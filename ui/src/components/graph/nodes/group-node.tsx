import type { FunctionComponent, ReactElement } from 'react';
import type { NodeProps } from '@xyflow/react';

type GroupNodeData = {
    label: string;
    id: string;
};

const GroupNode: FunctionComponent<NodeProps> = ({ data }): ReactElement => {
    const nodeData = data as GroupNodeData;

    return (
        <div
            className="group-node"
            style={{
                width: '100%',
                height: '100%',
                border: '2px solid #ddd',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 0, 255, 0.1)',
                position: 'relative',
                padding: '8px'
            }}
        >
            {/* Group Label */}
            <div
                style={{
                    position: 'absolute',
                    top: '4px',
                    left: '8px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#666',
                    backgroundColor: 'white',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                }}
            >
                {nodeData.label}
            </div>
        </div>
    );
};

export default GroupNode;
