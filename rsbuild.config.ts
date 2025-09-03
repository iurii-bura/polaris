import { defineConfig, rspack } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSvgr } from '@rsbuild/plugin-svgr';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { config } from 'dotenv';

config();

const { SubresourceIntegrityPlugin } = rspack.experiments;

export default defineConfig({
    plugins: [pluginReact(), pluginSvgr()],
    html: {
        template: './src/index.html'
    },
    // @ts-expect-error: accodring to the documentation it is correct
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['postcss-loader'],
                type: 'css'
            }
        ]
    },
    tools: {
        rspack: {
            target: 'browserslist',
            output: {
                crossOriginLoading: 'anonymous'
            },
            plugins: [
                new rspack.CircularDependencyRspackPlugin({
                    failOnError: true,
                    exclude: /node_modules/
                }),

                process.env.NODE_ENV === 'production' && new SubresourceIntegrityPlugin(),

                process.env.NODE_ENV === 'production' &&
                    new RsdoctorRspackPlugin({
                        disableClientServer: true,
                        features: ['loader', 'plugins', 'bundle'],
                        mode: 'brief',
                        output: {
                            reportDir: `${__dirname}/reports/bundle/`
                        },
                        brief: {
                            reportHtmlName: 'report.html',
                            writeDataJson: true
                        }
                    })
            ]
        }
    },
    resolve: {
        alias: {
            '@/shared': './src/shared'
        }
    },
    output: {
        cleanDistPath: true,
        distPath: {
            root: './dist/bundle',
            js: '',
            css: ''
        }
    },
    performance: {
        chunkSplit: {
            strategy: 'split-by-experience'
        }
    },
    server: {
        open: false,
        port: parseInt(process.env.APP_DEV_SERVER_PORT ?? '8080', 10),
        strictPort: true
    }
});
