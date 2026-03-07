import { type FunctionComponent, type ReactElement, useState, useCallback, useEffect } from 'react';
import type { WorkspaceInfo } from '../../context/data-provider-context';

/**
 * Shown in Electron mode when no workspace is currently open.
 * Lets the user create a new workspace or open an existing one.
 */
export const WorkspaceSplash: FunctionComponent = (): ReactElement => {
    const [newName, setNewName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [recentWorkspaces, setRecentWorkspaces] = useState<WorkspaceInfo[]>([]);

    useEffect(() => {
        const api = window.electronAPI;
        if (!api) return;

        void api.getRecentWorkspaces().then(setRecentWorkspaces);

        // The native File menu can also trigger "New Workspace" — mirror it here
        const unsubscribe = api.onMenuNewWorkspace(() => {
            setIsCreating(true);
        });
        return unsubscribe;
    }, []);

    const handleCreate = useCallback(async () => {
        const api = window.electronAPI;
        if (!api) return;
        const name = newName.trim();
        if (!name) return;
        await api.newWorkspace(name);
    }, [newName]);

    const handleOpen = useCallback(async () => {
        const api = window.electronAPI;
        if (!api) return;
        await api.openWorkspace();
    }, []);

    const handleOpenRecent = useCallback(async (filePath: string) => {
        const api = window.electronAPI;
        if (!api) return;
        await api.openWorkspace(filePath);
    }, []);

    return (
        <main
            role="main"
            className="min-h-screen bg-base-100 flex flex-col"
        >
            {/* Invisible drag strip — allows dragging the window on the splash screen.
                pl-20 clears the macOS traffic light buttons (hiddenInset titleBarStyle). */}
            <div className="h-10 flex-shrink-0 app-drag-region pl-20" />
            <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-8 max-w-lg w-full px-6">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-base-content mb-2">Polaris</h1>
                    <p className="text-base-content/60">Architecture visualization dashboard</p>
                </div>

                {isCreating ? (
                    <div className="card bg-base-200 w-full">
                        <div className="card-body gap-4">
                            <h2 className="card-title">New Workspace</h2>
                            <label className="form-control">
                                <div className="label">
                                    <span className="label-text">Workspace name</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="My Architecture"
                                    className="input input-bordered"
                                    value={newName}
                                    onChange={(e) => {
                                        setNewName(e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') void handleCreate();
                                        if (e.key === 'Escape') setIsCreating(false);
                                    }}
                                    autoFocus={true}
                                />
                            </label>
                            <div className="card-actions justify-end">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => {
                                        setIsCreating(false);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    disabled={!newName.trim()}
                                    onClick={() => {
                                        void handleCreate();
                                    }}
                                >
                                    Choose location&hellip;
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-3 w-full">
                        <button
                            type="button"
                            className="btn btn-primary flex-1"
                            onClick={() => {
                                setIsCreating(true);
                            }}
                        >
                            New Workspace
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline flex-1"
                            onClick={() => {
                                void handleOpen();
                            }}
                        >
                            Open Workspace&hellip;
                        </button>
                    </div>
                )}

                {recentWorkspaces.length > 0 && (
                    <div className="w-full">
                        <p className="text-sm text-base-content/50 mb-2 uppercase tracking-wide">Recent</p>
                        <ul className="menu menu-sm bg-base-200 rounded-box w-full">
                            {recentWorkspaces.map((ws) => (
                                <li key={ws.filePath}>
                                    <button
                                        type="button"
                                        className="flex flex-col items-start"
                                        onClick={() => {
                                            void handleOpenRecent(ws.filePath);
                                        }}
                                    >
                                        <span className="font-medium">{ws.name}</span>
                                        <span className="text-xs text-base-content/40 truncate w-full">
                                            {ws.filePath}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            </div>
        </main>
    );
};
