import type { FunctionComponent, ReactElement } from 'react';
import { useCallback, useState } from 'react';
import {
    FiChevronDown,
    FiChevronUp,
    FiLink,
    FiBook,
    FiDatabase,
    FiUsers,
    FiMonitor,
    FiGlobe,
    FiExternalLink
} from 'react-icons/fi';
import type { Link } from '../../types';

type LinksFactsProps = {
    readonly links?: Link[];
};

// Map link types to appropriate icons based on type
const getLinkIcon = (type: string): ReactElement => {
    const linkType = type.toLowerCase();

    if (linkType.includes('kb') || linkType.includes('knowledge') || linkType.includes('wiki')) {
        return <FiBook className="w-4 h-4" />;
    }
    if (linkType.includes('database') || linkType.includes('db')) {
        return <FiDatabase className="w-4 h-4" />;
    }
    if (linkType.includes('team') || linkType.includes('contact')) {
        return <FiUsers className="w-4 h-4" />;
    }
    if (linkType.includes('dashboard') || linkType.includes('monitor')) {
        return <FiMonitor className="w-4 h-4" />;
    }
    if (linkType.includes('web') || linkType.includes('site')) {
        return <FiGlobe className="w-4 h-4" />;
    }

    // Default icon for other link types
    return <FiLink className="w-4 h-4" />;
};

// Get display name for link type
const getLinkTypeDisplay = (type: string): string => {
    const linkType = type.toLowerCase();
    
    if (linkType === 'kb') return 'Knowledge Base';
    if (linkType === 'wiki') return 'Wiki';
    if (linkType === 'docs') return 'Documentation';
    if (linkType === 'dashboard') return 'Dashboard';
    if (linkType === 'monitor') return 'Monitoring';
    if (linkType === 'repo') return 'Repository';
    if (linkType === 'api') return 'API';
    
    // Capitalize first letter for other types
    return type.charAt(0).toUpperCase() + type.slice(1);
};

const LinksFacts: FunctionComponent<LinksFactsProps> = ({ links }): ReactElement => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = useCallback(() => {
        setIsExpanded(!isExpanded);
    }, [isExpanded]);

    const hasLinks = links && links.length > 0;
    const linkCount = links?.length ?? 0;

    return (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-6">
                {/* Header - Always Visible */}
                <div
                    className="flex items-center justify-between cursor-pointer hover:bg-base-200/50 rounded-lg p-2 -m-2 transition-colors"
                    onClick={handleToggle}
                >
                    <div className="flex items-center gap-3">
                        <FiLink className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold">Links</h2>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Link Count Badge */}
                        <div className={`badge ${hasLinks ? 'badge-success' : 'badge-warning'} badge-sm`}>
                            {linkCount}
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

                {/* Expanded Content */}
                {isExpanded ? (
                    <div className="mt-4 space-y-4">
                        {hasLinks ? (
                            <div className="space-y-3">
                                {links.map((link, index) => (
                                    <div
                                        key={`${link.type}-${index}`}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-base-200 hover:bg-base-300 transition-colors"
                                    >
                                        <div className="text-primary">{getLinkIcon(link.type)}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="badge badge-outline badge-sm">
                                                    {getLinkTypeDisplay(link.type)}
                                                </span>
                                            </div>
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:text-primary-focus font-medium hover:underline flex items-center gap-1"
                                            >
                                                {link.url}
                                                <FiExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-base-content/60">
                                <FiLink className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <h3 className="text-lg font-medium mb-2">No Links</h3>
                                <p className="text-sm">No additional links are available for this component.</p>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default LinksFacts;
