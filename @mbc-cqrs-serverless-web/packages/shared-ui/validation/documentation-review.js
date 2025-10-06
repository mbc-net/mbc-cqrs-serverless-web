#!/usr/bin/env node

/**
 * Documentation Review Script for @mbc-cqrs-serverless-web/shared-ui
 *
 * This script performs comprehensive documentation review including:
 * - API documentation completeness
 * - Usage examples validation
 * - TypeScript documentation
 * - README quality assessment
 * - Code comments analysis
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log(
	'📚 Starting Documentation Review for @mbc-cqrs-serverless-web/shared-ui\n',
)

// Documentation review results
const results = {
	apiDocumentation: {},
	usageExamples: {},
	typescriptDocs: {},
	readmeQuality: {},
	codeComments: {},
	overall: {},
}

// Helper function to count lines in file
function countLines(filePath) {
	try {
		const content = fs.readFileSync(filePath, 'utf8')
		return content.split('\n').length
	} catch (error) {
		return 0
	}
}

// Helper function to check if file exists
function fileExists(filePath) {
	try {
		return fs.statSync(filePath).isFile()
	} catch (error) {
		return false
	}
}

// 1. API Documentation Review
console.log('📖 Reviewing API Documentation...')
try {
	const apiResults = {
		components: [],
		totalComponents: 0,
		documentedComponents: 0,
		coverage: 0,
		issues: [],
	}

	// Check component documentation
	const componentsDir = path.join(__dirname, 'src', 'components', 'ui')
	const componentFiles = fs
		.readdirSync(componentsDir)
		.filter((file) => file.endsWith('.tsx'))

	apiResults.totalComponents = componentFiles.length

	componentFiles.forEach((file) => {
		const filePath = path.join(componentsDir, file)
		const content = fs.readFileSync(filePath, 'utf8')
		const componentName = file.replace('.tsx', '')

		const componentDoc = {
			name: componentName,
			hasJSDoc: false,
			hasPropsInterface: false,
			hasUsageExample: false,
			hasDescription: false,
			issues: [],
		}

		// Check for JSDoc comments
		componentDoc.hasJSDoc = /\/\*\*[\s\S]*?\*\//.test(content)

		// Check for props interface
		componentDoc.hasPropsInterface = /interface\s+\w+Props/.test(content)

		// Check for usage examples in comments
		componentDoc.hasUsageExample = /@example|usage|example/i.test(content)

		// Check for component description
		componentDoc.hasDescription =
			/@description|@summary|Component description/i.test(content)

		// Identify issues
		if (!componentDoc.hasJSDoc) {
			componentDoc.issues.push('Missing JSDoc comments')
		}
		if (!componentDoc.hasPropsInterface) {
			componentDoc.issues.push('Missing props interface')
		}
		if (!componentDoc.hasUsageExample) {
			componentDoc.issues.push('Missing usage example')
		}
		if (!componentDoc.hasDescription) {
			componentDoc.issues.push('Missing component description')
		}

		apiResults.components.push(componentDoc)

		if (componentDoc.hasJSDoc && componentDoc.hasPropsInterface) {
			apiResults.documentedComponents++
		}

		if (componentDoc.issues.length > 0) {
			apiResults.issues.push({
				component: componentName,
				issues: componentDoc.issues,
			})
		}
	})

	apiResults.coverage =
		(apiResults.documentedComponents / apiResults.totalComponents) * 100
	results.apiDocumentation = apiResults

	console.log(`   📊 Total Components: ${apiResults.totalComponents}`)
	console.log(`   📊 Documented Components: ${apiResults.documentedComponents}`)
	console.log(
		`   📊 Documentation Coverage: ${apiResults.coverage.toFixed(1)}%`,
	)
	console.log(`   📊 Components with Issues: ${apiResults.issues.length}`)
} catch (error) {
	console.error('   ❌ API documentation review failed:', error.message)
	results.apiDocumentation.error = error.message
}

// 2. Usage Examples Validation
console.log('\n💡 Validating Usage Examples...')
try {
	const examplesResults = {
		demoPages: [],
		storyFiles: [],
		testFiles: [],
		coverage: 0,
		issues: [],
	}

	// Check for demo pages
	const demoPages = [
		'src/app/demo/page.tsx',
		'src/app/integration-test/page.tsx',
		'src/app/ssr-test/page.tsx',
	]

	demoPages.forEach((page) => {
		const pagePath = path.join(__dirname, '..', '..', '..', '..', page)
		if (fileExists(pagePath)) {
			const content = fs.readFileSync(pagePath, 'utf8')
			const lineCount = countLines(pagePath)

			examplesResults.demoPages.push({
				page: page,
				exists: true,
				lineCount: lineCount,
				hasExamples: content.includes('import') && content.includes('from'),
				hasComments: content.includes('//') || content.includes('/*'),
			})
		} else {
			examplesResults.demoPages.push({
				page: page,
				exists: false,
			})
		}
	})

	// Check for test files (which often contain usage examples)
	const testDir = path.join(__dirname, 'src', 'test')
	if (fs.existsSync(testDir)) {
		const testFiles = fs
			.readdirSync(testDir)
			.filter((file) => file.endsWith('.tsx'))

		testFiles.forEach((file) => {
			const filePath = path.join(testDir, file)
			const content = fs.readFileSync(filePath, 'utf8')
			const lineCount = countLines(filePath)

			examplesResults.testFiles.push({
				file: file,
				lineCount: lineCount,
				hasExamples: content.includes('render(') && content.includes('<'),
				hasComments: content.includes('//') || content.includes('/*'),
			})
		})
	}

	// Calculate coverage
	const totalDemoPages = examplesResults.demoPages.length
	const existingDemoPages = examplesResults.demoPages.filter(
		(p) => p.exists,
	).length
	const totalTestFiles = examplesResults.testFiles.length

	examplesResults.coverage =
		((existingDemoPages + totalTestFiles) / (totalDemoPages + totalTestFiles)) *
		100

	results.usageExamples = examplesResults

	console.log(`   📊 Demo Pages: ${existingDemoPages}/${totalDemoPages}`)
	console.log(`   📊 Test Files: ${totalTestFiles}`)
	console.log(`   📊 Coverage: ${examplesResults.coverage.toFixed(1)}%`)
} catch (error) {
	console.error('   ❌ Usage examples validation failed:', error.message)
	results.usageExamples.error = error.message
}

// 3. TypeScript Documentation Review
console.log('\n🔧 Reviewing TypeScript Documentation...')
try {
	const tsResults = {
		typeFiles: [],
		totalTypes: 0,
		documentedTypes: 0,
		coverage: 0,
		issues: [],
	}

	// Check type definition files
	const typesDir = path.join(__dirname, 'src', 'types')
	if (fs.existsSync(typesDir)) {
		const typeFiles = fs
			.readdirSync(typesDir)
			.filter((file) => file.endsWith('.ts'))

		typeFiles.forEach((file) => {
			const filePath = path.join(typesDir, file)
			const content = fs.readFileSync(filePath, 'utf8')

			const typeDoc = {
				file: file,
				lineCount: countLines(filePath),
				hasJSDoc: /\/\*\*[\s\S]*?\*\//.test(content),
				hasComments: content.includes('//') || content.includes('/*'),
				interfaces: (content.match(/interface\s+\w+/g) || []).length,
				types: (content.match(/type\s+\w+/g) || []).length,
				enums: (content.match(/enum\s+\w+/g) || []).length,
			}

			tsResults.typeFiles.push(typeDoc)
			tsResults.totalTypes += typeDoc.interfaces + typeDoc.types + typeDoc.enums

			if (typeDoc.hasJSDoc || typeDoc.hasComments) {
				tsResults.documentedTypes +=
					typeDoc.interfaces + typeDoc.types + typeDoc.enums
			}
		})
	}

	// Check component files for TypeScript documentation
	const componentsDir = path.join(__dirname, 'src', 'components', 'ui')
	const componentFiles = fs
		.readdirSync(componentsDir)
		.filter((file) => file.endsWith('.tsx'))

	componentFiles.forEach((file) => {
		const filePath = path.join(componentsDir, file)
		const content = fs.readFileSync(filePath, 'utf8')

		// Count TypeScript constructs
		const interfaces = (content.match(/interface\s+\w+/g) || []).length
		const types = (content.match(/type\s+\w+/g) || []).length
		const enums = (content.match(/enum\s+\w+/g) || []).length

		tsResults.totalTypes += interfaces + types + enums

		// Check for documentation
		if (content.includes('/**') || content.includes('//')) {
			tsResults.documentedTypes += interfaces + types + enums
		}
	})

	tsResults.coverage = (tsResults.documentedTypes / tsResults.totalTypes) * 100
	results.typescriptDocs = tsResults

	console.log(`   📊 Type Files: ${tsResults.typeFiles.length}`)
	console.log(`   📊 Total Types: ${tsResults.totalTypes}`)
	console.log(`   📊 Documented Types: ${tsResults.documentedTypes}`)
	console.log(`   📊 Coverage: ${tsResults.coverage.toFixed(1)}%`)
} catch (error) {
	console.error('   ❌ TypeScript documentation review failed:', error.message)
	results.typescriptDocs.error = error.message
}

// 4. README Quality Assessment
console.log('\n📄 Assessing README Quality...')
try {
	const readmeResults = {
		files: [],
		totalFiles: 0,
		qualityScore: 0,
		issues: [],
	}

	// Check for README files
	const readmeFiles = [
		'README.md',
		'docs/README.md',
		'src/README.md',
		'validation/README.md',
	]

	readmeFiles.forEach((file) => {
		const filePath = path.join(__dirname, file)
		if (fileExists(filePath)) {
			const content = fs.readFileSync(filePath, 'utf8')
			const lineCount = countLines(filePath)

			const readmeDoc = {
				file: file,
				exists: true,
				lineCount: lineCount,
				hasTitle: /^#\s+/.test(content),
				hasDescription:
					content.includes('##') || content.includes('Description'),
				hasInstallation: /install|setup|getting started/i.test(content),
				hasUsage: /usage|example|demo/i.test(content),
				hasAPI: /api|props|interface/i.test(content),
				hasLicense: /license|copyright/i.test(content),
				hasContributing: /contributing|contribute/i.test(content),
				hasChangelog: /changelog|history/i.test(content),
			}

			// Calculate quality score
			const qualityFactors = [
				readmeDoc.hasTitle,
				readmeDoc.hasDescription,
				readmeDoc.hasInstallation,
				readmeDoc.hasUsage,
				readmeDoc.hasAPI,
				readmeDoc.hasLicense,
				readmeDoc.hasContributing,
				readmeDoc.hasChangelog,
			]

			readmeDoc.qualityScore =
				(qualityFactors.filter(Boolean).length / qualityFactors.length) * 100

			readmeResults.files.push(readmeDoc)
			readmeResults.totalFiles++

			if (readmeDoc.qualityScore < 70) {
				readmeResults.issues.push({
					file: file,
					score: readmeDoc.qualityScore,
					missing: qualityFactors
						.map((factor, index) =>
							!factor
								? [
										'title',
										'description',
										'installation',
										'usage',
										'api',
										'license',
										'contributing',
										'changelog',
									][index]
								: null,
						)
						.filter(Boolean),
				})
			}
		}
	})

	// Calculate overall quality score
	const totalScore = readmeResults.files.reduce(
		(sum, file) => sum + file.qualityScore,
		0,
	)
	readmeResults.qualityScore =
		readmeResults.totalFiles > 0 ? totalScore / readmeResults.totalFiles : 0

	results.readmeQuality = readmeResults

	console.log(`   📊 README Files: ${readmeResults.totalFiles}`)
	console.log(`   📊 Quality Score: ${readmeResults.qualityScore.toFixed(1)}%`)
	console.log(`   📊 Files with Issues: ${readmeResults.issues.length}`)
} catch (error) {
	console.error('   ❌ README quality assessment failed:', error.message)
	results.readmeQuality.error = error.message
}

// 5. Code Comments Analysis
console.log('\n💬 Analyzing Code Comments...')
try {
	const commentsResults = {
		components: [],
		totalComponents: 0,
		commentedComponents: 0,
		coverage: 0,
		issues: [],
	}

	// Check component files for comments
	const componentsDir = path.join(__dirname, 'src', 'components', 'ui')
	const componentFiles = fs
		.readdirSync(componentsDir)
		.filter((file) => file.endsWith('.tsx'))

	commentsResults.totalComponents = componentFiles.length

	componentFiles.forEach((file) => {
		const filePath = path.join(componentsDir, file)
		const content = fs.readFileSync(filePath, 'utf8')
		const componentName = file.replace('.tsx', '')

		const commentDoc = {
			name: componentName,
			lineCount: countLines(filePath),
			hasComments: content.includes('//') || content.includes('/*'),
			commentLines: (content.match(/\/\/.*|\/\*[\s\S]*?\*\//g) || []).length,
			hasJSDoc: /\/\*\*[\s\S]*?\*\//.test(content),
			hasInlineComments: /\/\/.*/.test(content),
			hasBlockComments: /\/\*[\s\S]*?\*\//.test(content),
		}

		// Calculate comment density
		commentDoc.commentDensity =
			(commentDoc.commentLines / commentDoc.lineCount) * 100

		commentsResults.components.push(commentDoc)

		if (commentDoc.hasComments) {
			commentsResults.commentedComponents++
		}

		if (commentDoc.commentDensity < 5) {
			commentsResults.issues.push({
				component: componentName,
				commentDensity: commentDoc.commentDensity,
				issue: 'Low comment density',
			})
		}
	})

	commentsResults.coverage =
		(commentsResults.commentedComponents / commentsResults.totalComponents) *
		100
	results.codeComments = commentsResults

	console.log(`   📊 Total Components: ${commentsResults.totalComponents}`)
	console.log(
		`   📊 Commented Components: ${commentsResults.commentedComponents}`,
	)
	console.log(`   📊 Coverage: ${commentsResults.coverage.toFixed(1)}%`)
	console.log(
		`   📊 Components with Low Comments: ${commentsResults.issues.length}`,
	)
} catch (error) {
	console.error('   ❌ Code comments analysis failed:', error.message)
	results.codeComments.error = error.message
}

