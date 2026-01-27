import { defineConfig } from 'tsup'
import { exec } from 'child_process'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  entry: {
    index: 'src/index.ts', // Root export
    styles: 'src/styles.ts',
    MasterSetting: 'src/modules/master-settings/templates/index.tsx',
    MasterData: 'src/modules/master-data/templates/index.tsx',
    EditMasterSettings: 'src/modules/edit-master-settings/templates/index.tsx',
    EditMasterData: 'src/modules/edit-master-data/templates/index.tsx',
    AppProviders: 'src/provider.tsx',
    UrlProvider: 'src/lib/constants/url.ts',
    MsLayout: 'src/components/MsLayout.tsx',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  publicDir: 'public',
  // React、React DOM、Next.jsを外部化してコンテキスト分離問題を解決
  external: ['react', 'react-dom', 'next', 'next/navigation', 'next/link'],
  loader: {
    '.css': 'css',
  },
  esbuildOptions(options) {
    options.jsx = 'automatic'
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
