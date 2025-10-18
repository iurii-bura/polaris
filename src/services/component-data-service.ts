import type { ComponentData, ComponentGraph, Group } from '../components/types';
import mockDataJson from '../../data/example.json';

/**
 * Service class for managing component data operations.
 * This abstraction allows for easy replacement with REST API calls in the future.
 *
 * Data persistence strategy:
 * 1. First load: Configurable to read from localStorage or example.json based on preferBrowserStorage setting
 * 2. Subsequent loads: Follows the same strategy as configured
 * 3. All updates: Automatically saved to localStorage for persistence
 *
 * Configuration:
 * - Use ComponentDataService.setPreferBrowserStorage(true) to prefer localStorage over file data
 * - Use ComponentDataService.setPreferBrowserStorage(false) to always load from file, ignoring localStorage
 * - Call reloadData() after changing the preference to apply the new setting
 */
export class ComponentDataService {
    /**
     * Delay constants for simulating API response times (in milliseconds)
     * Easily configurable for testing purposes
     *
     * For testing:
     * - Set to 0 for instant responses
     * - Set to higher values to test loading states
     * - FETCH_ALL is intentionally higher to simulate initial data load
     */
    private static readonly DELAYS = {
        FETCH_ALL: 100, // Delay for fetchComponents()
        FETCH_BY_ID: 200, // Delay for fetchComponentById()
        CREATE: 300, // Delay for createComponent()
        UPDATE: 300, // Delay for updateComponent()
        BATCH_UPDATE: 350, // Delay for batchUpdateComponents()
        BATCH_UPDATE_GROUPS: 350, // Delay for batchUpdateGroups()
        DELETE: 300 // Delay for deleteComponent()
    } as const;

    /**
     * localStorage key for persisting component data
     */
    private static readonly STORAGE_KEY = 'viz-lib-component-data';

    /**
     * Configuration flag to control data loading behavior
     * - true: Always prefer localStorage over file data on initialization
     * - false: Always load from file, ignore localStorage on initialization
     *
     * Note: This only affects the initial data loading. Updates are always saved to localStorage.
     */
    private static preferBrowserStorage: boolean = false;

    /**
     * Mock data storage - simulates a database or API data source
     * Data is loaded from localStorage first, then falls back to external JSON file
     */
    private mockData: ComponentGraph = this.loadDataFromStorage();

    /**
     * Singleton instance for consistent data state across the application
     */
    private static instance: ComponentDataService | null = null;

    /**
     * Get singleton instance of the service
     */
    static getInstance(): ComponentDataService {
        return (ComponentDataService.instance ??= new ComponentDataService());
    }

    /**
     * Configure the data loading behavior for the service
     * @param preferStorage - If true, prefers localStorage over file data on initialization
     *                       If false, always loads from file and ignores localStorage on initialization
     *
     * Note: This setting only affects initial data loading. All updates continue to be saved to localStorage.
     * To apply this setting, you may need to call clearStoredData() and reload the service.
     */
    static setPreferBrowserStorage(preferStorage: boolean): void {
        ComponentDataService.preferBrowserStorage = preferStorage;
        console.log(`Data loading preference set to: ${preferStorage ? 'browser storage' : 'file'}`);
    }

    /**
     * Get the current data loading preference
     */
    static getPreferBrowserStorage(): boolean {
        return ComponentDataService.preferBrowserStorage;
    }

    /**
     * Loads component data from localStorage if available, otherwise from example.json
     * Behavior is controlled by the preferBrowserStorage configuration
     */
    private loadDataFromStorage(): ComponentGraph {
        // If preferBrowserStorage is false, skip localStorage and load directly from file
        if (!ComponentDataService.preferBrowserStorage) {
            console.log('Loading component graph from example.json (browser storage disabled)');
            const componentGraph = mockDataJson as ComponentGraph;
            return {
                components: [...componentGraph.components],
                groups: [...componentGraph.groups]
            };
        }

        // Original behavior: try localStorage first, fallback to file
        try {
            const storedData = localStorage.getItem(ComponentDataService.STORAGE_KEY);
            if (storedData) {
                const parsedData = JSON.parse(storedData) as ComponentGraph;
                console.log(
                    'Loaded component graph from localStorage:',
                    parsedData.components.length,
                    'components',
                    parsedData.groups.length,
                    'groups'
                );
                return parsedData;
            }
        } catch (error) {
            console.warn('Failed to load data from localStorage, falling back to example.json:', error);
        }

        // Fallback to example.json - extract components from new data structure
        console.log('Loading component graph from example.json');
        const componentGraph = mockDataJson as ComponentGraph;
        return {
            components: [...componentGraph.components],
            groups: [...componentGraph.groups]
        };
    }

