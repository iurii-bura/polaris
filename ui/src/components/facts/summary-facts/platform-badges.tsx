import type { FunctionComponent, ReactElement } from 'react';

// Platform badge styling mapping with brand-appropriate colors
const PLATFORM_BADGES: Record<string, { className: string; label: string }> = {
    mainframe: {
        className: 'badge bg-red-600 text-white border-red-600',
        label: 'Mainframe'
    },
    onprem: {
        className: 'badge badge-secondary',
        label: 'On-Premises'
    },
    azure: {
        className: 'badge text-white border-0',
        label: 'Azure'
    }
};

type PlatformBadgesProps = {
    readonly platforms: { type: string; comment: string }[];
};

const PlatformBadges: FunctionComponent<PlatformBadgesProps> = ({ platforms }): ReactElement => {
    return (
        <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => {
                const platformConfig = PLATFORM_BADGES[platform.type];

                // Disable eslint rule for this line only as we do want to check for null/undefined here
                // To have a proper solution, we need to rework types.
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (!platformConfig) {
                    // Fallback for unknown platform types
                    return (
                        <div
                            key={platform.type}
                            className="badge badge-outline tooltip"
                            data-tip={platform.comment}
                        >
                            {platform.type}
                        </div>
                    );
                }

                return (
                    <div
                        key={platform.type}
                        className={`${platformConfig.className} tooltip`}
                        data-tip={platformConfig.label}
                        style={platform.type === 'azure' ? { backgroundColor: '#0078d4' } : undefined}
                    >
                        {platformConfig.label}
                    </div>
                );
            })}
        </div>
    );
};

export default PlatformBadges;
