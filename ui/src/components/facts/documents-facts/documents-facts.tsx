import type { FunctionComponent, ReactElement } from 'react';
import { useCallback, useState } from 'react';
import {
    FiChevronDown,
    FiChevronUp,
    FiFileText,
    FiFile,
    FiBook,
    FiShield,
    FiSettings,
    FiAlertTriangle
} from 'react-icons/fi';
import type { Document } from '../../types';

type DocumentsFactsProps = {
    readonly documents?: Document[];
};

// Map document types to appropriate icons based on description keywords
const getDocumentIcon = (description: string): ReactElement => {
    const desc = description.toLowerCase();

    if (desc.includes('architecture') || desc.includes('design')) {
        return <FiFileText className="w-4 h-4" />;
    }
    if (desc.includes('security') || desc.includes('compliance')) {
        return <FiShield className="w-4 h-4" />;
    }
    if (desc.includes('user') || desc.includes('manual') || desc.includes('guide')) {
        return <FiBook className="w-4 h-4" />;
    }
    if (desc.includes('deployment') || desc.includes('operations') || desc.includes('runbook')) {
        return <FiSettings className="w-4 h-4" />;
    }
    if (desc.includes('legacy') || desc.includes('migration')) {
        return <FiAlertTriangle className="w-4 h-4" />;
    }

    // Default icon for other document types
    return <FiFile className="w-4 h-4" />;
};

const DocumentsFacts: FunctionComponent<DocumentsFactsProps> = ({ documents }): ReactElement => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = useCallback(() => {
        setIsExpanded(!isExpanded);
    }, [isExpanded]);

    const hasDocuments = documents && documents.length > 0;
    const documentCount = documents?.length ?? 0;

    return (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-6">
                {/* Header - Always Visible */}
                <div
                    className="flex items-center justify-between cursor-pointer hover:bg-base-200/50 rounded-lg p-2 -m-2 transition-colors"
                    onClick={handleToggle}
                >
                    <div className="flex items-center gap-3">
                        <FiFileText className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold">Documents</h2>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Document Count Badge */}
                        <div className={`badge ${hasDocuments ? 'badge-success' : 'badge-warning'} badge-sm`}>
                            {documentCount}
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
                        {hasDocuments ? (
                            <div className="space-y-3">
                                {documents.map((doc) => (
                                    <div
                                        key={doc.url}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-base-200 hover:bg-base-300 transition-colors"
                                    >
                                        <div className="text-primary">{getDocumentIcon(doc.description)}</div>
                                        <div className="flex-1">
                                            <a
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:text-primary-focus font-medium hover:underline"
                                            >
                                                {doc.description}
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-base-content/60">
                                <FiFileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <h3 className="text-lg font-medium mb-2">No Documents</h3>
                                <p className="text-sm">Documentation is not available for this component.</p>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default DocumentsFacts;
