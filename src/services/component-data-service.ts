import type { ComponentData, ComponentGraph } from '../components/types';
import mockDataJson from '../../data/example.json';

/**
 * Service class for managing component data operations.
 * This abstraction allows for easy replacement with REST API calls in the future.
 *
 * Data persistence strategy:
 * 1. First load: Reads from example.json
 * 2. Subsequent loads: Reads from localStorage if available, fallback to example.json
 * 3. All updates: Automatically saved to localStorage for persistence
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
        DELETE: 300 // Delay for deleteComponent()
    } as const;

    /**
     * localStorage key for persisting component data
     */
    private static readonly STORAGE_KEY = 'viz-lib-component-data';

    /**
     * Mock data storage - simulates a database or API data source
     * Data is loaded from localStorage first, then falls back to external JSON file
     */
    private mockData: ComponentData[] = this.loadDataFromStorage();

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
     * Loads component data from localStorage if available, otherwise from example.json
     */
    private loadDataFromStorage(): ComponentData[] {
        try {
            const storedData = localStorage.getItem(ComponentDataService.STORAGE_KEY);
            if (storedData) {
                const parsedData = JSON.parse(storedData) as ComponentData[];
                console.log('Loaded component data from localStorage:', parsedData.length, 'components');
                return parsedData;
            }
        } catch (error) {
            console.warn('Failed to load data from localStorage, falling back to example.json:', error);
        }

        // Fallback to example.json - extract components from new data structure
        console.log('Loading component data from example.json');
        const componentGraph = mockDataJson as ComponentGraph;
        return [...componentGraph.components];
    }

    /**
     * Saves the current component data to localStorage
     */
    private saveDataToStorage(): void {
        try {
            const dataToStore = JSON.stringify(this.mockData);
            localStorage.setItem(ComponentDataService.STORAGE_KEY, dataToStore);
            console.log('Saved component data to localStorage:', this.mockData.length, 'components');
        } catch (error) {
            console.error('Failed to save data to localStorage:', error);
        }
    }

    /**
     * Simulates fetching component data from an API.
     * Currently returns mock data, but can be replaced with actual API calls.
     */
    async fetchComponents(): Promise<ComponentData[]> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, ComponentDataService.DELAYS.FETCH_ALL));

        // Return copy of mock data to prevent external mutations
        return [...this.mockData];
    }

    /**
     * Fetches a specific component by ID.
     * Future implementation will make targeted API calls.
     */
    async fetchComponentById(id: string): Promise<ComponentData | null> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, ComponentDataService.DELAYS.FETCH_BY_ID));

        const component = this.mockData.find((component) => component.id === id);
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
        this.mockData.push(newComponent);

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

        const index = this.mockData.findIndex((component) => component.id === id);
        if (index === -1) {
            throw new Error(`Component with id ${id} not found`);
        }

        // Update the component in mock data
        this.mockData[index] = { ...this.mockData[index], ...updates };

        // Save to localStorage
        this.saveDataToStorage();

        return { ...this.mockData[index] };
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
            const index = this.mockData.findIndex((component) => component.id === update.id);

            if (index === -1) {
                notFoundIds.push(update.id);
                continue;
            }

            // Update the component in mock data
            this.mockData[index] = { ...this.mockData[index], ...update.data };
            updatedComponents.push({ ...this.mockData[index] });
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
     * Deletes a component from the mock data.
     * Future implementation will make DELETE request to API.
     */
    async deleteComponent(id: string): Promise<void> {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, ComponentDataService.DELAYS.DELETE));

        const index = this.mockData.findIndex((component) => component.id === id);
        if (index === -1) {
            throw new Error(`Component with id ${id} not found`);
        }

        // Remove from mock data
        this.mockData.splice(index, 1);

        // Save to localStorage
        this.saveDataToStorage();
    }

    /**
     * Utility method to get current mock data count (useful for testing)
     */
    getDataCount(): number {
        return this.mockData.length;
    }

    /**
     * Utility method to clear stored data and reset to original example.json
     * Useful for debugging and resetting state
     */
    clearStoredData(): void {
        try {
            localStorage.removeItem(ComponentDataService.STORAGE_KEY);
            const componentGraph = mockDataJson as ComponentGraph;
            this.mockData = [...componentGraph.components];
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
}
