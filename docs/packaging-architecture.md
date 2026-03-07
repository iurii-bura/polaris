# Packaging Architecture: Electron + React

This document describes how Polaris is structured as both a web application and a native macOS desktop app, and how the two runtime targets share a single React codebase.

---

## Overview

Polaris ships in two modes from one source tree:

| Mode | Runtime | Data storage | Entry point |
|---|---|---|---|
| **Web** | Browser | `localStorage` / REST API | `ui/dist/bundle/index.html` |
| **Desktop** | Electron (macOS) | `.polaris` bundle file | `electron/dist/main.js` |

The React application in `ui/` is identical in both modes. The difference is which **data provider** is injected at startup, and how the app is served.

---

## Build pipeline

There are two independent compilation steps, orchestrated from the repository root.

```
npm run build
  ├── build:web       RsBuild compiles ui/src/ → ui/dist/bundle/
  └── build:electron  tsc compiles electron/ → electron/dist/
```

### Web build (RsBuild / Rspack)

`ui/` has its own `package.json` and build configuration (`rsbuild.config.ts`). It produces a standard static web bundle: HTML, JS chunks, and CSS in `ui/dist/bundle/`. This output is:

- Served by the RsBuild dev server during web development (`npm run start`)
- Deployed as static files for the hosted web version
- Loaded by Electron in production via the custom `app://` protocol

### Electron build (tsc → CommonJS)

`electron/` has a separate `tsconfig.json` that compiles TypeScript to CommonJS (`"module": "CommonJS"`). This is required because:

- `ui/package.json` uses `"type": "module"` (ESM), which must not affect the main process
- Electron's main process expects CommonJS modules
- The two compilation pipelines are completely independent — no shared `tsconfig.json`

Output goes to `electron/dist/`. The root `package.json` points Electron to `electron/dist/main.js` via the `"main"` field.

---

## Process model

Electron applications consist of two processes with different capabilities and a strict security boundary between them.

```
┌─────────────────────────────────────────────────────┐
│  Main Process (Node.js — electron/main.ts)          │
│                                                     │
│  • App lifecycle (create window, handle quit)       │
│  • Custom app:// protocol (serves static files)     │
│  • Native OS integration (menus, file dialogs)      │
│  • File system (read/write .polaris bundles)        │
│  • WorkspaceManager (open, new, recent files)       │
│  • IPC handlers (workspace:open, workspace:save…)   │
└───────────────────┬─────────────────────────────────┘
                    │  IPC (ipcMain / ipcRenderer)
                    │  Serialised JSON — no shared memory
                    │
┌───────────────────▼─────────────────────────────────┐
│  Renderer Process (Chromium — ui/src/)              │
│                                                     │
│  • React application (identical to web version)     │
│  • No direct Node.js or file system access          │
│  • Communicates with main only via contextBridge    │
└─────────────────────────────────────────────────────┘
```

`contextIsolation: true` and `nodeIntegration: false` are set on the `BrowserWindow`. This is the standard Electron security model — the renderer is treated as an untrusted web page.

---

## The contextBridge (preload.ts)

The preload script runs in a privileged context that has access to both the renderer's `window` and Electron's IPC APIs. It exposes a typed, minimal API to the renderer via `contextBridge.exposeInMainWorld`:

```
window.electronAPI = {
  // Renderer → Main (invoke/handle pattern)
  openWorkspace(filePath?)    → Promise<void>
  newWorkspace(name)          → Promise<void>
  getRecentWorkspaces()       → Promise<WorkspaceInfo[]>
  saveGraph(graph)            → Promise<void>

  // Main → Renderer (on/send pattern, returns unsubscribe fn)
  onWorkspaceLoaded(callback) → () => void
  onNoWorkspace(callback)     → () => void
  onMenuNewWorkspace(callback)→ () => void
}
```

The renderer never calls Node.js APIs directly. All file system operations happen in the main process. This keeps the security boundary intact and makes the IPC contract explicit and auditable.

---

## Static file serving in production (app:// protocol)

In a browser, the web app is served over HTTP with proper `Content-Type` headers and CORS semantics. Electron's `file://` protocol lacks these, which breaks React Router (HTML5 history API) and Subresource Integrity checks.

To solve this, a custom `app://` scheme is registered before the app is ready and a protocol handler is set up after:

```
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure, standard, supportFetchAPI, corsEnabled } }
])

// Inside app.whenReady():
protocol.handle('app', (request) => {
  // Map app://anything → ui/dist/bundle/index.html (SPA fallback)
  // Map app://file.js  → ui/dist/bundle/file.js
  return net.fetch(`file://${filePath}`)
})
```

`net.fetch` with `file://` is used internally — Electron's file loader is ASAR-aware, so this works correctly in both development and the packaged `.app` bundle.

In development, Electron loads `http://localhost:8080` directly (the RsBuild dev server), so the custom protocol is only registered in production builds (`!app.isPackaged`).

