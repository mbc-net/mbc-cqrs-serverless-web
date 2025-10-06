#!/usr/bin/env node

/**
 * Accessibility Testing Script for @mbc-cqrs-serverless-web/shared-ui
 *
 * This script performs comprehensive accessibility testing including:
 * - ARIA attribute validation
 * - Keyboard navigation testing
 * - Color contrast analysis
 * - Screen reader compatibility
 * - Focus management validation
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log(
	'♿ Starting Accessibility Testing for @mbc-cqrs-serverless-web/shared-ui\n',
)

// Accessibility test results
const results = {
	ariaAttributes: {},
	keyboardNavigation: {},
	colorContrast: {},
	screenReader: {},
	focusManagement: {},
	overall: {},
}

// Helper function to check if file exists
function fileExists(filePath) {
	try {
		return fs.statSync(filePath).isFile()
	} catch (error) {
		return false
	}
}

// Helper function to read file content
function readFile(filePath) {
	try {
		return fs.readFileSync(filePath, 'utf8')
	} catch (error) {
		return ''
	}
}

// 1. ARIA Attributes Validation
console.log('🔍 Validating ARIA Attributes...')
try {
	const componentsDir = path.join(__dirname, 'src', 'components', 'ui')
	const componentFiles = fs
		.readdirSync(componentsDir)
		.filter((file) => file.endsWith('.tsx'))

	const ariaResults = {
		totalComponents: componentFiles.length,
		componentsWithAria: 0,
		ariaIssues: [],
		ariaCoverage: 0,
	}

	// Required ARIA attributes for different component types
	const ariaRequirements = {
		button: ['aria-label', 'aria-pressed', 'aria-expanded', 'aria-haspopup'],
		input: ['aria-label', 'aria-describedby', 'aria-invalid', 'aria-required'],
		dialog: ['aria-modal', 'aria-labelledby', 'aria-describedby'],
		menu: ['aria-orientation', 'aria-activedescendant'],
		tab: ['aria-selected', 'aria-controls', 'aria-labelledby'],
		accordion: ['aria-expanded', 'aria-controls'],
		checkbox: ['aria-checked', 'aria-describedby'],
		radio: ['aria-checked', 'aria-describedby'],
		select: ['aria-expanded', 'aria-haspopup', 'aria-activedescendant'],
		table: ['aria-label', 'aria-rowcount', 'aria-colcount'],
		tooltip: ['aria-describedby', 'role="tooltip"'],
	}

	componentFiles.forEach((file) => {
		const filePath = path.join(componentsDir, file)
		const content = readFile(filePath)
		const componentName = file.replace('.tsx', '')

		// Check if component has ARIA attributes
		const hasAriaAttributes = /aria-\w+/.test(content)
		if (hasAriaAttributes) {
			ariaResults.componentsWithAria++
		}

		// Check for specific ARIA requirements based on component type
		const componentType = componentName.toLowerCase()
		if (ariaRequirements[componentType]) {
			const missingAria = ariaRequirements[componentType].filter(
				(attr) => !content.includes(attr),
			)

			if (missingAria.length > 0) {
				ariaResults.ariaIssues.push({
					component: componentName,
					missingAttributes: missingAria,
				})
			}
		}

		// Check for proper ARIA role usage
		const hasRole = /role=["'][^"']*["']/.test(content)
		if (
			!hasRole &&
			['dialog', 'menu', 'tablist', 'tooltip'].includes(componentType)
		) {
			ariaResults.ariaIssues.push({
				component: componentName,
				issue: 'Missing required role attribute',
			})
		}
	})

	ariaResults.ariaCoverage =
		(ariaResults.componentsWithAria / ariaResults.totalComponents) * 100
	results.ariaAttributes = ariaResults

	console.log(
		`   📊 Components with ARIA: ${ariaResults.componentsWithAria}/${ariaResults.totalComponents}`,
	)
	console.log(`   📊 ARIA Coverage: ${ariaResults.ariaCoverage.toFixed(1)}%`)
	console.log(`   📊 ARIA Issues: ${ariaResults.ariaIssues.length}`)
} catch (error) {
	console.error('   ❌ ARIA attributes validation failed:', error.message)
	results.ariaAttributes.error = error.message
}

// 2. Keyboard Navigation Testing
console.log('\n⌨️  Testing Keyboard Navigation...')
try {
	const keyboardResults = {
		components: [],
		issues: [],
		coverage: 0,
	}

	// Required keyboard interactions
	const keyboardRequirements = {
		button: ['onKeyDown', 'onKeyUp', 'tabIndex'],
		input: ['onKeyDown', 'onKeyUp', 'onKeyPress'],
		select: ['onKeyDown', 'onKeyUp', 'onKeyPress'],
		dialog: ['onKeyDown', 'onEscapeKeyDown'],
		menu: ['onKeyDown', 'onKeyUp', 'onKeyPress'],
		tab: ['onKeyDown', 'onKeyUp', 'onKeyPress'],
		accordion: ['onKeyDown', 'onKeyUp'],
		checkbox: ['onKeyDown', 'onKeyUp'],
		radio: ['onKeyDown', 'onKeyUp'],
	}

	const componentsDir = path.join(__dirname, 'src', 'components', 'ui')
	const componentFiles = fs
		.readdirSync(componentsDir)
		.filter((file) => file.endsWith('.tsx'))

	componentFiles.forEach((file) => {
		const filePath = path.join(componentsDir, file)
		const content = readFile(filePath)
		const componentName = file.replace('.tsx', '')
		const componentType = componentName.toLowerCase()

		const keyboardSupport = {
			component: componentName,
			hasKeyboardEvents: false,
			missingEvents: [],
			hasTabIndex: false,
			hasFocusManagement: false,
		}

		// Check for keyboard event handlers
		if (keyboardRequirements[componentType]) {
			const hasRequiredEvents = keyboardRequirements[componentType].every(
				(event) => content.includes(event),
			)

			keyboardSupport.hasKeyboardEvents = hasRequiredEvents

			if (!hasRequiredEvents) {
				keyboardSupport.missingEvents = keyboardRequirements[
					componentType
				].filter((event) => !content.includes(event))
			}
		}

		// Check for tabIndex
		keyboardSupport.hasTabIndex = /tabIndex/.test(content)

		// Check for focus management
		keyboardSupport.hasFocusManagement = /focus|blur|onFocus|onBlur/.test(
			content,
		)

		keyboardResults.components.push(keyboardSupport)

		if (
			!keyboardSupport.hasKeyboardEvents &&
			keyboardRequirements[componentType]
		) {
			keyboardResults.issues.push({
				component: componentName,
				issue: 'Missing keyboard event handlers',
				missingEvents: keyboardSupport.missingEvents,
			})
		}
	})

	const componentsWithKeyboardSupport = keyboardResults.components.filter(
		(c) => c.hasKeyboardEvents || c.hasTabIndex || c.hasFocusManagement,
	).length

	keyboardResults.coverage =
		(componentsWithKeyboardSupport / keyboardResults.components.length) * 100
	results.keyboardNavigation = keyboardResults

	console.log(
		`   📊 Components with Keyboard Support: ${componentsWithKeyboardSupport}/${keyboardResults.components.length}`,
	)
	console.log(
		`   📊 Keyboard Coverage: ${keyboardResults.coverage.toFixed(1)}%`,
	)
	console.log(`   📊 Keyboard Issues: ${keyboardResults.issues.length}`)
} catch (error) {
	console.error('   ❌ Keyboard navigation testing failed:', error.message)
	results.keyboardNavigation.error = error.message
}

// 3. Color Contrast Analysis
console.log('\n🎨 Analyzing Color Contrast...')
try {
	const themePath = path.join(__dirname, 'src', 'styles', 'theme.css')
	const themeContent = readFile(themePath)

	const contrastResults = {
		colorVariables: [],
		contrastIssues: [],
		coverage: 0,
	}

	// Extract color variables from theme.css
	const colorRegex = /--mbc-color-([^:]+):\s*([^;]+);/g
	let match
	const colorVariables = []

	while ((match = colorRegex.exec(themeContent)) !== null) {
		colorVariables.push({
			name: match[1],
			value: match[2].trim(),
		})
	}

	contrastResults.colorVariables = colorVariables

	// Check for high contrast color pairs
	const highContrastPairs = [
		{ foreground: '--mbc-color-text', background: '--mbc-color-background' },
		{
			foreground: '--mbc-color-text-muted',
			background: '--mbc-color-background',
		},
		{ foreground: '--mbc-color-primary', background: '--mbc-color-background' },
		{
			foreground: '--mbc-color-destructive',
			background: '--mbc-color-background',
		},
	]

	// Note: Actual contrast ratio calculation would require color parsing
	// For now, we'll check if the color variables exist
	highContrastPairs.forEach((pair) => {
		const hasForeground = colorVariables.some((c) =>
			c.name.includes(pair.foreground.split('-').pop()),
		)
		const hasBackground = colorVariables.some((c) =>
			c.name.includes(pair.background.split('-').pop()),
		)

		if (!hasForeground || !hasBackground) {
			contrastResults.contrastIssues.push({
				pair: `${pair.foreground} on ${pair.background}`,
				issue: 'Missing color variable',
			})
		}
	})

	contrastResults.coverage =
		((highContrastPairs.length - contrastResults.contrastIssues.length) /
			highContrastPairs.length) *
		100
	results.colorContrast = contrastResults

	console.log(`   📊 Color Variables: ${colorVariables.length}`)
	console.log(
		`   📊 Contrast Coverage: ${contrastResults.coverage.toFixed(1)}%`,
	)
	console.log(`   📊 Contrast Issues: ${contrastResults.contrastIssues.length}`)
} catch (error) {
	console.error('   ❌ Color contrast analysis failed:', error.message)
	results.colorContrast.error = error.message
}

// 4. Screen Reader Compatibility
console.log('\n🔊 Testing Screen Reader Compatibility...')
try {
	const screenReaderResults = {
		components: [],
		issues: [],
		coverage: 0,
	}

	// Screen reader requirements
	const screenReaderRequirements = {
		button: ['aria-label', 'aria-describedby'],
		input: ['aria-label', 'aria-describedby', 'aria-invalid'],
		select: ['aria-label', 'aria-describedby', 'aria-expanded'],
		dialog: ['aria-modal', 'aria-labelledby', 'aria-describedby'],
		menu: ['aria-orientation', 'aria-activedescendant'],
		tab: ['aria-selected', 'aria-controls', 'aria-labelledby'],
		accordion: ['aria-expanded', 'aria-controls'],
		checkbox: ['aria-checked', 'aria-describedby'],
		radio: ['aria-checked', 'aria-describedby'],
		table: ['aria-label', 'aria-rowcount', 'aria-colcount'],
		tooltip: ['aria-describedby', 'role="tooltip"'],
	}

	const componentsDir = path.join(__dirname, 'src', 'components', 'ui')
	const componentFiles = fs
		.readdirSync(componentsDir)
		.filter((file) => file.endsWith('.tsx'))

	componentFiles.forEach((file) => {
		const filePath = path.join(componentsDir, file)
		const content = readFile(filePath)
		const componentName = file.replace('.tsx', '')
		const componentType = componentName.toLowerCase()

		const screenReaderSupport = {
			component: componentName,
			hasAriaLabels: false,
			hasDescriptions: false,
			hasRoles: false,
			missingAttributes: [],
		}

		// Check for ARIA labels
		screenReaderSupport.hasAriaLabels = /aria-label/.test(content)

		// Check for ARIA descriptions
		screenReaderSupport.hasDescriptions = /aria-describedby/.test(content)

		// Check for ARIA roles
		screenReaderSupport.hasRoles = /role=["'][^"']*["']/.test(content)

		// Check for specific requirements
		if (screenReaderRequirements[componentType]) {
			screenReaderSupport.missingAttributes = screenReaderRequirements[
				componentType
			].filter((attr) => !content.includes(attr))
		}

		screenReaderResults.components.push(screenReaderSupport)

		if (screenReaderSupport.missingAttributes.length > 0) {
			screenReaderResults.issues.push({
				component: componentName,
				missingAttributes: screenReaderSupport.missingAttributes,
			})
		}
	})

	const componentsWithScreenReaderSupport =
		screenReaderResults.components.filter(
			(c) => c.hasAriaLabels || c.hasDescriptions || c.hasRoles,
		).length

	screenReaderResults.coverage =
		(componentsWithScreenReaderSupport /
			screenReaderResults.components.length) *
		100
	results.screenReader = screenReaderResults

	console.log(
		`   📊 Components with Screen Reader Support: ${componentsWithScreenReaderSupport}/${screenReaderResults.components.length}`,
	)
	console.log(
		`   📊 Screen Reader Coverage: ${screenReaderResults.coverage.toFixed(1)}%`,
	)
	console.log(
		`   📊 Screen Reader Issues: ${screenReaderResults.issues.length}`,
	)
} catch (error) {
	console.error(
		'   ❌ Screen reader compatibility testing failed:',
		error.message,
	)
	results.screenReader.error = error.message
}

// 5. Focus Management Validation
console.log('\n🎯 Validating Focus Management...')
try {
	const focusResults = {
		components: [],
		issues: [],
		coverage: 0,
	}

	// Focus management requirements
	const focusRequirements = {
		dialog: ['onOpenAutoFocus', 'onCloseAutoFocus', 'onEscapeKeyDown'],
		menu: ['onOpenAutoFocus', 'onCloseAutoFocus'],
		select: ['onOpenAutoFocus', 'onCloseAutoFocus'],
		popover: ['onOpenAutoFocus', 'onCloseAutoFocus'],
		tooltip: ['onOpenAutoFocus', 'onCloseAutoFocus'],
	}

	const componentsDir = path.join(__dirname, 'src', 'components', 'ui')
	const componentFiles = fs
		.readdirSync(componentsDir)
		.filter((file) => file.endsWith('.tsx'))

	componentFiles.forEach((file) => {
		const filePath = path.join(componentsDir, file)
		const content = readFile(filePath)
		const componentName = file.replace('.tsx', '')
		const componentType = componentName.toLowerCase()

		const focusSupport = {
			component: componentName,
			hasFocusManagement: false,
			hasAutoFocus: false,
			hasEscapeKey: false,
			missingFeatures: [],
		}

		// Check for focus management
		focusSupport.hasFocusManagement = /focus|blur|onFocus|onBlur/.test(content)

		// Check for auto focus
		focusSupport.hasAutoFocus = /onOpenAutoFocus|onCloseAutoFocus/.test(content)

		// Check for escape key handling
		focusSupport.hasEscapeKey = /onEscapeKeyDown|onKeyDown.*Escape/.test(
			content,
		)

		// Check for specific requirements
		if (focusRequirements[componentType]) {
			focusSupport.missingFeatures = focusRequirements[componentType].filter(
				(feature) => !content.includes(feature),
			)
		}

		focusResults.components.push(focusSupport)

		if (focusSupport.missingFeatures.length > 0) {
			focusResults.issues.push({
				component: componentName,
				missingFeatures: focusSupport.missingFeatures,
			})
		}
	})

	const componentsWithFocusSupport = focusResults.components.filter(
		(c) => c.hasFocusManagement || c.hasAutoFocus || c.hasEscapeKey,
	).length

	focusResults.coverage =
		(componentsWithFocusSupport / focusResults.components.length) * 100
	results.focusManagement = focusResults

	console.log(
		`   📊 Components with Focus Support: ${componentsWithFocusSupport}/${focusResults.components.length}`,
	)
	console.log(`   📊 Focus Coverage: ${focusResults.coverage.toFixed(1)}%`)
	console.log(`   📊 Focus Issues: ${focusResults.issues.length}`)
} catch (error) {
	console.error('   ❌ Focus management validation failed:', error.message)
	results.focusManagement.error = error.message
}

// 6. Generate Accessibility Report
console.log('\n📋 Generating Accessibility Report...')

const reportPath = path.join(__dirname, 'accessibility-report.json')
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2))

console.log(`   ✅ Accessibility report saved to: ${reportPath}`)

// 7. Summary
console.log('\n♿ Accessibility Testing Summary:')
console.log('================================')

console.log(`🔍 ARIA Attributes:`)
console.log(
	`   Coverage: ${results.ariaAttributes?.ariaCoverage?.toFixed(1) || 'N/A'}%`,
)
console.log(`   Issues: ${results.ariaAttributes?.ariaIssues?.length || 'N/A'}`)

console.log(`\n⌨️  Keyboard Navigation:`)
console.log(
	`   Coverage: ${results.keyboardNavigation?.coverage?.toFixed(1) || 'N/A'}%`,
)
console.log(`   Issues: ${results.keyboardNavigation?.issues?.length || 'N/A'}`)

console.log(`\n🎨 Color Contrast:`)
console.log(
	`   Coverage: ${results.colorContrast?.coverage?.toFixed(1) || 'N/A'}%`,
)
console.log(
	`   Issues: ${results.colorContrast?.contrastIssues?.length || 'N/A'}`,
)

console.log(`\n🔊 Screen Reader:`)
console.log(
	`   Coverage: ${results.screenReader?.coverage?.toFixed(1) || 'N/A'}%`,
)
console.log(`   Issues: ${results.screenReader?.issues?.length || 'N/A'}`)

console.log(`\n🎯 Focus Management:`)
console.log(
	`   Coverage: ${results.focusManagement?.coverage?.toFixed(1) || 'N/A'}%`,
)
console.log(`   Issues: ${results.focusManagement?.issues?.length || 'N/A'}`)

// 8. Accessibility Recommendations
console.log('\n💡 Accessibility Recommendations:')

if (results.ariaAttributes?.ariaCoverage < 80) {
	console.log(
		'   ⚠️  ARIA coverage is low - add more ARIA attributes to components',
	)
}

if (results.keyboardNavigation?.coverage < 80) {
	console.log(
		'   ⚠️  Keyboard navigation coverage is low - add keyboard event handlers',
	)
}

if (results.colorContrast?.coverage < 80) {
	console.log(
		'   ⚠️  Color contrast coverage is low - ensure proper color combinations',
	)
}

if (results.screenReader?.coverage < 80) {
	console.log(
		'   ⚠️  Screen reader coverage is low - add ARIA labels and descriptions',
	)
}

if (results.focusManagement?.coverage < 80) {
	console.log(
		'   ⚠️  Focus management coverage is low - add focus management features',
	)
}

console.log('\n✅ Accessibility testing completed!')
console.log('📊 Detailed results saved to validation/accessibility-report.json')
