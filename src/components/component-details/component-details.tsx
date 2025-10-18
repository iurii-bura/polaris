import type { FunctionComponent, ReactElement } from 'react';
import type { ComponentData } from '../types';
import NoComponentSelected from './no-component-selected';
import {
    SummaryFacts,
    GitFacts,
    TechStackFacts,
    QualityMetricsFacts,
    ApiSpecificationsFacts,
    DocumentsFacts,
    TeamFacts,
    KafkaFacts,
    CmdbFacts,
    PlatformsFacts,
    LinksFacts
} from '../facts';

type ComponentDetailsProps = {
    readonly component: ComponentData | null;
};

const ComponentDetails: FunctionComponent<ComponentDetailsProps> = ({ component }): ReactElement => {
    return (
        <div className="h-full flex flex-col">
            {component ? (
                <div className="flex-1 overflow-auto space-y-4 pr-3">
                    {/* Summary Card */}
                    <SummaryFacts
                        id={component.id}
                        businessCapabilities={component.facts.businessCapabilities}
                        platforms={component.facts.platforms}
                        techStack={component.facts.techStack}
                        name={component.facts.cmdbFacts.name}
                        description={component.facts.cmdbFacts.description}
                        teamName={component.facts.team?.teamName}
                        coveragePercentage={component.facts.qualityMetrics?.codeCoveragePercentage}
                    />

                    {/* Technical Details Cards */}
                    {!!(component.facts.techStack && component.facts.techStack.length > 0) && (
                        <TechStackFacts techStack={component.facts.techStack} />
                    )}

                    <CmdbFacts cmdbFacts={component.facts.cmdbFacts} />

                    {component.facts.qualityMetrics && (
                        <QualityMetricsFacts qualityMetrics={component.facts.qualityMetrics} />
                    )}

                    {/* Development & Collaboration Cards */}
                    {component.facts.git && <GitFacts git={component.facts.git} />}

                    {component.facts.team && <TeamFacts team={component.facts.team} />}

                    {component.facts.apiSpecifications && component.facts.apiSpecifications.length > 0 && (
                        <ApiSpecificationsFacts apiSpecifications={component.facts.apiSpecifications} />
                    )}

                    {component.facts.documents && component.facts.documents.length > 0 && (
                        <DocumentsFacts documents={component.facts.documents} />
                    )}

                    {component.facts.platforms && component.facts.platforms.length > 0 && (
                        <PlatformsFacts platforms={component.facts.platforms} />
                    )}

                    <LinksFacts links={component.facts.links} />

                    {component.facts.kafka ? <KafkaFacts kafka={component.facts.kafka} /> : null}
                </div>
            ) : (
                <div className="h-full flex items-center justify-center">
                    <NoComponentSelected />
                </div>
            )}
        </div>
    );
};

export default ComponentDetails;
