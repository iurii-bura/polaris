# Local Image Serving Setup

This document explains how static images are served locally in the project for journey step screenshots and other static assets.

## Directory Structure

```
project-root/
├── public/
│   └── img/
│       ├── login-form-screenshot.svg
│       ├── account-balance-screenshot.svg
│       └── [your-images-here]
├── rsbuild.config.ts (configured for static serving)
└── data/
    └── example.json (references local images)
```

## Configuration

The project uses RSBuild with the following configuration in `rsbuild.config.ts`:

```typescript
server: {
    open: false,
    port: parseInt(process.env.APP_DEV_SERVER_PORT ?? '8080', 10),
    strictPort: true,
    publicDir: {
        name: 'public',
        copyOnBuild: true
    }
}
```

This configuration:

- Serves files from the `public/` directory at the root URL
- Copies public files to the build output during production builds
- Makes images accessible via `/img/filename.ext` URLs

## Image Access

### In Development

Images in the `public/img/` directory are accessible at:

- `http://localhost:8080/img/login-form-screenshot.svg`
- `http://localhost:8080/img/account-balance-screenshot.svg`

### In JSON Configuration

Reference images in `example.json` using relative paths:

```json
{
    "journeyStep": {
        "name": "Login Form",
        "screenshot": "/img/login-form-screenshot.svg",
        "description": "User login screen..."
    }
}
```

## Adding New Images

To add new journey step screenshots:

1. **Place your image files** in the `public/img/` directory
2. **Use descriptive filenames** (e.g., `dashboard-overview.png`, `payment-form.jpg`)
3. **Update the JSON data** to reference the new image path
4. **Restart the development server** if needed

### Supported Formats

- **SVG**: Vector graphics (recommended for UI mockups)
- **PNG**: High-quality screenshots with transparency
- **JPG/JPEG**: Compressed photos and screenshots
- **WebP**: Modern, efficient image format

### Example Filenames

```
public/img/
├── login-form-screenshot.svg
├── account-balance-screenshot.svg
├── payment-form-screenshot.png
├── dashboard-overview.jpg
├── settings-screen.webp
└── user-profile-edit.png
```

## Demo Images

The project includes two demo SVG images created specifically for journey step screenshots:

### 1. Login Form Screenshot (`login-form-screenshot.svg`)

- **Dimensions**: 400x600px
- **Content**: Login form with username/password fields, sign-in button
- **Style**: Clean, modern UI with blue primary color (#4A90E2)
- **Usage**: Demonstrates authentication step in user journey

### 2. Account Balance Screenshot (`account-balance-screenshot.svg`)

- **Dimensions**: 400x600px
- **Content**: Banking dashboard with balance, quick actions, recent transactions
- **Style**: Banking app interface with green accent (#2E8B57)
- **Usage**: Shows main dashboard after successful login

## Replacing Demo Images

To replace the demo SVG images with real screenshots:

1. **Take screenshots** of your actual application screens
2. **Resize/optimize** images (recommended: 400-800px width for mobile, 800-1200px for desktop)
3. **Save** with descriptive names in `public/img/`
4. **Update** the `screenshot` paths in `example.json`

### Example Replacement

```json
// Before (demo SVG)
"screenshot": "/img/login-form-screenshot.svg"

// After (real screenshot)
"screenshot": "/img/actual-login-screen.png"
```

## Best Practices

### Image Optimization

- **Compress images** to reduce file size (use tools like TinyPNG, ImageOptim)
- **Use appropriate formats**: PNG for UI screenshots, JPG for photos, SVG for simple graphics
- **Consider WebP** for better compression and quality

### Naming Conventions

- Use kebab-case: `login-form-screenshot.png`
- Include context: `mobile-dashboard.png` vs `desktop-dashboard.png`
- Add version if needed: `login-form-v2.png`

### Performance

- Keep image files under 500KB when possible
- Use lazy loading for large images
- Consider using responsive images for different screen sizes

## Troubleshooting

### Images Not Loading

1. **Check file path** - ensure the path in JSON matches the actual file location
2. **Verify file extension** - make sure the extension matches the actual file type
3. **Restart dev server** - sometimes needed after adding new files to public directory
4. **Check console** - browser developer tools will show 404 errors for missing images

### Build Issues

1. **Verify RSBuild config** - ensure `publicDir` is properly configured
2. **Check build output** - confirm images are copied to dist folder
3. **Test production build** - verify images work in production environment

## Production Deployment

When deploying to production:

1. **Images are automatically copied** to the build output via `copyOnBuild: true`
2. **Paths remain the same** (`/img/filename.ext`)
3. **CDN integration** - consider serving images from a CDN for better performance
4. **Cache headers** - configure appropriate cache headers for static assets
