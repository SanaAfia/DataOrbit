const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const express = require('express');
const multer = require('multer');

const ROOT = __dirname;
const DATA_DIRECTORY = path.join(ROOT, '.data');
const UPLOAD_DIRECTORY = path.join(DATA_DIRECTORY, 'pdfs');
const INDEX_PATH = path.join(DATA_DIRECTORY, 'pdf-index.json');
const PORT = Number.parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '127.0.0.1';
const MAX_PDF_SIZE = 100 * 1024 * 1024;
const MODULE_NUMBERS = new Set(['1', '2', '3', '4', '5']);
const CODE_COMPILERS = {
  Python: 'cpython-3.14.0',
  Pandas: 'cpython-3.14.0',
  PyTorch: 'cpython-3.14.0',
  Java: 'openjdk-jdk-21+35',
  C: 'gcc-13.2.0-c',
  'C++': 'gcc-13.2.0'
};
const records = new Map();
let writes = Promise.resolve();

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function publicRecord(record) {
  return {
    id: record.id,
    title: record.title,
    moduleNumber: record.moduleNumber,
    fileName: record.fileName,
    uploadedAt: record.uploadedAt
  };
}

async function persistRecords() {
  const temporaryPath = `${INDEX_PATH}.${crypto.randomUUID()}.tmp`;
  writes = writes.catch(() => {}).then(async () => {
    const snapshot = JSON.stringify([...records.values()], null, 2);
    await fs.writeFile(temporaryPath, snapshot, { encoding: 'utf8', flag: 'wx' });
    await fs.rename(temporaryPath, INDEX_PATH);
  }).catch(async (error) => {
    await fs.rm(temporaryPath, { force: true });
    throw error;
  });
  return writes;
}

async function loadRecords() {
  await fs.mkdir(UPLOAD_DIRECTORY, { recursive: true });
  let storedRecords;
  try {
    storedRecords = JSON.parse(await fs.readFile(INDEX_PATH, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw new Error(`Could not read the PDF index: ${error.message}`);
  }
  if (!Array.isArray(storedRecords)) throw new Error('The PDF index has an invalid format.');
  for (const record of storedRecords) {
    if (!record || !MODULE_NUMBERS.has(record.moduleNumber)
      || !/^[0-9a-f-]{36}\.pdf$/i.test(record.storageName)
      || typeof record.id !== 'string'
      || typeof record.title !== 'string'
      || typeof record.fileName !== 'string') {
      throw new Error('The PDF index contains an invalid record.');
    }
    records.set(record.id, record);
  }
}

function validateModuleNumber(request, response, next) {
  if (!MODULE_NUMBERS.has(request.params.moduleNumber)) {
    next(new HttpError(400, 'Module number must be between 1 and 5.'));
    return;
  }
  next();
}

function validateTitle(value) {
  if (typeof value !== 'string') throw new HttpError(400, 'A PDF title is required.');
  const title = value.trim();
  if (!title || title.length > 120) throw new HttpError(400, 'PDF titles must be between 1 and 120 characters.');
  return title;
}

async function hasPdfSignature(filePath) {
  const file = await fs.open(filePath, 'r');
  try {
    const buffer = Buffer.alloc(5);
    const { bytesRead } = await file.read(buffer, 0, buffer.length, 0);
    return bytesRead === buffer.length && buffer.toString('ascii') === '%PDF-';
  } finally {
    await file.close();
  }
}

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => callback(null, UPLOAD_DIRECTORY),
  filename: (_request, _file, callback) => callback(null, `${crypto.randomUUID()}.pdf`)
});
const upload = multer({
  storage,
  limits: { fileSize: MAX_PDF_SIZE, files: 1 },
  fileFilter: (_request, file, callback) => {
    if (file.mimetype !== 'application/pdf' || path.extname(file.originalname).toLowerCase() !== '.pdf') {
      callback(new HttpError(400, 'Choose a valid PDF file.'));
      return;
    }
    callback(null, true);
  }
});

const app = express();

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.post('/api/execute', express.json({ limit: '64kb' }), async (request, response, next) => {
  const { language, code, stdin = '' } = request.body || {};
  if (!Object.hasOwn(CODE_COMPILERS, language)) {
    next(new HttpError(400, 'Choose Python, Pandas, PyTorch, Java, C, or C++.'));
    return;
  }
  if (typeof code !== 'string' || !code.trim()) {
    next(new HttpError(400, 'Add code to the editor before running it.'));
    return;
  }
  if (Buffer.byteLength(code, 'utf8') > 48 * 1024) {
    next(new HttpError(413, 'Code must be 48 KB or smaller.'));
    return;
  }
  if (typeof stdin !== 'string' || Buffer.byteLength(stdin, 'utf8') > 8 * 1024) {
    next(new HttpError(400, 'Program input must be text no larger than 8 KB.'));
    return;
  }

  const compilerCode = language === 'Java'
    ? code.replace(/\bpublic\s+class\s+Main\b/, 'class Main')
    : code;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const upstream = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compiler: CODE_COMPILERS[language],
        code: compilerCode,
        stdin,
        options: '',
        'compiler-option-raw': '',
        'runtime-option-raw': ''
      }),
      signal: controller.signal
    });
    const result = await upstream.json();
    if (!upstream.ok) {
      console.error(`Wandbox returned HTTP ${upstream.status}:`, result);
      response.status(502).json({ error: 'The online code execution service is temporarily unavailable.' });
      return;
    }
    if (typeof result.status !== 'string' || typeof result.program_output !== 'string') {
      console.error('Wandbox returned an invalid execution response:', result);
      response.status(502).json({ error: 'The online code execution service returned an invalid response.' });
      return;
    }
    response.json({
      status: result.status,
      signal: result.signal || '',
      compilerOutput: result.compiler_output || '',
      compilerError: result.compiler_error || '',
      programOutput: result.program_output,
      programError: result.program_error || ''
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      response.status(504).json({ error: 'Code execution timed out after 30 seconds.' });
      return;
    }
    next(error);
  } finally {
    clearTimeout(timeout);
  }
});