// 6. Generate Documentation Report
console.log('\n📋 Generating Documentation Report...')

const reportPath = path.join(__dirname, 'documentation-report.json')
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2))

console.log(`   ✅ Documentation report saved to: ${reportPath}`)

// 7. Summary
console.log('\n📚 Documentation Review Summary:')
console.log('=================================')

console.log(`📖 API Documentation:`)
console.log(
	`   Coverage: ${results.apiDocumentation?.coverage?.toFixed(1) || 'N/A'}%`,
)
console.log(
	`   Components with Issues: ${results.apiDocumentation?.issues?.length || 'N/A'}`,
)

console.log(`\n💡 Usage Examples:`)
console.log(
	`   Coverage: ${results.usageExamples?.coverage?.toFixed(1) || 'N/A'}%`,
)
console.log(
	`   Demo Pages: ${results.usageExamples?.demoPages?.filter((p) => p.exists).length || 'N/A'}`,
)
console.log(
	`   Test Files: ${results.usageExamples?.testFiles?.length || 'N/A'}`,
)

console.log(`\n🔧 TypeScript Documentation:`)
console.log(
	`   Coverage: ${results.typescriptDocs?.coverage?.toFixed(1) || 'N/A'}%`,
)
console.log(`   Total Types: ${results.typescriptDocs?.totalTypes || 'N/A'}`)
console.log(
	`   Documented Types: ${results.typescriptDocs?.documentedTypes || 'N/A'}`,
)

