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
    CmdbFacts
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
                        name={component.facts.cmdb.name}
                        description={component.facts.cmdb.description}
                        cmdbId={component.facts.cmdb.id}
                        teamName={component.facts.team?.teamName}
                        coveragePercentage={component.facts.qualityMetrics.codeCoveragePercentage}
                    />

                    {/* Technical Details Cards */}
                    <TechStackFacts techStack={component.facts.techStack} />

                    {component.facts.cmdbFacts ? <CmdbFacts cmdbFacts={component.facts.cmdbFacts} /> : null}

                    <QualityMetricsFacts qualityMetrics={component.facts.qualityMetrics} />

                    {/* Development & Collaboration Cards */}
                    <GitFacts git={component.facts.git} />

                    <TeamFacts team={component.facts.team} />

                    <ApiSpecificationsFacts apiSpecifications={component.facts.apiSpecifications} />

                    <DocumentsFacts documents={component.facts.documents} />

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
