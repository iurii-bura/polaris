import type { ToolFunction } from './index.js';

/**
 * Tool: example-components
 *
 * Generates example components for testing purposes.
 * Creates a specified number of sample components with mock data.
 *
 * Usage:
 *   dash example-components --out data.json
 *   dash example-components --out data.json 20
 *   dash example-components --data existing.json --out updated.json 5
 *
 * Arguments:
 *   args[0] - Number of components to generate (optional, default: 10)
 */
export const exampleComponents: ToolFunction = async (store, args) => {
    const count = args.length > 0 ? parseInt(args[0], 10) : 10;

    if (isNaN(count) || count < 1) {
        throw new Error('Component count must be a positive number');
    }

    console.log(`🎨 Generating ${count} example components`);

    const newComponents = Array.from({ length: count }, (_, idx) => ({
        id: `EXAMPLE-${String(idx + 1).padStart(3, '0')}`,
        label: `Example Component ${idx + 1}`,
        description: `This is an example component for testing purposes`,
        facts: {
            businessCapabilities: ['example-capability'],
            cmdbFacts: {
                id: `EXAMPLE-${String(idx + 1).padStart(3, '0')}`,
                name: `Example Component ${idx + 1}`,
                description: 'Example component',
                aliases: [],
                solution: {
                    id: 'SOL-EXAMPLE',
                    name: 'Example Solution',
                    link: 'https://example.com/solution'
                }
            }
        },
        layouts: {
            default: {
                x: (idx % 10) * 100,
                y: Math.floor(idx / 10) * 100,
                nodeType: 'componentDetails'
            }
        }
    }));

    console.log(`✨ Generated ${newComponents.length} example components`);

    // Add components to the store
    for (const component of newComponents) {
        await store.addComponent(component);
    }
};
