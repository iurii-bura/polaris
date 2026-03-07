#!/usr/bin/env node
/**
 * polaris-tool — pack/unpack .polaris workspace bundles
 *
 * Usage:
 *   node utils/polaris-tool.js pack   <input.json>    <output.polaris> [--name <workspace-name>]
 *   node utils/polaris-tool.js unpack <input.polaris> <output.json>
 *
 * pack   — wraps a ComponentGraph JSON file into a .polaris ZIP bundle.
 *          Workspace name defaults to the output filename without extension.
 *
 * unpack — extracts graph.json from a .polaris bundle back to a plain JSON file.
 */

import JSZip from 'jszip';
import fs from 'fs/promises';
import path from 'path';

// ── Commands ──────────────────────────────────────────────────────────────────

async function pack(inputJson, outputPolaris, name) {
    const raw = await fs.readFile(inputJson, 'utf-8');
    const graph = JSON.parse(raw);

    const workspaceName = name ?? path.basename(outputPolaris, '.polaris');
    const now = new Date().toISOString();

    const manifest = {
        version: '1',
        name: workspaceName,
        createdAt: now,
        updatedAt: now
    };

    const zip = new JSZip();
    zip.file('manifest.json', JSON.stringify(manifest, null, 2));
    zip.file('graph.json', JSON.stringify(graph, null, 2));
    zip.folder('assets/images');

    const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

    // Atomic write — same pattern as the desktop app
    const tmpPath = `${outputPolaris}.tmp`;
    await fs.writeFile(tmpPath, content);
    await fs.rename(tmpPath, outputPolaris);

    console.log(`packed  ${inputJson} → ${outputPolaris}  (name: "${workspaceName}")`);
}

async function unpack(inputPolaris, outputJson) {
    const data = await fs.readFile(inputPolaris);
    const zip = await JSZip.loadAsync(data);

    const graphFile = zip.file('graph.json');
    if (!graphFile) throw new Error(`Invalid .polaris bundle: missing graph.json in ${inputPolaris}`);

    const graph = JSON.parse(await graphFile.async('string'));
    await fs.writeFile(outputJson, JSON.stringify(graph, null, 2));

    const manifestFile = zip.file('manifest.json');
    const manifest = manifestFile ? JSON.parse(await manifestFile.async('string')) : null;

    console.log(`unpacked ${inputPolaris} → ${outputJson}${manifest ? `  (name: "${manifest.name}")` : ''}`);
}

// ── CLI ───────────────────────────────────────────────────────────────────────

const COMMANDS = { pack, unpack };

const args = process.argv.slice(2);
const command = args[0];
const arg1 = args[1];
const arg2 = args[2];

if (!COMMANDS[command] || !arg1 || !arg2) {
    console.error(
        'Usage:\n' +
        '  node utils/polaris-tool.js pack   <input.json>    <output.polaris> [--name <workspace-name>]\n' +
        '  node utils/polaris-tool.js unpack <input.polaris> <output.json>'
    );
    process.exit(1);
}

const nameFlag = args.indexOf('--name');
const name = nameFlag !== -1 ? args[nameFlag + 1] : undefined;

COMMANDS[command](arg1, arg2, name).catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
});
