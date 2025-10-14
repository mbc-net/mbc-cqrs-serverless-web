# Survey Package Library Build Plan

## Overview

This document outlines the plan to transform the `@mbc-cqrs-serverless/survey` package from a simple source export to a proper buildable library, following the same patterns established in the `@mbc-cqrs-serverless-web/master` package.

## Current State Analysis

### Master Package Structure (Reference)

- **Build Tool**: tsup (TypeScript bundler)
- **Entry Points**: Multiple entry points for different modules
- **Output Formats**: CommonJS (.js) and ESM (.mjs)
- **TypeScript**: Full type definitions (.d.ts)
- **CSS Processing**: PostCSS with Tailwind CSS
- **Post-build**: Custom script to fix "use client" directives
- **Exports**: Named exports for each major module

### Survey Package Current State

- **Current Structure**: Simple source code export
- **Main Entry**: `src/index.ts` with basic re-exports
- **Modules**: Well-organized modular structure
- **Dependencies**: Minimal package.json with basic configuration
- **Build System**: None (direct source export)

## Build Configuration Plan

### 1. Package.json Updates

#### Core Package Configuration

```json
{
  "name": "@mbc-cqrs-serverless-web/survey",
  "version": "0.0.1",
  "private": false,
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "exports": {
    "./styles": {
      "types": "./dist/styles.d.ts",
      "import": "./dist/styles.mjs",
      "require": "./dist/styles.js"
    },
    "./SurveyTemplatePage": {
      "types": "./dist/SurveyTemplatePage.d.ts",
      "import": "./dist/SurveyTemplatePage.mjs",
      "require": "./dist/SurveyTemplatePage.js"
    },
    "./EditSurveyTemplatePage": {
      "types": "./dist/EditSurveyTemplatePage.d.ts",
      "import": "./dist/EditSurveyTemplatePage.mjs",
      "require": "./dist/EditSurveyTemplatePage.js"
    },
    "./SurveyForm": {
      "types": "./dist/SurveyForm.d.ts",
      "import": "./dist/SurveyForm.mjs",
      "require": "./dist/SurveyForm.js"
    },
    "./styles.css": "./dist/styles.css"
  }
}
```

#### Scripts Configuration

```json
{
  "scripts": {
    "prebuild": "rm -rf dist",
    "build": "tsup",
    "build:watch": "tsup --watch",
    "dev": "tsup --watch",
    "lint": "tsc --noEmit",
    "type-check": "tsc --noEmit"
  }
}
```

### 2. Build Dependencies

#### Dev Dependencies

```json
{
  "devDependencies": {
    "@swc/core": "^1.12.9",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.4.16",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "tsup": "^8.0.2",
    "typescript": "^5"
  }
}
```

#### Dependencies (Required for SurveyForm)

```json
{
  "dependencies": {
    "react-hook-form": "^7.51.3",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

#### Peer Dependencies

```json
{
  "peerDependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

### 3. tsup.config.ts Configuration

```typescript
import { defineConfig } from 'tsup'
import { exec } from 'child_process'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  entry: {
    index: 'src/index.ts', // Root export
    styles: 'src/styles.ts', // CSS styles
    SurveyTemplatePage: 'src/modules/survey-template/templates/index.tsx',
    EditSurveyTemplatePage:
      'src/modules/edit-survey-template/templates/index.tsx',
    SurveyForm: 'src/forms/survey-form.tsx',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  publicDir: 'public',
  loader: {
    '.css': 'css',
  },
  esbuildOptions(options) {
    options.jsx = 'automatic'
    return options
  },
  onSuccess: async () => {
    console.log('Build successful! Processing CSS with PostCSS...')

    const postcssProcessor = postcss([tailwindcss, autoprefixer])

    try {
      const fs = await import('fs')
      const path = await import('path')

      const cssPath = path.join(process.cwd(), 'dist', 'styles.css')
      const cssContent = fs.readFileSync(cssPath, 'utf8')

      const result = await postcssProcessor.process(cssContent, {
        from: cssPath,
        to: cssPath,
      })

      fs.writeFileSync(cssPath, result.css)
      console.log('CSS processed successfully with Tailwind CSS!')

      exec('node ./postbuild.js', (err, stdout, stderr) => {
        if (err) {
          console.error('Error during post-build:', stderr)
          return
        }
        console.log(stdout)
      })
    } catch (error) {
      console.error('Error processing CSS:', error)
    }
  },
})
```

### 4. TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "es6",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "noImplicitAny": false,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "forceConsistentCasingInFileNames": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "incremental": false,
    "baseUrl": ".",
    "paths": {
      "@mbc-cqrs-serverless-web/survey": ["dist/"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### 5. PostCSS Configuration (postcss.config.js)

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 6. Tailwind Configuration (tailwind.config.js)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 7. Post-build Script (postbuild.js)

```javascript
const fs = require('fs')
const path = require('path')
const glob = require('glob')

const distDir = path.join(__dirname, 'dist')
const files = glob.sync(`${distDir}/**/*.js`)

files.forEach((file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${file}:`, err)
      return
    }

    if (!data.startsWith('"use client"')) {
      console.log(`Fixing "use client" directive in: ${file}`)

      const cleanedData = data.replace(/"use client";?/g, '')
      const newData = `"use client";\n${cleanedData}`

      fs.writeFile(file, 'utf8', (writeErr) => {
        if (writeErr) {
          console.error(`Error writing file ${file}:`, writeErr)
        } else {
          console.log(`Successfully fixed ${file}`)
        }
      })
    }
  })
})
```

### 8. Styles Entry Point (src/styles.ts)

```typescript
// Import all CSS files
import './ui/button.css'
import './ui/input.css'
import './ui/card.css'
// ... other UI component styles

