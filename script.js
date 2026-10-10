const PDF_DATABASE_NAME = 'dataVersePdfLibrary';
const PDF_DATABASE_VERSION = 2;
const PDF_STORE_NAME = 'modulePdfs';
const PROJECT_FILE_STORE_NAME = 'projectFiles';
const LEGACY_PDF_STORAGE_KEY = 'dataVerseModule1Pdfs';
const PDF_MODULE_STORAGE_KEYS = {
  '1': 'module1PDFs',
  '2': 'module2PDFs',
  '3': 'module3PDFs',
  '4': 'module4PDFs',
  '5': 'module5PDFs'
};
const RESOURCE_STORAGE_KEY = 'dataVerseResources';
const THEME_STORAGE_KEY = 'dataOrbitTheme';
const PROJECT_STORAGE_KEY = 'savedProjects';
const FOLDER_STORAGE_KEY = 'projectFolders';
const CODE_FILE_STORAGE_KEY = 'savedCodeFiles';
const EDITOR_STORAGE_KEY = 'dataOrbitLabDraft';
const THEMES = {
  'buttermilk-pageant-blue': {
    name: 'Buttermilk + Pageant Blue',
    light: '#FCEEA8',
    background: '#FCEEA8',
    dark: '#1F2C43',
    secondary: '#1F2C43',
    button: '#1F2C43',
    card: '#FFFFFF',
    muted: '#536078'
  },
  'rosewood-ebony': {
    name: 'RoseWood + Ebony',
    light: '#F7EFEA',
    background: '#F7EFEA',
    dark: '#AE5369',
    secondary: '#515335',
    button: '#AE5369',
    card: '#FFFFFF',
    muted: '#62545A'
  },
  'chocolate-sodalite': {
    name: 'Chocolate Brown + Sodalite Blue',
    light: '#F5EFE6',
    background: '#F5EFE6',
    dark: '#4B2E2B',
    secondary: '#27496D',
    button: '#27496D',
    card: '#FFFFFF',
    muted: '#675A55'
  }
};
const DEFAULT_THEME = 'buttermilk-pageant-blue';
const MODULE_NAMES = {
  '1': 'Data Analysis',
  '2': 'Extracting Meaning from Data',
  '3': 'Feature Selection and Decision Tree Foundation',
  '4': 'Ensemble Learning',
  '5': 'Dimensionality Reduction'
};
const MODULE_VIDEOS = {
  1: [
    ['Data Analysis for Beginners', 'Learn the basic workflow for exploring and analyzing data.', 'Data+Analysis+for+Beginners'],
    ['Data Analysis with Python', 'See how Python supports practical data analysis.', 'Data+Analysis+with+Python'],
    ['Exploratory Data Analysis', 'Explore patterns and summarize a dataset before modeling.', 'Exploratory+Data+Analysis']
  ],
  2: [
    ['Data Interpretation', 'Turn analysis results into meaningful conclusions.', 'Data+Interpretation+Data+Analysis'],
    ['Exploratory Data Analysis in Python', 'Use Python to explore and understand a dataset.', 'Exploratory+Data+Analysis+in+Python'],
    ['Data Storytelling', 'Communicate evidence and insight with a clear narrative.', 'Data+Storytelling']
  ],
  3: [
    ['Feature Selection in Machine Learning', 'Select useful features for simpler, stronger models.', 'Feature+Selection+in+Machine+Learning'],
    ['Decision Tree Explained', 'Understand how decision trees split data and make predictions.', 'Decision+Tree+Explained'],
    ['Decision Tree in Python', 'Build and evaluate a decision tree with Python.', 'Decision+Tree+in+Python']
  ],
  4: [
    ['Ensemble Learning Explained', 'Combine multiple models to improve prediction quality.', 'Ensemble+Learning+Explained'],
    ['Random Forest Tutorial', 'Learn how random forests aggregate decision trees.', 'Random+Forest+Tutorial'],
    ['Bagging and Boosting', 'Compare two common ensemble learning strategies.', 'Bagging+and+Boosting']
  ],
  5: [
    ['Dimensionality Reduction Explained', 'Reduce feature count while preserving useful structure.', 'Dimensionality+Reduction+Explained'],
    ['PCA Tutorial', 'Understand principal component analysis step by step.', 'PCA+Tutorial'],
    ['PCA in Python', 'Apply PCA to data using Python.', 'PCA+in+Python']
  ]
};
let pdfDatabasePromise;
let pdfBookReady = false;
let pdfDocument;
let pdfObjectUrl;
let pdfZoom = 1;
let pdfBookDimensions;
let pdfResizeTimer;
const modalTriggers = new Map();

const resources = [
  { title: 'Python Official Documentation', topic: 'Python', type: 'Documentation', url: 'https://docs.python.org/3/' },
  { title: 'Pandas Official Documentation', topic: 'Pandas', type: 'Documentation', url: 'https://pandas.pydata.org/docs/' },
  { title: 'NumPy Official Documentation', topic: 'NumPy', type: 'Documentation', url: 'https://numpy.org/doc/stable/' },
  { title: 'Matplotlib Documentation', topic: 'Data Visualization', type: 'Documentation', url: 'https://matplotlib.org/stable/' },
  { title: 'Seaborn Documentation', topic: 'Data Visualization', type: 'Documentation', url: 'https://seaborn.pydata.org/' },
  { title: 'PyTorch Official Tutorials', topic: 'PyTorch', type: 'Course', url: 'https://pytorch.org/tutorials/' },
  { title: 'Kaggle Learn', topic: 'Machine Learning', type: 'Course', url: 'https://www.kaggle.com/learn' },
  { title: 'freeCodeCamp Data Analysis with Python', topic: 'Python', type: 'Course', url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/' },
  { title: 'StatQuest YouTube Channel', topic: 'Statistics', type: 'YouTube', url: 'https://www.youtube.com/user/joshstarmer' },
  { title: 'Corey Schafer Python Tutorials', topic: 'Python', type: 'YouTube', url: 'https://www.youtube.com/user/Coreyms' },
  { title: 'SQL for Data Science', topic: 'SQL for Data Science', type: 'Course', url: 'https://www.w3schools.com/sql/' },
  { title: 'Machine Learning Crash Course', topic: 'Machine Learning', type: 'Course', url: 'https://developers.google.com/machine-learning/crash-course' }
];

const tools = [
  { name: 'Python', category: 'Programming', purpose: 'Programming and automation', useCase: 'Automation, scripting, and data workflows', icon: 'fa-brands fa-python', url: 'https://www.python.org/' },
  { name: 'Jupyter Notebook', category: 'Programming', purpose: 'Interactive coding and documentation', useCase: 'Exploration and classroom learning', icon: 'fa-solid fa-book-open', url: 'https://jupyter.org/' },
  { name: 'Google Colab', category: 'Productivity', purpose: 'Cloud-based Python coding with GPU', useCase: 'Training models without local setup', icon: 'fa-solid fa-cloud', url: 'https://colab.research.google.com/' },
  { name: 'Anaconda', category: 'Programming', purpose: 'Python environment and package management', useCase: 'Reproducible data science projects', icon: 'fa-solid fa-cube', url: 'https://www.anaconda.com/' },
  { name: 'Pandas', category: 'Data Analysis', purpose: 'Data cleaning and analysis', useCase: 'Exploring and transforming tabular data', icon: 'fa-solid fa-table', url: 'https://pandas.pydata.org/' },
  { name: 'NumPy', category: 'Data Analysis', purpose: 'Numerical computing', useCase: 'Array operations and scientific calculations', icon: 'fa-solid fa-calculator', url: 'https://numpy.org/' },
  { name: 'Matplotlib', category: 'Visualization', purpose: 'Data visualization', useCase: 'Creating static charts and plots', icon: 'fa-solid fa-chart-line', url: 'https://matplotlib.org/' },
  { name: 'Seaborn', category: 'Visualization', purpose: 'Statistical visualization', useCase: 'Insightful statistical charts', icon: 'fa-solid fa-chart-pie', url: 'https://seaborn.pydata.org/' },
  { name: 'Scikit-learn', category: 'Machine Learning', purpose: 'Machine learning', useCase: 'Model training and evaluation', icon: 'fa-solid fa-brain', url: 'https://scikit-learn.org/' },
  { name: 'TensorFlow', category: 'Deep Learning', purpose: 'Deep learning', useCase: 'Building neural networks at scale', icon: 'fa-solid fa-network-wired', url: 'https://www.tensorflow.org/' },
  { name: 'PyTorch', category: 'Deep Learning', purpose: 'Deep learning and neural networks', useCase: 'Research and production ML systems', icon: 'fa-solid fa-microchip', url: 'https://pytorch.org/' },
  { name: 'SQL', category: 'Databases', purpose: 'Database queries', useCase: 'Extracting insights from relational data', icon: 'fa-solid fa-database', url: 'https://www.w3schools.com/sql/' },
  { name: 'Power BI', category: 'Productivity', purpose: 'Business intelligence dashboards', useCase: 'Creating executive reporting dashboards', icon: 'fa-solid fa-chart-column', url: 'https://powerbi.microsoft.com/' },
  { name: 'Tableau', category: 'Visualization', purpose: 'Data visualization dashboards', useCase: 'Interactive business analytics', icon: 'fa-solid fa-chart-simple', url: 'https://www.tableau.com/' },
  { name: 'Git & GitHub', category: 'Productivity', purpose: 'Version control and project sharing', useCase: 'Collaboration and code management', icon: 'fa-brands fa-github', url: 'https://github.com/' },
  { name: 'VS Code', category: 'Productivity', purpose: 'Code editing and development', useCase: 'Writing and debugging scripts efficiently', icon: 'fa-solid fa-code', url: 'https://code.visualstudio.com/' }
];

const sampleCode = {
  Python: 'print("Hello, Data Science!")',
  Pandas: 'import pandas as pd\n\ndata = {"Name": ["Sana", "Riya"], "Marks": [90, 85]}\ndf = pd.DataFrame(data)\nprint(df)',
  PyTorch: 'import torch\n\nx = torch.tensor([1.0, 2.0, 3.0])\nprint(x)',
  Java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java!");\n  }\n}',
  C: '#include <stdio.h>\n\nint main() {\n  printf("Hello, C!\\n");\n  return 0;\n}',
  'C++': '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, C++!" << endl;\n  return 0;\n}'
};

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function readStorage(key) {
  try {
    const value = localStorage.getItem(key);
    if (!value) return [];
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) throw new Error('Stored data is not a list.');
    return parsed;
  } catch (error) {
    showToast('Saved data could not be read. Clear this site’s storage and try again.', 'error');
    return [];
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  if (!modal.classList.contains('visible')) modalTriggers.set(modalId, document.activeElement);
  modal.classList.add('visible');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  const trigger = modalTriggers.get(modalId);
  if (modal.contains(document.activeElement)) document.activeElement.blur();
  modal.classList.remove('visible');
  modal.setAttribute('aria-hidden', 'true');
  if (trigger && typeof trigger.focus === 'function') trigger.focus();
  modalTriggers.delete(modalId);
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) {
    window.alert(message);
    return;
  }
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => toast.classList.remove('show'), 3000);
}

