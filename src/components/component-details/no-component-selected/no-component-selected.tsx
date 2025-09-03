import type { FunctionComponent, ReactElement } from 'react';
import './no-component-selected.css';

const NoComponentSelected: FunctionComponent = (): ReactElement => {
    return (
        <div className="flex-1 flex items-center justify-center no-component-selected-container">
            <div className="text-center text-base-content/60">
                <svg
                    className="w-12 h-12 mx-auto mb-3 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                <p className="text-sm italic">No component selected</p>
                <p className="text-xs mt-1">Click on a node to view details</p>
            </div>
        </div>
    );
};

export default NoComponentSelected;
