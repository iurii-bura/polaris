import type { FunctionComponent, ReactElement } from 'react';

import { Loading } from 'src/components';
import { WorkspaceSplash } from '../components/workspace';
import { useDataProvider } from '../context/data-provider-context';
import { Dashboard } from './dashboard';

import './app.css';

/**
 * Root component. Decides what to render based on the data provider state:
 *
 *   loading      → spinner (provider still detecting environment)
 *   no-workspace → splash screen (Electron mode, no workspace open yet)
 *   ready        → Dashboard (normal operation)
 */
const App: FunctionComponent = (): ReactElement => {
    const state = useDataProvider();

    if (state.status === 'loading') {
        return (
            <main
                role="main"
                className="min-h-screen bg-base-100 flex items-center justify-center"
            >
                <Loading text="Initializing..." />
            </main>
        );
    }

    if (state.status === 'no-workspace') {
        return <WorkspaceSplash />;
    }

    return <Dashboard workspace={state.workspace} />;
};

export { App };
