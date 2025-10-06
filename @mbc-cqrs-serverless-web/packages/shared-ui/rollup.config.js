import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'

const packageJson = require('./package.json')

export default defineConfig([
	// Main build
	{
		input: 'src/index.ts',
		output: [
			{
				file: packageJson.main,
				format: 'cjs',
				sourcemap: true,
				exports: 'named',
			},
			{
				file: packageJson.module,
				format: 'esm',
				sourcemap: true,
				exports: 'named',
			},
		],
		plugins: [
			external(),
			resolve({
				browser: true,
				preferBuiltins: false,
			}),
			commonjs(),
			typescript({
				tsconfig: './tsconfig.json',
				declaration: false,
				declarationMap: false,
			}),
			postcss({
				extract: true,
				minimize: true,
				modules: false,
			}),
			terser(),
		],
		external: [
			...Object.keys(packageJson.peerDependencies || {}),
			...Object.keys(packageJson.dependencies || {}),
			'react/jsx-runtime',
		],
	},
	// Type definitions
	{
		input: 'dist/index.d.ts',
		output: [{ file: 'dist/index.d.ts', format: 'esm' }],
		plugins: [dts()],
		external: [/\.css$/],
	},
])
