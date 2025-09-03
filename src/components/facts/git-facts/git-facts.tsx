import type { FunctionComponent, ReactElement } from 'react';
import { useState, useCallback, useMemo } from 'react';
import {
    FiGitBranch,
    FiCheckCircle,
    FiAlertTriangle,
    FiMinus,
    FiChevronDown,
    FiChevronUp,
    FiUser,
    FiCalendar,
    FiFolder
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { GitInfo } from '../../types';
import { generateRepositoryColors } from '../../../constants';
import CustomTooltip from './custom-tooltip';

type GitFactsProps = {
    readonly git: GitInfo;
};

type GitStatus = 'active' | 'supported' | 'inactive';

const GitFacts: FunctionComponent<GitFactsProps> = ({ git }): ReactElement => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = useCallback(() => {
        setIsExpanded((prev) => !prev);
    }, []);

    // Calculate repository status based on commit activity across all repositories
    const getRepositoryStatus = (): GitStatus => {
        const allCommits = git.repositories.flatMap((repo) => repo.monthlyCommits.data);
        const totalCommits = allCommits.reduce((sum, month) => sum + month.commits, 0);

        // Check last 3 months for active status across all repositories
        const lastThreeMonthsCommits = git.repositories.flatMap((repo) => repo.monthlyCommits.data.slice(-3));
        const recentCommits = lastThreeMonthsCommits.reduce((sum, month) => sum + month.commits, 0);

        if (recentCommits > 0) return 'active';
        if (totalCommits >= 10) return 'supported'; // At least 10 commits in the year
        return 'inactive';
    };

    const getStatusConfig = (status: GitStatus) => {
        switch (status) {
            case 'active':
                return {
                    className: 'bg-success/10 text-success border-success/20',
                    text: 'Active',
                    icon: FiCheckCircle
                };
            case 'supported':
                return {
                    className: 'bg-warning/10 text-warning border-warning/20',
                    text: 'Supported',
                    icon: FiAlertTriangle
                };
            case 'inactive':
                return {
                    className: 'bg-neutral/10 text-neutral-content border-neutral/20',
                    text: 'Inactive',
                    icon: FiMinus
                };
        }
    };

    const repositoryStatus = getRepositoryStatus();
    const statusConfig = getStatusConfig(repositoryStatus);

    // Calculate total commits across all repositories
    const totalCommits = git.repositories.reduce(
        (sum, repo) => sum + repo.monthlyCommits.data.reduce((repoSum, month) => repoSum + month.commits, 0),
        0
    );

    // Prepare data for stacked bar chart
    const chartData = useMemo(() => {
        if (git.repositories.length === 0) return [];

        // Get all months from the first repository (assuming all repos have same months)
        const months = git.repositories[0]?.monthlyCommits.data.map((m) => m.month) || [];

        return months.map((month) => {
            const dataPoint: Record<string, any> = { month: month.split('-')[1] }; // Show only month number

            // Add data for each repository
            git.repositories.forEach((repo) => {
                const monthData = repo.monthlyCommits.data.find((m) => m.month === month);
                const repoName = repo.url.split('/').pop() ?? 'unknown';
                dataPoint[repoName] = monthData?.commits ?? 0;
            });

            return dataPoint;
        });
    }, [git.repositories]);

    // Generate colors for each repository using harmonious palette
    const repositoryColors = useMemo(() => {
        return generateRepositoryColors(git.repositories);
    }, [git.repositories]);

    const handleFullReportClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
    }, []);

    const handleAvatarError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        target.nextElementSibling?.classList.remove('hidden');
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
                        <FiGitBranch className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold">Git Activity</h2>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Repository Status - Always Visible */}
                        <div className="flex items-center gap-2">
                            <statusConfig.icon
                                className={`w-4 h-4 ${statusConfig.className.split(' ').find((c) => c.startsWith('text-'))}`}
                            />
                            <span
                                className={`text-sm font-medium ${statusConfig.className.split(' ').find((c) => c.startsWith('text-'))}`}
                            >
                                {statusConfig.text}
                            </span>
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

                {/* Expandable Content */}
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="mt-4">
                        {/* Activity Summary */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className="flex flex-col items-center p-3 bg-base-200/50 rounded-lg">
                                <div className="font-bold text-xl text-base-content">{git.repositories.length}</div>
                                <div className="text-xs text-base-content/60">Repositories</div>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-base-200/50 rounded-lg">
                                <div className="font-bold text-xl text-base-content">{totalCommits}</div>
                                <div className="text-xs text-base-content/60">Total Commits</div>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-base-200/50 rounded-lg">
                                <div className="font-bold text-xl text-base-content">{git.topContributors.length}</div>
                                <div className="text-xs text-base-content/60">Contributors</div>
                            </div>
                        </div>

                        {/* Commit Activity Chart */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-base-content/60">Monthly Commits</h3>
                                <a
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:text-primary-focus underline"
                                    onClick={handleFullReportClick}
                                >
                                    Full report
                                </a>
                            </div>

                            <div className="bg-base-200/50 rounded-lg">
                                <div className="h-64 w-full p-2">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={chartData}
                                            margin={{
                                                top: 10,
                                                right: 20,
                                                left: 0,
                                                bottom: 5
                                            }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="currentColor"
                                                opacity={0.1}
                                            />
                                            <XAxis
                                                dataKey="month"
                                                tick={{ fontSize: 12, fill: 'currentColor' }}
                                                axisLine={{ stroke: 'currentColor', opacity: 0.2 }}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12, fill: 'currentColor' }}
                                                axisLine={{ stroke: 'currentColor', opacity: 0.2 }}
                                                width={40}
                                                tickFormatter={(value) => value.toString()}
                                            />
                                            <Tooltip
                                                content={<CustomTooltip />}
                                                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                                            />
                                            {git.repositories.map((repo) => {
                                                const repoName = repo.url.split('/').pop() ?? 'unknown';
                                                return (
                                                    <Bar
                                                        key={repoName}
                                                        dataKey={repoName}
                                                        stackId="commits"
                                                        fill={repositoryColors[repoName]}
                                                        name={repoName}
                                                    />
                                                );
                                            })}
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Repositories */}
                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-base-content/60 mb-3">Repositories</h3>
                            <div className="space-y-3">
                                {git.repositories.map((repo) => {
                                    const repoName = repo.url.split('/').pop() ?? 'unknown';
                                    const repoCommits = repo.monthlyCommits.data.reduce(
                                        (sum, month) => sum + month.commits,
                                        0
                                    );

                                    return (
                                        <div
                                            key={repoName}
                                            className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg"
                                        >
                                            <FiFolder
                                                className="w-5 h-5 flex-shrink-0"
                                                style={{ color: repositoryColors[repoName] }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-base-content">
                                                    <a
                                                        href={repo.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:text-primary transition-colors"
                                                    >
                                                        {repoName}
                                                    </a>
                                                </div>
                                                <div className="text-xs text-base-content/60">
                                                    {repoCommits} commits in last 12 months
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Top Contributors */}
                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-base-content/60 mb-3">Top Contributors</h3>
                            {git.topContributors.length > 0 ? (
                                <div className="space-y-3">
                                    {git.topContributors.map((contributor) => (
                                        <div
                                            key={contributor.name}
                                            className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg"
                                        >
                                            <img
                                                src={contributor.avatarUrl}
                                                alt={`${contributor.name} avatar`}
                                                className="w-8 h-8 rounded-full bg-base-300"
                                                onError={handleAvatarError}
                                            />
                                            <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center text-xs font-medium hidden">
                                                <FiUser className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-base-content">{contributor.name}</div>
                                                <div className="text-xs text-base-content/60 truncate">
                                                    {contributor.email}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-base-content/60">
                                    <FiUser className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No contributors data available</p>
                                </div>
                            )}
                        </div>

                        {/* Last Commit Info */}
                        <div className="pt-4 border-t border-base-300">
                            <div className="flex items-center gap-2 text-sm text-base-content/60">
                                <FiCalendar className="w-4 h-4" />
                                <span>Last commit: {git.lastCommit}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GitFacts;