app.get('/api/modules/:moduleNumber/pdfs', validateModuleNumber, (request, response) => {
  const modulePdfs = [...records.values()]
    .filter((record) => record.moduleNumber === request.params.moduleNumber)
    .sort((first, second) => second.uploadedAt.localeCompare(first.uploadedAt))
    .map(publicRecord);
  response.json(modulePdfs);
});

app.post('/api/modules/:moduleNumber/pdfs', validateModuleNumber, upload.single('pdf'), async (request, response, next) => {
  if (!request.file) {
    next(new HttpError(400, 'Select a PDF file to upload.'));
    return;
  }
  let record;
  try {
    const title = validateTitle(request.body.title);
    if (!await hasPdfSignature(request.file.path)) throw new HttpError(400, 'The selected file is not a valid PDF.');
    record = {
      id: crypto.randomUUID(),
      title,
      moduleNumber: request.params.moduleNumber,
      fileName: path.basename(request.file.originalname).slice(0, 180),
      storageName: request.file.filename,
      uploadedAt: new Date().toISOString()
    };
    records.set(record.id, record);
    await persistRecords();
    response.status(201).json(publicRecord(record));
  } catch (error) {
    if (record) records.delete(record.id);
    await fs.rm(request.file.path, { force: true }).catch((cleanupError) => {
      console.error('Could not clean up a failed PDF upload:', cleanupError);
    });
    next(error);
  }
});

app.get('/api/modules/:moduleNumber/pdfs/:id/file', validateModuleNumber, async (request, response, next) => {
  const record = records.get(request.params.id);
  if (!record || record.moduleNumber !== request.params.moduleNumber) {
    next(new HttpError(404, 'PDF not found for this module.'));
    return;
  }
  try {
    await fs.access(path.join(UPLOAD_DIRECTORY, record.storageName));
    response.type('application/pdf').download(
      path.join(UPLOAD_DIRECTORY, record.storageName),
      record.fileName
    );
  } catch (error) {
    if (error.code === 'ENOENT') {
      next(new HttpError(404, 'The saved PDF file is missing.'));
      return;
    }
    next(error);
  }
});

app.delete('/api/modules/:moduleNumber/pdfs/:id', validateModuleNumber, async (request, response, next) => {
  const record = records.get(request.params.id);
  if (!record || record.moduleNumber !== request.params.moduleNumber) {
    next(new HttpError(404, 'PDF not found for this module.'));
    return;
  }
  records.delete(record.id);
  try {
    await persistRecords();
  } catch (error) {
    records.set(record.id, record);
    next(error);
    return;
  }
  try {
    await fs.rm(path.join(UPLOAD_DIRECTORY, record.storageName));
  } catch (error) {
    console.error(`PDF ${record.id} was removed from the index but its file could not be deleted:`, error);
    next(new HttpError(500, 'The PDF was removed from the library, but its stored file could not be cleaned up.'));
    return;
  }
  response.status(204).end();
});

app.use('/api', (_request, _response, next) => next(new HttpError(404, 'API endpoint not found.')));
app.use((request, _response, next) => {
  let requestedPath;
  try {
    requestedPath = decodeURIComponent(new URL(request.originalUrl, 'http://localhost').pathname);
  } catch (error) {
    next(new HttpError(400, 'Invalid URL path.'));
    return;
  }
  const fileName = path.basename(requestedPath);
  const isHomePage = requestedPath === '/';
  const isPage = /^(index|lab|module[1-5]|modules|profile|projects|resources|tools)\.html$/.test(fileName);
  const isSharedAsset = fileName === 'script.js' || fileName === 'style.css';
  const isImageAsset = /^\/assets\/[A-Za-z0-9._-]+\.(png|jpe?g|webp|svg|ico)$/i.test(requestedPath);
  const isPublishedPdfCatalog = requestedPath === '/pdfs.json';
  const isPublishedPdf = /^\/pdfs\/module[1-5]\/[A-Za-z0-9][A-Za-z0-9._-]*\.pdf$/i.test(requestedPath);
  if (!isHomePage && !isPage && !isSharedAsset && !isImageAsset && !isPublishedPdfCatalog && !isPublishedPdf) {
    next(new HttpError(404, 'File not found.'));
    return;
  }
  next();
});
app.use(express.static(ROOT, { dotfiles: 'ignore', index: 'index.html' }));
app.use((error, _request, response, _next) => {
  if (response.headersSent) return;
  if (error instanceof multer.MulterError) {
    const message = error.code === 'LIMIT_FILE_SIZE'
      ? `PDF files must be smaller than ${MAX_PDF_SIZE / (1024 * 1024)} MB.`
      : 'The PDF upload could not be processed.';
    response.status(400).json({ error: message });
    return;
  }
  const status = error.status || 500;
  if (status >= 500) console.error('Request failed:', error);
  response.status(status).json({ error: status < 500 ? error.message : 'The server could not complete the request.' });
});

loadRecords().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`DataOrbit is running at http://${HOST}:${PORT}`);
  });
}).catch((error) => {
  console.error('Could not start the DataOrbit server:', error);
  process.exitCode = 1;
});
