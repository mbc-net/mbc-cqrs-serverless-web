import { readFileSync } from 'fs'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import postcssImport from 'postcss-import'
import postcssPresetEnv from 'postcss-preset-env'
import { defineConfig } from 'rollup'
import analyzer from 'rollup-plugin-analyzer'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import { visualizer } from 'rollup-plugin-visualizer'

// Read package.json
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'))

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

// External dependencies
const externalDeps = [
	...Object.keys(packageJson.peerDependencies || {}),
	'react/jsx-runtime',
	'react/jsx-dev-runtime',
	// Externalize shared-ui components
	'@mbc-cqrs-serverless-web/shared-ui',
	// Externalize Radix UI components to preserve "use client" directives
	'@radix-ui/react-slot',
	'@radix-ui/react-label',
	'@radix-ui/react-avatar',
	'@radix-ui/react-select',
	'@radix-ui/react-checkbox',
	'@radix-ui/react-radio-group',
	'@radix-ui/react-switch',
	'@radix-ui/react-accordion',
	'@radix-ui/react-collapsible',
	'@radix-ui/react-tabs',
	'@radix-ui/react-scroll-area',
	'@radix-ui/react-toast',
	'@radix-ui/react-separator',
	'@radix-ui/react-dialog',
	'@radix-ui/react-tooltip',
	'@radix-ui/react-popover',
	'@radix-ui/react-alert-dialog',
	'@radix-ui/react-dropdown-menu',
	// Externalize survey-specific dependencies
	'react-hook-form',
	'zod',
	'@hookform/resolvers',
	'@dnd-kit/core',
	'@dnd-kit/sortable',
	// Externalize other dependencies that should not be bundled
	'class-variance-authority',
	'clsx',
	'tailwind-merge',
	'lucide-react',
	'cmdk',
	'date-fns',
	'react-day-picker',
]

export default defineConfig({
	input: 'src/index.ts',
	output: [
		{
			file: 'dist/index.js',
			format: 'cjs',
			sourcemap: true,
			exports: 'named',
		},
		{
			file: 'dist/index.esm.js',
			format: 'esm',
			sourcemap: true,
			exports: 'named',
		},
	],
	external: externalDeps,
	plugins: [
		// Externalize peer dependencies
		external({
			includeDependencies: false,
		}),

		// Resolve node modules
		resolve({
			browser: true,
			preferBuiltins: false,
		}),

		// Convert CommonJS to ES modules
		commonjs(),

		// TypeScript compilation
		typescript({
			tsconfig: './tsconfig.json',
			declaration: true,
			declarationDir: './dist',
			exclude: ['**/*.test.*', '**/*.spec.*'],
		}),

		// PostCSS processing
		postcss({
			extract: true,
			minimize: isProduction,
			plugins: [
				postcssImport(),
				postcssPresetEnv({
					stage: 3,
					features: {
						'custom-properties': false,
						'custom-media-queries': true,
						'media-queries-ranges': true,
						'custom-selectors': true,
						'nesting-rules': true,
					},
				}),
			],
		}),

		// Minification for production
		...(isProduction ? [terser()] : []),

		// Bundle analysis
		...(isDev
			? [
					analyzer({
						summaryOnly: true,
						limit: 20,
					}),
				]
			: []),

		// Bundle visualization
		...(isProduction
			? [
					visualizer({
						filename: 'dist/bundle-analysis.html',
						open: false,
						gzipSize: true,
						brotliSize: true,
					}),
				]
			: []),
	],
	onwarn(warning, warn) {
		// Suppress certain warnings
		if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return
		if (warning.code === 'CIRCULAR_DEPENDENCY') return
		if (warning.code === 'EVAL') return
		warn(warning)
	},
})
