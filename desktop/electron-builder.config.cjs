/** @type {import('electron-builder').Configuration} */
module.exports = {
    appId: 'com.polaris.desktop',
    productName: 'Polaris',
    copyright: 'Copyright © 2026',

    directories: {
        output: '../dist-electron'
    },

    files: [
        'dist/**',
        'node_modules/**',
        'package.json'
    ],

    // The React bundle lives outside desktop/ so it cannot go into the ASAR via
    // files[]. extraResources copies it to Contents/Resources/ui/dist/bundle/,
    // which is accessible via process.resourcesPath at runtime.
    extraResources: [
        { from: '../ui/dist/bundle', to: 'ui/dist/bundle' }
    ],

    npmRebuild: false,

    mac: {
        category: 'public.app-category.productivity',
        // icon: 'assets/icon.icns',  // Uncomment once icon is available
        target: [
            { target: 'dmg', arch: ['arm64', 'x64'] }
        ],
        entitlements: 'entitlements.mac.plist',
        entitlementsInherit: 'entitlements.mac.plist'
    },

    dmg: {
        title: 'Polaris',
        contents: [
            { x: 130, y: 220, type: 'file' },
            { x: 410, y: 220, type: 'link', path: '/Applications' }
        ],
        window: { width: 540, height: 380 }
    }
};
