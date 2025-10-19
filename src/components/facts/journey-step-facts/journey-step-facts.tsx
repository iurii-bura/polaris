import type { FunctionComponent, ReactElement } from 'react';
import { useState, useCallback } from 'react';
import { FiMap, FiChevronDown, FiChevronUp, FiImage, FiFileText } from 'react-icons/fi';
import type { JourneyStepFacts as JourneyStepFactsType } from '../../types';

type JourneyStepFactsProps = {
    readonly journeyStepFacts: JourneyStepFactsType;
};

const JourneyStepFacts: FunctionComponent<JourneyStepFactsProps> = ({ journeyStepFacts }): ReactElement => {
    const [isExpanded, setIsExpanded] = useState(false);

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
                        <FiMap className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold">Journey Step</h2>
                    </div>

                    {/* Expand/Collapse Button */}
                    <button
                        type="button"
                        className="btn btn-ghost btn-sm btn-circle"
                    >
                        {isExpanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                    </button>
                </div>

                {/* Expanded Content */}
                {isExpanded ? (
                    <div className="mt-4 space-y-6">
                        {/* Step Name */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <FiFileText className="w-4 h-4 text-primary" />
                                <span className="font-medium">Step Information</span>
                            </div>
                            <div className="pl-6 space-y-2 text-sm">
                                <div>
                                    <span className="font-medium">Name:</span>{' '}
                                    <span className="text-primary font-semibold">{journeyStepFacts.name}</span>
                                </div>
                                <div>
                                    <span className="font-medium">Description:</span>
                                    <p className="mt-2 text-base-content/80 leading-relaxed">
                                        {journeyStepFacts.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Screenshot Display */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <FiImage className="w-4 h-4 text-primary" />
                                <span className="font-medium">Screenshot</span>
                            </div>
                            <div className="pl-6">
                                <div className="bg-base-200/50 rounded-lg p-4">
                                    <div className="relative overflow-hidden rounded-md border border-base-300">
                                        <img
                                            src={journeyStepFacts.screenshot}
                                            alt={`Screenshot of ${journeyStepFacts.name}`}
                                            className="w-full h-auto max-w-full object-contain bg-white"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                const parent = target.parentElement;
                                                if (parent) {
                                                    parent.innerHTML = `
                                                        <div class="w-full h-48 flex items-center justify-center text-base-content/60 bg-base-200">
                                                            <div class="text-center">
                                                                <div class="text-4xl mb-3">📷</div>
                                                                <div class="text-sm">Screenshot not available</div>
                                                                <div class="text-xs text-base-content/40 mt-1">Unable to load image from URL</div>
                                                            </div>
                                                        </div>
                                                    `;
                                                }
                                            }}
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Image Caption */}
                                    <div className="mt-3 text-xs text-base-content/60 text-center">
                                        <span className="font-medium">{journeyStepFacts.name}</span>
                                        {' - '}
                                        <span>UI Screenshot</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default JourneyStepFacts;
