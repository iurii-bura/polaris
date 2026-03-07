import type { ComponentData, ComponentGraph, Group } from '../components/types';
import type { IDataProvider } from './data-provider';

const SAVE_DEBOUNCE_MS = 300;

/**
 * Data provider for Electron desktop mode.
 *
 * Keeps the ComponentGraph in memory (same pattern as ComponentDataService) and
 * persists changes to the open .polaris bundle via the Electron IPC bridge with
 * a debounced, atomic write. The DataProviderBootstrap is responsible for
 * calling loadData() when a workspace is opened or switched.
 */
export class LocalFileProvider implements IDataProvider {
    private data: ComponentGraph = { components: [], groups: [], edges: [] };
    private saveTimer: ReturnType<typeof setTimeout> | null = null;

    /**
     * Replace the in-memory graph with fresh data from a newly opened workspace.
     * Cancels any pending save to avoid writing stale data from the previous workspace.
     */
    loadData(graph: ComponentGraph): void {
        if (this.saveTimer !== null) {
            clearTimeout(this.saveTimer);
            this.saveTimer = null;
        }
        this.data = {
            components: [...graph.components],
            groups: [...graph.groups],
            edges: [...graph.edges]
        };
    }

    fetchComponentGraph(): Promise<ComponentGraph> {
        return Promise.resolve({
            components: [...this.data.components],
            groups: [...this.data.groups],
            edges: [...this.data.edges]
        });
    }

    fetchComponentById(id: string): Promise<ComponentData | null> {
        return Promise.resolve(this.data.components.find((c) => c.id === id) ?? null);
    }

    createComponent(data: Omit<ComponentData, 'id'>): Promise<ComponentData> {
        const id = `AA${Math.random().toString().slice(2, 7)}`;
        const newComponent: ComponentData = { id, ...data };
        this.data.components.push(newComponent);
        this.scheduleSave();
        return Promise.resolve({ ...newComponent });
    }

    updateComponent(id: string, updates: Partial<ComponentData>): Promise<ComponentData> {
        const index = this.data.components.findIndex((c) => c.id === id);
        if (index === -1) return Promise.reject(new Error(`Component with id ${id} not found`));
        this.data.components[index] = { ...this.data.components[index], ...updates };
        this.scheduleSave();
        return Promise.resolve({ ...this.data.components[index] });
    }

    batchUpdateComponents(updates: { id: string; data: Partial<ComponentData> }[]): Promise<ComponentData[]> {
        const updated: ComponentData[] = [];
        const notFound: string[] = [];

        for (const update of updates) {
            const index = this.data.components.findIndex((c) => c.id === update.id);
            if (index === -1) {
                notFound.push(update.id);
                continue;
            }
            this.data.components[index] = { ...this.data.components[index], ...update.data };
            updated.push({ ...this.data.components[index] });
        }

        if (notFound.length > 0) return Promise.reject(new Error(`Components not found: [${notFound.join(', ')}]`));

        this.scheduleSave();
        return Promise.resolve(updated);
    }

    batchUpdateGroups(updates: { id: string; data: Partial<Group> }[]): Promise<Group[]> {
        const updated: Group[] = [];
        const notFound: string[] = [];

        for (const update of updates) {
            const index = this.data.groups.findIndex((g) => g.id === update.id);
            if (index === -1) {
                notFound.push(update.id);
                continue;
            }
            this.data.groups[index] = { ...this.data.groups[index], ...update.data };
            updated.push({ ...this.data.groups[index] });
        }

        if (notFound.length > 0) return Promise.reject(new Error(`Groups not found: [${notFound.join(', ')}]`));

        this.scheduleSave();
        return Promise.resolve(updated);
    }

    deleteComponent(id: string): Promise<void> {
        const index = this.data.components.findIndex((c) => c.id === id);
        if (index === -1) return Promise.reject(new Error(`Component with id ${id} not found`));
        this.data.components.splice(index, 1);
        this.scheduleSave();
        return Promise.resolve();
    }

    private scheduleSave(): void {
        if (this.saveTimer !== null) clearTimeout(this.saveTimer);
        this.saveTimer = setTimeout(() => {
            const api = window.electronAPI;
            if (api) void api.saveGraph(this.data);
            this.saveTimer = null;
        }, SAVE_DEBOUNCE_MS);
    }
}
