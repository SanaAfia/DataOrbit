# DataOrbit

## Run locally

On Windows, double-click `Start DataOrbit.bat` to start the local server and open the website at `http://127.0.0.1:3000`. If dependencies are missing, run `npm install` once in the project folder. Alternatively, run `npm start` and open the same URL manually.

Open the served URL rather than double-clicking `index.html`: PDF uploads and code execution require the local server, and browser storage is separate between `file://` and `http://127.0.0.1:3000`.

The Express server serves the existing static pages and provides the PDF API. Uploaded PDFs and their metadata are stored in the ignored `.data` directory, so they remain on the server across restarts and are not committed to source control. The default server binds to this computer only (`127.0.0.1`); other devices cannot access it unless you deliberately configure a reachable host.

PDF uploads are limited to 100 MB. The local API does not include accounts or access control; add authentication and authorization before exposing it to a public network.

PDFs still present in this site's browser storage are copied to the server the next time that module's PDF list is opened. Browser storage is isolated by origin, so PDFs saved while opening pages directly with `file://` are not visible to the server; upload those files again after starting the server.

## Deploy from GitHub with Render

The root `render.yaml` configures a Render Node web service that serves both the site and its API from one URL, with a persistent disk mounted at `.data` for uploaded PDFs. The persistent disk requires a paid Render web-service plan.

1. Push this entire project (including `render.yaml`, `package.json`, and `package-lock.json`) to a GitHub repository you control.
2. In Render, create a Blueprint from that repository and deploy the `dataorbit` service.
3. Open the deployed service URL and check that `/api/health` returns `{"status":"ok"}`. Open the site's `index.html` route from that same URL.

Do not publish the current backend as an unrestricted public service for real users: it has no authentication, so visitors can upload/delete PDFs and call the code execution endpoint. Add access control and abuse protections before sharing it publicly. Theme, project, folder, and lab-code browser data stays local to each user's browser and is not stored on the Render disk.

## Browser features and storage

The selected site theme, project/folder records, and saved or uploaded lab code are stored in this browser's local storage. Files attached to project folders are stored in IndexedDB in this browser. These records do not sync between browsers or devices and are subject to browser storage limits.

The Lab Experiments page sends code through the local server to the external Wandbox compiler API when Run Code is used; do not submit credentials, secrets, or private data. The API supports Python, Java, C, and C++; Pandas and PyTorch packages may not be installed, so use Google Colab for those dependencies. Code submissions are limited to 48 KB and upstream requests time out after 30 seconds. PDF uploads continue to use the local Express backend.
