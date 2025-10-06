# @mbc-cqrs-serverless-web Monorepo

This monorepo contains the MBC CQRS Serverless Web packages and applications.

## Packages

### @mbc-cqrs-serverless-web/shared-ui
A comprehensive UI component library built with React, TypeScript, and the MBC design system.

### @mbc-cqrs-serverless-web/survey
A complete survey system with creators, renderers, and forms.

## Apps

### mebs-builshiru-web
The main Next.js application that consumes the packages.

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

```bash
# Install dependencies for all packages
npm run bootstrap

# Or install dependencies individually
cd packages/shared-ui
npm install

cd packages/survey
npm install
```

### Development

```bash
# Build all packages
npm run build

# Run tests for all packages
npm run test

# Lint all packages
npm run lint

# Clean all packages
npm run clean
```

### Package Management

```bash
# See which packages have changed
npm run changed

# See diff of changed packages
npm run diff

# Publish packages (with conventional commits)
npm run publish
```

## Project Structure

```
@mbc-cqrs-serverless-web/
├── packages/
│   ├── shared-ui/          # UI component library
│   └── survey/             # Survey system
├── apps/
│   └── mebs-builshiru-web/ # Main Next.js app
├── package.json            # Root package.json
├── lerna.json             # Lerna configuration
└── tsconfig.json          # Root TypeScript config
```

## Contributing

1. Make changes to the relevant package
2. Run tests: `npm run test`
3. Build packages: `npm run build`
4. Commit changes with conventional commits
5. Create a pull request

## License

MIT
