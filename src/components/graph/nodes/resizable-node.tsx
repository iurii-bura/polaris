import type { FunctionComponent, ReactElement } from 'react';
import { NodeResizer, Handle, Position, type NodeProps } from '@xyflow/react';

type ResizableNodeData = {
  label?: string;
};

const ResizableGroupNode: FunctionComponent<NodeProps> = ({ data, selected }): ReactElement => {
  const nodeData = data as ResizableNodeData;
  
  return (
    <>
      {/* Add resize functionality */}
      <NodeResizer 
        isVisible={selected}  // Only show when selected
        minWidth={200}
        minHeight={150}
        maxWidth={800}
        maxHeight={600}
        keepAspectRatio={false}
        color="#007bff"
        handleStyle={{ backgroundColor: '#007bff' }}
        lineStyle={{ borderColor: '#007bff' }}
        onResizeStart={(event, data) => console.log('Resize started', data)}
        onResize={(event, data) => console.log('Resizing', data)}
        onResizeEnd={(event, data) => console.log('Resize ended', data)}
      />
      Hello
      {/* Optional: Add handles for connections */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default ResizableGroupNode;