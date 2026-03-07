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
import { useDataProvider } from '../context/data-provider-context';
import { WorkspaceSwitcher } from '../components/workspace';
import type { WorkspaceInfo } from '../context/data-provider-context';

type DashboardProps = {
    readonly workspace: WorkspaceInfo | null;
};

/**
 * The main dashboard view. Only rendered when a data provider is ready.
 * Extracted from App so that App can safely handle loading / no-workspace states
 * without violating the rules of hooks.
 */
export const Dashboard: FunctionComponent<DashboardProps> = ({ workspace }): ReactElement => {
    const { data: componentGraph, loading, error } = useComponentData();
    const providerState = useDataProvider();
    const provider = providerState.status === 'ready' ? providerState.provider : null;
    const [selectedElement, setSelectedElement] = useState<WithFacts | null>(null);
    const [currentLayout, setCurrentLayout] = useState<string>('default');
    const [panelWidth, setPanelWidth] = useState(470);
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<number>(0);
    const [componentData, setComponentData] = useState<ComponentData[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [edges, setEdges] = useState<EdgeData[]>([]);

    useEffect(() => {
        setComponentData(componentGraph.components);
        setGroups(componentGraph.groups);
        setEdges(componentGraph.edges);
    }, [componentGraph]);

    const handleSelectionChange = useCallback((selection: GraphSelection | null) => {
        setSelectedElement(selection ? selection.element : null);
    }, []);

    const handleLayoutChange = useCallback((layout: string) => {
        setCurrentLayout(layout);
    }, []);

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

    const handleComponentLayoutChange = useCallback(
        (updates: ComponentLayoutUpdate[]) => {
            if (!updates.length || !provider) return;
            const updatedComponents = createUpdatedNodes(updates, 'componentDetails');
            updateStateArray(setComponentData, updatedComponents);
            void provider.batchUpdateComponents(updatedComponents.map((item) => ({ id: item.id, data: item })));
        },
        [createUpdatedNodes, updateStateArray, provider]
    );

    const handleGroupLayoutChange = useCallback(
        (updates: GroupLayoutUpdate[]) => {
            if (!updates.length || !provider) return;
            const updatedGroups = createUpdatedNodes(updates, 'group');
            updateStateArray(setGroups, updatedGroups);
            void provider.batchUpdateGroups(updatedGroups.map((item) => ({ id: item.id, data: item })));
        },
        [createUpdatedNodes, updateStateArray, provider]
    );

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setIsDragging(true);
        dragRef.current = e.clientX;
        e.preventDefault();
    }, []);

    const handleDoubleClick = useCallback(() => {
        setPanelWidth(470);
    }, []);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging) return;
            const deltaX = dragRef.current - e.clientX;
            const newWidth = Math.max(250, Math.min(600, panelWidth + deltaX));
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
            className="min-h-screen bg-base-100 flex flex-col"
        >
            {/* Header — only shown in Electron desktop mode */}
            {workspace !== null && (
                <header className="flex items-center pr-4 h-10 bg-base-200 border-b border-base-300 flex-shrink-0 app-drag-region">
                    {/* pl-20 (80px) reserves space for the macOS traffic light buttons */}
                    <div className="app-no-drag pl-20">
                        <WorkspaceSwitcher workspace={workspace} />
                    </div>
                </header>
            )}

            <div className="flex flex-1 overflow-hidden">
                {/* Graph canvas */}
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
                    style={{ backgroundColor: isDragging ? 'hsl(var(--p) / 0.7)' : undefined }}
                    title="Drag to resize, double-click to reset"
                />

                {/* Component details panel */}
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
