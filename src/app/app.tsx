import type { FunctionComponent, ReactElement } from 'react';
import { useCallback, useState, useRef, useEffect } from 'react';

import { Graph, ComponentDetails, Loading, LayoutControls, type ComponentData } from 'src/components';
import { useComponentData } from '../hooks';
import { ComponentDataService } from 'src/services';

import './app.css';

const App: FunctionComponent = (): ReactElement => {
    const { data: graph, loading, error } = useComponentData();
    const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null);
    const [currentLayout, setCurrentLayout] = useState<string>('default');
    const [panelWidth, setPanelWidth] = useState(470); // Default panel width in pixels
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<number>(0);
    const [componentData, setComponentData] = useState<ComponentData[]>([]);

    // Sync component data when graph data loads
    useEffect(() => {
        if (graph) {
            setComponentData(graph);
        }
    }, [graph]);

    const handleSelectionChange = useCallback((component: ComponentData | null) => {
        component && setSelectedComponent(component);
    }, []);

    const handleLayoutChange = useCallback((layout: string) => {
        console.log(`Switching to layout: ${layout}`);
        setCurrentLayout(layout);
    }, []);

    const handleNodeLayoutChange = useCallback(
        (updates: { node: ComponentData; position: { x: number; y: number } }[]) => {
            if (!updates.length) {
                return;
            }

            const updatedItems = updates.map((u) => ({
                ...u.node,
                layouts: {
                    ...u.node.layouts,
                    [currentLayout]: {
                        ...u.node.layouts[currentLayout],
                        x: u.position.x,
                        y: u.position.y,
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

            // console.log(updatedItems);
            ComponentDataService.getInstance().batchUpdateComponents(
                updatedItems.map((item) => ({ id: item.id, data: item }))
            );
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
                            graph={componentData.length > 0 ? componentData : graph}
                            layout={currentLayout}
                            onSelectionChange={handleSelectionChange}
                            onLayoutChange={handleNodeLayoutChange}
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
