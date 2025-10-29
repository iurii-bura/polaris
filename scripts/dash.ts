#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import type { ComponentGraph } from '../src/components/types.js';
import { toolRegistry } from './tools/index.js';

type DashArgs = {
    data?: string;
    out?: string;
    _: (string | number)[];
    $0: string;
};

const main = async (): Promise<void> => {
    try {
        // Parse command line arguments
        const argv = yargs(hideBin(process.argv))
            .usage('Usage: $0 <tool> [options]')
            .option('data', {
                type: 'string',
                description: 'Path to input JSON data file',
                coerce: (arg: string) => path.resolve(arg)
            })
            .option('out', {
                type: 'string',
                description: 'Path to output JSON data file',
                coerce: (arg: string) => path.resolve(arg)
            })
            .example('$0 components --out ../data/example.json', 'Generate components')
            .example('$0 cmdb --data ../data/example.json --out ../data/example.json', 'Process CMDB data')
            .example('$0 map-capabilities --data ../data/example.json --out ../data/result.json', 'Map capabilities')
            .example('$0 new-layout --data ../data/example.json my-layout', 'Create new layout')
            .help()
            .parseSync() as DashArgs;

        // Extract tool name from positional arguments
        const toolName = argv._[0] as string | undefined;

        if (!toolName) {
            console.error('❌ Error: No tool specified');
            console.error('Available tools:', Object.keys(toolRegistry).join(', '));
            process.exit(1);
        }

        // Check if tool exists in registry
        if (!(toolName in toolRegistry)) {
            console.error(`❌ Error: Unknown tool "${toolName}"`);
            console.error('Available tools:', Object.keys(toolRegistry).join(', '));
            process.exit(1);
        }

        const tool = toolRegistry[toolName];

        // Load input data
        let data: ComponentGraph;
        const dataPath = argv.data;

        if (dataPath) {
            // Check if file exists
            if (!fs.existsSync(dataPath)) {
                console.error(`❌ Error: Data file not found: ${dataPath}`);
                process.exit(1);
            }

            console.log(`📖 Reading data from: ${dataPath}`);
            const fileContent = fs.readFileSync(dataPath, 'utf8');
            data = JSON.parse(fileContent) as ComponentGraph;
        } else {
            // No data file provided, start with empty data
            console.log('📝 Starting with empty dataset');
            data = {
                components: [],
                groups: [],
                edges: []
            };
        }

        // Determine output path
        const outPath = argv.out ?? dataPath;

        if (!outPath) {
            console.error('❌ Error: No output path specified. Use --out or --data');
            process.exit(1);
        }

        // Extract additional arguments for the tool (everything after tool name)
        const toolArgs = argv._.slice(1) as string[];

        console.log(`🔧 Running tool: ${toolName}`);

        // Execute the tool
        const result = await tool(data, toolArgs);

        // Write result to output file
        const jsonString = JSON.stringify(result, null, 2);
        fs.writeFileSync(outPath, jsonString, 'utf8');

        console.log(`✅ Successfully wrote data to: ${outPath}`);
    } catch (error) {
        const err = error as Error & { code?: string; path?: string };

        // Pretty print errors
        console.error('\n❌ Error occurred:');
        console.error('━'.repeat(50));

        if (err.code === 'ENOENT') {
            console.error(`File not found: ${err.path ?? 'unknown'}`);
        } else if (err.code === 'EACCES') {
            console.error(`Permission denied: ${err.path ?? 'unknown'}`);
        } else if (err instanceof SyntaxError) {
            console.error(`Invalid JSON format: ${err.message}`);
        } else {
            console.error(err.message);
            if (err.stack) {
                console.error('\nStack trace:');
                console.error(err.stack);
            }
        }

        console.error('━'.repeat(50));
        process.exit(1);
    }
};

void main();
