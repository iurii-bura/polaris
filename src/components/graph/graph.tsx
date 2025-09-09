import type { FunctionComponent, ReactElement } from 'react';
import { useState, useCallback, useMemo, useEffect } from 'react';

import type { NodeDimensionChange, NodePositionChange } from '@xyflow/react';
import {
    ReactFlow,
    applyNodeChanges,
    type Node,
    type NodeChange,
    Background,
    BackgroundVariant,
    type Edge
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import type { ComponentData, Group, ComponentLayoutUpdate, GroupLayoutUpdate } from '../types';
import { ComponentDetailsNode, ResizableGroupNode } from './nodes';

// Type guard for completed position changes
const isCompletedPositionChange = (change: NodeChange): change is NodePositionChange => {
    return change.type === 'position' && !change.dragging;
};

// Type guard for completed dimension changes
const isCompletedDimensionChange = (change: NodeChange): change is NodeDimensionChange => {
    return change.type === 'dimensions' && !change.resizing;
};

// Combined type guard for any completed change
const isCompletedChange = (change: NodeChange): change is NodePositionChange | NodeDimensionChange => {
    return isCompletedPositionChange(change) || isCompletedDimensionChange(change);
};

type GraphProps = {
    readonly components: ComponentData[];
    readonly groups: Group[];
    readonly layout?: string;
    readonly onSelectionChange?: (component: ComponentData | null) => void;
    readonly onComponentLayoutChange?: (updates: ComponentLayoutUpdate[]) => void;
    readonly onGroupLayoutChange?: (updates: GroupLayoutUpdate[]) => void;
};

/**
 * Maps from the domain data structure to Graph library data structure,
 * joins the Groups and Nodes in one array as requried by React Flow
 */
const mapToNodes = (components: ComponentData[], groups: Group[], layout = 'default'): Node[] => {
    const stepX = 200;
    const stepY = 100;
    const nodes = components.map((item, index) => {
        // Check if layout-specific information exists
        const layoutInfo = layout && item.layouts[layout];
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

    const groupNodes = groups
        .filter((group) => group.layouts[layout])
        .map((group) => {
            const { x, y, width, height } = group.layouts[layout];
            return {
                id: group.id,
                data: {
                    id: group.id,
                    label: group.label
                },
                position: { x, y },
                style: {
                    backgroundColor: 'rgba(255, 0, 255, 0.2)',
                    zIndex: -10,
                    width,
                    height
                },
                type: 'group'
            };
        });

    return [...nodes, ...groupNodes];
};

function mapChangesToLayoutUpdates<T extends { id: string }>(
    changes: (NodePositionChange | NodeDimensionChange)[],
    nodes: T[]
): Array<{
    node: T;
    position?: { x: number; y: number };
    size?: { width: number; height: number };
}> {
    return changes
        .map((change) => {
            const node = nodes.find(({ id }) => id === change.id);

            if (!node) {
                return undefined;
            }

            return {
                node,
                position: change.type === 'position' ? change.position : undefined,
                size: change.type === 'dimensions' ? change.dimensions : undefined
            };
        })
        .filter((update): update is NonNullable<typeof update> => !!update);
}

const Graph: FunctionComponent<GraphProps> = ({
    components,
    groups,
    layout,
    onSelectionChange: onSelectionChangeCallback,
    onComponentLayoutChange,
    onGroupLayoutChange
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
        setNodes(mapToNodes(components, groups, layout));
    }, [components, layout]);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            const completedChanges = changes.filter(isCompletedPositionChange);
            const componentUpdates = mapChangesToLayoutUpdates(completedChanges, components);
            const groupUpdates = mapChangesToLayoutUpdates(completedChanges, groups);

            componentUpdates.length && onComponentLayoutChange?.(componentUpdates);
            groupUpdates.length && onGroupLayoutChange?.(groupUpdates);

            setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));
        },
        [components, groups, onComponentLayoutChange, onGroupLayoutChange]
    );

    const onSelectionChange = useCallback(
        (selection: { nodes: Node[]; edges: Edge[] }) => {
            if (!onSelectionChangeCallback) {
                return;
            }

            if (selection.nodes.length > 0) {
                const selectedNode = components.find(({ id }) => id === selection.nodes[0].id);
                onSelectionChangeCallback(selectedNode ?? null);
            } else {
                onSelectionChangeCallback(null);
            }
        },
        [onSelectionChangeCallback, components]
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
