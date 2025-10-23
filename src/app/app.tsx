import type { FunctionComponent, ReactElement } from 'react';
import { useCallback, useState, useRef, useEffect } from 'react';

import {
    Graph,
    ComponentDetails,
    Loading,
    LayoutControls,
    type ComponentData,
    type Group,
    type EdgeData,
    type ComponentLayoutUpdate,
    type GraphNode,
    type GroupLayoutUpdate,
    type GraphSelection,
    type WithFacts
} from 'src/components';
import { useComponentData } from '../hooks';
import { ComponentDataService } from 'src/services';

import './app.css';

const App: FunctionComponent = (): ReactElement => {
    const { data: componentGraph, loading, error } = useComponentData();
    const [selectedElement, setSelectedElement] = useState<WithFacts | null>(null);
    const [currentLayout, setCurrentLayout] = useState<string>('default');
    const [panelWidth, setPanelWidth] = useState(470); // Default panel width in pixels
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<number>(0);
    const [componentData, setComponentData] = useState<ComponentData[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [edges, setEdges] = useState<EdgeData[]>([]);

    // Sync component data when graph data loads
    useEffect(() => {
        setComponentData(componentGraph.components);
        setGroups(componentGraph.groups);
        setEdges(componentGraph.edges);
    }, [componentGraph]);

    /**
     * Handles selection changes in the graph, updates which element is selected
     * @param selection The selection object containing type and element, or null if nothing is selected
     */
    const handleSelectionChange = useCallback((selection: GraphSelection | null) => {
        if (selection) {
            setSelectedElement(selection.element);
        } else {
            setSelectedElement(null);
        }
    }, []);

    /**
     * Handles the change of the layout (e.g., switching between different layout views)
     * @param layout The new layout identifier
     */
    const handleLayoutChange = useCallback((layout: string) => {
        setCurrentLayout(layout);
    }, []);

    /**
     * Generic helper function to update node layouts
     * @param updates Array of layout updates for any node type
     * @param defaultNodeType Default node type to use if not specified
     * @returns Array of updated nodes with modified layouts
     */
    const createUpdatedNodes = useCallback(
        <T extends GraphNode>(
            updates: { node: T; position?: { x: number; y: number }; size?: { width: number; height: number } }[],
            defaultNodeType: string
        ): T[] => {
            return updates.map((u) => ({
                ...u.node,
                layouts: {
                    ...u.node.layouts,
                    [currentLayout]: {
                        ...u.node.layouts[currentLayout],
                        ...(u.position && { x: u.position.x, y: u.position.y }),
                        ...(u.size && { width: u.size.width, height: u.size.height }),
                        nodeType: u.node.layouts[currentLayout]?.nodeType ?? defaultNodeType
                    }
                }
            }));
        },
        [currentLayout]
    );

    /**
     * Generic helper function to update state array
     * @param setState State setter function
     * @param updatedItems Array of updated items
     */
    const updateStateArray = useCallback(
        <T extends { id: string }>(setState: React.Dispatch<React.SetStateAction<T[]>>, updatedItems: T[]) => {
            setState((prevData) => {
                return prevData.map((item) => {
                    const update = updatedItems.find(({ id }) => id === item.id);
                    return update ?? item;
                });
            });
        },
        []
    );

    /**
     * Handles component layout changes
     * Updates the local state and persists changes via the component service
     * @param updates Array of component layout updates
     */
    const handleComponentLayoutChange = useCallback(
        (updates: ComponentLayoutUpdate[]) => {
            if (!updates.length) {
                return;
            }

            const updatedComponents = createUpdatedNodes(updates, 'componentDetails');
            updateStateArray(setComponentData, updatedComponents);

            void ComponentDataService.getInstance().batchUpdateComponents(
                updatedComponents.map((item) => ({ id: item.id, data: item }))
            );
        },
        [createUpdatedNodes, updateStateArray]
    );

    /**
     * Handles group layout changes
     * Updates the local state and persists changes via the group service
     * @param updates Array of group layout updates
     */
    const handleGroupLayoutChange = useCallback(
        (updates: GroupLayoutUpdate[]) => {
            if (!updates.length) {
                return;
            }

            const updatedGroups = createUpdatedNodes(updates, 'group');
            updateStateArray(setGroups, updatedGroups);

            void ComponentDataService.getInstance().batchUpdateGroups(
                updatedGroups.map((item) => ({ id: item.id, data: item }))
            );
        },
        [createUpdatedNodes, updateStateArray]
    );

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setIsDragging(true);
        dragRef.current = e.clientX;
        e.preventDefault();
    }, []);

    const handleDoubleClick = useCallback(() => {
        setPanelWidth(470); // Reset to default width
    }, []);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging) return;

            const deltaX = dragRef.current - e.clientX;
            const newWidth = Math.max(250, Math.min(600, panelWidth + deltaX)); // Min 250px, max 600px

            setPanelWidth(newWidth);
            dragRef.current = e.clientX;
        },
        [isDragging, panelWidth]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    if (loading) {
        return (
            <main
                role="main"
                className="min-h-screen bg-base-100 flex items-center justify-center"
            >
                <Loading text="Loading components..." />
            </main>
        );
    }

    if (error) {
        return (
            <main
                role="main"
                className="min-h-screen bg-base-100 flex items-center justify-center"
            >
                <div className="alert alert-error max-w-md">
                    <span>Error loading components: {error}</span>
                </div>
            </main>
        );
    }

    return (
        <main
            role="main"
            className="min-h-screen bg-base-100"
        >
            <div className="flex h-screen">
                {/* Middle: Graph section */}
                <section className="flex-1 p-4 overflow-hidden relative">
                    <div style={{ width: '100%', height: '100%' }}>
                        <Graph
                            components={componentData}
                            groups={groups}
                            edges={edges}
                            layout={currentLayout}
                            onSelectionChange={handleSelectionChange}
                            onComponentLayoutChange={handleComponentLayoutChange}
                            onGroupLayoutChange={handleGroupLayoutChange}
                        />
                    </div>

                    {/* Layout Controls Widget */}
                    <LayoutControls
                        currentLayout={currentLayout}
                        onLayoutChange={handleLayoutChange}
                    />
                </section>

                {/* Resize handle */}
                <div
                    className="w-1 bg-base-300 hover:bg-primary/50 cursor-col-resize flex-shrink-0 transition-colors duration-200 resize-handle"
                    onMouseDown={handleMouseDown}
                    onDoubleClick={handleDoubleClick}
                    style={{
                        backgroundColor: isDragging ? 'hsl(var(--p) / 0.7)' : undefined
                    }}
                    title="Drag to resize, double-click to reset"
                />

                {/* Right hand side: Component Details section */}
                <aside
                    className="bg-base-200 p-4 border-l border-base-300 overflow-hidden flex-shrink-0"
                    style={{ width: String(panelWidth) + 'px' }}
                >
                    <ComponentDetails component={selectedElement} />
                </aside>
            </div>
        </main>
    );
};

export { App };
