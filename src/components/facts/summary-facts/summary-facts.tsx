import type { FunctionComponent, ReactElement } from 'react';
import { FiDatabase, FiUsers } from 'react-icons/fi';
import BusinessCapabilityBadge from './business-capability-badge';
import CoverageScore from './coverage-score';
import TechStackIcons from './tech-stack-icons';
import PlatformBadges from './platform-badges';

type SummaryFactsProps = {
    readonly id: string;
    readonly businessCapabilities: string[];
    readonly platforms: { type: string; comment: string }[];
    readonly techStack: { name: string; version: string; source: string }[];
    readonly name: string;
    readonly description: string;
    readonly teamName?: string;
    readonly coveragePercentage: number;
};

const SummaryFacts: FunctionComponent<SummaryFactsProps> = ({
    id,
    businessCapabilities,
    platforms,
    techStack,
    name,
    description,
    teamName,
    coveragePercentage
}): ReactElement => {
    return (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-6">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-xl font-bold text-primary">{id}</h2>
                            <div
                                className="tooltip"
                                data-tip="View CMDB Entry"
                            >
                                <button
                                    type="button"
                                    className="btn btn-ghost btn-sm btn-circle"
                                    title="View CMDB Entry"
                                >
                                    <FiDatabase className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-base-content mb-2">{name}</h3>
                        <p className="text-sm text-base-content/70 leading-relaxed">{description}</p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {/* Business Capabilities */}
                        <div>
                            <h4 className="text-sm font-medium text-base-content/60 mb-2">Business Capabilities</h4>
                            <div className="flex flex-wrap gap-2">
                                {businessCapabilities.map((capability) => (
                                    <BusinessCapabilityBadge
                                        key={capability}
                                        capability={capability}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Team */}
                        <div>
                            <h4 className="text-sm font-medium text-base-content/60 mb-2">Team</h4>
                            <div className="flex items-center gap-2">
                                <FiUsers className="w-4 h-4 text-base-content/60" />
                                <span className="text-sm font-medium">{teamName ?? 'Unknown'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {/* Technology Stack */}
                        <div>
                            <h4 className="text-sm font-medium text-base-content/60 mb-2">Technology Stack</h4>
                            <TechStackIcons techStack={techStack} />
                        </div>

                        {/* Test Coverage */}
                        <div>
                            <h4 className="text-sm font-medium text-base-content/60 mb-2">Test Coverage</h4>
                            <CoverageScore percentage={coveragePercentage} />
                        </div>
                    </div>
                </div>

                {/* Platform Badges */}
                <div className="mt-4 pt-4 border-t border-base-300">
                    <h4 className="text-sm font-medium text-base-content/60 mb-2">Platforms</h4>
                    <PlatformBadges platforms={platforms} />
                </div>
            </div>
        </div>
    );
};

export default SummaryFacts;
