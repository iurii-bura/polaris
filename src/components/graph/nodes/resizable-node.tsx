import type { FunctionComponent, ReactElement } from 'react';
import { NodeResizer, Handle, Position, type NodeProps } from '@xyflow/react';

import { useCallback } from 'react';

const ResizableGroupNode: FunctionComponent<NodeProps> = ({ selected }): ReactElement => {
    const handleResizeStart = useCallback((event: MouseEvent, data: unknown) => {
        console.log('Resize started', data);
    }, []);

    const handleResize = useCallback((event: MouseEvent, data: unknown) => {
        console.log('Resizing', data);
    }, []);

    const handleResizeEnd = useCallback((event: MouseEvent, data: unknown) => {
        console.log('Resize ended', data);
    }, []);

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
                onResizeStart={handleResizeStart}
                onResize={handleResize}
                onResizeEnd={handleResizeEnd}
            />
            Hello
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
