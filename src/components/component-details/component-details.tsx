import type { FunctionComponent, ReactElement } from 'react';
import { useMemo } from 'react';
import type { ComponentData, Facts } from '../types';
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
    LinksFacts,
    JourneyStepFacts
} from '../facts';

type ComponentDetailsProps = {
    readonly component: ComponentData | null;
};

/*
 * Ideally this function (and the whole application) should be completely independent
 * on specific types of facts. There should be a flexibility to add more types dynamically
 * witohut touching this code
 */
const getFactCards = (facts: Facts): ReactElement[] => {
    const summary = facts.cmdbFacts && (
        <SummaryFacts
            id={facts.cmdbFacts.id}
            businessCapabilities={facts.businessCapabilities}
            platforms={facts.platforms}
            techStack={facts.techStack}
            name={facts.cmdbFacts.name}
            description={facts.cmdbFacts.description}
            teamName={facts.team?.teamName}
            coveragePercentage={facts.qualityMetrics?.codeCoveragePercentage}
        />
    );
    const techStack = facts.techStack && facts.techStack.length > 0 && <TechStackFacts techStack={facts.techStack} />;
    const cmdb = facts.cmdbFacts && <CmdbFacts cmdbFacts={facts.cmdbFacts} />;
    const qualityMetrics = facts.qualityMetrics && <QualityMetricsFacts qualityMetrics={facts.qualityMetrics} />;
    const git = facts.git && <GitFacts git={facts.git} />;
    const team = facts.team && <TeamFacts team={facts.team} />;
    const api = facts.apiSpecifications && facts.apiSpecifications.length > 0 && (
        <ApiSpecificationsFacts apiSpecifications={facts.apiSpecifications} />
    );
    const docs = facts.documents && facts.documents.length > 0 && <DocumentsFacts documents={facts.documents} />;
    const platforms = facts.platforms && facts.platforms.length > 0 && <PlatformsFacts platforms={facts.platforms} />;
    const links = facts.links && <LinksFacts links={facts.links} />;
    const kafka = facts.kafka && <KafkaFacts kafka={facts.kafka} />;
    const journeyStep = facts.journeyStep && <JourneyStepFacts journeyStepFacts={facts.journeyStep} />;

    return [
        summary,
        techStack,
        cmdb,
        qualityMetrics,
        git,
        team,
        api,
        docs,
        platforms,
        links,
        kafka,
        journeyStep
    ].filter((el) => !!el);
};

const ComponentDetails: FunctionComponent<ComponentDetailsProps> = ({ component }): ReactElement => {
    if (component === null) {
        return (
            <div className="h-full flex items-center justify-center">
                <NoComponentSelected />
            </div>
        );
    }

    const facts = useMemo(() => getFactCards(component.facts), [component.facts]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-auto space-y-4 pr-3">
                {/* Summary Card */}

                {...facts}
            </div>
        </div>
    );
};

export default ComponentDetails;