---

## Workspace file format (.polaris)

A `.polaris` file is a ZIP archive with a defined internal structure:

```
workspace.polaris  (ZIP)
├── manifest.json        { version, name, createdAt, updatedAt }
├── graph.json           ComponentGraph — components, groups, edges
└── assets/
    └── images/          Reserved for future image assets
```

`graph.json` uses the same JSON schema as `ui/data/example.json`, so existing example data can be exported directly as a `.polaris` file without transformation.

### Write safety

All writes are atomic:

1. Serialise the updated ZIP to a buffer
2. Write to a temporary file: `workspace.polaris.tmp`
3. Rename `workspace.polaris.tmp` → `workspace.polaris`

The rename operation is atomic on all major operating systems. If the application crashes during step 2, the original file is untouched. The `.tmp` file is cleaned up on the next write.

### Auto-save

The renderer calls `window.electronAPI.saveGraph(graph)` after every mutation (node drag, component update, etc.). Saves are **debounced at 300 ms** in `LocalFileProvider` — rapid sequences of changes (e.g., dragging a node) result in a single write, not hundreds.

---

## Data provider abstraction

The React app never imports a concrete storage implementation directly. Instead, `DataProviderBootstrap` (in `ui/src/context/data-provider-context.tsx`) detects the runtime environment on mount and injects the appropriate `IDataProvider` implementation via React Context:

```
App startup
  │
  ├── window.electronAPI defined?
  │     └── yes → LocalFileProvider
  │               Reads/writes .polaris via IPC
  │               Waits for workspace:loaded event before rendering
  │
  ├── process.env.POLARIS_API_URL set?
  │     └── yes → RestApiProvider
  │               Calls REST endpoints over HTTP
  │               (stubbed — server not yet implemented)
  │
  └── neither
        └── ComponentDataService (browser default)
              Loads from example.json, persists to localStorage
```

All three implement `IDataProvider`:

```typescript
type IDataProvider = {
  fetchComponentGraph:    () => Promise<ComponentGraph>
  fetchComponentById:     (id: string) => Promise<ComponentData | null>
  createComponent:        (data) => Promise<ComponentData>
  updateComponent:        (id, updates) => Promise<ComponentData>
  batchUpdateComponents:  (updates) => Promise<ComponentData[]>
  batchUpdateGroups:      (updates) => Promise<Group[]>
  deleteComponent:        (id) => Promise<void>
}
```

Components and hooks use `useDataProvider()` to read from context. Adding a new backend (e.g., GraphQL, IndexedDB) requires only a new class that implements `IDataProvider` and a new branch in `detectMode()`.

---

## Workspace lifecycle (desktop mode)

```
Electron starts
  │
  ├── main.ts: registerSchemesAsPrivileged()
  ├── app.whenReady()
  │     ├── registerAppProtocol()       (production only)
  │     ├── createWindow()
  │     ├── new WorkspaceManager()
  │     └── workspaceManager.init()
  │           ├── load settings.json from app.getPath('userData')
  │           ├── last opened path found and file exists?
  │           │     └── readBundle() → send workspace:loaded to renderer
  │           └── no workspace
  │                 └── send workspace:none to renderer
  │
Renderer receives event
  ├── workspace:loaded → LocalFileProvider.loadData(graph)
  │                      setState({ status: 'ready', provider, workspace })
  │                      → Dashboard renders
  │
  └── workspace:none  → setState({ status: 'no-workspace' })
                        → WorkspaceSplash renders
```

Workspace settings (recent files list, last opened path) are stored as JSON in `app.getPath('userData')`, which resolves to `~/Library/Application Support/Polaris/` on macOS.

---

## DMG packaging

`electron-builder` assembles the final macOS distributable. The packaged bundle includes:

```
Polaris.app/
└── Contents/
    └── Resources/
        └── app/               (or app.asar if ASAR is enabled)
            ├── electron/dist/ (compiled main process)
            ├── ui/dist/bundle/(compiled React app)
            ├── node_modules/  (runtime deps: jszip)
            └── package.json
```

Relative paths from `electron/dist/main.js` to `ui/dist/bundle/` are identical inside the packaged `.app` as they are in the repository root, so no path adjustment is needed between development and production.

The `entitlements.mac.plist` grants `com.apple.security.files.user-selected.read-write`, which allows the app to read and write files that the user explicitly selects through open/save dialogs — no broader disk access is requested.

---

## Adding a new runtime target

To add a new mode (e.g., Tauri, Electron on Windows, PWA with OPFS):

1. Implement `IDataProvider` in a new file under `ui/src/services/`
2. Add a detection branch in `detectMode()` in `data-provider-context.tsx`
3. Instantiate and inject the new provider in `DataProviderBootstrap`

No changes are required to any component, hook, or the graph engine.
