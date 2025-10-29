import type { ToolFunction } from './index.js';

/**
 * Tool: add-layout
 *
 * Adds a new layout to all components in the dataset.
 * The layout will position components in a grid pattern.
 *
 * Usage:
 *   dash add-layout --data data.json <layout-name>
 *   dash add-layout --data data.json grid-layout
 *
 * Arguments:
 *   args[0] - Layout name (required)
 */
export const addLayout: ToolFunction = (data, args) => {
    if (args.length === 0) {
        throw new Error('Layout name is required as first argument');
    }

    const layoutName = args[0];
    console.log(`📐 Adding layout: ${layoutName}`);

    const updatedComponents = data.components.map((component, idx) => ({
        ...component,
        layouts: {
            ...component.layouts,
            [layoutName]: {
                x: (idx % 10) * 150,
                y: Math.floor(idx / 10) * 150,
                nodeType: 'componentDetails'
            }
        }
    }));

    console.log(`✨ Added layout "${layoutName}" to ${updatedComponents.length} components`);

    return Promise.resolve({
        ...data,
        components: updatedComponents
    });
};
