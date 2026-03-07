import type { FunctionComponent, ReactElement } from 'react';
import { useState, useCallback } from 'react';
import { FiDatabase, FiChevronDown, FiChevronUp, FiDollarSign, FiTag, FiLink, FiBox } from 'react-icons/fi';
import type { CmdbFacts as CmdbFactsType } from '../../types';

type CmdbFactsProps = {
    readonly cmdbFacts: CmdbFactsType;
};

const CmdbFacts: FunctionComponent<CmdbFactsProps> = ({ cmdbFacts }): ReactElement => {
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
                        <FiDatabase className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold">CMDB</h2>
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
                        {/* Basic Information */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <FiTag className="w-4 h-4 text-primary" />
                                <span className="font-medium">Basic Information</span>
                            </div>
                            <div className="pl-6 space-y-2 text-sm">
                                <div>
                                    <span className="font-medium">ID:</span>{' '}
                                    <span className="font-mono text-primary">{cmdbFacts.id}</span>
                                </div>
                                <div>
                                    <span className="font-medium">Name:</span> {cmdbFacts.name}
                                </div>
                                <div>
                                    <span className="font-medium">Description:</span> {cmdbFacts.description}
                                </div>
                                <div>
                                    <span className="font-medium">Solution:</span>
                                    <a
                                        href={cmdbFacts.solution.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-2 text-primary hover:text-primary-focus hover:underline"
                                    >
                                        {cmdbFacts.solution.name} ({cmdbFacts.solution.id})
                                        <FiLink className="w-3 h-3 inline ml-1" />
                                    </a>
                                </div>
                                {cmdbFacts.aliases && cmdbFacts.aliases.length > 0 ? (
                                    <div>
                                        <span className="font-medium">Aliases:</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {cmdbFacts.aliases.map((alias) => (
                                                <span
                                                    key={alias}
                                                    className="badge badge-outline badge-sm"
                                                >
                                                    {alias}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {/* Subcomponents */}
                        {cmdbFacts.subcomponents && cmdbFacts.subcomponents.length > 0 ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <FiBox className="w-4 h-4 text-primary" />
                                    <span className="font-medium">
                                        Subcomponents ({cmdbFacts.subcomponents.length})
                                    </span>
                                </div>
                                <div className="pl-6 grid gap-2">
                                    {cmdbFacts.subcomponents.map((subcomp) => (
                                        <div
                                            key={subcomp.id}
                                            className="flex items-center justify-between p-2 bg-base-200/50 rounded"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="badge badge-outline badge-sm font-mono">
                                                    {subcomp.id}
                                                </span>
                                                <span className="text-sm">{subcomp.description}</span>
                                            </div>
                                            <a
                                                href={subcomp.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-ghost btn-xs"
                                            >
                                                <FiLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {/* Financial Information */}
                        {cmdbFacts.annualCost ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <FiDollarSign className="w-4 h-4 text-primary" />
                                    <span className="font-medium">Financial Information</span>
                                </div>
                                <div className="pl-6 space-y-2 text-sm">
                                    <div>
                                        <span className="font-medium">Annual Cost:</span>
                                        <span className="ml-2 badge badge-warning">
                                            {cmdbFacts.annualCost.amount.toLocaleString()}{' '}
                                            {cmdbFacts.annualCost.currency}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default CmdbFacts;
