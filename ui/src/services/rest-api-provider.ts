import type { ComponentData, ComponentGraph, Group } from '../components/types';
import type { IDataProvider } from './data-provider';

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        message: string,
        public readonly retryable: boolean = status >= 500
    ) {
        super(message);
        this.name = 'ApiError';
    }

    static async fromResponse(response: Response): Promise<ApiError> {
        const body = await response.text().catch(() => response.statusText);
        return new ApiError(response.status, body);
    }
}

// Narrowed options type so headers are always a plain object — avoids spread issues
// with the broader HeadersInit union (which also allows string[][] and Headers instances).
type FetchOptions = Omit<RequestInit, 'headers'> & {
    headers?: Record<string, string>;
};

async function apiFetch<T>(url: string, options?: FetchOptions): Promise<T> {
    const response = await fetch(url, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options?.headers }
    });
    if (!response.ok) throw await ApiError.fromResponse(response);
    return response.json() as Promise<T>;
}

/**
 * REST API data provider for server-connected mode.
 *
 * Implied server endpoints:
 *   GET    /api/v1/graph
 *   GET    /api/v1/components/:id
 *   POST   /api/v1/components
 *   PATCH  /api/v1/components/:id
 *   POST   /api/v1/components/batch
 *   POST   /api/v1/groups/batch
 *   DELETE /api/v1/components/:id
 *
 * WebSocket support is reserved via connectLiveEvents() for future real-time
 * collaboration events once the server implements them.
 */
export class RestApiProvider implements IDataProvider {
    constructor(private readonly baseUrl: string) {}

    /** Stub — wire up a WebSocket here when the server supports real-time events. */
    connectLiveEvents(handler: (event: unknown) => void): () => void {
        // The handler parameter is intentionally unused in this stub implementation.
        // It will be wired to a WebSocket subscription when the server supports live events.
        void handler;
        return () => {
            return;
        };
    }

    async fetchComponentGraph(): Promise<ComponentGraph> {
        return apiFetch<ComponentGraph>(`${this.baseUrl}/api/v1/graph`);
    }

    async fetchComponentById(id: string): Promise<ComponentData | null> {
        try {
            return await apiFetch<ComponentData>(`${this.baseUrl}/api/v1/components/${id}`);
        } catch (e) {
            if (e instanceof ApiError && e.status === 404) return null;
            throw e;
        }
    }

    async createComponent(data: Omit<ComponentData, 'id'>): Promise<ComponentData> {
        return apiFetch<ComponentData>(`${this.baseUrl}/api/v1/components`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateComponent(id: string, updates: Partial<ComponentData>): Promise<ComponentData> {
        return apiFetch<ComponentData>(`${this.baseUrl}/api/v1/components/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(updates)
        });
    }

    async batchUpdateComponents(updates: { id: string; data: Partial<ComponentData> }[]): Promise<ComponentData[]> {
        return apiFetch<ComponentData[]>(`${this.baseUrl}/api/v1/components/batch`, {
            method: 'POST',
            body: JSON.stringify(updates)
        });
    }

    async batchUpdateGroups(updates: { id: string; data: Partial<Group> }[]): Promise<Group[]> {
        return apiFetch<Group[]>(`${this.baseUrl}/api/v1/groups/batch`, {
            method: 'POST',
            body: JSON.stringify(updates)
        });
    }

    async deleteComponent(id: string): Promise<void> {
        await apiFetch(`${this.baseUrl}/api/v1/components/${id}`, { method: 'DELETE' });
    }
}
