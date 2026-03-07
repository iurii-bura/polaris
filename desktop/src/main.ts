import { app, BrowserWindow, protocol, ipcMain, dialog, Menu } from 'electron';
import path from 'path';
import fs from 'fs/promises';
import { WorkspaceManager } from './workspace/workspace-manager';
import type { ComponentGraph } from './types';

// ── Protocol registration ──────────────────────────────────────────────────
// Must happen before app.whenReady() per Electron requirements.
protocol.registerSchemesAsPrivileged([
    {
        scheme: 'app',
        privileges: { secure: true, standard: true, supportFetchAPI: true, corsEnabled: true }
    }
]);

// ── State ──────────────────────────────────────────────────────────────────

let mainWindow: BrowserWindow | null = null;
let workspaceManager: WorkspaceManager | null = null;

const isDev = !app.isPackaged;

// ── IPC handlers ───────────────────────────────────────────────────────────
// Registered at module level so they are ready before any window is created.

ipcMain.handle('workspace:open', async (_event, filePath?: string) => {
    const targetPath = filePath ?? (await showOpenDialog());
    if (!targetPath) return;
    await workspaceManager?.openWorkspace(targetPath);
});

ipcMain.handle('workspace:new', async (_event, name: string) => {
    const savePath = await showSaveDialog(name);
    if (!savePath) return;
    await workspaceManager?.newWorkspace(name, savePath);
});

ipcMain.handle('workspace:getRecent', () => {
    return workspaceManager?.getRecentWorkspaces() ?? [];
});

ipcMain.handle('workspace:save', async (_event, graph: ComponentGraph) => {
    await workspaceManager?.saveGraph(graph);
});

// ── Window creation ─────────────────────────────────────────────────────────

function createWindow(): void {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        titleBarStyle: 'hiddenInset', // macOS native integrated title bar
        title: 'Polaris',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false // Renderer never gets direct Node.js access
        }
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:8080');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadURL('app://index');
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// ── Static file serving (production only) ──────────────────────────────────

const MIME_TYPES: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.txt': 'text/plain; charset=utf-8'
};

function registerAppProtocol(): void {
    protocol.handle('app', async (request) => {
        const url = new URL(request.url);
        let urlPath = url.pathname;

        // Any path without a file extension is an SPA route — serve index.html
        if (!path.extname(urlPath)) {
            urlPath = '/index.html';
        }

        // The React bundle is placed at Contents/Resources/ui/dist/bundle/ via
        // extraResources in electron-builder config — accessible via resourcesPath.
        const filePath = path.join(process.resourcesPath, 'ui/dist/bundle', urlPath);
        const mimeType = MIME_TYPES[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream';

        try {
            // fs.readFile is ASAR-aware (unlike net.fetch with file://).
            // Access-Control-Allow-Origin is required because index.html uses
            // crossorigin="anonymous" + SRI integrity on every script/link tag.
            const data = await fs.readFile(filePath);
            return new Response(data, {
                status: 200,
                headers: {
                    'Content-Type': mimeType,
                    'Access-Control-Allow-Origin': '*'
                }
            });
        } catch {
            return new Response('Not Found', { status: 404 });
        }
    });
}

// ── Native dialogs ──────────────────────────────────────────────────────────

async function showOpenDialog(): Promise<string | undefined> {
    if (!mainWindow) return undefined;
    const result = await dialog.showOpenDialog(mainWindow, {
        filters: [{ name: 'Polaris Workspace', extensions: ['polaris'] }],
        properties: ['openFile']
    });
    return result.canceled ? undefined : result.filePaths[0];
}

async function showSaveDialog(name: string): Promise<string | undefined> {
    if (!mainWindow) return undefined;
    const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath: `${name}.polaris`,
        filters: [{ name: 'Polaris Workspace', extensions: ['polaris'] }]
    });
    return result.canceled ? undefined : result.filePath;
}

// ── Application menu ────────────────────────────────────────────────────────

function buildMenu(): void {
    const recentItems: Electron.MenuItemConstructorOptions[] =
        workspaceManager
            ?.getRecentWorkspaces()
            .map((ws) => ({
                label: ws.name,
                sublabel: ws.filePath,
                click: (): void => {
                    void workspaceManager?.openWorkspace(ws.filePath);
                }
            })) ?? [];

    const template: Electron.MenuItemConstructorOptions[] = [
        {
            label: app.name,
            submenu: [{ role: 'about' }, { type: 'separator' }, { role: 'quit' }]
        },
        {
            label: 'File',
            submenu: [
                {
                    label: 'New Workspace\u2026',
                    accelerator: 'CmdOrCtrl+N',
                    click: (): void => {
                        mainWindow?.webContents.send('menu:newWorkspace');
                    }
                },
                {
                    label: 'Open Workspace\u2026',
                    accelerator: 'CmdOrCtrl+O',
                    click: async (): Promise<void> => {
                        const filePath = await showOpenDialog();
                        if (filePath) await workspaceManager?.openWorkspace(filePath);
                    }
                },
                { type: 'separator' },
                {
                    label: 'Recent Workspaces',
                    submenu: recentItems.length > 0 ? recentItems : [{ label: 'No recent workspaces', enabled: false }]
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'selectAll' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        }
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ── App lifecycle ───────────────────────────────────────────────────────────

app.whenReady()
    .then(async () => {
        if (!isDev) {
            registerAppProtocol();
        }

        createWindow();

        workspaceManager = new WorkspaceManager(mainWindow!);
        buildMenu();

        // Defer init until the renderer has finished loading so that React's
        // useEffect listeners are registered before we send workspace:loaded
        // or workspace:none — otherwise the IPC events arrive before anyone
        // is listening and the app stays in 'loading' state forever.
        mainWindow!.webContents.once('did-finish-load', () => {
            void workspaceManager?.init();
        });
    })
    .catch(console.error);

app.on('window-all-closed', () => {
    // On macOS apps conventionally stay in the dock until the user quits explicitly
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // app.isReady() guards against the activate event firing before
    // app.whenReady() has resolved (common when launching from DMG).
    // In that case whenReady() will create the window itself.
    if (mainWindow === null && app.isReady()) {
        createWindow();
    }
});
