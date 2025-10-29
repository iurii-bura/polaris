import type { ComponentGraph } from '../../src/components/types.js';
import { componentsFromExcel } from './components-from-excel.js';
import { addLayout } from './add-layout.js';
import { exampleComponents } from './example-components.js';

/**
 * Tool function type definition.
 * Each tool receives the current data and additional arguments,
 * and returns a Promise with the modified data.
 */
export type ToolFunction = (data: ComponentGraph, args: string[]) => Promise<ComponentGraph>;

/**
 * Tool registry mapping tool names to their implementations.
 * Add new tools here to make them available in the CLI.
 *
 * To add a new tool:
 * 1. Create a new file in the tools/ directory (e.g., my-tool.ts)
 * 2. Export a function that matches the ToolFunction type
 * 3. Import it above
 * 4. Add an entry to this registry with the desired command name
 */
export const toolRegistry: Record<string, ToolFunction> = {
    'components-from-excel': componentsFromExcel,
    'add-layout': addLayout,
    'example-components': exampleComponents
};
