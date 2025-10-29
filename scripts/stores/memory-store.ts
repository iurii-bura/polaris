import { nanoid } from 'nanoid';
import type { ComponentData, ComponentGraph, EdgeData, Facts, Group } from '../../src/components/types.js';

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
    upsertComponentFacts: (componentId: string, facts: Partial<Facts>) => Promise<ComponentData>;
    removeComponentFacts: (componentId: string, factKeys: (keyof Facts)[]) => Promise<ComponentData>;

    // Group operations
    findGroup: (groupId: string) => Promise<Group | undefined>;
    addGroup: (group: Group) => Promise<Group>;
    deleteGroup: (groupId: string) => Promise<void>;
    upsertGroupFacts: (groupId: string, facts: Partial<Facts>) => Promise<Group>;
    removeGroupFacts: (groupId: string, factKeys: (keyof Facts)[]) => Promise<Group>;

    // Edge operations
    findEdge: (edgeId: string) => Promise<EdgeData | undefined>;
    addEdge: (edge: EdgeData) => Promise<EdgeData>;
    deleteEdge: (edgeId: string) => Promise<void>;
    upsertEdgeFacts: (edgeId: string, facts: Partial<Facts>) => Promise<EdgeData>;
    removeEdgeFacts: (edgeId: string, factKeys: (keyof Facts)[]) => Promise<EdgeData>;

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
        upsertComponentFacts,
        removeComponentFacts,

        // Group operations
        findGroup,
        addGroup,
        deleteGroup,
        upsertGroupFacts,
        removeGroupFacts,

        // Edge operations
        findEdge,
        addEdge,
        deleteEdge,
        upsertEdgeFacts,
        removeEdgeFacts,

        // Store operations
        clearStore,
        getAll
    };
};
