# React with TypeScript and rspack template

This repository serves as a starting point for creating a React application using TypeScript and rspack.

## Getting started

To get started, clone the repository and install the dependencies:

```bash
git clone git@github.com:mezeitamas/react-typescript-boilerplate.git
cd react-typescript-boilerplate
npm install
npm run install:playwright
```

Next, you can start the development server:

```bash
npm start
```

## Available scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode. Open http://localhost:8080 to view it in the browser. The port needs to be defined in the `.env` file with the name `APP_DEV_SERVER_PORT`.

```bash
APP_DEV_SERVER_PORT=8080
```

### `npm run build`

Builds the app for production to the `dist/bundle` folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.

A report is also created and placed under the `reports/bundle` folder with stats of bundle.

### `npm run clean`

Removes all the generated folders: `dist/` and `reports/`.

### `npm run format:check`

Executes a `prettier` check on the source code.

### `npm run format:fix`

Fixes the formatting.

### `npm run lint:check`

Runs a static code analysis, using `eslint`.

### `npm run lint:fix`

Fixes all the automatically fixable issues.

### `npm run test:unit:check`

Runs unit tests.

### `npm run test:unit:update`

Updates the `Rstest` snapshots.

### `npm run test:e2e:check`

Runs e2e tests with `Playwright` and place the report under `reports/tests/e2e`.

Before using this script, the application needs to be built with `npm run build`.

### `npm run test:e2e:update`

Updates the `Playwright` snapshots.

Before using this script, the application needs to be built with `npm run build`.

### `npm run audit:check`

Executes an audit on dependencies regarding security vulnerabilities.

### `npm run install:playwright`

Installs `Playwright` dependencies (browser, etc).

### `npm run serve`

It starts the `http-server` (on a fixed port (8080) for now) and serves the content from the `dist/bundle` folder.

Before using this script, the application needs to be built with `npm run build`.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This repository is licensed under the [MIT License](LICENSE).
