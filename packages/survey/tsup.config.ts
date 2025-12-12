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
  external: ['next', 'next/navigation', 'next/dynamic'],
  esbuildOptions(options) {
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

      // Run the original post-build script
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
