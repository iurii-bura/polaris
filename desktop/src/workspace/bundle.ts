import JSZip from 'jszip';
import fs from 'fs/promises';
import type { ComponentGraph } from '../types';

export type BundleManifest = {
    version: '1';
    name: string;
    createdAt: string;
    updatedAt: string;
};

const REQUIRED_FILES = ['manifest.json', 'graph.json'] as const;

export async function readBundle(filePath: string): Promise<{ manifest: BundleManifest; graph: ComponentGraph }> {
    const data = await fs.readFile(filePath);
    const zip = await JSZip.loadAsync(data);

    for (const name of REQUIRED_FILES) {
        if (!zip.file(name)) {
            throw new Error(`Invalid .polaris bundle: missing '${name}' in ${filePath}`);
        }
    }

    const manifest = JSON.parse(await zip.file('manifest.json')!.async('string')) as BundleManifest;
    const graph = JSON.parse(await zip.file('graph.json')!.async('string')) as ComponentGraph;

    return { manifest, graph };
}

export async function writeBundle(filePath: string, graph: ComponentGraph, manifest: BundleManifest): Promise<void> {
    // Preserve existing ZIP contents (assets/images etc.) and update only graph.json
    let zip = new JSZip();
    try {
        const existingData = await fs.readFile(filePath);
        zip = await JSZip.loadAsync(existingData);
    } catch {
        // File does not exist yet — start with a fresh ZIP
    }

    const updatedManifest: BundleManifest = { ...manifest, updatedAt: new Date().toISOString() };
    zip.file('manifest.json', JSON.stringify(updatedManifest, null, 2));
    zip.file('graph.json', JSON.stringify(graph, null, 2));

    const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

    // Atomic write: write to a temp file then rename to prevent corruption on crash
    const tmpPath = `${filePath}.tmp`;
    await fs.writeFile(tmpPath, content);
    await fs.rename(tmpPath, filePath);
}

export async function createBundle(filePath: string, name: string): Promise<void> {
    const zip = new JSZip();

    const manifest: BundleManifest = {
        version: '1',
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const emptyGraph: ComponentGraph = { components: [], groups: [], edges: [] };

    zip.file('manifest.json', JSON.stringify(manifest, null, 2));
    zip.file('graph.json', JSON.stringify(emptyGraph, null, 2));
    zip.folder('assets/images'); // Reserve space for future image assets

    const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
    await fs.writeFile(filePath, content);
}
