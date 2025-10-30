# Dashboard Data Tools (dash)

A flexible command-line tool for manipulating dashboard component data. The `dash` CLI provides a plugin-based architecture where different tools can be chained together to process, transform, and generate component data.

## Architecture

The dash CLI follows a shell-and-tool pattern with a store abstraction:

- **Shell** (`dash.ts`): Handles command-line parsing, data I/O, store initialization, and tool orchestration
- **Store** (`stores/`): Abstraction layer for data persistence (memory, MongoDB, LokiJS, etc.)
- **Tools** (`tools/`): Individual functions that manipulate data through the store interface
- **Registry** (`tools/index.ts`): Maps tool names to their implementations

Tools no longer manipulate data directly. Instead, they receive a `Store` instance and use its methods to persist changes. This allows for different storage backends without changing tool implementations.

## Usage

### Basic Syntax

```bash
npm run dash -- <tool-name> [--data input.json] [--out output.json] [tool-args...]
```

### Parameters

- `tool-name`: Name of the tool to execute (required, first positional argument)
- `--data`: Path to input JSON data file (optional)
  - If omitted, starts with empty dataset
  - If file doesn't exist, throws error
- `--out`: Path to output JSON data file (optional)
  - If omitted but `--data` is present, defaults to `--data` (in-place update)
  - If both omitted, throws error
- `tool-args`: Additional arguments passed to the tool

### Examples

```bash
# Generate 10 example components
npm run dash -- example-components --out data/test.json

# Generate 20 example components
npm run dash -- example-components --out data/test.json 20

# Add components from Excel file
npm run dash -- components-from-excel --out data/components.json path/to/file.xlsx

# Add a new layout to existing data
npm run dash -- add-layout --data data/components.json --out data/updated.json my-layout

# In-place update (same input and output)
npm run dash -- add-layout --data data/components.json --out data/components.json grid

# In-place update (implicit out)
npm run dash -- add-layout --data data/components.json my-layout
```

## Available Tools

### `example-components`

Generates example components for testing purposes.

**Arguments:**
- `count` (optional): Number of components to generate (default: 10)

**Example:**
```bash
npm run dash -- example-components --out data/test.json 20
```

### `components-from-excel`

Imports components from an Excel file. The Excel file should have columns: team, id, label.

**Arguments:**
- `excel-file-path` (required): Path to Excel file

**Example:**
```bash
npm run dash -- components-from-excel --out data/imported.json report.xlsx
```

### `add-layout`

Adds a new named layout to all components in the dataset. Components are positioned in a grid pattern.

**Arguments:**
- `layout-name` (required): Name of the layout to create

**Example:**
```bash
npm run dash -- add-layout --data data/components.json grid-view
```

## Creating New Tools

To add a new tool:

1. Create a new file in `scripts/tools/` (e.g., `my-tool.ts`)
2. Export a function matching the `ToolFunction` type:

```typescript
import type { ToolFunction } from './index.js';

export const myTool: ToolFunction = async (store, args) => {
    // Get data from store if needed
    const data = await store.getAll();
    
    // Manipulate data through store methods
    for (const component of data.components) {
        await store.updateComponent(component.id, {
            label: `Updated ${component.label}`
        });
    }
    
    // No return value - store persists changes
};
```

3. Register it in `scripts/tools/index.ts`:

```typescript
import { myTool } from './my-tool.js';

export const toolRegistry: Record<string, ToolFunction> = {
    // ... existing tools
    'my-tool': myTool
};
```

4. Your tool is now available:

```bash
npm run dash -- my-tool --out data.json
```

## Store Interface

Tools interact with data through the `Store` interface, which provides:

**Component Operations:**
- `findComponent(id)` - Find a component by ID
- `addComponent(component)` - Add a new component
- `deleteComponent(id)` - Delete a component
- `updateComponent(id, updates)` - Update component fields (label, description)
- `upsertComponentFacts(id, facts)` - Add/update component facts
- `removeComponentFacts(id, factKeys)` - Remove specific facts
- `addComponentLayout(id, name, layout)` - Add a layout
- `updateComponentLayout(id, name, layout)` - Update a layout
- `removeComponentLayout(id, name)` - Remove a layout
- `getComponentLayout(id, name)` - Get a specific layout

**Group Operations:**
- Similar methods for groups (findGroup, addGroup, etc.)

**Edge Operations:**
- Similar methods for edges (findEdge, addEdge, etc.)

**Store Operations:**
- `getAll()` - Get the entire component graph
- `clearStore()` - Clear all data

All methods return Promises for consistency, even when using in-memory storage.

## Renaming the CLI

The CLI is currently called `dash` (short for "dashboard"). To rename it:

1. Rename `scripts/dash.ts` to your preferred name (e.g., `scripts/polaris.ts`)
2. Update `package.json`:

```json
{
  "scripts": {
    "polaris": "tsx scripts/polaris.ts"
  }
}
```

3. Use the new name:

```bash
npm run polaris -- example-components --out data.json
```

## Error Handling

The shell provides pretty-printed error messages for common scenarios:

- Missing tool name
- Unknown tool name
- File not found
- Permission denied
- Invalid JSON format
- Tool-specific errors (with stack traces in verbose mode)

## Data Format

All tools work with the `ComponentGraph` type from `src/components/types.ts`:

```typescript
{
  components: ComponentData[],
  groups: Group[],
  edges: EdgeData[]
}
```

The shell loads this data and creates a store instance. Tools manipulate the store, and the shell persists changes back to the output file.

## Implementing Custom Stores

To add a new storage backend (e.g., MongoDB, LokiJS):

1. Create a new file in `scripts/stores/` (e.g., `mongo-store.ts`)
2. Implement the `Store` interface from `scripts/stores/store.ts`
3. Export your store factory function
4. Update `dash.ts` to use your store implementation

Example:

```typescript
import type { Store } from './store.js';
import type { ComponentGraph } from '../../src/components/types.js';

export const mongoStore = async (connectionString: string): Promise<Store> => {
    // Connect to MongoDB
    // Implement Store interface methods
    return {
        findComponent: async (id) => { /* ... */ },
        addComponent: async (component) => { /* ... */ },
        // ... implement all Store methods
    };
};
```
