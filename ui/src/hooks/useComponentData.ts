import { useState, useEffect, useCallback } from 'react';

import type { ComponentData, ComponentGraph } from '../components/types';
import { useDataProvider } from '../context/data-provider-context';

/**
 * Type definition for the hook's return value
 */
export type UseComponentDataResult = {
    /** The fetched component graph data */
    data: ComponentGraph;
    /** Loading state indicator */
    loading: boolean;
    /** Error state if fetch fails */
    error: string | null;
    /** Function to manually refresh the data */
    refetch: () => Promise<void>;
    /** Function to add a new component */
    addComponent: (component: Omit<ComponentData, 'id'>) => Promise<void>;
    /** Function to update an existing component */
    updateComponent: (id: string, updates: Partial<ComponentData>) => Promise<void>;
    /** Function to remove a component */
    removeComponent: (id: string) => Promise<void>;
};

/**
 * Custom hook for managing component data with full CRUD operations.
 * Encapsulates all data fetching logic and provides a clean API for components.
 *
 * @returns Object containing data, loading state, error state, and CRUD operations
 */
export const useComponentData = (): UseComponentDataResult => {
    const providerState = useDataProvider();
    const provider = providerState.status === 'ready' ? providerState.provider : null;

    const [data, setData] = useState<ComponentGraph>({ components: [], groups: [], edges: [] });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetches component data and updates state accordingly
     */
    const fetchData = useCallback(async (): Promise<void> => {
        if (!provider) return;
        try {
            setLoading(true);
            setError(null);
            const componentGraph = await provider.fetchComponentGraph();
            setData(componentGraph);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch components';
            setError(errorMessage);
            console.error('Error fetching component data:', err);
        } finally {
            setLoading(false);
        }
    }, [provider]);

    /**
     * Manually refresh the data
     */
    const refetch = useCallback(async (): Promise<void> => {
        await fetchData();
    }, [fetchData]);

    /**
     * Add a new component
     */
    const addComponent = useCallback(
        async (componentData: Omit<ComponentData, 'id'>): Promise<void> => {
            if (!provider) return;
            try {
                const newComponent = await provider.createComponent(componentData);
                setData((prevData) => ({
                    ...prevData,
                    components: [...prevData.components, newComponent]
                }));
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to create component';
                setError(errorMessage);
                throw err;
            }
        },
        [provider]
    );

    /**
     * Update an existing component
     */
    const updateComponent = useCallback(
        async (id: string, updates: Partial<ComponentData>): Promise<void> => {
            if (!provider) return;
            try {
                const updatedComponent = await provider.updateComponent(id, updates);
                setData((prevData) => ({
                    ...prevData,
                    components: prevData.components.map((component) =>
                        component.id === id ? updatedComponent : component
                    )
                }));
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to update component';
                setError(errorMessage);
                throw err;
            }
        },
        [provider]
    );

    /**
     * Remove a component
     */
    const removeComponent = useCallback(
        async (id: string): Promise<void> => {
            if (!provider) return;
            try {
                await provider.deleteComponent(id);
                setData((prevData) => ({
                    ...prevData,
                    components: prevData.components.filter((component) => component.id !== id)
                }));
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to delete component';
                setError(errorMessage);
                throw err;
            }
        },
        [provider]
    );

    // Fetch data on mount
    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refetch,
        addComponent,
        updateComponent,
        removeComponent
    };
};