function ensureModulePdfLayout() {
  const moduleNumber = document.body.dataset.moduleNumber;
  const detail = document.querySelector('.module-detail');
  if (!moduleNumber || !detail) return;

  detail.classList.add('module-detail-layout');
  const moduleCard = detail.querySelector('.module-detail-card');
  if (!moduleCard) return;
  let primaryColumn = detail.querySelector('.module-primary-column');
  if (!primaryColumn) {
    primaryColumn = document.createElement('div');
    primaryColumn.className = 'module-primary-column';
    detail.insertBefore(primaryColumn, moduleCard);
    primaryColumn.appendChild(moduleCard);
  }
  let viewer = document.getElementById('pdfBookViewer');
  if (!viewer) viewer = document.createElement('section');
  viewer.id = 'pdfBookViewer';
  viewer.className = 'pdf-book-viewer glass-card';
  viewer.setAttribute('aria-label', 'PDF flipbook viewer');
  viewer.hidden = true;
  viewer.innerHTML = `
    <div class="pdf-viewer-header">
      <div><span class="eyebrow">Module ${escapeHTML(moduleNumber)} Reading</span><h2 id="pdfViewerTitle">PDF Flipbook</h2></div>
      <button class="viewer-icon-btn" id="closePdfViewerBtn" aria-label="Close flipbook"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="pdf-viewer-toolbar">
      <button class="viewer-control-btn" id="prevBtn" aria-label="Previous page" disabled><i class="fa-solid fa-chevron-left"></i><span>Previous</span></button>
      <span id="pdfPageNumber" class="pdf-page-number" aria-live="polite">Page 1 of 1</span>
      <button class="viewer-control-btn" id="nextBtn" aria-label="Next page" disabled><span>Next</span><i class="fa-solid fa-chevron-right"></i></button>
      <div class="pdf-zoom-controls"><button class="viewer-icon-btn" id="zoomOutPdfBtn" aria-label="Zoom out"><i class="fa-solid fa-magnifying-glass-minus"></i></button><button class="viewer-icon-btn" id="zoomInPdfBtn" aria-label="Zoom in"><i class="fa-solid fa-magnifying-glass-plus"></i></button></div>
      <a class="viewer-control-btn pdf-download-btn" id="downloadPdfBtn" href="#" download><i class="fa-solid fa-download"></i><span>Download PDF</span></a>
    </div>
    <p id="pdfViewerStatus" class="pdf-viewer-status" role="status">Select a PDF to begin reading.</p>
    <div id="pdfFlipbookStage" class="pdf-flipbook-stage" aria-label="Interactive PDF pages"></div>`;
  if (!viewer.parentElement) primaryColumn.appendChild(viewer);

  const resources = MODULE_VIDEOS[moduleNumber] || MODULE_VIDEOS[1];
  let aside = detail.querySelector('.youtube-resources');
  if (!aside) {
    aside = document.createElement('aside');
    aside.className = 'youtube-resources glass-card';
    detail.appendChild(aside);
  }
  aside.setAttribute('aria-labelledby', 'youtubeResourcesHeading');
  aside.innerHTML = `<span class="eyebrow">Watch &amp; Learn</span><h2 id="youtubeResourcesHeading">Related YouTube Resources</h2>${resources.map(([title, description, query]) => `
    <article class="youtube-resource-card">
      <div class="youtube-resource-icon"><i class="fa-brands fa-youtube"></i></div>
      <h3>${escapeHTML(title)}</h3><p>${escapeHTML(description)}</p>
      <a class="youtube-watch-link" href="https://www.youtube.com/results?search_query=${query}" target="_blank" rel="noopener noreferrer">Watch on YouTube <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
    </article>`).join('')}`;
  const moduleName = MODULE_NAMES[moduleNumber];
  if (moduleName) {
    document.body.dataset.moduleTitle = moduleName;
    document.title = `Module ${moduleNumber}: ${moduleName} | DataOrbit`;
    const heading = document.querySelector('.page-heading h1');
    if (heading) heading.textContent = moduleName;
    const eyebrow = document.querySelector('.page-heading .eyebrow');
    if (eyebrow) eyebrow.textContent = `Module ${moduleNumber}`;
  }
}

function openPdfDatabase() {
  if (!('indexedDB' in window)) {
    return Promise.reject(new Error('This browser does not support IndexedDB.'));
  }
  if (!pdfDatabasePromise) {
    pdfDatabasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(PDF_DATABASE_NAME, PDF_DATABASE_VERSION);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(PDF_STORE_NAME)) {
          database.createObjectStore(PDF_STORE_NAME, { keyPath: 'id' });
        }
        if (!database.objectStoreNames.contains(PROJECT_FILE_STORE_NAME)) {
          database.createObjectStore(PROJECT_FILE_STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => {
        const database = request.result;
        database.onversionchange = () => database.close();
        migrateLegacyPDFs(database)
          .then(() => resolve(database))
          .catch((error) => {
            showToast('Could not migrate older saved PDFs. They are still available in this browser’s previous storage.', 'error');
            resolve(database);
            console.error('Legacy PDF migration failed:', error);
          });
      };
      request.onerror = () => reject(request.error || new Error('Could not open PDF storage.'));
      request.onblocked = () => reject(new Error('PDF storage is busy in another tab. Close other DataOrbit tabs and retry.'));
    });
    pdfDatabasePromise.catch(() => {
      pdfDatabasePromise = undefined;
    });
  }
  return pdfDatabasePromise;
}

async function migrateLegacyPDFs(database) {
  let legacyItems;
  try {
    const stored = localStorage.getItem(LEGACY_PDF_STORAGE_KEY);
    if (!stored) return;
    legacyItems = JSON.parse(stored);
  } catch (error) {
    throw new Error('Previously saved PDFs could not be read.');
  }
  if (!Array.isArray(legacyItems) || legacyItems.length === 0) return;

  const converted = await Promise.all(legacyItems
    .filter((item) => item && typeof item.data === 'string')
    .map(async (item) => {
      const response = await fetch(item.data);
      if (!response.ok) throw new Error('A previously saved PDF could not be converted.');
      return {
        id: item.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title: item.title || 'Saved Module 1 PDF',
        moduleNumber: '1',
        moduleName: 'Module 1: Introduction to Data Science',
        fileName: item.fileName || `${item.title || 'module-1'}.pdf`,
        file: await response.blob()
      };
    }));
  if (!converted.length) return;

  await new Promise((resolve, reject) => {
    const transaction = database.transaction(PDF_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(PDF_STORE_NAME);
    converted.forEach((item) => store.put(item));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error('Could not migrate older PDFs.'));
    transaction.onabort = () => reject(transaction.error || new Error('Migrating older PDFs was cancelled.'));
  });
  writeStoredPdfIds('1', converted.map((item) => item.id));
  localStorage.removeItem(LEGACY_PDF_STORAGE_KEY);
}

async function getStoredPDFs() {
  const moduleNumber = document.body.dataset.moduleNumber;
  let pdfs = await fetchModulePdfList(moduleNumber);
  const migrated = 'indexedDB' in window && await migrateBrowserStoredPDFs(moduleNumber, pdfs);
  if (migrated) pdfs = await fetchModulePdfList(moduleNumber);
  writeStoredPdfIds(moduleNumber, pdfs.map((pdf) => pdf.id));
  return pdfs;
}

async function saveStoredPDF(pdf) {
  const savedPdf = await uploadPdfToServer(pdf);
  writeStoredPdfIds(pdf.moduleNumber, [...readStoredPdfIds(pdf.moduleNumber), savedPdf.id]);
  return savedPdf;
}

async function fetchModulePdfList(moduleNumber) {
  const response = await fetchApi(`/api/modules/${encodeURIComponent(moduleNumber)}/pdfs`);
  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, 'Could not load saved PDFs.'));
  }
  const pdfs = await response.json();
  if (!Array.isArray(pdfs)) throw new Error('The PDF service returned an invalid list.');
  return pdfs;
}

async function uploadPdfToServer(pdf) {
  const formData = new FormData();
  formData.append('title', pdf.title);
  formData.append('pdf', pdf.file, pdf.fileName);
  const response = await fetchApi(`/api/modules/${encodeURIComponent(pdf.moduleNumber)}/pdfs`, {
    method: 'POST',
    body: formData
  });
  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, 'Could not save this PDF.'));
  }
  return response.json();
}

