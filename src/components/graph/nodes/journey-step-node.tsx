import type { FunctionComponent, ReactElement, MouseEvent } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useCallback, useState } from 'react';

type JourneyStepNodeData = {
    id: string;
    label: string;
    screenshot?: string;
    stepNumber?: number;
    description?: string;
    onClick?: (stepData: JourneyStepNodeData) => void;
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
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = useCallback((event: MouseEvent) => {
        event.stopPropagation();
        if (data.onClick) {
            data.onClick(data);
        }
    }, [data]);

    const handleImageError = useCallback(() => {
        setImageError(true);
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    return (
        <div 
            className={`journey-step-node relative bg-white border-2 rounded-lg shadow-md transition-all duration-200 p-4 min-w-[200px] max-w-[300px] cursor-pointer ${
                isHovered 
                    ? 'border-blue-400 shadow-lg transform scale-105' 
                    : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label={`Journey step: ${data.label}`}
        >
            <Handle
                type="target"
                position={targetPosition}
                isConnectable={isConnectable}
                className="!bg-blue-500 !border-2 !border-white !w-3 !h-3 hover:!bg-blue-600"
            />
            
            {/* Step Number Badge */}
            {data.stepNumber && (
                <div className={`absolute -top-2 -left-2 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold transition-colors duration-200 ${
                    isHovered ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                }`}>
                    {data.stepNumber}
                </div>
            )}
            
            {/* Screenshot Section */}
            <div className="mb-3">
                <div className="bg-gray-100 rounded-md overflow-hidden border border-gray-200 relative">
                    {data.screenshot && !imageError ? (
                        <img
                            src={data.screenshot}
                            alt={`Screenshot for ${data.label}`}
                            className="w-full h-32 object-cover object-top transition-transform duration-200 hover:scale-110"
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
                    
                    {/* Overlay for better text visibility on hover */}
                    {isHovered && data.screenshot && !imageError && (
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                            <span className="text-white text-xs font-medium px-2 py-1 bg-black bg-opacity-50 rounded">
                                Click to view
                            </span>
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
                className="!bg-blue-500 !border-2 !border-white !w-3 !h-3 hover:!bg-blue-600"
            />
        </div>
    );
};