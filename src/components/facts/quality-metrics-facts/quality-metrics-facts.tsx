import type { FunctionComponent, ReactElement } from 'react';
import { useState, useCallback } from 'react';
import {
    FiBarChart,
    FiCheckCircle,
    FiAlertTriangle,
    FiXCircle,
    FiChevronDown,
    FiChevronUp,
    FiExternalLink
} from 'react-icons/fi';
import type { QualityMetrics } from '../../types';

type QualityMetricsFactsProps = {
    readonly qualityMetrics: QualityMetrics;
};

type QualityStatus = 'good' | 'fair' | 'poor';

const QualityMetricsFacts: FunctionComponent<QualityMetricsFactsProps> = ({ qualityMetrics }): ReactElement => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = useCallback(() => {
        setIsExpanded((prev) => !prev);
    }, []);

    // Calculate coverage status
    const getCoverageStatus = (percentage: number): QualityStatus => {
        if (percentage >= 80) return 'good';
        if (percentage >= 60) return 'fair';
        return 'poor';
    };

    // Calculate API linting status
    const getApiLintingStatus = (issues: { minor: number; major: number }): QualityStatus => {
        if (issues.major === 0 && issues.minor <= 5) return 'good';
        if (issues.major <= 2 && issues.minor <= 15) return 'fair';
        return 'poor';
    };

    // Calculate overall status
    const getOverallStatus = (): QualityStatus => {
        const coverageStatus = getCoverageStatus(qualityMetrics.codeCoveragePercentage);
        const lintingStatus = getApiLintingStatus(qualityMetrics.apiLintingIssues);

        if (coverageStatus === 'poor' || lintingStatus === 'poor') {
            return 'poor';
        }
        if (coverageStatus === 'fair' || lintingStatus === 'fair') {
            return 'fair';
        }
        return 'good';
    };

    const getStatusConfig = (status: QualityStatus) => {
        switch (status) {
            case 'good':
                return {
                    className: 'bg-success/10 text-success border-success/20',
                    text: 'Good',
                    icon: FiCheckCircle
                };
            case 'fair':
                return {
                    className: 'bg-warning/10 text-warning border-warning/20',
                    text: 'Fair',
                    icon: FiAlertTriangle
                };
            case 'poor':
                return {
                    className: 'bg-error/10 text-error border-error/20',
                    text: 'Poor',
                    icon: FiXCircle
                };
        }
    };

    const coverageStatus = getCoverageStatus(qualityMetrics.codeCoveragePercentage);
    const lintingStatus = getApiLintingStatus(qualityMetrics.apiLintingIssues);
    const overallStatus = getOverallStatus();
    const overallConfig = getStatusConfig(overallStatus);

    return (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-6">
                {/* Header - Always Visible */}
                <div
                    className="flex items-center justify-between cursor-pointer hover:bg-base-200/50 rounded-lg p-2 -m-2 transition-colors"
                    onClick={toggleExpanded}
                >
                    <div className="flex items-center gap-3">
                        <FiBarChart className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold">Quality Metrics</h2>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Overall Status - Always Visible */}
                        <div className="flex items-center gap-2">
                            <overallConfig.icon
                                className={`w-4 h-4 ${overallConfig.className.split(' ').find((c) => c.startsWith('text-'))}`}
                            />
                            <span
                                className={`text-sm font-medium ${overallConfig.className.split(' ').find((c) => c.startsWith('text-'))}`}
                            >
                                {overallConfig.text}
                            </span>
                        </div>

                        {/* Expand/Collapse Button */}
                        <button className="btn btn-ghost btn-sm btn-circle">
                            {isExpanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Expandable Content */}
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="mt-4">
                        {/* Metrics Summary */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {/* Code Coverage */}
                            <div
                                className={`tooltip tooltip-bottom flex flex-col items-center justify-center p-4 rounded-lg border ${getStatusConfig(coverageStatus).className} relative z-10`}
                                data-tip="Code Coverage"
                            >
                                <FiCheckCircle className="w-6 h-6 mb-2" />
                                <div className="font-bold text-2xl">{qualityMetrics.codeCoveragePercentage}%</div>
                                <div className="text-xs font-medium">Coverage</div>
                            </div>

                            {/* API Linting Issues */}
                            <div
                                className={`tooltip tooltip-bottom flex flex-col items-center justify-center p-4 rounded-lg border ${getStatusConfig(lintingStatus).className} relative z-10`}
                                data-tip="API Linting Issues"
                            >
                                <FiAlertTriangle className="w-6 h-6 mb-2" />
                                <div className="font-bold text-2xl">
                                    {qualityMetrics.apiLintingIssues.major + qualityMetrics.apiLintingIssues.minor}
                                </div>
                                <div className="text-xs font-medium">Issues</div>
                            </div>
                        </div>

                        {/* Detailed Breakdown */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-base-content/60">Detailed Metrics</h3>
                                <a
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:text-primary-focus underline"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    Full report
                                </a>
                            </div>

                            {/* Code Coverage Detail */}
                            <div className="flex items-center justify-between p-3 bg-base-200/50 rounded-lg">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-base-content">Code Coverage</h4>
                                        <div
                                            className={`badge badge-sm ${coverageStatus === 'good' ? 'badge-success' : coverageStatus === 'fair' ? 'badge-warning' : 'badge-error'}`}
                                        >
                                            {getStatusConfig(coverageStatus).text}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-full bg-base-300 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${coverageStatus === 'good' ? 'bg-success' : coverageStatus === 'fair' ? 'bg-warning' : 'bg-error'}`}
                                                style={{ width: `${qualityMetrics.codeCoveragePercentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-mono font-medium min-w-0">
                                            {qualityMetrics.codeCoveragePercentage}%
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <div
                                        className="tooltip"
                                        data-tip="View coverage report"
                                    >
                                        <a
                                            href={qualityMetrics.linkToCoverageReport}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-ghost btn-sm btn-circle"
                                        >
                                            <FiExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* API Linting Issues Detail */}
                            <div className="flex items-center justify-between p-3 bg-base-200/50 rounded-lg">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-base-content">API Linting</h4>
                                        <div
                                            className={`badge badge-sm ${lintingStatus === 'good' ? 'badge-success' : lintingStatus === 'fair' ? 'badge-warning' : 'badge-error'}`}
                                        >
                                            {getStatusConfig(lintingStatus).text}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-error">
                                            <span className="font-medium">{qualityMetrics.apiLintingIssues.major}</span>{' '}
                                            major
                                        </span>
                                        <span className="text-warning">
                                            <span className="font-medium">{qualityMetrics.apiLintingIssues.minor}</span>{' '}
                                            minor
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QualityMetricsFacts;
