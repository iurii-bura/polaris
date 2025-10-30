import type { ComponentData, ComponentGraph, EdgeData, Facts, Group, LayoutInfo } from '../../src/components/types.js';

/**
 * Generic store interface for managing component graph data.
 * This interface can be implemented by different storage backends
 * (e.g., memory, MongoDB, LokiJS, etc.)
 */
export type Store = {
    // Component operations
    findComponent: (componentId: string) => Promise<ComponentData | undefined>;
    addComponent: (component: ComponentData) => Promise<ComponentData>;
    deleteComponent: (componentId: string) => Promise<void>;
    updateComponent: (componentId: string, updates: { label?: string; description?: string }) => Promise<ComponentData>;
    upsertComponentFacts: (componentId: string, facts: Partial<Facts>) => Promise<ComponentData>;
    removeComponentFacts: (componentId: string, factKeys: (keyof Facts)[]) => Promise<ComponentData>;

    // Component layout operations
    addComponentLayout: (componentId: string, layoutName: string, layout: LayoutInfo) => Promise<ComponentData>;
    updateComponentLayout: (
        componentId: string,
        layoutName: string,
        layout: Partial<LayoutInfo>
    ) => Promise<ComponentData>;
    removeComponentLayout: (componentId: string, layoutName: string) => Promise<ComponentData>;
    getComponentLayout: (componentId: string, layoutName: string) => Promise<LayoutInfo | undefined>;

    // Group operations
    findGroup: (groupId: string) => Promise<Group | undefined>;
    addGroup: (group: Group) => Promise<Group>;
    deleteGroup: (groupId: string) => Promise<void>;
    updateGroup: (
        groupId: string,
        updates: { label?: string; description?: string; componentIds?: string[] }
    ) => Promise<Group>;
    upsertGroupFacts: (groupId: string, facts: Partial<Facts>) => Promise<Group>;
    removeGroupFacts: (groupId: string, factKeys: (keyof Facts)[]) => Promise<Group>;

    // Group layout operations
    addGroupLayout: (groupId: string, layoutName: string, layout: LayoutInfo) => Promise<Group>;
    updateGroupLayout: (groupId: string, layoutName: string, layout: Partial<LayoutInfo>) => Promise<Group>;
    removeGroupLayout: (groupId: string, layoutName: string) => Promise<Group>;
    getGroupLayout: (groupId: string, layoutName: string) => Promise<LayoutInfo | undefined>;

    // Edge operations
    findEdge: (edgeId: string) => Promise<EdgeData | undefined>;
    addEdge: (edge: EdgeData) => Promise<EdgeData>;
    deleteEdge: (edgeId: string) => Promise<void>;
    updateEdge: (
        edgeId: string,
        updates: { source?: string; target?: string; label?: string; description?: string }
    ) => Promise<EdgeData>;
    upsertEdgeFacts: (edgeId: string, facts: Partial<Facts>) => Promise<EdgeData>;
    removeEdgeFacts: (edgeId: string, factKeys: (keyof Facts)[]) => Promise<EdgeData>;

    // Edge layout operations
    addEdgeLayout: (edgeId: string, layoutName: string, visible: boolean) => Promise<EdgeData>;
    removeEdgeLayout: (edgeId: string, layoutName: string) => Promise<EdgeData>;
    getEdgeLayout: (edgeId: string, layoutName: string) => Promise<boolean | undefined>;

    // Store operations
    clearStore: () => Promise<void>;
    getAll: () => Promise<ComponentGraph>;
};
