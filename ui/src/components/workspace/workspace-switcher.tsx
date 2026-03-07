import { type FunctionComponent, type ReactElement, useState, useCallback, useEffect, useRef } from 'react';
import type { WorkspaceInfo } from '../../context/data-provider-context';

type WorkspaceSwitcherProps = {
    readonly workspace: WorkspaceInfo;
};

/**
 * Compact workspace indicator shown in the app header when a workspace is open.
 * Clicking it opens a dropdown for switching to another workspace.
 */
export const WorkspaceSwitcher: FunctionComponent<WorkspaceSwitcherProps> = ({ workspace }): ReactElement => {
    const [isOpen, setIsOpen] = useState(false);
    const [recentWorkspaces, setRecentWorkspaces] = useState<WorkspaceInfo[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const api = window.electronAPI;
        if (!api) return;
        const unsubscribe = api.onMenuNewWorkspace(() => {
            setIsOpen(true);
            setIsCreating(true);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setIsCreating(false);
            setNewName('');
            return;
        }
        const api = window.electronAPI;
        if (!api) return;
        void api.getRecentWorkspaces().then((recent) => {
            setRecentWorkspaces(recent.filter((ws) => ws.filePath !== workspace.filePath));
        });
    }, [isOpen, workspace.filePath]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent): void => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleOpen = useCallback(async () => {
        const api = window.electronAPI;
        if (!api) return;
        setIsOpen(false);
        await api.openWorkspace();
    }, []);

    const handleOpenRecent = useCallback(async (filePath: string) => {
        const api = window.electronAPI;
        if (!api) return;
        setIsOpen(false);
        await api.openWorkspace(filePath);
    }, []);

    const handleCreate = useCallback(async () => {
        const api = window.electronAPI;
        if (!api) return;
        const name = newName.trim();
        if (!name) return;
        setIsOpen(false);
        await api.newWorkspace(name);
    }, [newName]);

    return (
        <div
            className="relative"
            ref={dropdownRef}
        >
            <button
                type="button"
                className="btn btn-ghost btn-sm gap-2 font-normal"
                onClick={() => {
                    setIsOpen((prev) => !prev);
                }}
            >
                <span className="text-sm font-medium truncate max-w-48">{workspace.name}</span>
                <svg
                    className="w-3 h-3 opacity-50"
                    viewBox="0 0 12 12"
                    fill="currentColor"
                >
                    <path d="M6 8L1 3h10L6 8z" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full mt-1 w-72 bg-base-200 border border-base-300 rounded-box shadow-lg z-50">
                    {isCreating ? (
                        <div className="p-3 flex flex-col gap-2">
                            <input
                                type="text"
                                placeholder="Workspace name"
                                className="input input-bordered input-sm w-full"
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
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className="btn btn-ghost btn-xs flex-1"
                                    onClick={() => {
                                        setIsCreating(false);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-xs flex-1"
                                    disabled={!newName.trim()}
                                    onClick={() => {
                                        void handleCreate();
                                    }}
                                >
                                    Choose location&hellip;
                                </button>
                            </div>
                        </div>
                    ) : (
                        <ul className="menu menu-sm p-1">
                            <li>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreating(true);
                                    }}
                                >
                                    New Workspace&hellip;
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={() => {
                                        void handleOpen();
                                    }}
                                >
                                    Open Workspace&hellip;
                                </button>
                            </li>
                            {recentWorkspaces.length > 0 && (
                                <>
                                    <li className="menu-title">Recent</li>
                                    {recentWorkspaces.map((ws) => (
                                        <li key={ws.filePath}>
                                            <button
                                                type="button"
                                                className="flex flex-col items-start"
                                                onClick={() => {
                                                    void handleOpenRecent(ws.filePath);
                                                }}
                                            >
                                                <span>{ws.name}</span>
                                                <span className="text-xs text-base-content/40 truncate w-full">
                                                    {ws.filePath}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </>
                            )}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};
