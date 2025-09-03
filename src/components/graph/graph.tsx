import type { FunctionComponent, ReactElement } from 'react';
import { useState, useCallback, useMemo, useEffect } from 'react';

import {
    ReactFlow,
    applyNodeChanges,
    type Node,
    type NodeChange,
    Background,
    BackgroundVariant,
    NodePositionChange,
    type Edge
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import type { ComponentData } from '../types';
import { ComponentDetailsNode, GroupNode, ResizableGroupNode } from './nodes';

// Type predicate function for NodePositionChange
const isNodePositionChange = (change: NodeChange): change is NodePositionChange => {
    return change.type === 'position' && !change.dragging;
};

type GraphProps = {
    readonly name: string;
    readonly graph: ComponentData[];
    readonly layout?: string;
    readonly onSelectionChange?: (component: ComponentData | null) => void;
    readonly onLayoutChange?: (updates: Array<{ node: ComponentData; position: { x: number; y: number } }>) => void;
};

const groups = [
    {
        id: 'GROUP-A',
        data: { id: 'GROUP-A', label: 'Group A' },
        position: { x: 100, y: 100 },
        style: {
            backgroundColor: 'rgba(255, 0, 255, 0.2)',
            zIndex: -10,
            height: 150,
            width: 270
        },
        type: 'group'
    }
];

const mapToNodes = (data: ComponentData[], layout: string = 'default'): Node[] => {
    console.log('Mapping to nodes...');
    const stepX = 200;
    const stepY = 100;
    const nodes = data.map((item, index) => {
        // Check if layout-specific information exists
        const layoutInfo = layout && item.layouts && item.layouts[layout];
        const numColumns = 5;

        // Use layout-specific position and node type if available, otherwise use grid-based defaults
        const position = layoutInfo
            ? { x: layoutInfo.x, y: layoutInfo.y }
            : { x: (index % numColumns) * stepX, y: Math.floor(index / numColumns) * stepY };

        const nodeType = layoutInfo ? layoutInfo.nodeType : 'componentDetails';

        return {
            id: item.id,
            type: nodeType,
            position,
            data: {
                id: item.id,
                label: item.label
            }
        };
    });

    return [...groups, ...nodes];
};

const Graph: FunctionComponent<GraphProps> = ({
    name,
    graph,
    layout,
    onSelectionChange: onSelectionChangeCallback,
    onLayoutChange
}): ReactElement => {
    // Custom node types
    const nodeTypes = useMemo(
        () => ({
            componentDetails: ComponentDetailsNode,
            group: ResizableGroupNode
        }),
        []
    );

    const [nodes, setNodes] = useState<Node[]>([]);

    useEffect(() => {
        console.log('Graph or layout changed, updating nodes...', graph.length, layout);
        setNodes(mapToNodes(graph, layout));
    }, [graph, layout]);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            const layoutUpdates = changes
                .filter(isNodePositionChange)
                .map((move) => {
                    const graphNode = graph.find(({ id }) => id === move.id);
                    if (!graphNode) {
                        return undefined;
                    }
                    return {
                        node: graphNode,
                        position: move.position as { x: number; y: number }
                    };
                })
                .filter((update): update is { node: ComponentData; position: { x: number; y: number } } => !!update);

            layoutUpdates.length && onLayoutChange?.(layoutUpdates);

            setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));
        },
        [graph, onLayoutChange]
    );

    const onSelectionChange = useCallback(
        (selection: { nodes: Node[]; edges: Edge[] }) => {
            if (!onSelectionChangeCallback) {
                return;
            }

            if (selection.nodes.length > 0) {
                const selectedNode = graph.find(({ id }) => id === selection.nodes[0].id);
                onSelectionChangeCallback(selectedNode || null);
            } else {
                onSelectionChangeCallback(null);
            }
        },
        [onSelectionChangeCallback, graph]
    );

    return (
        <ReactFlow
            nodes={nodes}
            edges={[]}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            proOptions={{ hideAttribution: true }}
            defaultViewport={{ x: 200, y: 300, zoom: 1.5 }}
            onSelectionChange={onSelectionChange}
        >
            <Background
                color="#ccc"
                variant={BackgroundVariant.Dots}
            />
        </ReactFlow>
    );
};

export default Graph;
