import { readFileSync } from 'fs'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import postcssImport from 'postcss-import'
import postcssPresetEnv from 'postcss-preset-env'
import { defineConfig } from 'rollup'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'

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
	// Externalize other dependencies that should not be bundled
	'class-variance-authority',
	'clsx',
	'tailwind-merge',
	'lucide-react',
	'cmdk',
	'react-day-picker',
	'date-fns',
]

// PostCSS plugins
const postcssPlugins = [
	postcssImport(),
	postcssPresetEnv({
		features: {
			'custom-properties': false, // We want to keep CSS variables as-is
			'nesting-rules': true,
		},
		autoprefixer: {
			flexbox: 'no-2009',
		},
	}),
]

// TypeScript plugin configuration
const typescriptConfig = {
	tsconfig: './tsconfig.json',
	declaration: true,
	declarationMap: true,
	outDir: 'dist',
	exclude: [
		'**/*.test.*',
		'**/*.spec.*',
		'**/__tests__/**',
		'**/stories/**',
		'**/dist/**',
		'**/node_modules/**',
	],
	include: ['src/**/*'],
}

// Terser configuration for production
const terserConfig = {
	compress: {
		drop_console: !isDev,
		drop_debugger: !isDev,
		pure_funcs: isProduction ? ['console.log', 'console.info'] : [],
	},
	mangle: {
		keep_fnames: isDev,
	},
	format: {
		comments: false,
	},
}

export default defineConfig([
	// Main build configuration
	{
		input: 'src/index.ts',
		output: [
			{
				file: packageJson.main,
				format: 'cjs',
				sourcemap: true,
				exports: 'named',
				generatedCode: {
					constBindings: true,
				},
			},
			{
				file: packageJson.module,
				format: 'esm',
				sourcemap: true,
				exports: 'named',
				generatedCode: {
					constBindings: true,
				},
			},
		],
		plugins: [
			// Externalize peer dependencies
			external({
				includeDependencies: false,
			}),

			// Resolve node modules
			resolve({
				browser: true,
				preferBuiltins: false,
				dedupe: ['react', 'react-dom'],
				extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
			}),

			// TypeScript compilation
			typescript({
				tsconfig: './tsconfig.json',
				declaration: false,
				declarationMap: false,
				jsx: 'react-jsx',
			}),

			// Convert CommonJS to ES modules
			commonjs({
				include: /node_modules/,
				transformMixedEsModules: true,
			}),

			// PostCSS processing
			postcss({
				extract: true,
				minimize: isProduction,
				modules: false,
				use: {
					sass: null,
					stylus: null,
					less: null,
				},
				plugins: postcssPlugins,
				sourceMap: true,
			}),

			// Minification for production
			...(isProduction ? [terser(terserConfig)] : []),
		],
		external: externalDeps,
		treeshake: {
			moduleSideEffects: false,
			propertyReadSideEffects: false,
			unknownGlobalSideEffects: false,
		},
		onwarn(warning, warn) {
			// Suppress certain warnings
			if (warning.code === 'UNRESOLVED_IMPORT') return
			if (warning.code === 'CIRCULAR_DEPENDENCY') return
			if (warning.code === 'EVAL') return
			warn(warning)
		},
	},

	// Server-compatible build (no client-only components)
	{
		input: 'src/server.ts',
		output: [
			{
				file: 'dist/server.js',
				format: 'cjs',
				sourcemap: true,
				exports: 'named',
				generatedCode: {
					constBindings: true,
				},
			},
			{
				file: 'dist/server.esm.js',
				format: 'esm',
				sourcemap: true,
				exports: 'named',
				generatedCode: {
					constBindings: true,
				},
			},
		],
		plugins: [
			// Externalize peer dependencies
			external({
				includeDependencies: false,
			}),

			// Resolve node modules
			resolve({
				browser: true,
				preferBuiltins: false,
				dedupe: ['react', 'react-dom'],
				extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
			}),

			// TypeScript compilation
			typescript({
				tsconfig: './tsconfig.json',
				declaration: false,
				declarationMap: false,
				jsx: 'react-jsx',
			}),

			// Convert CommonJS to ES modules
			commonjs({
				include: /node_modules/,
				transformMixedEsModules: true,
			}),

			// PostCSS processing
			postcss({
				extract: true,
				minimize: isProduction,
				modules: false,
				use: {
					sass: null,
					stylus: null,
					less: null,
				},
				plugins: postcssPlugins,
				sourceMap: true,
			}),

			// Minification for production
			...(isProduction ? [terser(terserConfig)] : []),
		],
		external: externalDeps,
		treeshake: {
			moduleSideEffects: false,
			propertyReadSideEffects: false,
			unknownGlobalSideEffects: false,
		},
		onwarn(warning, warn) {
			// Suppress certain warnings
			if (warning.code === 'UNRESOLVED_IMPORT') return
			if (warning.code === 'CIRCULAR_DEPENDENCY') return
			if (warning.code === 'EVAL') return
			warn(warning)
		},
	},

	// CSS-only build for styles
	{
		input: 'src/styles/index.css',
		output: {
			file: 'dist/styles.css',
			format: 'es',
		},
		plugins: [
			postcss({
				extract: true,
				minimize: isProduction,
				modules: false,
				plugins: postcssPlugins,
				sourceMap: true,
			}),
		],
	},
	// TypeScript declarations build
	{
		input: 'src/index.ts',
		output: [
			{
				file: 'dist/index.d.ts',
				format: 'esm',
			},
		],
		plugins: [
			// Externalize peer dependencies
			external({
				includeDependencies: false,
			}),
			// Resolve node modules
			resolve({
				browser: true,
				preferBuiltins: false,
				dedupe: ['react', 'react-dom'],
				extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
			}),
			// TypeScript compilation for declarations only
			typescript({
				tsconfig: './tsconfig.json',
				declaration: true,
				declarationMap: true,
				jsx: 'react-jsx',
				emitDeclarationOnly: true,
			}),
		],
		external: [...externalDeps, /\.css$/],
	},
])