async function fetchApi(url, options) {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('The PDF server is unavailable. Start it with "npm start" and open this site at http://127.0.0.1:3000.');
    }
    throw error;
  }
}

async function migrateBrowserStoredPDFs(moduleNumber, serverPdfs) {
  let localPdfs;
  try {
    const database = await openPdfDatabase();
    localPdfs = await new Promise((resolve, reject) => {
      const transaction = database.transaction(PDF_STORE_NAME, 'readonly');
      const request = transaction.objectStore(PDF_STORE_NAME).getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Could not read browser-saved PDFs.'));
    });
  } catch (error) {
    showPdfStorageError(error);
    return false;
  }
  const serverIds = new Set(serverPdfs.map((pdf) => pdf.id));
  const localModulePdfs = localPdfs.filter((pdf) => pdf.file instanceof Blob && (
    pdf.moduleNumber === moduleNumber
    || (!pdf.moduleNumber && moduleNumber === '1' && pdf.moduleName === 'Module 1: Introduction to Data Science')
  ));
  let migrated = false;
  for (const pdf of localModulePdfs) {
    if (serverIds.has(pdf.id)) continue;
    try {
      const saved = await uploadPdfToServer({
        title: pdf.title || pdf.fileName || `Module ${moduleNumber} PDF`,
        moduleNumber,
        fileName: pdf.fileName || 'saved.pdf',
        file: pdf.file
      });
      serverIds.add(saved.id);
      await removeBrowserStoredPDF(pdf.id);
      migrated = true;
    } catch (error) {
      showToast(`A PDF saved in this browser could not be copied to the server: ${error.message}`, 'error');
      console.error('Browser PDF migration failed:', error);
    }
  }
  return migrated;
}

async function removeBrowserStoredPDF(id) {
  const database = await openPdfDatabase();
  await new Promise((resolve, reject) => {
    const transaction = database.transaction(PDF_STORE_NAME, 'readwrite');
    transaction.objectStore(PDF_STORE_NAME).delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error('Could not remove the migrated browser PDF.'));
    transaction.onabort = () => reject(transaction.error || new Error('Removing the migrated browser PDF was cancelled.'));
  });
}

