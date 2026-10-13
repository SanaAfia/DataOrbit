# DataOrbit

## Run locally

On Windows, double-click `Start DataOrbit.bat` to start the local server and open the website at `http://127.0.0.1:3000`. If dependencies are missing, run `npm install` once in the project folder. Alternatively, run `npm start` and open the same URL manually.

Open the served URL rather than double-clicking `index.html`: PDF uploads and code execution require the local server, and browser storage is separate between `file://` and `http://127.0.0.1:3000`.

The Express server serves the existing static pages and provides the PDF API. Uploaded PDFs and their metadata are stored in the ignored `.data` directory, so they remain on the server across restarts and are not committed to source control. The default server binds to this computer only (`127.0.0.1`); other devices cannot access it unless you deliberately configure a reachable host.

PDF uploads are limited to 100 MB. The local API does not include accounts or access control; add authentication and authorization before exposing it to a public network.

PDFs still present in this site's browser storage are copied to the server the next time that module's PDF list is opened. Browser storage is isolated by origin, so PDFs saved while opening pages directly with `file://` are not visible to the server; upload those files again after starting the server.

## Publish PDFs on GitHub Pages

GitHub Pages serves static files and cannot run the PDF upload API. On GitHub Pages, add PDFs to the repository and list them in `pdfs.json`; the module pages open them in the built-in flipbook. Published PDFs are read-only in the site: they have no edit, delete, or download controls. Anyone with site access can still view the documents.

1. Add the PDF to `pdfs/moduleN/`, replacing `N` with the module number (1–5). Use a simple filename, such as `lecture-notes.pdf`.
2. Edit the matching module list in `pdfs.json` and add an entry like `{"title":"Lecture notes","path":"pdfs/module1/lecture-notes.pdf"}`.
3. Commit and push the PDF and catalog changes to GitHub. GitHub Pages will publish them; open the module page, choose **View Module N PDFs**, then **Read in Flipbook**.

Direct PDF uploads remain available when running the site with its Node server. The optional `render.yaml` deployment needs paid Render resources for persistent storage; no Render deployment is needed for GitHub Pages.

The local PDF API does not include accounts or access control. Do not expose it to a public network without adding authentication and abuse protections.

## Browser features and storage

The selected site theme, project/folder records, and saved or uploaded lab code are stored in this browser's local storage. Files attached to project folders are stored in IndexedDB in this browser. These records do not sync between browsers or devices and are subject to browser storage limits.

On GitHub Pages, the Lab Experiments page cannot run code because Pages does not provide the required server. Use **Open Online Compiler** and paste your code there, or use **Open in Google Colab** for Python, Pandas, or PyTorch. When running the site locally, Run Code sends code through the local server to the external Wandbox compiler API; do not submit credentials, secrets, or private data. The API supports Python, Java, C, and C++; Pandas and PyTorch packages may not be installed, so use Google Colab for those dependencies. Code submissions are limited to 48 KB and upstream requests time out after 30 seconds. PDF uploads continue to use the local Express backend.
