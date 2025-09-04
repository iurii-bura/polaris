import type { FunctionComponent, ReactElement } from 'react';
import type { Platform } from '../../types';

type PlatformsFactsProps = {
    readonly platforms: Platform[];
};

const PlatformsFacts: FunctionComponent<PlatformsFactsProps> = ({ platforms }): ReactElement => {
    return (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
                <h2 className="card-title">Platforms</h2>
                <pre className="text-xs overflow-auto">{JSON.stringify(platforms, null, 2)}</pre>
            </div>
        </div>
    );
};

export default PlatformsFacts;
