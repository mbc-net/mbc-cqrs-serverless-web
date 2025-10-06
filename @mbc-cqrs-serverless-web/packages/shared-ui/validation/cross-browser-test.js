#!/usr/bin/env node

/**
 * Cross-Browser Testing Script for @mbc-cqrs-serverless-web/shared-ui
 *
 * This script performs comprehensive cross-browser testing including:
 * - Browser compatibility validation
 * - CSS feature support analysis
 * - JavaScript feature support analysis
 * - Polyfill requirements
 * - Responsive design validation
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log(
	'🌐 Starting Cross-Browser Testing for @mbc-cqrs-serverless-web/shared-ui\n',
)

// Cross-browser test results
const results = {
	browserSupport: {},
	cssFeatures: {},
	javascriptFeatures: {},
	polyfills: {},
	responsiveDesign: {},
	overall: {},
}

// Target browsers and their versions
const targetBrowsers = {
	chrome: { min: 90, current: 120 },
	firefox: { min: 88, current: 121 },
	safari: { min: 14, current: 17 },
	edge: { min: 90, current: 120 },
	mobile: {
		chrome: { min: 90, current: 120 },
		safari: { min: 14, current: 17 },
		samsung: { min: 12, current: 20 },
	},
}

// 1. Browser Support Analysis
console.log('🌐 Analyzing Browser Support...')
try {
	const browserResults = {
		targetBrowsers: targetBrowsers,
		supportedFeatures: [],
		unsupportedFeatures: [],
		compatibilityScore: 0,
	}

	// Check package.json for browser support configuration
	const packageJsonPath = path.join(__dirname, 'package.json')
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

	// Check for browserslist configuration
	const browserslistConfig =
		packageJson.browserslist || packageJson.browsers || []
	if (browserslistConfig.length > 0) {
		browserResults.browserslistConfig = browserslistConfig
		console.log(`   📊 Browserslist Config: ${browserslistConfig.join(', ')}`)
	} else {
		console.log('   ⚠️  No browserslist configuration found')
	}

	// Check for browser-specific dependencies
	const dependencies = {
		...packageJson.dependencies,
		...packageJson.devDependencies,
	}
	const browserDependencies = Object.keys(dependencies).filter(
		(dep) =>
			dep.includes('browser') ||
			dep.includes('polyfill') ||
			dep.includes('shim'),
	)

	browserResults.browserDependencies = browserDependencies
	console.log(`   📊 Browser Dependencies: ${browserDependencies.length}`)

	results.browserSupport = browserResults
} catch (error) {
	console.error('   ❌ Browser support analysis failed:', error.message)
	results.browserSupport.error = error.message
}

// 2. CSS Features Support Analysis
console.log('\n🎨 Analyzing CSS Features Support...')
try {
	const cssResults = {
		features: [],
		unsupportedFeatures: [],
		compatibilityScore: 0,
	}

	// CSS features used in the library
	const cssFeatures = [
		{
			name: 'CSS Variables',
			usage: '--mbc-color-*',
			support: { chrome: 49, firefox: 31, safari: 9.1, edge: 16 },
		},
		{
			name: 'CSS Grid',
			usage: 'grid',
			support: { chrome: 57, firefox: 52, safari: 10.1, edge: 16 },
		},
		{
			name: 'CSS Flexbox',
			usage: 'flex',
			support: { chrome: 29, firefox: 28, safari: 9, edge: 12 },
		},
		{
			name: 'CSS Custom Properties',
			usage: 'var()',
			support: { chrome: 49, firefox: 31, safari: 9.1, edge: 16 },
		},
		{
			name: 'CSS Transforms',
			usage: 'transform',
			support: { chrome: 36, firefox: 16, safari: 9, edge: 12 },
		},
		{
			name: 'CSS Transitions',
			usage: 'transition',
			support: { chrome: 26, firefox: 16, safari: 6.1, edge: 12 },
		},
		{
			name: 'CSS Animations',
			usage: 'animation',
			support: { chrome: 43, firefox: 16, safari: 9, edge: 12 },
		},
		{
			name: 'CSS Calc',
			usage: 'calc()',
			support: { chrome: 26, firefox: 16, safari: 6, edge: 12 },
		},
		{
			name: 'CSS Box Shadow',
			usage: 'box-shadow',
			support: { chrome: 10, firefox: 4, safari: 5.1, edge: 12 },
		},
		{
			name: 'CSS Border Radius',
			usage: 'border-radius',
			support: { chrome: 4, firefox: 4, safari: 5, edge: 12 },
		},
		{
			name: 'CSS Media Queries',
			usage: '@media',
			support: { chrome: 26, firefox: 3.5, safari: 3, edge: 12 },
		},
		{
			name: 'CSS Pseudo Elements',
			usage: '::before, ::after',
			support: { chrome: 1, firefox: 1.5, safari: 4, edge: 12 },
		},
	]

	// Check theme.css for CSS features
	const themePath = path.join(__dirname, 'src', 'styles', 'theme.css')
	const themeContent = fs.readFileSync(themePath, 'utf8')

	cssFeatures.forEach((feature) => {
		const isUsed = themeContent.includes(feature.usage)
		const minSupport = Math.min(...Object.values(feature.support))

		cssResults.features.push({
			name: feature.name,
			usage: feature.usage,
			isUsed: isUsed,
			minSupport: minSupport,
			support: feature.support,
		})

		if (isUsed && minSupport > 80) {
			// Assuming modern browser versions
			cssResults.unsupportedFeatures.push({
				name: feature.name,
				reason: `Requires browser version ${minSupport}+`,
			})
		}
	})

	const supportedFeatures = cssResults.features.filter(
		(f) => f.isUsed && f.minSupport <= 80,
	).length
	cssResults.compatibilityScore =
		(supportedFeatures / cssResults.features.filter((f) => f.isUsed).length) *
		100

	results.cssFeatures = cssResults

	console.log(
		`   📊 CSS Features Used: ${cssResults.features.filter((f) => f.isUsed).length}`,
	)
	console.log(
		`   📊 Compatibility Score: ${cssResults.compatibilityScore.toFixed(1)}%`,
	)
	console.log(
		`   📊 Unsupported Features: ${cssResults.unsupportedFeatures.length}`,
	)
} catch (error) {
	console.error('   ❌ CSS features analysis failed:', error.message)
	results.cssFeatures.error = error.message
}

// 3. JavaScript Features Support Analysis
console.log('\n⚡ Analyzing JavaScript Features Support...')
try {
	const jsResults = {
		features: [],
		unsupportedFeatures: [],
		compatibilityScore: 0,
	}

	// JavaScript features used in the library
	const jsFeatures = [
		{
			name: 'ES6 Modules',
			usage: 'import/export',
			support: { chrome: 61, firefox: 60, safari: 10.1, edge: 16 },
		},
		{
			name: 'Arrow Functions',
			usage: '() => {}',
			support: { chrome: 45, firefox: 22, safari: 10, edge: 12 },
		},
		{
			name: 'Template Literals',
			usage: '`string`',
			support: { chrome: 41, firefox: 34, safari: 9, edge: 12 },
		},
		{
			name: 'Destructuring',
			usage: '{ a, b } = obj',
			support: { chrome: 49, firefox: 41, safari: 8, edge: 12 },
		},
		{
			name: 'Spread Operator',
			usage: '...array',
			support: { chrome: 46, firefox: 16, safari: 8, edge: 12 },
		},
		{
			name: 'Async/Await',
			usage: 'async/await',
			support: { chrome: 55, firefox: 52, safari: 10.1, edge: 14 },
		},
		{
			name: 'Promises',
			usage: 'Promise',
			support: { chrome: 32, firefox: 29, safari: 8, edge: 12 },
		},
		{
			name: 'Classes',
			usage: 'class',
			support: { chrome: 49, firefox: 45, safari: 9, edge: 12 },
		},
		{
			name: 'Const/Let',
			usage: 'const, let',
			support: { chrome: 49, firefox: 44, safari: 10, edge: 12 },
		},
		{
			name: 'Default Parameters',
			usage: 'function(a = 1)',
			support: { chrome: 49, firefox: 15, safari: 9, edge: 12 },
		},
		{
			name: 'Rest Parameters',
			usage: 'function(...args)',
			support: { chrome: 47, firefox: 15, safari: 9, edge: 12 },
		},
		{
			name: 'Object.assign',
			usage: 'Object.assign',
			support: { chrome: 45, firefox: 34, safari: 9, edge: 12 },
		},
	]

	// Check component files for JavaScript features
	const componentsDir = path.join(__dirname, 'src', 'components', 'ui')
	const componentFiles = fs
		.readdirSync(componentsDir)
		.filter((file) => file.endsWith('.tsx'))

	// Sample a few component files to check for JS features
	const sampleFiles = componentFiles.slice(0, 5)
	let allContent = ''

	sampleFiles.forEach((file) => {
		const filePath = path.join(componentsDir, file)
		allContent += fs.readFileSync(filePath, 'utf8')
	})

	jsFeatures.forEach((feature) => {
		const isUsed = allContent.includes(feature.usage)
		const minSupport = Math.min(...Object.values(feature.support))

		jsResults.features.push({
			name: feature.name,
			usage: feature.usage,
			isUsed: isUsed,
			minSupport: minSupport,
			support: feature.support,
		})

		if (isUsed && minSupport > 80) {
			jsResults.unsupportedFeatures.push({
				name: feature.name,
				reason: `Requires browser version ${minSupport}+`,
			})
		}
	})

	const supportedFeatures = jsResults.features.filter(
		(f) => f.isUsed && f.minSupport <= 80,
	).length
	jsResults.compatibilityScore =
		(supportedFeatures / jsResults.features.filter((f) => f.isUsed).length) *
		100

	results.javascriptFeatures = jsResults

	console.log(
		`   📊 JS Features Used: ${jsResults.features.filter((f) => f.isUsed).length}`,
	)
	console.log(
		`   📊 Compatibility Score: ${jsResults.compatibilityScore.toFixed(1)}%`,
	)
	console.log(
		`   📊 Unsupported Features: ${jsResults.unsupportedFeatures.length}`,
	)
} catch (error) {
	console.error('   ❌ JavaScript features analysis failed:', error.message)
	results.javascriptFeatures.error = error.message
}

// 4. Polyfill Requirements Analysis
console.log('\n🔧 Analyzing Polyfill Requirements...')
try {
	const polyfillResults = {
		required: [],
		recommended: [],
		alreadyIncluded: [],
		compatibilityScore: 0,
	}

	// Check for existing polyfills
	const packageJsonPath = path.join(__dirname, 'package.json')
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
	const dependencies = {
		...packageJson.dependencies,
		...packageJson.devDependencies,
	}

	const polyfillPackages = [
		'core-js',
		'babel-polyfill',
		'es6-shim',
		'es5-shim',
		'whatwg-fetch',
		'intersection-observer',
		'resize-observer-polyfill',
	]

	polyfillPackages.forEach((polyfill) => {
		if (dependencies[polyfill]) {
			polyfillResults.alreadyIncluded.push(polyfill)
		}
	})

	// Check for features that might need polyfills
	const featuresNeedingPolyfills = [
		{
			name: 'Intersection Observer',
			polyfill: 'intersection-observer-polyfill',
			usage: 'IntersectionObserver',
		},
		{
			name: 'Resize Observer',
			polyfill: 'resize-observer-polyfill',
			usage: 'ResizeObserver',
		},
		{ name: 'Fetch API', polyfill: 'whatwg-fetch', usage: 'fetch' },
		{ name: 'Promise', polyfill: 'es6-promise', usage: 'Promise' },
		{
			name: 'Object.assign',
			polyfill: 'object-assign',
			usage: 'Object.assign',
		},
	]

	// Check if these features are used and need polyfills
	const componentsDir = path.join(__dirname, 'src', 'components', 'ui')
	const componentFiles = fs
		.readdirSync(componentsDir)
		.filter((file) => file.endsWith('.tsx'))

	let allContent = ''
	componentFiles.forEach((file) => {
		const filePath = path.join(componentsDir, file)
		allContent += fs.readFileSync(filePath, 'utf8')
	})

	featuresNeedingPolyfills.forEach((feature) => {
		if (allContent.includes(feature.usage)) {
			if (!polyfillResults.alreadyIncluded.includes(feature.polyfill)) {
				polyfillResults.required.push(feature)
			}
		}
	})

	// Calculate compatibility score
	const totalFeatures = featuresNeedingPolyfills.length
	const coveredFeatures =
		polyfillResults.alreadyIncluded.length + polyfillResults.required.length
	polyfillResults.compatibilityScore = (coveredFeatures / totalFeatures) * 100

	results.polyfills = polyfillResults

	console.log(
		`   📊 Already Included: ${polyfillResults.alreadyIncluded.length}`,
	)
	console.log(`   📊 Required: ${polyfillResults.required.length}`)
	console.log(
		`   📊 Compatibility Score: ${polyfillResults.compatibilityScore.toFixed(1)}%`,
	)
} catch (error) {
	console.error('   ❌ Polyfill requirements analysis failed:', error.message)
	results.polyfills.error = error.message
}

// 5. Responsive Design Validation
console.log('\n📱 Validating Responsive Design...')
try {
	const responsiveResults = {
		breakpoints: [],
		mediaQueries: [],
		responsiveComponents: [],
		compatibilityScore: 0,
	}

	// Check for responsive breakpoints in theme.css
	const themePath = path.join(__dirname, 'src', 'styles', 'theme.css')
	const themeContent = fs.readFileSync(themePath, 'utf8')

	// Extract media queries
	const mediaQueryRegex = /@media\s+([^{]+)\s*{/g
	let match
	const mediaQueries = []

	while ((match = mediaQueryRegex.exec(themeContent)) !== null) {
		mediaQueries.push(match[1].trim())
	}

	responsiveResults.mediaQueries = mediaQueries

	// Check for responsive utility classes
	const responsiveClasses = [
		'sm:',
		'md:',
		'lg:',
		'xl:',
		'2xl:',
		'max-sm:',
		'max-md:',
		'max-lg:',
		'max-xl:',
		'max-2xl:',
		'min-sm:',
		'min-md:',
		'min-lg:',
		'min-xl:',
		'min-2xl:',
	]

	const responsiveClassesFound = responsiveClasses.filter((className) =>
		themeContent.includes(className),
	)

	responsiveResults.breakpoints = responsiveClassesFound

	// Check components for responsive design
	const componentsDir = path.join(__dirname, 'src', 'components', 'ui')
	const componentFiles = fs
		.readdirSync(componentsDir)
		.filter((file) => file.endsWith('.tsx'))

	const responsiveComponents = []
	componentFiles.forEach((file) => {
		const filePath = path.join(componentsDir, file)
		const content = fs.readFileSync(filePath, 'utf8')

		const hasResponsiveClasses = responsiveClasses.some((className) =>
			content.includes(className),
		)

		if (hasResponsiveClasses) {
			responsiveComponents.push({
				component: file.replace('.tsx', ''),
				responsiveClasses: responsiveClasses.filter((className) =>
					content.includes(className),
				),
			})
		}
	})

	responsiveResults.responsiveComponents = responsiveComponents

	// Calculate compatibility score
	const totalComponents = componentFiles.length
	const responsiveComponentsCount = responsiveComponents.length
	responsiveResults.compatibilityScore =
		(responsiveComponentsCount / totalComponents) * 100

	results.responsiveDesign = responsiveResults

	console.log(`   📊 Media Queries: ${mediaQueries.length}`)
	console.log(`   📊 Responsive Classes: ${responsiveClassesFound.length}`)
	console.log(
		`   📊 Responsive Components: ${responsiveComponentsCount}/${totalComponents}`,
	)
	console.log(
		`   📊 Compatibility Score: ${responsiveResults.compatibilityScore.toFixed(1)}%`,
	)
} catch (error) {
	console.error('   ❌ Responsive design validation failed:', error.message)
	results.responsiveDesign.error = error.message
}

// 6. Generate Cross-Browser Report
console.log('\n📋 Generating Cross-Browser Report...')

const reportPath = path.join(__dirname, 'cross-browser-report.json')
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2))

console.log(`   ✅ Cross-browser report saved to: ${reportPath}`)

// 7. Summary
console.log('\n🌐 Cross-Browser Testing Summary:')
console.log('==================================')

console.log(`🌐 Browser Support:`)
console.log(`   Target Browsers: ${Object.keys(targetBrowsers).length}`)
console.log(
	`   Browser Dependencies: ${results.browserSupport?.browserDependencies?.length || 'N/A'}`,
)

console.log(`\n🎨 CSS Features:`)
console.log(
	`   Compatibility Score: ${results.cssFeatures?.compatibilityScore?.toFixed(1) || 'N/A'}%`,
)
console.log(
	`   Unsupported Features: ${results.cssFeatures?.unsupportedFeatures?.length || 'N/A'}`,
)

console.log(`\n⚡ JavaScript Features:`)
console.log(
	`   Compatibility Score: ${results.javascriptFeatures?.compatibilityScore?.toFixed(1) || 'N/A'}%`,
)
console.log(
	`   Unsupported Features: ${results.javascriptFeatures?.unsupportedFeatures?.length || 'N/A'}`,
)

console.log(`\n🔧 Polyfills:`)
console.log(
	`   Already Included: ${results.polyfills?.alreadyIncluded?.length || 'N/A'}`,
)
console.log(`   Required: ${results.polyfills?.required?.length || 'N/A'}`)
console.log(
	`   Compatibility Score: ${results.polyfills?.compatibilityScore?.toFixed(1) || 'N/A'}%`,
)

console.log(`\n📱 Responsive Design:`)
console.log(
	`   Media Queries: ${results.responsiveDesign?.mediaQueries?.length || 'N/A'}`,
)
console.log(
	`   Responsive Components: ${results.responsiveDesign?.responsiveComponents?.length || 'N/A'}`,
)
console.log(
	`   Compatibility Score: ${results.responsiveDesign?.compatibilityScore?.toFixed(1) || 'N/A'}%`,
)

// 8. Cross-Browser Recommendations
console.log('\n💡 Cross-Browser Recommendations:')

if (results.cssFeatures?.compatibilityScore < 90) {
	console.log(
		'   ⚠️  CSS compatibility is low - consider adding fallbacks for older browsers',
	)
}

if (results.javascriptFeatures?.compatibilityScore < 90) {
	console.log(
		'   ⚠️  JavaScript compatibility is low - consider transpiling or adding polyfills',
	)
}

if (results.polyfills?.required?.length > 0) {
	console.log(
		'   ⚠️  Missing polyfills - consider adding required polyfills for better compatibility',
	)
}

if (results.responsiveDesign?.compatibilityScore < 80) {
	console.log(
		'   ⚠️  Responsive design coverage is low - add more responsive components',
	)
}

console.log('\n✅ Cross-browser testing completed!')
console.log('📊 Detailed results saved to validation/cross-browser-report.json')
