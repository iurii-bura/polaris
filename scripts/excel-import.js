import readXlsxFile from 'read-excel-file/node';
import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 [options]')
    .option('input', {
        alias: 'i',
        type: 'string',
        description: 'Path to Excel file to import',
        demandOption: true,
        coerce: (arg) => path.resolve(arg) // Convert to absolute path
    })
    .option('output', {
        alias: 'o',
        type: 'string',
        description: 'Output JSON file path (relative to current directory)',
        default: 'imported-components.json'
    })
    .option('help', {
        alias: 'h',
        description: 'Show help information'
    })
    .example('$0 -i report.xlsx', 'Import components from report.xlsx to imported-components.json')
    .example('$0 -i data/report.xlsx -o components.json', 'Import from data/report.xlsx to components.json')
    .help().argv;

const main = async () => {
    try {
        console.log(`📖 Reading Excel file: ${argv.input}`);
        const rows = await readXlsxFile(argv.input);

        const components = rows.slice(1).map(([team, id, label], idx) => ({
            id: id,
            label: label,
            description: 'TODO',
            facts: {
                businessCapabilities: ['Client Static Data Distribution'],
                cmdbFacts: {
                    id: id,
                    name: label,
                    description: 'TODO',
                    aliases: [],
                    solution: {
                        id: 'AS28690',
                        name: 'PCM Data Provisioning',
                        link: 'https://cmdb.example.com/solutions/SOL-WEALTH'
                    },
                    subcomponents: []
                },
                documents: [
                    {
                        url: 'https://docs.example.com/customer-portfolio-management/architecture',
                        description: 'Solution Architecture Document'
                    }
                ],
                links: [
                    {
                        type: 'BRD',
                        url: 'https://link.example.com/'
                    }
                ],
                team: {
                    teamName: team,
                    kbSpaceLink: 'https://team7.example.com/',
                    solutionArchitect: {
                        name: 'Alice Johnson',
                        email: 'alice.johnson@example.com',
                        avatarUrl: 'https://www.gravatar.com/avatar/alicejohnson'
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

        const result = {
            components,
            groups: []
        };

        // Write result to file synchronously in current working directory
        const outputPath = path.join(process.cwd(), argv.output);
        const jsonString = JSON.stringify(result, null, 2);

        fs.writeFileSync(outputPath, jsonString, 'utf8');
        console.log(`✅ Successfully wrote ${components.length} components to: ${outputPath}`);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`❌ Error: Excel file not found: ${argv.input}`);
        } else if (error.code === 'EACCES') {
            console.error(`❌ Error: Permission denied accessing file: ${error.path}`);
        } else {
            console.error(`❌ Error: ${error.message}`);
        }
        process.exit(1);
    }
};

main();
