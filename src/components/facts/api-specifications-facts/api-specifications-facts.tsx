import type { FunctionComponent, ReactElement } from 'react';
import { useState, useCallback } from 'react';
import { FiCode, FiChevronDown, FiChevronUp, FiLink, FiFileText } from 'react-icons/fi';
import type { ApiSpecification } from '../../types';

type ApiSpecificationsFactsProps = {
    readonly apiSpecifications?: ApiSpecification[];
};

const ApiSpecificationsFacts: FunctionComponent<ApiSpecificationsFactsProps> = ({
    apiSpecifications
}): ReactElement => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = useCallback(() => {
        setIsExpanded((prev) => !prev);
    }, []);

    // Get the appropriate icon for each API type
    const getApiTypeIcon = (apiType: string) => {
        switch (apiType) {
            case 'REST':
                return FiCode;
            case 'GraphQL':
                return FiCode;
            case 'SOAP':
                return FiFileText;
            case 'other':
                return FiLink;
            default:
                return FiCode;
        }
    };

    return (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-6">
                {/* Header - Always Visible */}
                <div
                    className="flex items-center justify-between cursor-pointer hover:bg-base-200/50 rounded-lg p-2 -m-2 transition-colors"
                    onClick={toggleExpanded}
                >
                    <div className="flex items-center gap-3">
                        <FiCode className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold">API Specifications</h2>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Expand/Collapse Button */}
                        <button className="btn btn-ghost btn-sm btn-circle">
                            {isExpanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                    <div className="mt-4 space-y-4">
                        {!apiSpecifications || apiSpecifications.length === 0 ? (
                            <div className="text-center py-8 text-base-content/60">
                                <FiCode className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <h3 className="text-lg font-medium mb-2">No API Specifications</h3>
                                <p className="text-sm">API specifications are not available for this component.</p>
                            </div>
                        ) : (
                            <>
                                {apiSpecifications.map((api, index) => {
                                    const ApiIcon = getApiTypeIcon(api.apiType);

                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-base-200/50 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <ApiIcon className="w-5 h-5 text-primary" />
                                                <div>
                                                    <div className="font-medium text-base-content">
                                                        {api.apiType.toUpperCase()}
                                                    </div>
                                                    <div className="text-xs text-base-content/60">{api.apiSpace}</div>
                                                </div>
                                            </div>

                                            <div className="text-sm">
                                                {api.specification ? (
                                                    <a
                                                        href={api.specification}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:text-primary-focus transition-colors flex items-center gap-1"
                                                    >
                                                        <FiLink className="w-3 h-3" />
                                                        View Specification
                                                    </a>
                                                ) : (
                                                    <span className="text-base-content/60">No specification</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApiSpecificationsFacts;
