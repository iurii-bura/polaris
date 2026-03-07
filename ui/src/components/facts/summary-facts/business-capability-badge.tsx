import type { FunctionComponent, ReactElement } from 'react';
import { BUSINESS_CAPABILITY_COLORS } from './constants';

type BusinessCapabilityBadgeProps = {
    readonly capability: string;
};

const BusinessCapabilityBadge: FunctionComponent<BusinessCapabilityBadgeProps> = ({ capability }): ReactElement => {
    // Disable eslint rule for this line only as we do want to check for null/undefined here
    // To have a proper solution, we need to rework types.
    const colorClass =
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        BUSINESS_CAPABILITY_COLORS[capability as keyof typeof BUSINESS_CAPABILITY_COLORS] ||
        'bg-gray-100 text-gray-800 border-gray-200';

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
            {capability.replace(/-/g, ' ')}
        </span>
    );
};

export default BusinessCapabilityBadge;
