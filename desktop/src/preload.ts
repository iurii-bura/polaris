import { contextBridge, ipcRenderer } from 'electron';
import type { WorkspaceInfo, WorkspaceLoadedPayload, ComponentGraph } from './types';

/**
 * All communication between the renderer (React app) and the main process
 * goes through this typed bridge. The renderer never has direct access to
 * Node.js APIs or Electron internals.
 */
const electronAPI = {
    // ── Renderer → Main ────────────────────────────────────────────────────

    openWorkspace: (filePath?: string): Promise<void> => ipcRenderer.invoke('workspace:open', filePath),

    newWorkspace: (name: string): Promise<void> => ipcRenderer.invoke('workspace:new', name),

    getRecentWorkspaces: (): Promise<WorkspaceInfo[]> => ipcRenderer.invoke('workspace:getRecent'),

    saveGraph: (graph: ComponentGraph): Promise<void> => ipcRenderer.invoke('workspace:save', graph),

    // ── Main → Renderer ────────────────────────────────────────────────────
    // Each listener returns an unsubscribe function for use in React cleanup.

    onWorkspaceLoaded: (callback: (payload: WorkspaceLoadedPayload) => void): (() => void) => {
        const handler = (_event: Electron.IpcRendererEvent, payload: WorkspaceLoadedPayload): void =>
            callback(payload);
        ipcRenderer.on('workspace:loaded', handler);
        return () => {
            ipcRenderer.removeListener('workspace:loaded', handler);
        };
    },

    onNoWorkspace: (callback: () => void): (() => void) => {
        const handler = (): void => callback();
        ipcRenderer.on('workspace:none', handler);
        return () => {
            ipcRenderer.removeListener('workspace:none', handler);
        };
    },

    onMenuNewWorkspace: (callback: () => void): (() => void) => {
        const handler = (): void => callback();
        ipcRenderer.on('menu:newWorkspace', handler);
        return () => {
            ipcRenderer.removeListener('menu:newWorkspace', handler);
        };
    }
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
