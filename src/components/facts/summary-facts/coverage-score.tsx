import type { FunctionComponent, ReactElement } from 'react';
import { getCoverageLevel } from './constants';
import { FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi';

type CoverageScoreProps = {
    readonly percentage: number;
};

const CoverageScore: FunctionComponent<CoverageScoreProps> = ({ percentage }): ReactElement => {
    const level = getCoverageLevel(percentage);

    const getIcon = () => {
        if (percentage >= 85) return <FiCheckCircle className="w-5 h-5" />;
        if (percentage >= 70) return <FiAlertTriangle className="w-5 h-5" />;
        return <FiXCircle className="w-5 h-5" />;
    };

    return (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${level.className}`}>
            {getIcon()}
            <span className="font-semibold text-sm">{percentage}%</span>
        </div>
    );
};

export default CoverageScore;