async function removeStoredPDF(id) {
  const moduleNumber = document.body.dataset.moduleNumber;
  const response = await fetchApi(`/api/modules/${encodeURIComponent(moduleNumber)}/pdfs/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, 'Could not delete this PDF.'));
  }
  writeStoredPdfIds(moduleNumber, readStoredPdfIds(moduleNumber).filter((savedId) => savedId !== id));
}

async function getApiErrorMessage(response, fallback) {
  try {
    const payload = await response.json();
    if (payload && typeof payload.error === 'string') return payload.error;
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
  }
  return fallback;
}

function pdfIdsStorageKey(moduleNumber) {
  const key = PDF_MODULE_STORAGE_KEYS[moduleNumber];
  if (!key) throw new Error(`No PDF storage key is configured for Module ${moduleNumber}.`);
  return key;
}

function readStoredPdfIds(moduleNumber) {
  const key = pdfIdsStorageKey(moduleNumber);
  let parsed;
  try {
    const stored = localStorage.getItem(key);
    parsed = stored ? JSON.parse(stored) : [];
  } catch (error) {
    throw new Error(`The saved PDF list for Module ${moduleNumber} could not be read.`);
  }
  if (!Array.isArray(parsed) || parsed.some((id) => typeof id !== 'string')) {
    throw new Error(`The saved PDF list for Module ${moduleNumber} is invalid.`);
  }
  return parsed;
}

function writeStoredPdfIds(moduleNumber, ids) {
  const key = pdfIdsStorageKey(moduleNumber);
  try {
    localStorage.setItem(key, JSON.stringify([...new Set(ids)]));
  } catch (error) {
    throw new Error(`The saved PDF list for Module ${moduleNumber} could not be updated. Free browser storage and try again.`);
  }
}

function showPdfStorageError(error) {
  if (error && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
    showToast('Browser storage is full. Remove saved PDFs or free space and try again.', 'error');
    return;
  }
  showToast(error && error.message ? error.message : 'Could not access PDF storage. Please try again.', 'error');
}

function showPdfServerNotice() {
  if (window.location.protocol !== 'file:') return;
  const hint = document.querySelector('#pdfModal .form-hint');
  if (hint) {
    hint.innerHTML = 'PDF upload needs the local server. Open <a href="http://127.0.0.1:3000/module'
      + escapeHTML(document.body.dataset.moduleNumber)
      + '.html">this module from DataOrbit</a>, then select the PDF again.';
  }
}

function isGitHubPages() {
  return window.location.hostname.endsWith('.github.io');
}

function setupPublishedPdfCatalog() {
  if (!isGitHubPages()) return;
  const addButton = document.getElementById('addModulePdfBtn');
  const actions = document.querySelector('.module-detail-actions');
  if (addButton) addButton.hidden = true;
  if (actions) {
    const hint = document.createElement('p');
    hint.className = 'form-hint';
    hint.textContent = 'To add PDFs on GitHub Pages, place them in the pdfs folder and add them to pdfs.json in the GitHub repository.';
    actions.insertAdjacentElement('afterend', hint);
  }
}

async function getPublishedModulePDFs(moduleNumber) {
  const response = await fetch('pdfs.json');
  if (!response.ok) throw new Error('Could not load the published PDF list.');
  const catalog = await response.json();
  const modulePdfs = catalog && catalog[moduleNumber];
  if (!Array.isArray(modulePdfs)) throw new Error('The published PDF list has an invalid format.');
  return modulePdfs.map((pdf) => {
    if (!pdf || typeof pdf.title !== 'string' || !pdf.title.trim()
      || typeof pdf.path !== 'string'
      || !new RegExp(`^pdfs/module${moduleNumber}/[A-Za-z0-9][A-Za-z0-9._-]*\\.pdf$`, 'i').test(pdf.path)) {
      throw new Error(`The published PDF list for Module ${moduleNumber} contains an invalid entry.`);
    }
    return {
      title: pdf.title,
      fileName: pdf.path.split('/').pop(),
      path: pdf.path
    };
  });
}

function addPDF(event) {
  if (event) event.preventDefault();
  if (window.location.protocol === 'file:') {
    showToast('PDF upload is unavailable from a file:// page. Open http://127.0.0.1:3000, go to this module, and select the PDF again.', 'error');
    return;
  }
  const moduleNumber = document.body.dataset.moduleNumber;
  const moduleTitle = document.body.dataset.moduleTitle;
  if (!moduleNumber || !moduleTitle) {
    showToast('Module details are missing. Return to the Modules page and try again.', 'error');
    return;
  }
  const title = document.getElementById('pdfTitleInput').value.trim();
  const file = document.getElementById('pdfFileInput').files[0];
  if (!title || !file) {
    showToast('Please enter a title and select a PDF file.', 'error');
    return;
  }
  if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
    showToast('Please select a valid PDF file.', 'error');
    return;
  }
  saveStoredPDF({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title,
    moduleNumber,
    moduleName: `Module ${moduleNumber}: ${moduleTitle}`,
    fileName: file.name,
    file
  }).then(() => {
    document.getElementById('pdfForm').reset();
    closeModal('pdfModal');
    showToast(`Module ${moduleNumber} PDF added successfully.`);
  }).catch(showPdfStorageError);
}

async function viewPDFs() {
  const content = document.getElementById('pdfListContent');
  const moduleNumber = document.body.dataset.moduleNumber;
  content.innerHTML = '<div class="empty-state">Loading saved PDFs…</div>';
  openModal('pdfListModal');
  let pdfs;
  try {
    if (isGitHubPages()) {
      pdfs = await getPublishedModulePDFs(moduleNumber);
    } else {
      pdfs = (await getStoredPDFs()).filter((pdf) =>
        pdf.moduleNumber === moduleNumber
        || (!pdf.moduleNumber && moduleNumber === '1' && pdf.moduleName === 'Module 1: Introduction to Data Science')
      );
    }
  } catch (error) {
    content.innerHTML = '<div class="empty-state">Could not load saved PDFs.</div>';
    showPdfStorageError(error);
    return;
  }
  content.innerHTML = pdfs.length ? pdfs.map((pdf) => `
    <article class="list-item">
      <div><h4>${escapeHTML(pdf.title)}</h4><small>${escapeHTML(pdf.fileName || 'PDF')}</small></div>
      <div class="list-actions">${isGitHubPages()
        ? `<a href="${escapeHTML(pdf.path)}" target="_blank" rel="noopener noreferrer">Open PDF</a>`
        : `<button class="open-pdf-btn" data-action="open-pdf" data-id="${escapeHTML(pdf.id)}">Read PDF</button><button class="delete-pdf-btn" data-action="delete-pdf" data-id="${escapeHTML(pdf.id)}">Delete PDF</button>`}</div>
    </article>`).join('') : '<div class="empty-state">No PDFs added yet.</div>';
  openModal('pdfListModal');
}

async function deletePDF(id) {
  try {
    await removeStoredPDF(id);
    await viewPDFs();
    showToast('PDF deleted.');
  } catch (error) {
    showPdfStorageError(error);
  }
}

async function openPDF(id) {
  if (document.body.dataset.moduleNumber) {
    await openPdfFlipbook(id);
    return;
  }
  const pdfWindow = window.open('', '_blank');
  if (!pdfWindow) {
    showToast('Allow pop-ups to open the PDF in a new tab.', 'error');
    return;
  }
  try {
    const pdf = (await getStoredPDFs()).find((item) => item.id === id);
    if (!pdf || !(pdf.file instanceof Blob)) {
      pdfWindow.close();
      showToast('This PDF could not be found in saved storage.', 'error');
      return;
    }
    const objectUrl = URL.createObjectURL(pdf.file);
    pdfWindow.location.replace(objectUrl);
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
  } catch (error) {
    pdfWindow.close();
    showToast('The saved PDF could not be opened.', 'error');
  }
}

function updatePdfPageNumber(pageIndex) {
  const count = pdfDocument ? pdfDocument.numPages : 0;
  const pageNumber = document.getElementById('pdfPageNumber');
  const currentPage = Math.min(pageIndex + 1, count);
  if (pageNumber) pageNumber.textContent = `Page ${currentPage} of ${count}`;
  const previousButton = document.getElementById('prevBtn');
  const nextButton = document.getElementById('nextBtn');
  if (previousButton) previousButton.disabled = !pdfBookReady || currentPage <= 1;
  if (nextButton) nextButton.disabled = !pdfBookReady || currentPage >= count;
}

function getPdfBookLayout() {
  if (!pdfBookDimensions) return undefined;
  const stage = document.getElementById('pdfFlipbookStage');
  const mobile = window.matchMedia('(max-width: 760px)').matches;
  const display = pdfDocument.numPages === 1 || mobile ? 'single' : 'double';
  const pageCountAcross = display === 'double' ? 2 : 1;
  const availableWidth = Math.max(stage.clientWidth - 36, 1);
  const availableHeight = Math.max(Math.min(window.innerHeight * 0.68, 720) - 20, 1);
  const scale = Math.min(
    1,
    availableWidth / (pdfBookDimensions.width * pageCountAcross),
    availableHeight / pdfBookDimensions.height
  ) * pdfZoom;
  return {
    display,
    scale,
    width: Math.max(1, Math.round(pdfBookDimensions.width * pageCountAcross * scale)),
    height: Math.max(1, Math.round(pdfBookDimensions.height * scale))
  };
}

function resizePdfBook() {
  if (!pdfBookDimensions) return;
  const layout = getPdfBookLayout();
  const book = document.getElementById('flipbook');
  if (!book) return;
  book.querySelectorAll('.pdf-book-page').forEach((page) => {
    page.style.width = `${pdfBookDimensions.width * layout.scale}px`;
    page.style.height = `${pdfBookDimensions.height * layout.scale}px`;
    const canvas = page.querySelector('canvas');
    canvas.style.width = `${Number(canvas.dataset.pageWidth) * layout.scale}px`;
    canvas.style.height = `${Number(canvas.dataset.pageHeight) * layout.scale}px`;
  });
  if (pdfBookReady && window.jQuery) {
    jQuery('#flipbook').turn('display', layout.display);
    jQuery('#flipbook').turn('size', layout.width, layout.height);
  }
}

function closePdfFlipbook() {
  const viewer = document.getElementById('pdfBookViewer');
  if (!viewer) return;
  pdfBookReady = false;
  const previousButton = document.getElementById('prevBtn');
  const nextButton = document.getElementById('nextBtn');
  if (previousButton) previousButton.disabled = true;
  if (nextButton) nextButton.disabled = true;
  if (pdfDocument) {
    pdfDocument.destroy();
    pdfDocument = undefined;
  }
  if (pdfObjectUrl) {
    URL.revokeObjectURL(pdfObjectUrl);
    pdfObjectUrl = undefined;
  }
  document.getElementById('pdfFlipbookStage').innerHTML = '';
  viewer.hidden = true;
  pdfZoom = 1;
  pdfBookDimensions = undefined;
}

async function openPdfFlipbook(id) {
  const viewer = document.getElementById('pdfBookViewer');
  const status = document.getElementById('pdfViewerStatus');
  const stage = document.getElementById('pdfFlipbookStage');
  closePdfFlipbook();
  viewer.hidden = false;
  status.textContent = 'Loading your PDF…';
  closeModal('pdfListModal');

  try {
    if (!window.pdfjsLib || !window.jQuery || !jQuery.fn.turn) {
      throw new Error('The PDF reader could not load. Check your internet connection and reload the page.');
    }
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const pdf = (await getStoredPDFs()).find((item) => item.id === id);
    if (!pdf) {
      throw new Error('This PDF could not be found in saved storage.');
    }

    document.getElementById('pdfViewerTitle').textContent = pdf.title;
    const downloadLink = document.getElementById('downloadPdfBtn');
    const fileResponse = await fetchApi(`/api/modules/${encodeURIComponent(document.body.dataset.moduleNumber)}/pdfs/${encodeURIComponent(id)}/file`);
    if (!fileResponse.ok) {
      throw new Error(await getApiErrorMessage(fileResponse, 'The saved PDF file could not be loaded.'));
    }
    const pdfFile = await fileResponse.blob();
    if (pdfFile.type !== 'application/pdf' || pdfFile.size === 0) {
      throw new Error('The server returned an invalid or empty PDF file.');
    }
    pdfObjectUrl = URL.createObjectURL(pdfFile);
    downloadLink.href = pdfObjectUrl;
    downloadLink.download = pdf.fileName || `${pdf.title}.pdf`;

    pdfDocument = await pdfjsLib.getDocument({ data: await pdfFile.arrayBuffer() }).promise;
    status.textContent = `Rendering ${pdfDocument.numPages} PDF pages…`;
    const pages = [];
    pdfBookDimensions = { width: 0, height: 0 };
    for (let index = 0; index < pdfDocument.numPages; index += 1) {
      status.textContent = `Rendering page ${index + 1} of ${pdfDocument.numPages}…`;
      const pdfPage = await pdfDocument.getPage(index + 1);
      const viewport = pdfPage.getViewport({ scale: 1 });
      pdfBookDimensions.width = Math.max(pdfBookDimensions.width, viewport.width);
      pdfBookDimensions.height = Math.max(pdfBookDimensions.height, viewport.height);
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      canvas.dataset.pageWidth = String(viewport.width);
      canvas.dataset.pageHeight = String(viewport.height);
      await pdfPage.render({
        canvasContext: canvas.getContext('2d'),
        viewport
      }).promise;
      const pageElement = document.createElement('div');
      pageElement.className = 'pdf-book-page';
      pageElement.setAttribute('aria-label', `PDF page ${index + 1}`);
      pageElement.appendChild(canvas);
      pages.push(pageElement);
    }
    const book = document.createElement('div');
    book.id = 'flipbook';
    book.className = 'pdf-flipbook';
    book.replaceChildren(...pages);
    stage.replaceChildren(book);
    await new Promise((resolve) => window.requestAnimationFrame(resolve));
    resizePdfBook();
    const layout = getPdfBookLayout();
    jQuery('#flipbook').turn({
      width: layout.width,
      height: layout.height,
      display: layout.display,
      autoCenter: true,
      acceleration: true,
      gradients: true,
      duration: 700
    });
    pdfBookReady = true;
    jQuery('#flipbook').bind('turned', (event, pageNumber) => {
      updatePdfPageNumber(pageNumber - 1);
    });
    resizePdfBook();
    updatePdfPageNumber(0);
    status.textContent = 'Use the arrows, page corners, keyboard, or swipe to turn pages.';
    viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    closePdfFlipbook();
    viewer.hidden = false;
    status.textContent = error.message || 'Could not open the selected PDF.';
    stage.innerHTML = '<div class="empty-state">The PDF could not be displayed.</div>';
    showPdfStorageError(error);
  }
}

function flipPdfPage(direction) {
  if (!pdfBookReady || !window.jQuery) return;
  jQuery('#flipbook').turn(direction === 'next' ? 'next' : 'previous');
}

function setPdfZoom(direction) {
  if (!pdfBookReady) return;
  const book = jQuery('#flipbook');
  const currentPage = book.turn('page');
  pdfZoom = Math.max(0.65, Math.min(1.75, pdfZoom + direction * 0.15));
  resizePdfBook();
  book.turn('page', currentPage);
}

function renderResources() {
  const grid = document.getElementById('resourcesGrid');
  if (!grid) return;
  const custom = readStorage(RESOURCE_STORAGE_KEY);
  grid.innerHTML = [...resources, ...custom.map((item) => ({ ...item, custom: true }))].map((resource) => `
    <article class="resource-card">
      <span class="type-tag">${escapeHTML(resource.type)}</span><h2>${escapeHTML(resource.title)}</h2>
      <div class="meta"><strong>Topic:</strong> ${escapeHTML(resource.topic)}</div>
      <a class="open-link" href="${escapeHTML(resource.url)}" target="_blank" rel="noopener noreferrer">Open Resource <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
      ${resource.custom ? `<button class="delete-btn" data-action="delete-resource" data-id="${escapeHTML(resource.id)}">Delete</button>` : ''}
    </article>`).join('');
}

function addResource(event) {
  if (event) event.preventDefault();
  const title = document.getElementById('resourceTitleInput').value.trim();
  const topic = document.getElementById('resourceTopicInput').value.trim();
  const type = document.getElementById('resourceTypeInput').value;
  const url = document.getElementById('resourceUrlInput').value.trim();
  if (!title || !url) {
    showToast('Title and URL cannot be empty.', 'error');
    return;
  }
  if (!/^https?:\/\//i.test(url)) {
    showToast('URL must start with http:// or https://', 'error');
    return;
  }
  const userResources = readStorage(RESOURCE_STORAGE_KEY);
  userResources.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, title, topic: topic || 'General', type, url });
  if (!writeStorage(RESOURCE_STORAGE_KEY, userResources)) {
    showToast('Could not save the resource to browser storage.', 'error');
    return;
  }
  document.getElementById('resourceForm').reset();
  closeModal('resourceModal');
  renderResources();
  showToast('Resource added successfully.');
}

function viewResources() {
  const content = document.getElementById('resourceListContent');
  const userResources = readStorage(RESOURCE_STORAGE_KEY);
  content.innerHTML = userResources.length ? userResources.map((resource) => `
    <article class="list-item"><div><h4>${escapeHTML(resource.title)}</h4><small>${escapeHTML(resource.topic)} · ${escapeHTML(resource.type)}</small></div>
    <div class="list-actions"><a class="open-pdf-btn" href="${escapeHTML(resource.url)}" target="_blank" rel="noopener noreferrer">Open</a><button class="delete-pdf-btn" data-action="delete-resource" data-id="${escapeHTML(resource.id)}">Delete</button></div></article>`).join('') : '<div class="empty-state">No resources added yet.</div>';
  openModal('resourceListModal');
}

function deleteResource(id) {
  const remaining = readStorage(RESOURCE_STORAGE_KEY).filter((item) => item.id !== id);
  if (!writeStorage(RESOURCE_STORAGE_KEY, remaining)) {
    showToast('Could not update saved resources. Please try again.', 'error');
    return;
  }
  renderResources();
  const listModal = document.getElementById('resourceListModal');
  if (listModal && listModal.classList.contains('visible')) viewResources();
  showToast('Resource deleted.');
}

function filterTools(category = 'All') {
  const grid = document.getElementById('toolsGrid');
  if (!grid) return;
  const matches = category === 'All' ? tools : tools.filter((tool) => tool.category === category);
  grid.innerHTML = matches.map((tool) => `
    <article class="tool-card"><div class="tool-top"><div class="tool-icon"><i class="${tool.icon}"></i></div><h2>${escapeHTML(tool.name)}</h2></div>
      <p>${escapeHTML(tool.purpose)}</p><div class="tool-meta">Best use case: ${escapeHTML(tool.useCase)}</div>
      <a class="learn-link" href="${escapeHTML(tool.url)}" target="_blank" rel="noopener noreferrer">Learn More</a></article>`).join('');
  document.querySelectorAll('.filter-btn').forEach((button) => button.classList.toggle('active', button.dataset.filter === category));
}

function selectLanguage() {
  const selector = document.getElementById('languageSelect');
  const editor = document.getElementById('codeEditor');
  if (selector && editor) {
    editor.value = sampleCode[selector.value] || '';
    editor.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function loadSampleCode() {
  selectLanguage();
  showToast('Sample code loaded.');
}

async function copyCode() {
  const editor = document.getElementById('codeEditor');
  if (!editor.value) {
    showToast('There is no code to copy.', 'error');
    return;
  }
  try {
    await navigator.clipboard.writeText(editor.value);
    showToast('Code copied to clipboard.');
  } catch (error) {
    editor.focus();
    editor.select();
    const copied = document.execCommand('copy');
    showToast(copied ? 'Code copied to clipboard.' : 'Clipboard access was denied.', copied ? 'success' : 'error');
  }
}

function resizeCodeEditor(editor) {
  editor.style.height = 'auto';
  editor.style.height = `${Math.min(Math.max(editor.scrollHeight, 320), 720)}px`;
}

function openCompiler(mode) {
  const language = document.getElementById('languageSelect').value;
  const pythonLanguages = ['Python', 'Pandas', 'PyTorch'];
  const compilerLinks = {
    Python: 'https://www.onlinegdb.com/online_python_compiler',
    Java: 'https://www.onlinegdb.com/online_java_compiler',
    C: 'https://www.onlinegdb.com/online_c_compiler',
    'C++': 'https://www.onlinegdb.com/online_cpp_compiler'
  };
  if (mode === 'colab') {
    if (!pythonLanguages.includes(language)) {
      showToast('Google Colab is available for Python, Pandas, and PyTorch.', 'error');
      return;
    }
    window.open('https://colab.research.google.com/', '_blank', 'noopener,noreferrer');
    return;
  }
  if (mode === 'compiler') {
    if (!compilerLinks[language]) {
      showToast('Use Google Colab for Pandas and PyTorch package support.', 'error');
      return;
    }
    window.open(compilerLinks[language], '_blank', 'noopener,noreferrer');
  }
}

function openGoogleColab() {
  return openCompiler('colab');
}

function openOnlineCompiler() {
  return openCompiler('compiler');
}

function applyTheme(themeId, persist = false) {
  const theme = THEMES[themeId] || THEMES[DEFAULT_THEME];
  const selectedTheme = Object.prototype.hasOwnProperty.call(THEMES, themeId) ? themeId : DEFAULT_THEME;
  document.documentElement.dataset.theme = selectedTheme;
  Object.entries({
    '--theme-light': theme.light,
    '--theme-background': theme.background,
    '--theme-dark': theme.dark,
    '--theme-secondary': theme.secondary,
    '--theme-button': theme.button,
    '--theme-card': theme.card,
    '--theme-muted': theme.muted
  }).forEach(([property, value]) => document.documentElement.style.setProperty(property, value));
  document.querySelectorAll('[data-theme-choice]').forEach((button) => {
    const selected = button.dataset.themeChoice === selectedTheme;
    button.closest('.theme-option')?.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);
      showToast('Theme changed successfully.');
    } catch (error) {
      showToast('Theme changed for this page, but could not be saved in this browser.', 'error');
    }
  }
}

function setThemePickerOpen(isOpen) {
  const picker = document.getElementById('themePicker');
  const trigger = document.getElementById('changeThemeBtn');
  const panel = document.getElementById('themeOptionsPanel');
  if (!picker || !trigger || !panel) return;
  picker.classList.toggle('is-open', isOpen);
  trigger.setAttribute('aria-expanded', String(isOpen));
  panel.setAttribute('aria-hidden', String(!isOpen));
  panel.inert = !isOpen;
}

function readStoredArray(key) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const value = JSON.parse(stored);
    if (!Array.isArray(value)) throw new Error(`Stored data for ${key} is not a list.`);
    return value;
  } catch (error) {
    showToast(`Could not read saved data (${error.message}).`, 'error');
    throw error;
  }
}

function saveStoredArray(key, values) {
  try {
    localStorage.setItem(key, JSON.stringify(values));
    return true;
  } catch (error) {
    showToast(`Could not save data in this browser: ${error.message}`, 'error');
    return false;
  }
}

function makeId() {
  return window.crypto && typeof window.crypto.randomUUID === 'function'
    ? window.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function addProject(event) {
  if (event) event.preventDefault();
  const title = document.getElementById('projectTitle').value.trim();
  const description = document.getElementById('projectDescription').value.trim();
  const folderName = document.getElementById('projectFolder').value;
  const github = document.getElementById('projectGithub').value.trim();
  const tags = document.getElementById('projectTags').value.split(',').map((tag) => tag.trim()).filter(Boolean);
  if (!title) return showToast('Project title is required.', 'error');
  if (github && !github.startsWith('https://github.com/')) return showToast('GitHub links must start with https://github.com/.', 'error');
  const projects = readStoredArray(PROJECT_STORAGE_KEY);
  projects.push({ id: makeId(), title, description, folderName, github, tags, createdAt: new Date().toISOString() });
  if (!saveStoredArray(PROJECT_STORAGE_KEY, projects)) return;
  event.currentTarget.reset();
  closeModal('projectModal');
  showToast('Project added successfully.');
  viewProjects();
}

async function viewProjects(folderName = '') {
  const container = document.getElementById('projectsList');
  if (!container) return;
  const projects = readStoredArray(PROJECT_STORAGE_KEY).filter((project) => !folderName || project.folderName === folderName);
  const title = document.getElementById('projectsListTitle');
  if (title) {
    title.textContent = folderName ? `Folder: ${folderName}` : 'All Projects';
    title.dataset.folder = folderName;
  }
  const back = document.getElementById('backToProjectsBtn');
  if (back) back.hidden = !folderName;
  let projectCards = projects.map((project) => `
    <article class="project-card glass-card">
      <h3>${escapeHTML(project.title)}</h3><p>${escapeHTML(project.description || 'No description provided.')}</p>
      <p><strong>Folder:</strong> ${escapeHTML(project.folderName || 'Unfiled')}</p>
      <p><i class="fa-brands fa-github" aria-hidden="true"></i> <strong>GitHub:</strong> ${project.github ? `<a href="${escapeHTML(project.github)}" target="_blank" rel="noopener noreferrer">${escapeHTML(project.github)}</a>` : 'GitHub repository not added.'}</p>
      <div class="project-tags">${(project.tags || []).map((tag) => `<span>${escapeHTML(tag)}</span>`).join('')}</div>
      <div class="project-actions">${project.github ? `<button class="secondary-btn" data-action="open-github" data-url="${escapeHTML(project.github)}"><i class="fa-brands fa-github"></i> Open GitHub Repo</button>` : ''}
      <button class="ghost-btn" data-action="delete-project" data-id="${escapeHTML(project.id)}">Delete Project</button></div>
    </article>`).join('');
  let fileCards = '';
  if (folderName) {
    container.innerHTML = '<p class="empty-state">Loading folder contents…</p>';
    try {
      const folder = readStoredArray(FOLDER_STORAGE_KEY).find((item) => item.name === folderName);
      if (!folder) throw new Error('This folder could not be found. Refresh the page and try again.');
      const database = await openPdfDatabase();
      const files = await new Promise((resolve, reject) => {
        const transaction = database.transaction(PROJECT_FILE_STORE_NAME, 'readonly');
        const request = transaction.objectStore(PROJECT_FILE_STORE_NAME).getAll();
        request.onsuccess = () => resolve(request.result.filter((file) => file.folderId === folder.id));
        request.onerror = () => reject(request.error || new Error('Could not read files in this folder.'));
      });
      fileCards = files.map((file) => `
        <article class="project-card glass-card folder-open-file-card">
          <h3><i class="fa-regular fa-file" aria-hidden="true"></i> ${escapeHTML(file.name)}</h3>
          <p>${escapeHTML(file.type || 'File')} · ${formatFileSize(file.size)} · Added ${new Date(file.createdAt).toLocaleString()}</p>
          <div class="project-actions"><button class="secondary-btn" data-action="download-folder-file" data-id="${escapeHTML(file.id)}">Download File</button><button class="ghost-btn" data-action="delete-folder-file" data-id="${escapeHTML(file.id)}">Remove File</button></div>
        </article>`).join('');
    } catch (error) {
      showToast(`Could not open folder: ${error.message}`, 'error');
      fileCards = '';
    }
  }
  const contents = projectCards + fileCards;
  container.innerHTML = contents || `<p class="empty-state">${folderName ? 'This folder is empty. Add files or assign projects to it.' : 'No projects added yet.'}</p>`;
}

function formatFileSize(size) {
  if (!Number.isFinite(size) || size < 0) return 'Unknown size';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function deleteProject(id) {
  if (!window.confirm('Are you sure you want to delete this project?')) return;
  const projects = readStoredArray(PROJECT_STORAGE_KEY);
  if (!saveStoredArray(PROJECT_STORAGE_KEY, projects.filter((project) => project.id !== id))) return;
  viewProjects(document.getElementById('projectsListTitle')?.dataset.folder || '');
  viewFolders();
}

async function addFolder(event) {
  if (event) event.preventDefault();
  const form = event?.currentTarget;
  const name = document.getElementById('folderName').value.trim();
  const description = document.getElementById('folderDescription').value.trim();
  const files = [...(document.getElementById('folderFiles')?.files || [])];
  if (!name) return showToast('Folder name is required.', 'error');
  const folders = readStoredArray(FOLDER_STORAGE_KEY);
  if (folders.some((folder) => folder.name.toLowerCase() === name.toLowerCase())) return showToast('A folder with that name already exists.', 'error');
  const folder = { id: makeId(), name, description, createdAt: new Date().toISOString() };
  try {
    if (files.length) await storeProjectFiles(folder, files);
    if (!saveStoredArray(FOLDER_STORAGE_KEY, [...folders, folder])) {
      if (files.length) await removeProjectFiles(folder.id);
      return;
    }
  } catch (error) {
    showToast(`Could not save folder files: ${error.message}`, 'error');
    return;
  }
  form?.reset();
  const selectedFiles = document.getElementById('folderFilesSummary');
  if (selectedFiles) selectedFiles.textContent = 'No files selected.';
  closeModal('folderModal');
  viewFolders();
  updateProjectFolderOptions();
  showToast(files.length ? 'Folder and files added successfully.' : 'Folder added successfully.');
}

async function viewFolders() {
  const container = document.getElementById('foldersList');
  if (!container) return;
  container.innerHTML = '<p class="empty-state">Loading folders…</p>';
  const projects = readStoredArray(PROJECT_STORAGE_KEY);
  const folders = readStoredArray(FOLDER_STORAGE_KEY);
  let filesByFolder;
  try {
    filesByFolder = new Map();
    const database = await openPdfDatabase();
    const files = await new Promise((resolve, reject) => {
      const transaction = database.transaction(PROJECT_FILE_STORE_NAME, 'readonly');
      const request = transaction.objectStore(PROJECT_FILE_STORE_NAME).getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Could not read folder files.'));
    });
    files.forEach((file) => {
      const folderFiles = filesByFolder.get(file.folderId) || [];
      folderFiles.push(file);
      filesByFolder.set(file.folderId, folderFiles);
    });
  } catch (error) {
    showToast(`Could not load folder files: ${error.message}`, 'error');
    filesByFolder = new Map();
  }
  container.innerHTML = folders.map((folder) => `
    <article class="folder-card glass-card"><div class="folder-icon"><i class="fa-solid fa-folder-open"></i></div><h3>${escapeHTML(folder.name)}</h3>
      <p>${escapeHTML(folder.description || 'No description provided.')}</p><p>${projects.filter((project) => project.folderName === folder.name).length} projects</p>
      <div class="folder-files"><strong>Files (${(filesByFolder.get(folder.id) || []).length})</strong>
        ${(filesByFolder.get(folder.id) || []).map((file) => `<div class="folder-file-item"><span><i class="fa-regular fa-file" aria-hidden="true"></i> ${escapeHTML(file.name)}</span><button class="ghost-btn" data-action="download-folder-file" data-id="${escapeHTML(file.id)}">Download</button><button class="ghost-btn" data-action="delete-folder-file" data-id="${escapeHTML(file.id)}">Remove</button></div>`).join('') || '<p>No files added.</p>'}
      </div>
      <div class="project-actions"><button class="secondary-btn" data-action="open-folder" data-folder="${escapeHTML(folder.name)}">Open Folder</button><button class="ghost-btn" data-action="delete-folder" data-id="${escapeHTML(folder.id)}">Delete Folder</button></div></article>`).join('') || '<p class="empty-state">No folders added yet.</p>';
}

async function storeProjectFiles(folder, files) {
  const database = await openPdfDatabase();
  const records = files.map((file) => ({
    id: makeId(),
    folderId: folder.id,
    name: file.name,
    type: file.type || 'application/octet-stream',
    size: file.size,
    createdAt: new Date().toISOString(),
    file
  }));
  await new Promise((resolve, reject) => {
    const transaction = database.transaction(PROJECT_FILE_STORE_NAME, 'readwrite');
    records.forEach((record) => transaction.objectStore(PROJECT_FILE_STORE_NAME).add(record));
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error || new Error('Could not store the selected files.'));
    transaction.onabort = () => reject(transaction.error || new Error('Saving folder files was cancelled.'));
  });
}

async function removeProjectFiles(folderId) {
  const database = await openPdfDatabase();
  await new Promise((resolve, reject) => {
    const transaction = database.transaction(PROJECT_FILE_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(PROJECT_FILE_STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => request.result
      .filter((file) => file.folderId === folderId)
      .forEach((file) => store.delete(file.id));
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error || new Error('Could not remove folder files.'));
    transaction.onabort = () => reject(transaction.error || new Error('Removing folder files was cancelled.'));
  });
}

async function getProjectFile(id) {
  const database = await openPdfDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(PROJECT_FILE_STORE_NAME, 'readonly');
    const request = transaction.objectStore(PROJECT_FILE_STORE_NAME).get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not read the selected folder file.'));
  });
}

async function downloadProjectFile(id) {
  try {
    const record = await getProjectFile(id);
    if (!record || !(record.file instanceof Blob)) throw new Error('The selected file could not be found.');
    const url = URL.createObjectURL(record.file);
    const link = document.createElement('a');
    link.href = url;
    link.download = record.name;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    showToast(`Could not download folder file: ${error.message}`, 'error');
  }
}

async function deleteProjectFile(id) {
  if (!window.confirm('Remove this file from the folder?')) return;
  try {
    const database = await openPdfDatabase();
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(PROJECT_FILE_STORE_NAME, 'readwrite');
      transaction.objectStore(PROJECT_FILE_STORE_NAME).delete(id);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error || new Error('Could not remove this file.'));
      transaction.onabort = () => reject(transaction.error || new Error('Removing this file was cancelled.'));
    });
    await viewFolders();
    showToast('Folder file removed.');
  } catch (error) {
    showToast(`Could not remove folder file: ${error.message}`, 'error');
  }
}

function openFolder(folderName) {
  const folder = readStoredArray(FOLDER_STORAGE_KEY).find((item) => item.name === folderName);
  if (!folder) return showToast('This folder could not be found. Refresh the page and try again.', 'error');
  const title = document.getElementById('projectsListTitle');
  if (title) {
    title.dataset.folder = folderName;
    title.dataset.folderId = folder.id;
  }
  viewProjects(folderName);
  document.getElementById('projectsList')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deleteFolder(id) {
  const folders = readStoredArray(FOLDER_STORAGE_KEY);
  const folder = folders.find((item) => item.id === id);
  if (!folder) return;
  if (!window.confirm(`Delete folder "${folder.name}"? Projects in it will become unfiled and its attached files will be deleted.`)) return;
  const projects = readStoredArray(PROJECT_STORAGE_KEY).map((project) => project.folderName === folder.name ? { ...project, folderName: '' } : project);
  if (!saveStoredArray(PROJECT_STORAGE_KEY, projects) || !saveStoredArray(FOLDER_STORAGE_KEY, folders.filter((item) => item.id !== id))) return;
  removeProjectFiles(id).then(viewFolders).catch((error) => {
    showToast(`Folder deleted, but its files could not be removed: ${error.message}`, 'error');
    viewFolders();
  });
  updateProjectFolderOptions();
  viewProjects();
}

function updateProjectFolderOptions() {
  const select = document.getElementById('projectFolder');
  if (!select) return;
  const selected = select.value;
  select.innerHTML = '<option value="">Unfiled</option>' + readStoredArray(FOLDER_STORAGE_KEY)
    .map((folder) => `<option value="${escapeHTML(folder.name)}">${escapeHTML(folder.name)}</option>`).join('');
  select.value = selected;
}

function openGitHubRepo(url) {
  if (!url.startsWith('https://github.com/')) return showToast('This is not a valid GitHub repository URL.', 'error');
  window.open(url, '_blank', 'noopener,noreferrer');
}

const CODE_EXTENSIONS = { Python: 'py', Pandas: 'py', PyTorch: 'py', Java: 'java', C: 'c', 'C++': 'cpp', Notebook: 'ipynb' };

function saveCode(event) {
  if (event) event.preventDefault();
  const editor = document.getElementById('codeEditor');
  const language = document.getElementById('languageSelect').value;
  const name = document.getElementById('codeFileName').value.trim();
  const description = document.getElementById('codeFileDescription').value.trim();
  if (!name) return showToast('File name is required.', 'error');
  const files = readStoredArray(CODE_FILE_STORAGE_KEY);
  const activeId = document.getElementById('codeFileId').value;
  const existing = activeId && files.find((file) => file.id === activeId);
  const record = { id: activeId || makeId(), name, fileType: CODE_EXTENSIONS[language] || 'txt', language, content: editor.value, updatedAt: new Date().toISOString(), description };
  if (existing) files[files.indexOf(existing)] = record;
  else files.push(record);
  if (!saveStoredArray(CODE_FILE_STORAGE_KEY, files)) return;
  document.getElementById('codeFileId').value = record.id;
  closeModal('saveCodeModal');
  showToast('Code saved successfully.');
  viewSavedFiles();
}

function saveEditedFile(event) {
  return saveCode(event);
}

function viewSavedFiles() {
  const container = document.getElementById('savedFilesList');
  if (!container) return;
  const files = readStoredArray(CODE_FILE_STORAGE_KEY);
  container.innerHTML = files.length ? files.map((file) => `
    <article class="saved-file-card"><h3>${escapeHTML(file.name)}</h3><p>${escapeHTML(file.language)} · ${new Date(file.updatedAt).toLocaleString()}</p><p>${escapeHTML(file.description || 'No description')}</p>
      <div class="project-actions">${file.language === 'Notebook' ? `<button class="secondary-btn" data-action="open-notebook-colab">Open in Google Colab</button><button class="ghost-btn" data-action="download-code" data-id="${escapeHTML(file.id)}">Download File</button>` : `<button class="secondary-btn" data-action="open-code" data-id="${escapeHTML(file.id)}">Open Code</button><button class="secondary-btn" data-action="edit-code" data-id="${escapeHTML(file.id)}">Edit Code</button><button class="ghost-btn" data-action="download-code" data-id="${escapeHTML(file.id)}">Download Code</button>`}<button class="ghost-btn" data-action="delete-code" data-id="${escapeHTML(file.id)}">Delete Code</button></div></article>`).join('') : '<p class="empty-state">No saved or uploaded files yet.</p>';
  openModal('savedFilesModal');
}

function openSavedFile(id, edit = false) {
  const file = readStoredArray(CODE_FILE_STORAGE_KEY).find((item) => item.id === id);
  if (!file) return showToast('Saved file could not be found.', 'error');
  const selector = document.getElementById('languageSelect');
  if (file.language !== 'Notebook') selector.value = file.language;
  document.getElementById('codeEditor').value = file.content;
  document.getElementById('codeFileId').value = file.id;
  try {
    localStorage.setItem(EDITOR_STORAGE_KEY, file.content);
  } catch (error) {
    showToast(`Could not save editor draft: ${error.message}`, 'error');
  }
  closeModal('savedFilesModal');
  if (edit) document.getElementById('codeEditor').focus();
  else showToast('Code loaded into the editor.');
}

function editSavedFile(id) {
  openSavedFile(id, true);
  document.getElementById('codeFileName').value = readStoredArray(CODE_FILE_STORAGE_KEY).find((item) => item.id === id)?.name || '';
}

function downloadCodeFile(file) {
  const blob = new Blob([file.content], { type: file.fileType === 'ipynb' ? 'application/json' : 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  const baseName = file.name.replace(new RegExp(`\\.${file.fileType}$`, 'i'), '');
  link.download = `${baseName.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')}.${file.fileType}`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function downloadFile(id) {
  const file = readStoredArray(CODE_FILE_STORAGE_KEY).find((item) => item.id === id);
  if (file) downloadCodeFile(file);
}

function deleteCodeFile(id) {
  if (!window.confirm('Are you sure you want to delete this saved file?')) return;
  if (!saveStoredArray(CODE_FILE_STORAGE_KEY, readStoredArray(CODE_FILE_STORAGE_KEY).filter((file) => file.id !== id))) return;
  viewSavedFiles();
}

function deleteFile(id) {
  return deleteCodeFile(id);
}

function uploadFile() {
  document.getElementById('codeUploadInput')?.click();
}

async function handleCodeUpload(event) {
  const file = event.target.files[0];
  event.target.value = '';
  if (!file) return;
  const extension = file.name.split('.').pop().toLowerCase();
  const languages = { py: 'Python', java: 'Java', c: 'C', cpp: 'C++', ipynb: 'Notebook' };
  if (!languages[extension]) return showToast('Choose a .py, .java, .c, .cpp, or .ipynb file.', 'error');
  if (file.size > 1024 * 1024) return showToast('Files must be 1 MB or smaller to fit browser storage.', 'error');
  try {
    const content = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error || new Error('The selected file could not be read.'));
      reader.readAsText(file);
    });
    if (extension === 'ipynb') {
      const notebook = JSON.parse(content);
      const cells = (notebook.cells || []).filter((cell) => cell.cell_type === 'code')
        .map((cell) => Array.isArray(cell.source) ? cell.source.join('') : String(cell.source || '')).join('\n\n');
      if (cells) document.getElementById('codeEditor').value = cells;
    }
    const defaultName = file.name.replace(/\.[^.]+$/, '');
    const enteredName = window.prompt('Choose a file name, or keep the original name:', defaultName);
    if (enteredName === null) return;
    const name = enteredName.trim();
    if (!name) return showToast('File name cannot be empty.', 'error');
    const record = { id: makeId(), name, fileType: extension, language: languages[extension], content, updatedAt: new Date().toISOString(), description: `Uploaded ${file.name}` };
    if (!saveStoredArray(CODE_FILE_STORAGE_KEY, [...readStoredArray(CODE_FILE_STORAGE_KEY), record])) return;
    showToast('File uploaded successfully.');
    viewSavedFiles();
  } catch (error) {
    showToast(`Could not read uploaded file: ${error.message}`, 'error');
  }
}