    /**
     * Saves the current component data to localStorage
     */
    private saveDataToStorage(): void {
        try {
            const dataToStore = JSON.stringify(this.mockData);
            localStorage.setItem(ComponentDataService.STORAGE_KEY, dataToStore);
            console.log(
                'Saved component graph to localStorage:',
                this.mockData.components.length,
                'components',
                this.mockData.groups.length,
                'groups'
            );
        } catch (error) {
            console.error('Failed to save data to localStorage:', error);
        }
    }

    /**
     * Simulates fetching the complete component graph from an API.
     * Returns both components and groups.
     */
    async fetchComponentGraph(): Promise<ComponentGraph> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, ComponentDataService.DELAYS.FETCH_ALL));

        // Return copy of mock data to prevent external mutations
        return {
            components: [...this.mockData.components],
            groups: [...this.mockData.groups]
        };
    }

    /**
     * Simulates fetching component data from an API.
     * Currently returns mock data, but can be replaced with actual API calls.
     */
    async fetchComponents(): Promise<ComponentData[]> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, ComponentDataService.DELAYS.FETCH_ALL));

        // Return copy of mock data to prevent external mutations
        return [...this.mockData.components];
    }

    /**
     * Fetches a specific component by ID.
     * Future implementation will make targeted API calls.
     */
    async fetchComponentById(id: string): Promise<ComponentData | null> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, ComponentDataService.DELAYS.FETCH_BY_ID));

        const component = this.mockData.components.find((component) => component.id === id);
        return component ? { ...component } : null;
    }

    /**
     * Creates a new component and adds it to the mock data.
     * Future implementation will make POST request to API.
     */
    async createComponent(data: Omit<ComponentData, 'id'>): Promise<ComponentData> {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, ComponentDataService.DELAYS.CREATE));

        // Generate mock ID - in real implementation, this would come from the API
        const id = `AA${Math.random().toString().slice(2, 7)}`;
        const newComponent: ComponentData = { id, ...data };

        // Add to mock data
        this.mockData.components.push(newComponent);

        // Save to localStorage
        this.saveDataToStorage();

        return { ...newComponent };
    }

    /**
     * Updates an existing component in the mock data.
     * Future implementation will make PUT/PATCH request to API.
     */
    async updateComponent(id: string, updates: Partial<ComponentData>): Promise<ComponentData> {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, ComponentDataService.DELAYS.UPDATE));

        const index = this.mockData.components.findIndex((component) => component.id === id);
        if (index === -1) {
            throw new Error(`Component with id ${id} not found`);
        }

        // Update the component in mock data
        this.mockData.components[index] = { ...this.mockData.components[index], ...updates };

        // Save to localStorage
        this.saveDataToStorage();

        return { ...this.mockData.components[index] };
    }

    /**
     * Updates multiple components in a single batch operation.
     * More efficient than individual updates when modifying multiple components.
     * Future implementation will make a single batch API request.
     *
     * @param updates Array of component updates, each containing id and partial data
     * @returns Promise resolving to array of updated components
     * @throws Error if any component ID is not found
     */
    async batchUpdateComponents(updates: { id: string; data: Partial<ComponentData> }[]): Promise<ComponentData[]> {
        // Simulate API call - batch operations typically take slightly longer than single operations
        await new Promise((resolve) => setTimeout(resolve, ComponentDataService.DELAYS.BATCH_UPDATE));

        const updatedComponents: ComponentData[] = [];
        const notFoundIds: string[] = [];

        // Process each update
        for (const update of updates) {
            const index = this.mockData.components.findIndex((component) => component.id === update.id);

            if (index === -1) {
                notFoundIds.push(update.id);
                continue;
            }

            // Update the component in mock data
            this.mockData.components[index] = { ...this.mockData.components[index], ...update.data };
            updatedComponents.push({ ...this.mockData.components[index] });
        }

        // Throw error if any components were not found
        if (notFoundIds.length > 0) {
            throw new Error(`Components with ids [${notFoundIds.join(', ')}] not found`);
        }

        // Save to localStorage after all updates
        this.saveDataToStorage();

        return updatedComponents;
    }

    /**
     * Updates multiple groups in batch.
     * Simulates API batch update operation.
     * @param updates Array of objects containing group id and partial group data to update
     * @returns Promise resolving to array of updated groups
     * @throws Error if any group ID is not found
     */
    async batchUpdateGroups(updates: { id: string; data: Partial<Group> }[]): Promise<Group[]> {
        // Simulate API call - batch operations typically take slightly longer than single operations
        await new Promise((resolve) => setTimeout(resolve, ComponentDataService.DELAYS.BATCH_UPDATE_GROUPS));

        const updatedGroups: Group[] = [];
        const notFoundIds: string[] = [];

        // Process each update
        for (const update of updates) {
            const index = this.mockData.groups.findIndex((group) => group.id === update.id);

            if (index === -1) {
                notFoundIds.push(update.id);
                continue;
            }

            // Update the group in mock data
            this.mockData.groups[index] = { ...this.mockData.groups[index], ...update.data };
            updatedGroups.push({ ...this.mockData.groups[index] });
        }

        // Throw error if any groups were not found
        if (notFoundIds.length > 0) {
            throw new Error(`Groups with ids [${notFoundIds.join(', ')}] not found`);
        }

        // Save to localStorage after all updates
        this.saveDataToStorage();

        return updatedGroups;
    }

    /**
     * Deletes a component from the mock data.
     * Future implementation will make DELETE request to API.
     */
    async deleteComponent(id: string): Promise<void> {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, ComponentDataService.DELAYS.DELETE));

        const index = this.mockData.components.findIndex((component) => component.id === id);
        if (index === -1) {
            throw new Error(`Component with id ${id} not found`);
        }

        // Remove from mock data
        this.mockData.components.splice(index, 1);

        // Save to localStorage
        this.saveDataToStorage();
    }

    /**
     * Utility method to get current mock data count (useful for testing)
     */
    getDataCount(): number {
        return this.mockData.components.length;
    }

    /**
     * Utility method to clear stored data and reset to original example.json
     * Useful for debugging and resetting state
     */
    clearStoredData(): void {
        try {
            localStorage.removeItem(ComponentDataService.STORAGE_KEY);
            const componentGraph = mockDataJson as ComponentGraph;
            this.mockData = {
                components: [...componentGraph.components],
                groups: [...componentGraph.groups]
            };
            console.log('Cleared stored data and reset to example.json');
        } catch (error) {
            console.error('Failed to clear stored data:', error);
        }
    }

    /**
     * Utility method to check if data is currently loaded from localStorage
     */
    isUsingStoredData(): boolean {
        try {
            return localStorage.getItem(ComponentDataService.STORAGE_KEY) !== null;
        } catch (error) {
            console.error('Failed to access localStorage:', error);

            return false;
        }
    }

    /**
     * Reload data from the configured source (localStorage or file)
     * Useful when changing the preferBrowserStorage setting
     */
    reloadData(): void {
        this.mockData = this.loadDataFromStorage();
        console.log('Data reloaded from configured source');
    }

    /**
     * Utility method to get the current data loading configuration
     */
    getCurrentDataSource(): 'localStorage' | 'file' | 'mixed' {
        if (!ComponentDataService.preferBrowserStorage) {
            return 'file';
        }

        if (this.isUsingStoredData()) {
            return 'localStorage';
        }

        return 'mixed'; // Fallback scenario where localStorage is preferred but file is used
    }
}
