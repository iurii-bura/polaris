import readXlsxFile from 'read-excel-file/node';
import path from 'path';
import type { ComponentData } from '../../src/components/types.js';
import type { ToolFunction } from './index.js';

/**
 * Tool: components-from-excel
 *
 * Imports components from an Excel file and adds them to the store.
 * The Excel file should have columns: team, id, label
 *
 * Usage:
 *   dash components-from-excel --out data.json <excel-file-path>
 *   dash components-from-excel --data existing.json --out updated.json <excel-file-path>
 *
 * Arguments:
 *   args[0] - Path to Excel file (required)
 */
export const componentsFromExcel: ToolFunction = async (store, args) => {
    if (args.length === 0) {
        throw new Error('Excel file path is required as first argument');
    }

    const excelPath = path.resolve(args[0]);
    console.log(`📖 Reading Excel file: ${excelPath}`);

    const rows = await readXlsxFile(excelPath);

    if (rows.length < 2) {
        throw new Error('Excel file must contain at least a header row and one data row');
    }

    const newComponents: ComponentData[] = rows.slice(1).map(([team, id, label], idx) => ({
        id: String(id),
        label: String(label),
        description: 'TODO',
        facts: {
            businessCapabilities: ['Client Static Data Distribution'],
            cmdbFacts: {
                id: String(id),
                name: String(label),
                description: 'TODO',
                aliases: [],
                solution: {
                    id: 'AS28690',
                    name: 'PCM Data Provisioning',
                    link: 'https://cmdb.example.com/solutions/SOL-WEALTH'
                }
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
                teamName: String(team),
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

    console.log(`✨ Imported ${newComponents.length} components from Excel`);

    // Add components to the store
    for (const component of newComponents) {
        await store.addComponent(component);
    }
};
