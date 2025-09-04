import type { FunctionComponent, ReactElement } from 'react';
import { Handle, Position } from '@xyflow/react';

type ComponentDetailsNodeProps = {
    readonly data: {
        id: string;
        label: string;
    };
    readonly isConnectable?: boolean;
    readonly targetPosition?: Position;
    readonly sourcePosition?: Position;
};

export const ComponentDetailsNode: FunctionComponent<ComponentDetailsNodeProps> = ({
    data,
    isConnectable = true,
    targetPosition = Position.Top,
    sourcePosition = Position.Bottom
}): ReactElement => {
    return (
        <>
            <Handle
                type="target"
                position={targetPosition}
                isConnectable={isConnectable}
            />
            <p className="label">{data.label}</p>
            <p className="identifier">{data.id}</p>
            <Handle
                type="source"
                position={sourcePosition}
                isConnectable={isConnectable}
            />
        </>
    );
};
