# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Polaris** - Enterprise architecture visualization dashboard built with React 19 and @xyflow/react for interactive graph-based component visualization.

## Commands

```bash
# Development
npm run start              # Dev server on port 8080 (APP_DEV_SERVER_PORT env to change)
npm run serve              # Preview production build

# Building
npm run build              # Production build
npm run clean              # Clean build artifacts

# Testing
npm run test:unit:check    # Run unit tests
npm run test:unit:update   # Update unit test snapshots
npm run test:e2e:check     # Run Playwright E2E tests
npm run test:e2e:update    # Update E2E visual snapshots
npm run install:playwright # Install Playwright browsers

# Code Quality
npm run type:check         # TypeScript type checking
npm run lint:check         # ESLint check
npm run lint:fix           # ESLint with auto-fix
npm run format:check       # Prettier check
npm run format:fix         # Prettier fix
npm run all:check          # All checks (type, lint, format, unit tests)
```

All commands run from the `ui/` directory.

## Architecture

### Directory Structure
```
ui/
├── src/
│   ├── app/           # Root App component with layout management
│   ├── components/    # React components
│   │   ├── graph/     # @xyflow/react graph with custom nodes/edges
│   │   ├── facts/     # 14 domain-specific fact display components
│   │   ├── controls/  # UI controls (layout switching)
│   │   └── component-details/  # Right panel component details
│   ├── hooks/         # Custom React hooks (useComponentData)
│   ├── services/      # Business logic (ComponentDataService singleton)
│   └── constants/     # Application constants
├── data/example.json  # Mock component/group/edge data
└── tests/             # Playwright E2E tests with visual snapshots
```

### Key Patterns

- **Data Flow**: `useComponentData()` hook → `ComponentDataService` (singleton) → localStorage or example.json fallback
- **Graph Visualization**: @xyflow/react with custom node types (journeyStep, component, group) and edge types
- **Layout Persistence**: Component positions saved per layout name in localStorage
- **Re-exports**: Each component directory has index.ts re-exporting its contents

### Tech Stack
- React 19 + React Router 7
- @xyflow/react (graph visualization)
- TailwindCSS 4 + DaisyUI 5
- RsBuild (Rspack-based bundler)
- TypeScript 5.9 (strict mode)
- Rstest (unit) + Playwright (E2E)

## Code Conventions

- **Directories**: lowercase-with-dashes (e.g., `components/auth-wizard`)
- **Exports**: Named exports preferred over default exports
- **Types**: Use `type` over `interface`; avoid enums (use maps)
- **Styling**: TailwindCSS with mobile-first responsive design
- **Memoization**: Always wrap callbacks passed as props with `useCallback()`, use `useMemo()` for expensive computations
- **Tests**: Unit tests colocated (*.test.tsx), E2E tests in tests/ directory
