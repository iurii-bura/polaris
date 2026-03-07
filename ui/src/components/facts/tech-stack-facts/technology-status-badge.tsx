import type { FunctionComponent, ReactElement } from 'react';
import type { TechnologyStatus } from './tech-whitelist';

type TechnologyStatusBadgeProps = {
    readonly status: TechnologyStatus;
    readonly size?: 'sm' | 'md';
};

const TechnologyStatusBadge: FunctionComponent<TechnologyStatusBadgeProps> = ({
    status,
    size = 'sm'
}): ReactElement => {
    const getStatusConfig = (status: TechnologyStatus) => {
        switch (status) {
            case 'normal':
                return {
                    className: 'badge-success',
                    text: 'Supported',
                    icon: '✓'
                };
            case 'phased-out':
                return {
                    className: 'badge-warning',
                    text: 'Phased Out',
                    icon: '⚠'
                };
            case 'deprecated':
                return {
                    className: 'badge-error',
                    text: 'Deprecated',
                    icon: '✕'
                };
            case 'unknown':
                return {
                    className: 'badge-neutral',
                    text: 'Unknown',
                    icon: '?'
                };
        }
    };

    const config = getStatusConfig(status);
    const sizeClass = size === 'sm' ? 'badge-sm' : '';

    return (
        <div className={`badge ${config.className} ${sizeClass} gap-1`}>
            <span className="text-xs">{config.icon}</span>
            <span>{config.text}</span>
        </div>
    );
};

export default TechnologyStatusBadge;
