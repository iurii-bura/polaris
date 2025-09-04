import type { FunctionComponent, ReactElement } from 'react';

// Platform badge styling mapping - easy to modify colors here
const PLATFORM_BADGES = {
    mainframe: {
        className: 'badge-primary',
        label: 'Mainframe'
    },
    onprem: {
        className: 'badge-secondary',
        label: 'On-Premises'
    },
    azure: {
        className: 'badge-info',
        label: 'Azure'
    }
} as const;

type PlatformBadgesProps = {
    readonly platforms: { type: string; comment: string }[];
};

const PlatformBadges: FunctionComponent<PlatformBadgesProps> = ({ platforms }): ReactElement => {
    return (
        <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => {
                const platformConfig = PLATFORM_BADGES[platform.type as keyof typeof PLATFORM_BADGES];

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
                        className={`badge ${platformConfig.className} tooltip`}
                        data-tip={platformConfig.label}
                    >
                        {platformConfig.label}
                    </div>
                );
            })}
        </div>
    );
};

export default PlatformBadges;
