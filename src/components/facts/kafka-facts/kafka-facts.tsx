import type { FunctionComponent, ReactElement } from 'react';
import { useState, useCallback } from 'react';
import { FiChevronDown, FiChevronUp, FiSend, FiDownload } from 'react-icons/fi';
import { SiApachekafka } from 'react-icons/si';
import type { KafkaInfo } from '../../types';

type KafkaFactsProps = {
    readonly kafka: KafkaInfo;
};

const KafkaFacts: FunctionComponent<KafkaFactsProps> = ({ kafka }): ReactElement => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = useCallback(() => {
        setIsExpanded((prev) => !prev);
    }, []);

    const totalTopics = kafka.publishingToTopics.length + kafka.listeningToTopics.length;
    const hasTopics = totalTopics > 0;

    if (!hasTopics) {
        return (
            <div className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow">
                <div className="card-body p-6">
                    <div className="flex items-center gap-3">
                        <SiApachekafka className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold">Kafka</h2>
                    </div>
                    <p className="text-base-content/60 text-sm mt-2">No Kafka topics configured</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-6">
                {/* Header - Always Visible */}
                <div
                    className="flex items-center justify-between cursor-pointer hover:bg-base-200/50 rounded-lg p-2 -m-2 transition-colors"
                    onClick={toggleExpanded}
                >
                    <div className="flex items-center gap-3">
                        <SiApachekafka className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold">Kafka</h2>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Topic Count Badge */}
                        <div className="badge badge-primary badge-sm">
                            {totalTopics} topic{totalTopics !== 1 ? 's' : ''}
                        </div>

                        {/* Publishing/Listening Count Details */}
                        <div className="flex items-center gap-1 text-xs text-base-content/60">
                            <FiSend className="w-3 h-3" />
                            <span>{kafka.publishingToTopics.length}</span>
                            <span className="mx-1">|</span>
                            <FiDownload className="w-3 h-3" />
                            <span>{kafka.listeningToTopics.length}</span>
                        </div>

                        {/* Expand/Collapse Button */}
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm btn-circle"
                        >
                            {isExpanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {isExpanded ? (
                    <div className="mt-4 space-y-4">
                        {kafka.publishingToTopics.length > 0 ? (
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <FiSend className="w-4 h-4 text-success" />
                                    <h3 className="font-semibold text-success">Publishing Topics</h3>
                                    <div className="badge badge-success badge-sm">
                                        {kafka.publishingToTopics.length}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {kafka.publishingToTopics.map((topic) => (
                                        <div
                                            key={topic}
                                            className="badge badge-outline badge-success text-xs font-mono"
                                        >
                                            {topic}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {kafka.listeningToTopics.length > 0 ? (
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <FiDownload className="w-4 h-4 text-info" />
                                    <h3 className="font-semibold text-info">Listening Topics</h3>
                                    <div className="badge badge-info badge-sm">{kafka.listeningToTopics.length}</div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {kafka.listeningToTopics.map((topic) => (
                                        <div
                                            key={topic}
                                            className="badge badge-outline badge-info text-xs font-mono"
                                        >
                                            {topic}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default KafkaFacts;
