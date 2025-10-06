#!/usr/bin/env node

/**
 * Master Validation Script for @mbc-cqrs-serverless-web/shared-ui
 *
 * This script runs all validation tests including:
 * - Code review
 * - Performance testing
 * - Accessibility testing
 * - Cross-browser testing
 * - Documentation review
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log(
	'🚀 Starting Complete Validation for @mbc-cqrs-serverless-web/shared-ui\n',
)
console.log('='.repeat(80))

// Validation results
const validationResults = {
	startTime: new Date().toISOString(),
	tests: {},
	summary: {},
	endTime: null,
	duration: 0,
}

// Helper function to run a test script
function runTest(testName, scriptPath) {
	console.log(`\n🔍 Running ${testName}...`)
	console.log('-'.repeat(50))

	const startTime = Date.now()

	try {
		// Make script executable
		execSync(`chmod +x ${scriptPath}`, { stdio: 'pipe' })

		// Run the test
		const output = execSync(`node ${scriptPath}`, {
			encoding: 'utf8',
			stdio: 'pipe',
		})

		const endTime = Date.now()
		const duration = endTime - startTime

		console.log(`✅ ${testName} completed successfully in ${duration}ms`)

		return {
			status: 'success',
			duration: duration,
			output: output,
		}
	} catch (error) {
		const endTime = Date.now()
		const duration = endTime - startTime

		console.log(`❌ ${testName} failed after ${duration}ms`)
		console.log(`Error: ${error.message}`)

		return {
			status: 'failed',
			duration: duration,
			error: error.message,
		}
	}
}

// Helper function to load test results
function loadTestResults(testName) {
	const reportPath = path.join(__dirname, `${testName}-report.json`)

	try {
		if (fs.existsSync(reportPath)) {
			return JSON.parse(fs.readFileSync(reportPath, 'utf8'))
		}
	} catch (error) {
		console.log(`⚠️  Could not load ${testName} results: ${error.message}`)
	}

	return null
}

// 1. Code Review
console.log('\n📋 PHASE 1: CODE REVIEW')
console.log('='.repeat(50))

const codeReviewResult = runTest(
	'Code Review',
	path.join(__dirname, 'code-review.md'),
)
validationResults.tests.codeReview = codeReviewResult

// 2. Performance Testing
console.log('\n⚡ PHASE 2: PERFORMANCE TESTING')
console.log('='.repeat(50))

const performanceResult = runTest(
	'Performance Testing',
	path.join(__dirname, 'performance-test.js'),
)
validationResults.tests.performance = performanceResult

// 3. Accessibility Testing
console.log('\n♿ PHASE 3: ACCESSIBILITY TESTING')
console.log('='.repeat(50))

const accessibilityResult = runTest(
	'Accessibility Testing',
	path.join(__dirname, 'accessibility-test.js'),
)
validationResults.tests.accessibility = accessibilityResult

// 4. Cross-Browser Testing
console.log('\n🌐 PHASE 4: CROSS-BROWSER TESTING')
console.log('='.repeat(50))

const crossBrowserResult = runTest(
	'Cross-Browser Testing',
	path.join(__dirname, 'cross-browser-test.js'),
)
validationResults.tests.crossBrowser = crossBrowserResult

// 5. Documentation Review
console.log('\n📚 PHASE 5: DOCUMENTATION REVIEW')
console.log('='.repeat(50))

const documentationResult = runTest(
	'Documentation Review',
	path.join(__dirname, 'documentation-review.js'),
)
validationResults.tests.documentation = documentationResult

// 6. Load and Analyze Results
console.log('\n📊 PHASE 6: ANALYZING RESULTS')
console.log('='.repeat(50))

// Load individual test results
const performanceData = loadTestResults('performance')
const accessibilityData = loadTestResults('accessibility')
const crossBrowserData = loadTestResults('cross-browser')
const documentationData = loadTestResults('documentation')

// Calculate overall scores
const scores = {
	performance: 0,
	accessibility: 0,
	crossBrowser: 0,
	documentation: 0,
	overall: 0,
}

// Performance score
if (performanceData) {
	const bundleSizeRating = performanceData.overall?.bundleSizeRating || 'poor'
	const buildTimeRating = performanceData.overall?.buildTimeRating || 'poor'

	const bundleScore =
		bundleSizeRating === 'excellent'
			? 100
			: bundleSizeRating === 'good'
				? 80
				: bundleSizeRating === 'acceptable'
					? 60
					: 40

	const buildScore =
		buildTimeRating === 'excellent'
			? 100
			: buildTimeRating === 'good'
				? 80
				: buildTimeRating === 'acceptable'
					? 60
					: 40

	scores.performance = (bundleScore + buildScore) / 2
}

// Accessibility score
if (accessibilityData) {
	const ariaCoverage = accessibilityData.ariaAttributes?.ariaCoverage || 0
	const keyboardCoverage = accessibilityData.keyboardNavigation?.coverage || 0
	const screenReaderCoverage = accessibilityData.screenReader?.coverage || 0
	const focusCoverage = accessibilityData.focusManagement?.coverage || 0

	scores.accessibility =
		(ariaCoverage + keyboardCoverage + screenReaderCoverage + focusCoverage) / 4
}

// Cross-browser score
if (crossBrowserData) {
	const cssScore = crossBrowserData.cssFeatures?.compatibilityScore || 0
	const jsScore = crossBrowserData.javascriptFeatures?.compatibilityScore || 0
	const polyfillScore = crossBrowserData.polyfills?.compatibilityScore || 0
	const responsiveScore =
		crossBrowserData.responsiveDesign?.compatibilityScore || 0

	scores.crossBrowser =
		(cssScore + jsScore + polyfillScore + responsiveScore) / 4
}

// Documentation score
if (documentationData) {
	const apiScore = documentationData.apiDocumentation?.coverage || 0
	const examplesScore = documentationData.usageExamples?.coverage || 0
	const tsScore = documentationData.typescriptDocs?.coverage || 0
	const readmeScore = documentationData.readmeQuality?.qualityScore || 0
	const commentsScore = documentationData.codeComments?.coverage || 0

	scores.documentation =
		(apiScore + examplesScore + tsScore + readmeScore + commentsScore) / 5
}

// Overall score
scores.overall =
	(scores.performance +
		scores.accessibility +
		scores.crossBrowser +
		scores.documentation) /
	4

validationResults.summary = scores

// 7. Generate Final Report
console.log('\n📋 PHASE 7: GENERATING FINAL REPORT')
console.log('='.repeat(50))

validationResults.endTime = new Date().toISOString()
validationResults.duration =
	new Date(validationResults.endTime) - new Date(validationResults.startTime)

// Save comprehensive report
const finalReportPath = path.join(__dirname, 'final-validation-report.json')
fs.writeFileSync(finalReportPath, JSON.stringify(validationResults, null, 2))

console.log(`✅ Final validation report saved to: ${finalReportPath}`)

// 8. Display Summary
console.log('\n🎯 VALIDATION SUMMARY')
console.log('='.repeat(80))

console.log(`\n📊 Overall Scores:`)
console.log(`   Performance: ${scores.performance.toFixed(1)}%`)
console.log(`   Accessibility: ${scores.accessibility.toFixed(1)}%`)
console.log(`   Cross-Browser: ${scores.crossBrowser.toFixed(1)}%`)
console.log(`   Documentation: ${scores.documentation.toFixed(1)}%`)
console.log(`   Overall: ${scores.overall.toFixed(1)}%`)

console.log(`\n⏱️  Test Execution:`)
console.log(`   Start Time: ${validationResults.startTime}`)
console.log(`   End Time: ${validationResults.endTime}`)
console.log(
	`   Duration: ${(validationResults.duration / 1000).toFixed(1)} seconds`,
)

console.log(`\n✅ Test Results:`)
Object.entries(validationResults.tests).forEach(([testName, result]) => {
	const status = result.status === 'success' ? '✅' : '❌'
	console.log(
		`   ${status} ${testName}: ${result.status} (${result.duration}ms)`,
	)
})

// 9. Recommendations
console.log('\n💡 RECOMMENDATIONS')
console.log('='.repeat(50))

if (scores.performance < 80) {
	console.log(
		'   ⚠️  Performance score is low - consider bundle optimization and build improvements',
	)
}

if (scores.accessibility < 80) {
	console.log(
		'   ⚠️  Accessibility score is low - add more ARIA attributes and keyboard support',
	)
}

if (scores.crossBrowser < 80) {
	console.log(
		'   ⚠️  Cross-browser score is low - add polyfills and improve compatibility',
	)
}

if (scores.documentation < 80) {
	console.log(
		'   ⚠️  Documentation score is low - improve API docs and usage examples',
	)
}

if (scores.overall >= 90) {
	console.log(
		'   🎉 Excellent! The shared-ui library meets high quality standards',
	)
} else if (scores.overall >= 80) {
	console.log('   👍 Good! The shared-ui library meets most quality standards')
} else if (scores.overall >= 70) {
	console.log('   ⚠️  Fair! The shared-ui library needs some improvements')
} else {
	console.log(
		'   ❌ Poor! The shared-ui library needs significant improvements',
	)
}

// 10. Final Status
console.log('\n🏁 VALIDATION COMPLETE')
console.log('='.repeat(80))

if (scores.overall >= 80) {
	console.log(
		'🎉 VALIDATION PASSED - The shared-ui library is ready for production!',
	)
} else {
	console.log(
		'⚠️  VALIDATION WARNING - The shared-ui library needs improvements before production',
	)
}

console.log(`\n📊 Detailed results available in validation/ directory`)
console.log(`📋 Final report: ${finalReportPath}`)

console.log('\n✅ All validation tests completed!')