console.log(`\n📄 README Quality:`)
console.log(
	`   Quality Score: ${results.readmeQuality?.qualityScore?.toFixed(1) || 'N/A'}%`,
)
console.log(
	`   Files with Issues: ${results.readmeQuality?.issues?.length || 'N/A'}`,
)

console.log(`\n💬 Code Comments:`)
console.log(
	`   Coverage: ${results.codeComments?.coverage?.toFixed(1) || 'N/A'}%`,
)
console.log(
	`   Components with Low Comments: ${results.codeComments?.issues?.length || 'N/A'}`,
)

// 8. Documentation Recommendations
console.log('\n💡 Documentation Recommendations:')

if (results.apiDocumentation?.coverage < 80) {
	console.log(
		'   ⚠️  API documentation coverage is low - add JSDoc comments and prop interfaces',
	)
}

if (results.usageExamples?.coverage < 80) {
	console.log(
		'   ⚠️  Usage examples coverage is low - add more demo pages and examples',
	)
}

if (results.typescriptDocs?.coverage < 80) {
	console.log(
		'   ⚠️  TypeScript documentation coverage is low - add type comments and descriptions',
	)
}

if (results.readmeQuality?.qualityScore < 70) {
	console.log(
		'   ⚠️  README quality is low - improve documentation structure and content',
	)
}

if (results.codeComments?.coverage < 80) {
	console.log(
		'   ⚠️  Code comments coverage is low - add more inline comments and documentation',
	)
}

console.log('\n✅ Documentation review completed!')
console.log('📊 Detailed results saved to validation/documentation-report.json')