// Export for external consumption
export * from './ui'
```

### 9. Main Index Export (src/index.ts)

```typescript
// Main survey module exports
export * from './types'
export * from './forms'
export * from './renderers'
export * from './creators'
export * from './components/layout'

// Export the three main components
export { default as SurveyTemplatePage } from './modules/survey-template/templates/index'
export { default as EditSurveyTemplatePage } from './modules/edit-survey-template/templates/index'
export { SurveyForm } from './forms/survey-form'
```

## Implementation Steps

### Phase 1: Setup Build Infrastructure

1. ✅ Update `package.json` with proper library configuration
2. ✅ Install build dependencies (`tsup`, `postcss`, `tailwindcss`, etc.)
3. ✅ Create `tsup.config.ts` with entry points
4. ✅ Create `tsconfig.json` for TypeScript compilation
5. ✅ Create `postcss.config.js` and `tailwind.config.js`
6. ✅ Create `postbuild.js` script

### Phase 2: Create Entry Points

1. ✅ Create `src/styles.ts` for CSS exports
2. ✅ Create `src/ui/index.ts` for UI component exports
3. ✅ Update main `src/index.ts` with proper exports
4. ✅ Ensure all modules have proper index files

### Phase 3: Test Build Process

1. ✅ Run initial build to identify issues
2. ✅ Fix any TypeScript compilation errors
3. ✅ Verify CSS processing works correctly
4. ✅ Test "use client" directive fixing
5. ✅ Validate output structure

### Phase 4: Integration Testing

1. ✅ Test imports in consuming applications
2. ✅ Verify tree-shaking works correctly
3. ✅ Test both CommonJS and ESM imports
4. ✅ Validate TypeScript definitions

### Phase 5: Documentation and Publishing

1. ✅ Update README with usage examples
2. ✅ Document all exported modules
3. ✅ Set up publishing workflow
4. ✅ Version and publish package

## Expected Output Structure

```
dist/
├── index.js / index.mjs / index.d.ts
├── styles.js / styles.mjs / styles.d.ts / styles.css
├── SurveyTemplatePage.js / SurveyTemplatePage.mjs / SurveyTemplatePage.d.ts
├── EditSurveyTemplatePage.js / EditSurveyTemplatePage.mjs / EditSurveyTemplatePage.d.ts
├── SurveyForm.js / SurveyForm.mjs / SurveyForm.d.ts
└── sourcemaps...
```

## Usage Examples

### Importing Individual Components

```typescript
// Import specific components
import { SurveyTemplatePage } from '@mbc-cqrs-serverless-web/survey/SurveyTemplatePage'
import { EditSurveyTemplatePage } from '@mbc-cqrs-serverless-web/survey/EditSurveyTemplatePage'
import { SurveyForm } from '@mbc-cqrs-serverless-web/survey/SurveyForm'

// Import styles
import '@mbc-cqrs-serverless-web/survey/styles.css'
```

### Importing from Main Entry

```typescript
// Import from main entry point
import {
  SurveyTemplatePage,
  EditSurveyTemplatePage,
  SurveyForm,
} from '@mbc-cqrs-serverless-web/survey'
```

## Benefits of This Approach

1. **Focused Exports**: Only exports the three essential components you need
2. **Modular Imports**: Consumers can import only what they need
3. **Tree Shaking**: Unused code can be eliminated during bundling
4. **Type Safety**: Full TypeScript support with proper definitions
5. **CSS Support**: Proper CSS processing and bundling
6. **Framework Compatibility**: Works with both CommonJS and ESM
7. **Next.js Compatibility**: Proper "use client" directive handling
8. **Performance**: Optimized builds with source maps for debugging

## Migration Notes

- The build will only export the three specified components
- All dependencies for these components will be bundled appropriately
- CSS imports will need to be updated to use the new styles export
- Testing will be required to ensure all functionality works correctly

This simplified build plan focuses specifically on your three required components while maintaining the same proven build patterns from the master package.
