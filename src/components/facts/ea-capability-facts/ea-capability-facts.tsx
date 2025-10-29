import type { FunctionComponent, ReactElement } from 'react';
import { useState, useCallback } from 'react';
import { FiLayers, FiChevronDown, FiChevronUp, FiInfo } from 'react-icons/fi';
import type { EaCapabilityFacts as EaCapabilityFactsType } from '../../types';

type EaCapabilityFactsProps = {
    readonly eaCapabilityFacts?: EaCapabilityFactsType;
};

export const EaCapabilityFacts: FunctionComponent<EaCapabilityFactsProps> = ({ eaCapabilityFacts }): ReactElement => {
    const [isExpanded, setIsExpanded] = useState(true); // Expanded by default

    const toggleExpanded = useCallback(() => {
        setIsExpanded((prev) => !prev);
    }, []);

    return (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-6">
                {/* Header - Always Visible */}
                <div
                    className="flex items-center justify-between cursor-pointer hover:bg-base-200/50 rounded-lg p-2 -m-2 transition-colors"
                    onClick={toggleExpanded}
                >
                    <div className="flex items-center gap-3">
                        <FiLayers className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold">{eaCapabilityFacts?.name ?? 'EA Capability'}</h2>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Domain Status - Always Visible */}
                        {eaCapabilityFacts ? (
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-base-content">
                                    {eaCapabilityFacts.capabilityDomain}
                                </span>
                            </div>
                        ) : null}

                        {/* Expand/Collapse Button */}
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm btn-circle"
                        >
                            {isExpanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Expanded Content */}
                {isExpanded ? (
                    <div className="mt-4 space-y-4">
                        {!eaCapabilityFacts ? (
                            <div className="text-center py-8 text-base-content/60">
                                <FiLayers className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <h3 className="text-lg font-medium mb-2">No EA Capability Information</h3>
                                <p className="text-sm">
                                    Enterprise Architecture capability details are not available for this component.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Capability Domain */}
                                <div className="flex items-center justify-between p-3 bg-base-200/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <FiLayers className="w-5 h-5 text-primary" />
                                        <div>
                                            <div className="font-medium text-base-content">Capability Domain</div>
                                            <div className="text-xs text-base-content/60">
                                                Enterprise architecture domain
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                            {eaCapabilityFacts.capabilityDomain}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="p-3 bg-base-200/50 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <FiInfo className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <div className="font-medium text-base-content mb-2">Description</div>
                                            <p className="text-sm text-base-content/70 leading-relaxed">
                                                {eaCapabilityFacts.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
};
