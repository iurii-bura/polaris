# Controls Components

This directory contains UI control components for managing graph and application-wide operations.

## Components

### LayoutControls

- **Purpose**: Provides layout switching functionality for the graph
- **Features**:
    - Expandable circular menu button
    - Layout selection between 'default' and 'team'
    - Positioned as overlay on graph area
- **Usage**: Integrated into main App component

### Structure

```
controls/
├── index.ts                    # Main exports
└── layout-controls/
    ├── index.ts               # Layout controls exports
    ├── layout-controls.tsx    # Main expandable widget
    └── layout-selector.tsx    # Layout selection buttons
```

## Design Principles

- Lightweight and non-intrusive
- Expandable/collapsible interface
- DaisyUI components for consistency
- Reusable component architecture
