# Polaris Utilities

Small Node.js scripts for development and prototyping. No build step required — run directly with `node`.

## Install

```bash
npm --prefix utils install
```

---

## polaris-tool

Converts between plain JSON (the `example.json` format used in development) and `.polaris` workspace bundles (the ZIP format used by the desktop app). Useful for rapid prototyping — edit data as JSON, pack it into a bundle to open in the app, or unpack an existing workspace to inspect or modify its graph.

### Commands

**pack** — wrap a ComponentGraph JSON file into a `.polaris` bundle:

```bash
node utils/polaris-tool.js pack <input.json> <output.polaris> [--name <workspace-name>]
```

**unpack** — extract the graph from a `.polaris` bundle back to plain JSON:

```bash
node utils/polaris-tool.js unpack <input.polaris> <output.json>
```

### Examples

Pack the development example data into a workspace that can be opened in the desktop app:

```bash
node utils/polaris-tool.js pack ui/data/example.json workspaces/example.polaris --name "Example"
```

Pack without `--name` — the workspace name defaults to the output filename:

```bash
node utils/polaris-tool.js pack ui/data/example.json workspaces/my-arch.polaris
# workspace name → "my-arch"
```

Unpack a workspace to edit its graph as JSON, then repack it:

```bash
node utils/polaris-tool.js unpack workspaces/my-arch.polaris /tmp/my-arch.json
# edit /tmp/my-arch.json
node utils/polaris-tool.js pack /tmp/my-arch.json workspaces/my-arch.polaris --name "My Architecture"
```
