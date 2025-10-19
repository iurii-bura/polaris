import type { FunctionComponent, ReactElement } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useCallback, useState } from 'react';

type JourneyStepNodeData = {
    id: string;
    label: string;
    screenshot?: string;
    stepNumber?: number;
    description?: string;
};

type JourneyStepNodeProps = {
    readonly data: JourneyStepNodeData;
    readonly isConnectable?: boolean;
    readonly targetPosition?: Position;
    readonly sourcePosition?: Position;
};

export const JourneyStepNode: FunctionComponent<JourneyStepNodeProps> = ({
    data,
    isConnectable = true,
    targetPosition = Position.Top,
    sourcePosition = Position.Bottom
}): ReactElement => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = useCallback(() => {
        setImageError(true);
    }, []);

    return (
        <div className="journey-step-node relative bg-white border-2 border-gray-200 rounded-lg shadow-md p-4 min-w-[200px] max-w-[300px]">
            <Handle
                type="target"
                position={targetPosition}
                isConnectable={isConnectable}
                className="!bg-blue-500 !border-2 !border-white !w-3 !h-3"
            />
            
            {/* Step Number Badge */}
            {data.stepNumber && (
                <div className="absolute -top-2 -left-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {data.stepNumber}
                </div>
            )}
            
            {/* Screenshot Section */}
            <div className="mb-3">
                <div className="bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                    {data.screenshot && !imageError ? (
                        <img
                            src={data.screenshot}
                            alt={`Screenshot for ${data.label}`}
                            className="w-full h-32 object-cover object-top"
                            onError={handleImageError}
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-32 flex items-center justify-center text-gray-400 text-sm bg-gray-50">
                            <div className="text-center">
                                <div className="text-2xl mb-2">📷</div>
                                <div className="text-xs">
                                    {data.screenshot ? 'Image unavailable' : 'No screenshot'}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Step Content */}
            <div className="text-center space-y-1">
                <h3 className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">
                    {data.label}
                </h3>
                
                {data.description && (
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                        {data.description}
                    </p>
                )}
                
                <p className="text-xs text-gray-400 font-mono">
                    {data.id}
                </p>
            </div>
            
            <Handle
                type="source"
                position={sourcePosition}
                isConnectable={isConnectable}
                className="!bg-blue-500 !border-2 !border-white !w-3 !h-3"
            />
        </div>
    );
};