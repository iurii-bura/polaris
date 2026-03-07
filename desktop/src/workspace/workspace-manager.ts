import fs from 'fs/promises';
import path from 'path';
import { app } from 'electron';
import type { BrowserWindow } from 'electron';
import { readBundle, writeBundle, createBundle } from './bundle';
import type { BundleManifest } from './bundle';
import type { ComponentGraph, WorkspaceInfo, WorkspaceLoadedPayload } from '../types';

const SETTINGS_FILE = 'settings.json';
const MAX_RECENT_WORKSPACES = 10;

type Settings = {
    recentWorkspaces: WorkspaceInfo[];
    lastOpenedPath?: string;
};

export class WorkspaceManager {
    private readonly window: BrowserWindow;
    private readonly settingsPath: string;
    private currentManifest: BundleManifest | null = null;
    private currentFilePath: string | null = null;
    private settings: Settings = { recentWorkspaces: [] };

    constructor(window: BrowserWindow) {
        this.window = window;
        this.settingsPath = path.join(app.getPath('userData'), SETTINGS_FILE);
    }

    async init(): Promise<void> {
        await this.loadSettings();

        const lastPath = this.settings.lastOpenedPath;
        if (lastPath) {
            try {
                await fs.access(lastPath);
                await this.openWorkspace(lastPath);
                return;
            } catch {
                // File no longer exists on disk — clear the stale reference
                this.settings.lastOpenedPath = undefined;
                await this.saveSettings();
            }
        }

        // No workspace to restore — tell the renderer to show the splash screen
        this.window.webContents.send('workspace:none');
    }

    async openWorkspace(filePath: string): Promise<void> {
        const { manifest, graph } = await readBundle(filePath);

        this.currentFilePath = filePath;
        this.currentManifest = manifest;

        const workspace: WorkspaceInfo = {
            name: manifest.name,
            filePath,
            lastOpenedAt: new Date().toISOString()
        };

        this.settings.recentWorkspaces = [
            workspace,
            ...this.settings.recentWorkspaces.filter((ws) => ws.filePath !== filePath)
        ].slice(0, MAX_RECENT_WORKSPACES);

        this.settings.lastOpenedPath = filePath;
        await this.saveSettings();

        const payload: WorkspaceLoadedPayload = { graph, workspace };
        this.window.webContents.send('workspace:loaded', payload);
    }

    async newWorkspace(name: string, filePath: string): Promise<void> {
        await createBundle(filePath, name);
        await this.openWorkspace(filePath);
    }

    async saveGraph(graph: ComponentGraph): Promise<void> {
        if (!this.currentFilePath || !this.currentManifest) {
            throw new Error('No workspace is currently open');
        }
        await writeBundle(this.currentFilePath, graph, this.currentManifest);
    }

    getRecentWorkspaces(): WorkspaceInfo[] {
        return this.settings.recentWorkspaces;
    }

    private async loadSettings(): Promise<void> {
        try {
            const data = await fs.readFile(this.settingsPath, 'utf-8');
            this.settings = JSON.parse(data) as Settings;
        } catch {
            // No settings file yet — use defaults
            this.settings = { recentWorkspaces: [] };
        }
    }

    private async saveSettings(): Promise<void> {
        await fs.mkdir(path.dirname(this.settingsPath), { recursive: true });
        await fs.writeFile(this.settingsPath, JSON.stringify(this.settings, null, 2));
    }
}
