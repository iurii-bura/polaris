import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { addWebVitalsReporting } from './components';
import { DataProviderBootstrap } from './context/data-provider-context';

import { App } from './app/app';

import './index.css';

const rootElement = document.getElementById('root');

if (rootElement === null) {
    throw new Error('Failed to find the root element');
}

const root = createRoot(rootElement);

root.render(
    <StrictMode>
        <BrowserRouter>
            <DataProviderBootstrap>
                <App />
            </DataProviderBootstrap>
        </BrowserRouter>
    </StrictMode>
);

addWebVitalsReporting();
