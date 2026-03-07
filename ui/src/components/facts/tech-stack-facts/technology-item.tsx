import type { FunctionComponent, ReactElement } from 'react';
import { FiExternalLink, FiInfo } from 'react-icons/fi';
import type { TechStackItem } from '../../types';
import { getTechnologyStatus, getTechnologyEntry } from './tech-whitelist';
import TechnologyStatusBadge from './technology-status-badge';

type TechnologyItemProps = {
    readonly item: TechStackItem;
};

const TechnologyItem: FunctionComponent<TechnologyItemProps> = ({ item }): ReactElement => {
    const status = getTechnologyStatus(item.name, item.version);
    const techEntry = getTechnologyEntry(item.name);

    const getVersionColor = () => {
        switch (status) {
            case 'normal':
                return 'text-success';
            case 'phased-out':
                return 'text-warning';
            case 'deprecated':
                return 'text-error';
            case 'unknown':
                return 'text-base-content/60';
        }
    };

    return (
        <div className="flex items-center justify-between p-3 bg-base-200/50 rounded-lg">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-base-content truncate">{item.name}</h4>
                    <TechnologyStatusBadge status={status} />
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <span className="text-base-content/60">Version:</span>
                    <span className={`font-mono font-medium ${getVersionColor()}`}>{item.version}</span>

                    {techEntry?.recommendedVersion && status !== 'normal' ? (
                        <>
                            <span className="text-base-content/40">•</span>
                            <span className="text-base-content/60">Recommended:</span>
                            <span className="font-mono text-success font-medium">{techEntry.recommendedVersion}</span>
                        </>
                    ) : null}
                </div>

                {techEntry?.comment ? (
                    <div className="flex items-start gap-1 mt-1">
                        <FiInfo className="w-3 h-3 text-info mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-base-content/60">{techEntry.comment}</span>
                    </div>
                ) : null}
            </div>

            <div className="flex items-center gap-2 ml-3">
                <div
                    className="tooltip"
                    data-tip="View source file"
                >
                    <a
                        href={item.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm btn-circle"
                    >
                        <FiExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TechnologyItem;
