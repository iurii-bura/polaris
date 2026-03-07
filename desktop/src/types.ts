/**
 * Minimal type definitions for the Electron main process.
 * These mirror the shapes defined in ui/src/components/types.ts but are kept
 * separate so the main process has no build dependency on the renderer source.
 * The main process only needs to read, write, and pass through these structures
 * as opaque JSON — detailed field types live in the renderer.
 */

export type ComponentGraph = {
    components: unknown[];
    groups: unknown[];
    edges: unknown[];
};

export type WorkspaceInfo = {
    name: string;
    filePath: string;
    lastOpenedAt: string;
};

export type WorkspaceLoadedPayload = {
    graph: ComponentGraph;
    workspace: WorkspaceInfo;
};
