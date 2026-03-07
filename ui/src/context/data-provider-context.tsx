import { createContext, useContext, useState, useEffect, type FunctionComponent, type ReactNode } from 'react';
import type { IDataProvider } from '../services/data-provider';
import { ComponentDataService } from '../services/component-data-service';
import { LocalFileProvider } from '../services/local-file-provider';
import { RestApiProvider } from '../services/rest-api-provider';
import type { ComponentGraph } from '../components/types';

export type WorkspaceInfo = {
    name: string;
    filePath: string;
    lastOpenedAt: string;
};

export type DataProviderState =
    | { status: 'loading' }
    | { status: 'no-workspace' }
    | { status: 'ready'; provider: IDataProvider; workspace: WorkspaceInfo | null };

const DataProviderContext = createContext<DataProviderState>({ status: 'loading' });

export const useDataProvider = (): DataProviderState => useContext(DataProviderContext);

function detectMode(): 'electron' | 'rest' | 'browser' {
    if (typeof window !== 'undefined' && window.electronAPI !== undefined) return 'electron';
    if (import.meta.env.POLARIS_API_URL) return 'rest';
    return 'browser';
}

type DataProviderBootstrapProps = { readonly children: ReactNode };

/**
 * Detects the runtime environment on mount, creates the appropriate
 * IDataProvider implementation, and injects it into context.
 *
 * Render tree:
 *   DataProviderBootstrap
 *     └── children (App)
 *           └── any component can call useDataProvider()
 */
export const DataProviderBootstrap: FunctionComponent<DataProviderBootstrapProps> = ({ children }) => {
    const [state, setState] = useState<DataProviderState>({ status: 'loading' });

    useEffect(() => {
        const mode = detectMode();

        if (mode === 'electron') {
            const api = window.electronAPI;
            if (!api) return;

            const provider = new LocalFileProvider();

            const unsubscribeLoaded = api.onWorkspaceLoaded((payload) => {
                provider.loadData(payload.graph as ComponentGraph);
                setState({ status: 'ready', provider, workspace: payload.workspace });
            });

            const unsubscribeNone = api.onNoWorkspace(() => {
                setState({ status: 'no-workspace' });
            });

            return () => {
                unsubscribeLoaded();
                unsubscribeNone();
            };
        }

        if (mode === 'rest') {
            const apiUrl = import.meta.env.POLARIS_API_URL ?? '';
            setState({ status: 'ready', provider: new RestApiProvider(apiUrl), workspace: null });
            return;
        }

        // Browser / dev mode — use existing localStorage + example.json provider
        setState({ status: 'ready', provider: ComponentDataService.getInstance(), workspace: null });
    }, []);

    return <DataProviderContext.Provider value={state}>{children}</DataProviderContext.Provider>;
};