async function runCode() {
  const editor = document.getElementById('codeEditor');
  const output = document.getElementById('codeOutput');
  const language = document.getElementById('languageSelect').value;
  if (!editor.value.trim()) return showToast('Write or load code before running it.', 'error');
  if (isGitHubPages()) {
    output.textContent = 'GitHub Pages cannot run code because it does not provide the required server. Use Open Online Compiler and paste your code there, or choose Open in Google Colab for Python, Pandas, or PyTorch.';
    output.classList.remove('execution-error');
    return;
  }
  output.textContent = 'Compiling and running your code…';
  output.classList.remove('execution-error');
  const runButton = document.getElementById('runCodeBtn');
  runButton.disabled = true;
  try {
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, code: editor.value })
    });
    let result;
    try {
      result = await response.json();
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
      throw new Error(response.status === 404
        ? 'The code-execution server is not available at this address. Start the DataOrbit Node server or use Open Online Compiler.'
        : 'The code-execution server returned an unexpected response. Check that the DataOrbit Node server is running.');
    }
    if (!response.ok) throw new Error(result.error || `Execution service returned HTTP ${response.status}.`);
    if (typeof result.status !== 'string' || typeof result.programOutput !== 'string') {
      throw new Error('The online compiler returned an invalid response.');
    }
    output.textContent = [
      result.programOutput,
      result.programError,
      result.compilerError,
      result.compilerOutput
    ].filter(Boolean).join('\n') || (result.status === '0' ? '(Program completed with no output.)' : `Program exited with status ${result.status}.`);
    if (result.status !== '0') output.classList.add('execution-error');
    if (['Pandas', 'PyTorch'].includes(language)) {
      output.textContent += '\n\nNote: The online compiler may not include Pandas or PyTorch. Use Google Colab if these imports are unavailable.';
    }
  } catch (error) {
    const message = window.location.protocol === 'file:'
      ? 'Open the Lab page at http://127.0.0.1:3000/lab.html to run code through the server.'
      : `Execution failed: ${error.message}`;
    output.textContent = message;
    output.classList.add('execution-error');
  } finally {
    runButton.disabled = false;
  }
}

function setupNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const expanded = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(expanded));
  });
  menu.querySelectorAll('.nav-link').forEach((link) => link.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

function setupPageEvents() {
  document.querySelectorAll('.close-modal').forEach((button) => button.addEventListener('click', () => closeModal(button.dataset.close)));
  document.querySelectorAll('.modal').forEach((modal) => modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal(modal.id);
  }));
  document.addEventListener('keydown', (event) => {
    const viewer = document.getElementById('pdfBookViewer');
    const themePicker = document.getElementById('themePicker');
    const editingText = event.target instanceof HTMLElement
      && (event.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName));
    if (viewer && !viewer.hidden && !editingText && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault();
      flipPdfPage(event.key === 'ArrowRight' ? 'next' : 'previous');
    }
    if (event.key === 'Escape' && viewer && !viewer.hidden) closePdfFlipbook();
    if (event.key === 'Escape' && themePicker?.classList.contains('is-open')) {
      setThemePickerOpen(false);
      document.getElementById('changeThemeBtn')?.focus();
    }
    if (event.key === 'Escape') document.querySelectorAll('.modal.visible').forEach((modal) => closeModal(modal.id));
  });

  const pdfForm = document.getElementById('pdfForm');
  if (pdfForm) pdfForm.addEventListener('submit', addPDF);
  const addPdfButton = document.getElementById('addModulePdfBtn');
  if (addPdfButton) addPdfButton.addEventListener('click', () => openModal('pdfModal'));
  const viewPdfButton = document.getElementById('viewModulePdfsBtn');
  if (viewPdfButton) viewPdfButton.addEventListener('click', viewPDFs);
  const closePdfViewerButton = document.getElementById('closePdfViewerBtn');
  if (closePdfViewerButton) closePdfViewerButton.addEventListener('click', closePdfFlipbook);
  const previousPdfPageButton = document.getElementById('prevBtn');
  if (previousPdfPageButton) previousPdfPageButton.onclick = () => {
    if (pdfBookReady && window.jQuery) jQuery('#flipbook').turn('previous');
  };
  const nextPdfPageButton = document.getElementById('nextBtn');
  if (nextPdfPageButton) nextPdfPageButton.onclick = () => {
    if (pdfBookReady && window.jQuery) jQuery('#flipbook').turn('next');
  };
  const zoomOutPdfButton = document.getElementById('zoomOutPdfBtn');
  if (zoomOutPdfButton) zoomOutPdfButton.addEventListener('click', () => setPdfZoom(-1));
  const zoomInPdfButton = document.getElementById('zoomInPdfBtn');
  if (zoomInPdfButton) zoomInPdfButton.addEventListener('click', () => setPdfZoom(1));
  const flipbookStage = document.getElementById('pdfFlipbookStage');
  if (flipbookStage) {
    flipbookStage.addEventListener('click', (event) => {
      const page = event.target.closest('.pdf-book-page');
      if (!page) return;
      const pageBounds = page.getBoundingClientRect();
      const nearHorizontalCorner = event.clientX - pageBounds.left < 40 || pageBounds.right - event.clientX < 40;
      const nearVerticalCorner = event.clientY - pageBounds.top < 40 || pageBounds.bottom - event.clientY < 40;
      if (nearHorizontalCorner && nearVerticalCorner) return;
      const book = document.getElementById('flipbook');
      if (!book) return;
      const bounds = book.getBoundingClientRect();
      flipPdfPage(event.clientX >= bounds.left + bounds.width / 2 ? 'next' : 'previous');
    });
    let touchStart;
    flipbookStage.addEventListener('touchstart', (event) => {
      touchStart = event.changedTouches[0].clientX;
    }, { passive: true, capture: true });
    flipbookStage.addEventListener('touchend', (event) => {
      if (touchStart === undefined) return;
      const delta = event.changedTouches[0].clientX - touchStart;
      touchStart = undefined;
      if (Math.abs(delta) < 45) return;
      event.preventDefault();
      event.stopPropagation();
      flipPdfPage(delta < 0 ? 'next' : 'previous');
    }, { passive: false, capture: true });
  }
  window.addEventListener('resize', () => {
    window.clearTimeout(pdfResizeTimer);
    pdfResizeTimer = window.setTimeout(resizePdfBook, 120);
  });
  const resourceForm = document.getElementById('resourceForm');
  if (resourceForm) resourceForm.addEventListener('submit', addResource);
  const addResourceButton = document.getElementById('addResourceBtn');
  if (addResourceButton) addResourceButton.addEventListener('click', () => openModal('resourceModal'));
  const viewResourcesButton = document.getElementById('viewMyResourcesBtn');
  if (viewResourcesButton) viewResourcesButton.addEventListener('click', viewResources);

  document.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-action]');
    if (!actionButton) return;
    const id = actionButton.dataset.id;
    if (actionButton.dataset.action === 'open-pdf') openPDF(id);
    if (actionButton.dataset.action === 'delete-pdf') deletePDF(id);
    if (actionButton.dataset.action === 'delete-resource') deleteResource(id);
    if (actionButton.dataset.action === 'delete-project') deleteProject(id);
    if (actionButton.dataset.action === 'delete-folder') deleteFolder(id);
    if (actionButton.dataset.action === 'open-folder') openFolder(actionButton.dataset.folder);
    if (actionButton.dataset.action === 'download-folder-file') downloadProjectFile(id);
    if (actionButton.dataset.action === 'delete-folder-file') deleteProjectFile(id);
    if (actionButton.dataset.action === 'open-github') openGitHubRepo(actionButton.dataset.url);
    if (actionButton.dataset.action === 'open-code') openSavedFile(id);
    if (actionButton.dataset.action === 'edit-code') editSavedFile(id);
    if (actionButton.dataset.action === 'download-code') downloadFile(id);
    if (actionButton.dataset.action === 'delete-code') deleteFile(id);
    if (actionButton.dataset.action === 'open-notebook-colab') openGoogleColab();
  });

  document.querySelectorAll('.filter-btn').forEach((button) => button.addEventListener('click', () => filterTools(button.dataset.filter)));
  const languageSelector = document.getElementById('languageSelect');
  if (languageSelector) languageSelector.addEventListener('change', () => {
    document.getElementById('codeFileId').value = '';
    selectLanguage();
  });
  const sampleButton = document.getElementById('loadSampleCodeBtn');
  if (sampleButton) sampleButton.addEventListener('click', loadSampleCode);
  const copyButton = document.getElementById('copyCodeBtn');
  if (copyButton) copyButton.addEventListener('click', copyCode);
  const clearButton = document.getElementById('clearCodeBtn');
  if (clearButton) clearButton.addEventListener('click', () => {
    document.getElementById('codeEditor').value = '';
    document.getElementById('codeEditor').dispatchEvent(new Event('input', { bubbles: true }));
    showToast('Code cleared.');
  });
  const colabButton = document.getElementById('runColabBtn');
  if (colabButton) colabButton.addEventListener('click', openGoogleColab);
  const compilerButton = document.getElementById('openCompilerBtn');
  if (compilerButton) compilerButton.addEventListener('click', openOnlineCompiler);
  const themePicker = document.getElementById('themePicker');
  const changeThemeButton = document.getElementById('changeThemeBtn');
  const closeThemePickerButton = document.getElementById('closeThemePickerBtn');
  if (changeThemeButton) {
    changeThemeButton.addEventListener('click', () => {
      setThemePickerOpen(!themePicker.classList.contains('is-open'));
    });
  }
  if (closeThemePickerButton) {
    closeThemePickerButton.addEventListener('click', () => {
      setThemePickerOpen(false);
      changeThemeButton?.focus();
    });
  }
  document.querySelectorAll('[data-theme-choice]').forEach((button) => button.addEventListener('click', () => {
    applyTheme(button.dataset.themeChoice, true);
    setThemePickerOpen(false);
    changeThemeButton?.focus();
  }));
  document.addEventListener('click', (event) => {
    if (themePicker?.classList.contains('is-open') && !themePicker.contains(event.target)) {
      setThemePickerOpen(false);
    }
  });
  const projectForm = document.getElementById('projectForm');
  if (projectForm) projectForm.addEventListener('submit', addProject);
  const folderForm = document.getElementById('folderForm');
  if (folderForm) folderForm.addEventListener('submit', addFolder);
  const folderFilesInput = document.getElementById('folderFiles');
  if (folderFilesInput) folderFilesInput.addEventListener('change', () => {
    const names = [...folderFilesInput.files].map((file) => file.name);
    document.getElementById('folderFilesSummary').textContent = names.length
      ? `${names.length} file${names.length === 1 ? '' : 's'} selected: ${names.join(', ')}`
      : 'No files selected.';
  });
  document.getElementById('addProjectBtn')?.addEventListener('click', () => openModal('projectModal'));
  document.getElementById('addFolderBtn')?.addEventListener('click', () => openModal('folderModal'));
  document.getElementById('backToProjectsBtn')?.addEventListener('click', () => {
    const title = document.getElementById('projectsListTitle');
    if (title) title.dataset.folder = '';
    viewProjects();
  });
  document.getElementById('viewSavedFilesBtn')?.addEventListener('click', viewSavedFiles);
  document.getElementById('saveCodeBtn')?.addEventListener('click', () => {
    const active = document.getElementById('codeFileId')?.value;
    const record = active && readStoredArray(CODE_FILE_STORAGE_KEY).find((file) => file.id === active);
    document.getElementById('codeFileName').value = record?.name || '';
    document.getElementById('codeFileDescription').value = record?.description || '';
    document.getElementById('codeFileLanguage').value = document.getElementById('languageSelect').value;
    openModal('saveCodeModal');
  });
  document.getElementById('saveCodeForm')?.addEventListener('submit', saveEditedFile);
  document.getElementById('uploadCodeBtn')?.addEventListener('click', uploadFile);
  document.getElementById('codeUploadInput')?.addEventListener('change', handleCodeUpload);
  document.getElementById('runCodeBtn')?.addEventListener('click', runCode);
  const editor = document.getElementById('codeEditor');
  if (editor) {
    try {
      const savedDraft = localStorage.getItem(EDITOR_STORAGE_KEY);
      if (savedDraft !== null) {
        editor.value = savedDraft;
        editor.dataset.restoredDraft = 'true';
      }
    } catch (error) {
      showToast(`Could not restore editor draft: ${error.message}`, 'error');
    }
    resizeCodeEditor(editor);
    editor.addEventListener('input', () => {
      resizeCodeEditor(editor);
      try {
        localStorage.setItem(EDITOR_STORAGE_KEY, editor.value);
      } catch (error) {
        showToast(`Could not save editor draft: ${error.message}`, 'error');
      }
    });
  }
}

function init() {
  let savedTheme = DEFAULT_THEME;
  try {
    savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME;
  } catch (error) {
    showToast(`Could not read saved theme: ${error.message}`, 'error');
  }
  applyTheme(savedTheme);
  ensureModulePdfLayout();
  showPdfServerNotice();
  setupPublishedPdfCatalog();
  setupNavigation();
  setupPageEvents();
  renderResources();
  filterTools();
  const codeEditor = document.getElementById('codeEditor');
  if (codeEditor && !codeEditor.value && codeEditor.dataset.restoredDraft !== 'true') selectLanguage();
  updateProjectFolderOptions();
  viewFolders();
  if (document.getElementById('projectsList')) viewProjects();
}

document.addEventListener('DOMContentLoaded', init);
