/**
 * Type declaration for the Electron IPC bridge exposed via contextBridge.
 * Only present when the app is running inside Electron — always check
 * `window.electronAPI !== undefined` before use.
 */

type ElectronWorkspaceInfo = {
    name: string;
    filePath: string;
    lastOpenedAt: string;
};

type ElectronComponentGraph = {
    components: unknown[];
    groups: unknown[];
    edges: unknown[];
};

type ElectronWorkspaceLoadedPayload = {
    graph: ElectronComponentGraph;
    workspace: ElectronWorkspaceInfo;
};

// Interface is required here for global augmentation — type merging is not supported by TypeScript.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface Window {
    electronAPI?: {
        openWorkspace: (filePath?: string) => Promise<void>;
        newWorkspace: (name: string) => Promise<void>;
        getRecentWorkspaces: () => Promise<ElectronWorkspaceInfo[]>;
        saveGraph: (graph: ElectronComponentGraph) => Promise<void>;
        onWorkspaceLoaded: (callback: (payload: ElectronWorkspaceLoadedPayload) => void) => () => void;
        onNoWorkspace: (callback: () => void) => () => void;
        onMenuNewWorkspace: (callback: () => void) => () => void;
    };
}
