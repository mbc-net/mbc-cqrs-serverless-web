import { defineConfig } from 'tsup'
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
    SurveyCreator: 'src/creators/survey-creator.tsx',
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
  // React、React DOM、Next.jsを外部化してコンテキスト分離問題を解決
  external: ['react', 'react-dom', 'next', 'next/navigation', 'next/dynamic'],
  esbuildOptions(options) {
    // Classic JSX needs `React` in scope for `React.createElement`. The banner
    // supplies it; `postbuild.js` then strips colliding
    // `import * as React from "react"` lines so Turbopack does not error with
    // "the name `React` is defined multiple times".
    options.jsx = 'transform'
    options.jsxFactory = 'React.createElement'
    options.jsxFragment = 'React.Fragment'
    options.platform = 'browser'
    options.target = 'es2020'
    options.banner = {
      js: 'import React from "react";',
    }
    return options
  },
  // Process CSS with PostCSS/Tailwind
  onSuccess: async () => {
    console.log('Build successful! Processing CSS with PostCSS...')

    // Process CSS with PostCSS
    const postcssProcessor = postcss([tailwindcss, autoprefixer])

    try {
      const fs = await import('fs')
      const path = await import('path')

      // Read the CSS file
      const cssPath = path.join(process.cwd(), 'dist', 'styles.css')
      const cssContent = fs.readFileSync(cssPath, 'utf8')

      // Process with PostCSS
      const result = await postcssProcessor.process(cssContent, {
        from: cssPath,
        to: cssPath,
      })

      // Write the processed CSS
      fs.writeFileSync(cssPath, result.css)

      console.log('CSS processed successfully with Tailwind CSS!')

      // Run post-build synchronously so "use client" + React import dedupe
      // finish before consumers copy/publish `dist/`.
      const { execSync } = await import('child_process')
      console.log(execSync('node ./postbuild.js', { encoding: 'utf8' }))
    } catch (error) {
      console.error('Error processing CSS:', error)
    }
  },
})
