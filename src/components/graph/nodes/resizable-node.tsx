import type { FunctionComponent, ReactElement } from 'react';
import { NodeResizer, Handle, Position, type NodeProps } from '@xyflow/react';

const ResizableGroupNode: FunctionComponent<NodeProps> = ({ selected, data }): ReactElement => {
    return (
        <>
            {/* Add resize functionality */}
            <NodeResizer
                isVisible={selected} // Only show when selected
                minWidth={200}
                minHeight={150}
                maxWidth={800}
                maxHeight={600}
                keepAspectRatio={false}
                color="#007bff"
                handleStyle={{ backgroundColor: '#007bff' }}
                lineStyle={{ borderColor: '#007bff' }}
            />
            {data.label}
            {/* Optional: Add handles for connections */}
            <Handle
                type="target"
                position={Position.Top}
            />
            <Handle
                type="source"
                position={Position.Bottom}
            />
        </>
    );
};

export default ResizableGroupNode;
