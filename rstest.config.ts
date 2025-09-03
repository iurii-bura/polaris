import { defineConfig } from '@rstest/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
    plugins: [pluginReact()],
    include: ['src/**/*.test.tsx'],
    testEnvironment: 'jsdom',
    reporters: ['verbose', 'github-actions']
});
