import type { FunctionComponent, ReactElement } from 'react';
import type { Platform } from '../../types';

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
    readonly platforms: Array<{ type: string; comment: string }>;
};

const PlatformBadges: FunctionComponent<PlatformBadgesProps> = ({ platforms }): ReactElement => {
    return (
        <div className="flex flex-wrap gap-2">
            {platforms.map((platform, index) => {
                const platformConfig = PLATFORM_BADGES[platform.type];

                if (!platformConfig) {
                    // Fallback for unknown platform types
                    return (
                        <div
                            key={index}
                            className="badge badge-outline tooltip"
                            data-tip={platform.comment}
                        >
                            {platform.type}
                        </div>
                    );
                }

                return (
                    <div
                        key={index}
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
