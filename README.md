# Polaris

Enterprise architecture visualization dashboard. Interactive graph-based view of system components, dependencies, and domain facts — runs as a web application and as a native macOS desktop app.

## Prerequisites

- **Node.js** >= 24.1.0
- **npm** >= 11.3.0

## Project structure

```
/
├── package.json          Root orchestrator — delegates to sub-packages, no runtime code
├── ui/                   React web application
│   ├── package.json
│   └── src/
├── desktop/              Electron desktop wrapper (macOS)
│   ├── package.json
│   ├── src/              Main process source (compiled to desktop/dist/)
│   └── electron-builder.config.cjs
└── server/               REST API server (planned)
```

Each sub-package has its own `node_modules` and is independently installable. The root only contains orchestration scripts and shared tooling (e.g. `concurrently`).

---

## Install dependencies

From the **repository root** — installs everything in one go:

```bash
npm install
npm --prefix ui install
npm --prefix desktop install
```

---

## Web application

| Command | Description |
|---|---|
| `npm run dev:web` | Dev server at `http://localhost:8080` (hot reload) |
| `npm run build:web` | Production build to `ui/dist/bundle/` |

For web-specific commands (type checking, linting, tests):

```bash
cd ui
npm run type:check
npm run lint:check
npm run format:check
npm run test:unit:check
npm run test:e2e:check
npm run all:check          # type + lint + format + unit (CI gate)
```

### Environment variables

| Variable | Description |
|---|---|
| `APP_DEV_SERVER_PORT` | Override the dev server port (default `8080`) |
| `POLARIS_API_URL` | Point the app at a REST API server instead of local storage |

---

## Desktop application (macOS)

| Command | Description |
|---|---|
| `npm run dev:desktop` | Web dev server + Electron side by side (hot reload) |
| `npm run build:desktop` | Compile `desktop/src/` → `desktop/dist/` |
| `npm run package:mac` | Full build + DMG for arm64 and x64 → `dist-electron/` |

The packaged `.app` can be tested directly from `dist-electron/mac-arm64/Polaris.app` without mounting the DMG.

---

## Building everything

```bash
npm run build          # builds web bundle + desktop main process
npm run package:mac    # build + package as distributable DMG
```

---

## Architecture

The React app in `ui/` is identical in both web and desktop modes. At startup, `DataProviderBootstrap` detects the runtime environment and injects the appropriate data backend:

| Environment | Detection | Data backend |
|---|---|---|
| Electron desktop | `window.electronAPI` defined | `LocalFileProvider` — reads/writes `.polaris` bundle files |
| REST server | `POLARIS_API_URL` env var set | `RestApiProvider` — HTTP API calls |
| Browser (default) | neither | `ComponentDataService` — `localStorage` + `example.json` |

See [`docs/packaging-architecture.md`](docs/packaging-architecture.md) for a detailed breakdown of the Electron process model, IPC contract, file format, and protocol handler.
