import { nanoid } from 'nanoid';
import type { ComponentData, ComponentGraph, EdgeData, Facts, Group, LayoutInfo } from '../../src/components/types.js';

/**
 * Deep clone helper to prevent mutation of original data
 */
const deepClone = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj)) as T;
};

/**
 * Memory store type definition
 */
export type MemoryStore = {
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

/**
 * Creates an in-memory data store for managing component graph data.
 * Original dataset is deeply cloned to prevent mutations.
 */
export const memoryStore = (dataset: ComponentGraph): MemoryStore => {
    // Deep clone to prevent mutation of original data
    const store: ComponentGraph = deepClone(dataset);

    /**
     * Check if an ID is already used by any entity in the store
     */
    const isIdTaken = (id: string): boolean => {
        return (
            store.components.some((c) => c.id === id) ||
            store.groups.some((g) => g.id === id) ||
            store.edges.some((e) => e.id === id)
        );
    };

    // ============================================================================
    // Component operations
    // ============================================================================

    const findComponent = (componentId: string): Promise<ComponentData | undefined> => {
        return Promise.resolve(store.components.find(({ id }) => id === componentId));
    };

    const addComponent = (component: ComponentData): Promise<ComponentData> => {
        // Generate ID if not present
        let componentWithId = component;
        if (!component.id) {
            let newId: string;
            do {
                newId = nanoid(10);
            } while (isIdTaken(newId));
            componentWithId = { ...component, id: newId };
        }

        // Check for duplicate ID
        if (isIdTaken(componentWithId.id)) {
            throw new Error(`Entity with ID "${componentWithId.id}" already exists`);
        }

        // Deep clone and add to store
        const clonedComponent = deepClone(componentWithId);
        store.components.push(clonedComponent);
        return Promise.resolve(clonedComponent);
    };

    const deleteComponent = (componentId: string): Promise<void> => {
        const index = store.components.findIndex(({ id }) => id === componentId);
        if (index === -1) {
            throw new Error(`Component with ID "${componentId}" not found`);
        }
        store.components.splice(index, 1);
        return Promise.resolve();
    };

    const upsertComponentFacts = (componentId: string, facts: Partial<Facts>): Promise<ComponentData> => {
        const component = store.components.find(({ id }) => id === componentId);
        if (!component) {
            throw new Error(`Component with ID "${componentId}" not found`);
        }

        // Merge facts (deep clone to prevent mutation)
        component.facts = {
            ...deepClone(component.facts),
            ...deepClone(facts)
        };

        return Promise.resolve(deepClone(component));
    };

    const removeComponentFacts = (componentId: string, factKeys: (keyof Facts)[]): Promise<ComponentData> => {
        const component = store.components.find(({ id }) => id === componentId);
        if (!component) {
            throw new Error(`Component with ID "${componentId}" not found`);
        }

        // Remove specified fact keys
        const factsKeys = Object.keys(component.facts) as (keyof Facts)[];
        for (const key of factKeys) {
            if (factsKeys.includes(key)) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete component.facts[key];
            }
        }

        return Promise.resolve(deepClone(component));
    };

    const updateComponent = (
        componentId: string,
        updates: { label?: string; description?: string }
    ): Promise<ComponentData> => {
        const component = store.components.find(({ id }) => id === componentId);
        if (!component) {
            throw new Error(`Component with ID "${componentId}" not found`);
        }

        if (updates.label !== undefined) {
            component.label = updates.label;
        }
        if (updates.description !== undefined) {
            component.description = updates.description;
        }

        return Promise.resolve(deepClone(component));
    };

    // ============================================================================
    // Component layout operations
    // ============================================================================

    const addComponentLayout = (
        componentId: string,
        layoutName: string,
        layout: LayoutInfo
    ): Promise<ComponentData> => {
        const component = store.components.find(({ id }) => id === componentId);
        if (!component) {
            throw new Error(`Component with ID "${componentId}" not found`);
        }

        if (component.layouts[layoutName]) {
            throw new Error(`Layout "${layoutName}" already exists for component "${componentId}"`);
        }

        component.layouts[layoutName] = deepClone(layout);
        return Promise.resolve(deepClone(component));
    };

    const updateComponentLayout = (
        componentId: string,
        layoutName: string,
        layout: Partial<LayoutInfo>
    ): Promise<ComponentData> => {
        const component = store.components.find(({ id }) => id === componentId);
        if (!component) {
            throw new Error(`Component with ID "${componentId}" not found`);
        }

        if (!component.layouts[layoutName]) {
            throw new Error(`Layout "${layoutName}" not found for component "${componentId}"`);
        }

        const existingLayout = component.layouts[layoutName];
        component.layouts[layoutName] = {
            ...existingLayout,
            ...deepClone(layout)
        };

        return Promise.resolve(deepClone(component));
    };

    const removeComponentLayout = (componentId: string, layoutName: string): Promise<ComponentData> => {
        const component = store.components.find(({ id }) => id === componentId);
        if (!component) {
            throw new Error(`Component with ID "${componentId}" not found`);
        }

        if (!component.layouts[layoutName]) {
            throw new Error(`Layout "${layoutName}" not found for component "${componentId}"`);
        }

        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete component.layouts[layoutName];
        return Promise.resolve(deepClone(component));
    };

    const getComponentLayout = (componentId: string, layoutName: string): Promise<LayoutInfo | undefined> => {
        const component = store.components.find(({ id }) => id === componentId);
        if (!component) {
            throw new Error(`Component with ID "${componentId}" not found`);
        }

        const layout = component.layouts[layoutName];
        return Promise.resolve(layout ? deepClone(layout) : undefined);
    };

    // ============================================================================
    // Group operations
    // ============================================================================

    const findGroup = (groupId: string): Promise<Group | undefined> => {
        return Promise.resolve(store.groups.find(({ id }) => id === groupId));
    };

    const addGroup = (group: Group): Promise<Group> => {
        // Generate ID if not present
        let groupWithId = group;
        if (!group.id) {
            let newId: string;
            do {
                newId = nanoid(10);
            } while (isIdTaken(newId));
            groupWithId = { ...group, id: newId };
        }

        // Check for duplicate ID
        if (isIdTaken(groupWithId.id)) {
            throw new Error(`Entity with ID "${groupWithId.id}" already exists`);
        }

        // Deep clone and add to store
        const clonedGroup = deepClone(groupWithId);
        store.groups.push(clonedGroup);
        return Promise.resolve(clonedGroup);
    };

    const deleteGroup = (groupId: string): Promise<void> => {
        const index = store.groups.findIndex(({ id }) => id === groupId);
        if (index === -1) {
            throw new Error(`Group with ID "${groupId}" not found`);
        }
        store.groups.splice(index, 1);
        return Promise.resolve();
    };

    const upsertGroupFacts = (groupId: string, facts: Partial<Facts>): Promise<Group> => {
        const group = store.groups.find(({ id }) => id === groupId);
        if (!group) {
            throw new Error(`Group with ID "${groupId}" not found`);
        }

        // Merge facts (deep clone to prevent mutation)
        group.facts = {
            ...deepClone(group.facts),
            ...deepClone(facts)
        };

        return Promise.resolve(deepClone(group));
    };

    const removeGroupFacts = (groupId: string, factKeys: (keyof Facts)[]): Promise<Group> => {
        const group = store.groups.find(({ id }) => id === groupId);
        if (!group) {
            throw new Error(`Group with ID "${groupId}" not found`);
        }

        // Remove specified fact keys
        const factsKeys = Object.keys(group.facts) as (keyof Facts)[];
        for (const key of factKeys) {
            if (factsKeys.includes(key)) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete group.facts[key];
            }
        }

        return Promise.resolve(deepClone(group));
    };

    const updateGroup = (
        groupId: string,
        updates: { label?: string; description?: string; componentIds?: string[] }
    ): Promise<Group> => {
        const group = store.groups.find(({ id }) => id === groupId);
        if (!group) {
            throw new Error(`Group with ID "${groupId}" not found`);
        }

        if (updates.label !== undefined) {
            group.label = updates.label;
        }
        if (updates.description !== undefined) {
            group.description = updates.description;
        }
        if (updates.componentIds !== undefined) {
            group.componentIds = deepClone(updates.componentIds);
        }

        return Promise.resolve(deepClone(group));
    };

    // ============================================================================
    // Group layout operations
    // ============================================================================

    const addGroupLayout = (groupId: string, layoutName: string, layout: LayoutInfo): Promise<Group> => {
        const group = store.groups.find(({ id }) => id === groupId);
        if (!group) {
            throw new Error(`Group with ID "${groupId}" not found`);
        }

        if (group.layouts[layoutName]) {
            throw new Error(`Layout "${layoutName}" already exists for group "${groupId}"`);
        }

        group.layouts[layoutName] = deepClone(layout);
        return Promise.resolve(deepClone(group));
    };

    const updateGroupLayout = (groupId: string, layoutName: string, layout: Partial<LayoutInfo>): Promise<Group> => {
        const group = store.groups.find(({ id }) => id === groupId);
        if (!group) {
            throw new Error(`Group with ID "${groupId}" not found`);
        }

        if (!group.layouts[layoutName]) {
            throw new Error(`Layout "${layoutName}" not found for group "${groupId}"`);
        }

        const existingLayout = group.layouts[layoutName];
        group.layouts[layoutName] = {
            ...existingLayout,
            ...deepClone(layout)
        };

        return Promise.resolve(deepClone(group));
    };

    const removeGroupLayout = (groupId: string, layoutName: string): Promise<Group> => {
        const group = store.groups.find(({ id }) => id === groupId);
        if (!group) {
            throw new Error(`Group with ID "${groupId}" not found`);
        }

        if (!group.layouts[layoutName]) {
            throw new Error(`Layout "${layoutName}" not found for group "${groupId}"`);
        }

        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete group.layouts[layoutName];
        return Promise.resolve(deepClone(group));
    };

    const getGroupLayout = (groupId: string, layoutName: string): Promise<LayoutInfo | undefined> => {
        const group = store.groups.find(({ id }) => id === groupId);
        if (!group) {
            throw new Error(`Group with ID "${groupId}" not found`);
        }

        const layout = group.layouts[layoutName];
        return Promise.resolve(layout ? deepClone(layout) : undefined);
    };

    // ============================================================================
    // Edge operations
    // ============================================================================

    const findEdge = (edgeId: string): Promise<EdgeData | undefined> => {
        return Promise.resolve(store.edges.find(({ id }) => id === edgeId));
    };

    const addEdge = (edge: EdgeData): Promise<EdgeData> => {
        // Generate ID if not present
        let edgeWithId = edge;
        if (!edge.id) {
            let newId: string;
            do {
                newId = nanoid(10);
            } while (isIdTaken(newId));
            edgeWithId = { ...edge, id: newId };
        }

        // Check for duplicate ID
        if (isIdTaken(edgeWithId.id)) {
            throw new Error(`Entity with ID "${edgeWithId.id}" already exists`);
        }

        // Deep clone and add to store
        const clonedEdge = deepClone(edgeWithId);
        store.edges.push(clonedEdge);
        return Promise.resolve(clonedEdge);
    };

    const deleteEdge = (edgeId: string): Promise<void> => {
        const index = store.edges.findIndex(({ id }) => id === edgeId);
        if (index === -1) {
            throw new Error(`Edge with ID "${edgeId}" not found`);
        }
        store.edges.splice(index, 1);
        return Promise.resolve();
    };

    const upsertEdgeFacts = (edgeId: string, facts: Partial<Facts>): Promise<EdgeData> => {
        const edge = store.edges.find(({ id }) => id === edgeId);
        if (!edge) {
            throw new Error(`Edge with ID "${edgeId}" not found`);
        }

        // Merge facts (deep clone to prevent mutation)
        edge.facts = {
            ...deepClone(edge.facts),
            ...deepClone(facts)
        };

        return Promise.resolve(deepClone(edge));
    };

    const removeEdgeFacts = (edgeId: string, factKeys: (keyof Facts)[]): Promise<EdgeData> => {
        const edge = store.edges.find(({ id }) => id === edgeId);
        if (!edge) {
            throw new Error(`Edge with ID "${edgeId}" not found`);
        }

        // Remove specified fact keys
        const factsKeys = Object.keys(edge.facts) as (keyof Facts)[];
        for (const key of factKeys) {
            if (factsKeys.includes(key)) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete edge.facts[key];
            }
        }

        return Promise.resolve(deepClone(edge));
    };

    const updateEdge = (
        edgeId: string,
        updates: { source?: string; target?: string; label?: string; description?: string }
    ): Promise<EdgeData> => {
        const edge = store.edges.find(({ id }) => id === edgeId);
        if (!edge) {
            throw new Error(`Edge with ID "${edgeId}" not found`);
        }

        if (updates.source !== undefined) {
            edge.source = updates.source;
        }
        if (updates.target !== undefined) {
            edge.target = updates.target;
        }
        if (updates.label !== undefined) {
            edge.label = updates.label;
        }
        if (updates.description !== undefined) {
            edge.description = updates.description;
        }

        return Promise.resolve(deepClone(edge));
    };

    // ============================================================================
    // Edge layout operations
    // ============================================================================

    const addEdgeLayout = (edgeId: string, layoutName: string, visible: boolean): Promise<EdgeData> => {
        const edge = store.edges.find(({ id }) => id === edgeId);
        if (!edge) {
            throw new Error(`Edge with ID "${edgeId}" not found`);
        }

        if (edge.layouts[layoutName] !== undefined) {
            throw new Error(`Layout "${layoutName}" already exists for edge "${edgeId}"`);
        }

        edge.layouts[layoutName] = visible;
        return Promise.resolve(deepClone(edge));
    };

    const removeEdgeLayout = (edgeId: string, layoutName: string): Promise<EdgeData> => {
        const edge = store.edges.find(({ id }) => id === edgeId);
        if (!edge) {
            throw new Error(`Edge with ID "${edgeId}" not found`);
        }

        if (edge.layouts[layoutName] === undefined) {
            throw new Error(`Layout "${layoutName}" not found for edge "${edgeId}"`);
        }

        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete edge.layouts[layoutName];
        return Promise.resolve(deepClone(edge));
    };

    const getEdgeLayout = (edgeId: string, layoutName: string): Promise<boolean | undefined> => {
        const edge = store.edges.find(({ id }) => id === edgeId);
        if (!edge) {
            throw new Error(`Edge with ID "${edgeId}" not found`);
        }

        return Promise.resolve(edge.layouts[layoutName]);
    };

    // ============================================================================
    // Store operations
    // ============================================================================

    const clearStore = (): Promise<void> => {
        store.components = [];
        store.groups = [];
        store.edges = [];
        return Promise.resolve();
    };

    const getAll = (): Promise<ComponentGraph> => {
        return Promise.resolve(deepClone(store));
    };

    return {
        // Component operations
        findComponent,
        addComponent,
        deleteComponent,
        updateComponent,
        upsertComponentFacts,
        removeComponentFacts,

        // Component layout operations
        addComponentLayout,
        updateComponentLayout,
        removeComponentLayout,
        getComponentLayout,

        // Group operations
        findGroup,
        addGroup,
        deleteGroup,
        updateGroup,
        upsertGroupFacts,
        removeGroupFacts,

        // Group layout operations
        addGroupLayout,
        updateGroupLayout,
        removeGroupLayout,
        getGroupLayout,

        // Edge operations
        findEdge,
        addEdge,
        deleteEdge,
        updateEdge,
        upsertEdgeFacts,
        removeEdgeFacts,

        // Edge layout operations
        addEdgeLayout,
        removeEdgeLayout,
        getEdgeLayout,

        // Store operations
        clearStore,
        getAll
    };
};
