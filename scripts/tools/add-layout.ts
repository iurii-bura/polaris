import type { ToolFunction } from './index.js';

/**
 * Tool: add-layout
 *
 * Adds a new layout to all components in the store.
 * The layout will position components in a grid pattern.
 *
 * Usage:
 *   dash add-layout --data data.json <layout-name>
 *   dash add-layout --data data.json grid-layout
 *
 * Arguments:
 *   args[0] - Layout name (required)
 */
export const addLayout: ToolFunction = async (store, args) => {
    if (args.length === 0) {
        throw new Error('Layout name is required as first argument');
    }

    const layoutName = args[0];
    console.log(`📐 Adding layout: ${layoutName}`);

    // Get all components from the store
    const data = await store.getAll();
    const components = data.components;

    // Add layout to each component
    let count = 0;
    for (const [idx, component] of components.entries()) {
        await store.addComponentLayout(component.id, layoutName, {
            x: (idx % 10) * 150,
            y: Math.floor(idx / 10) * 150,
            nodeType: 'componentDetails'
        });
        count++;
    }

    console.log(`✨ Added layout "${layoutName}" to ${count} components`);
};
