import type { FunctionComponent, ReactElement } from 'react';
import { useCallback, useState, useRef, useEffect } from 'react';

import { Graph, ComponentDetails, Loading, LayoutControls, type ComponentData, type ComponentGraph, Group, type ComponentLayoutUpdate, GraphNode } from 'src/components';
import { useComponentData } from '../hooks';
import { ComponentDataService } from 'src/services';

import './app.css';

const App: FunctionComponent = (): ReactElement => {
    const { data: componentGraph, loading, error } = useComponentData();
    const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null);
    const [currentLayout, setCurrentLayout] = useState<string>('default');
    const [panelWidth, setPanelWidth] = useState(470); // Default panel width in pixels
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<number>(0);
    const [componentData, setComponentData] = useState<ComponentData[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);

    // Sync component data when graph data loads
    useEffect(() => {
        setComponentData(componentGraph.components);
        setGroups(componentGraph.groups);
    }, [componentGraph]);

    /**
     * Handles selection changes in the graph, updates which component is selected
     * @param component The component that was selected, or null if nothing is selected
     */
    const handleSelectionChange = useCallback((component: ComponentData | null) => {
        component && setSelectedComponent(component);
    }, []);


    /**
     * Handles the change of the layout (e.g., switching between different layout views)
     * @param layout The new layout identifier
     */
    const handleLayoutChange = useCallback((layout: string) => {
        setCurrentLayout(layout);
    }, []);

    /**
     * Called when a node's position is changed (dragged) in the graph
     * Updates the local state and persists the new position via the service
     * @param updates Array of ComponentLayoutUpdate objects containing the node and optionally its new position or dimensions
     */
    const handleComponentLayoutChange = useCallback(
        (updates: ComponentLayoutUpdate[]) => {
            console.log('Layout updates:', updates.length);
            if (!updates.length) {
                return;
            }

            const updatedItems = updates
                .map((u) => ({
                    ...u.node,
                    layouts: {
                        ...u.node.layouts,
                        [currentLayout]: {
                            ...u.node.layouts[currentLayout],
                            ...(u.position && { x: u.position.x, y: u.position.y }),
                            // ...(u.size && { width: u.size.width, height: u.size.height }),
                            nodeType: u.node.layouts[currentLayout].nodeType || 'componentDetails'
                        }
                    }
                }));


            setComponentData((prevData) => {
                return prevData.map((item) => {
                    const update = updatedItems.find(({ id }) => id === item.id);
                    return update ?? item;
                });
            });

            // void ComponentDataService.getInstance().batchUpdateComponents(
            //     updatedItems.map((item) => ({ id: item.id, data: item }))
            // );
        },
        [currentLayout]
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
                            layout={currentLayout}
                            onSelectionChange={handleSelectionChange}
                            onComponentLayoutChange={handleComponentLayoutChange}
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
                    <ComponentDetails component={selectedComponent} />
                </aside>
            </div>
        </main>
    );
};

export { App };
