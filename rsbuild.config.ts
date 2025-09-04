import { defineConfig, rspack } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSvgr } from '@rsbuild/plugin-svgr';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { config } from 'dotenv';

config();

export default defineConfig({
    plugins: [pluginReact(), pluginSvgr()],
    html: {
        template: './src/index.html',
        crossorigin: 'anonymous'
    },
    security: {
        sri: {
            enable: 'auto'
        }
    },
    tools: {
        rspack: {
            plugins: [
                new rspack.CircularDependencyRspackPlugin({
                    failOnError: true,
                    exclude: /node_modules/
                }),

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
        aliasStrategy: 'prefer-tsconfig'
    },
    output: {
        target: 'web',
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
