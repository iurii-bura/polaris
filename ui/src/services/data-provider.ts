import type { ComponentData, ComponentGraph, Group } from '../components/types';

/**
 * Uniform interface for all data backends.
 * The React app only depends on this interface — never on a concrete implementation.
 *
 * Current implementations:
 *   ComponentDataService — localStorage + example.json (web / dev)
 *   LocalFileProvider   — .polaris ZIP bundle via Electron IPC (desktop)
 *   RestApiProvider     — REST API (server-connected mode, stubbed)
 */
export type IDataProvider = {
    fetchComponentGraph: () => Promise<ComponentGraph>;
    fetchComponentById: (id: string) => Promise<ComponentData | null>;
    createComponent: (data: Omit<ComponentData, 'id'>) => Promise<ComponentData>;
    updateComponent: (id: string, updates: Partial<ComponentData>) => Promise<ComponentData>;
    batchUpdateComponents: (updates: { id: string; data: Partial<ComponentData> }[]) => Promise<ComponentData[]>;
    batchUpdateGroups: (updates: { id: string; data: Partial<Group> }[]) => Promise<Group[]>;
    deleteComponent: (id: string) => Promise<void>;
};
