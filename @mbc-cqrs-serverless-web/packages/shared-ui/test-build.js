#!/usr/bin/env node

/**
 * Build Process Integration Test
 * Tests that the shared-ui package builds correctly and all exports work
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Starting Build Process Integration Test...\n')

// Test 1: Clean build
console.log('1️⃣ Testing clean build...')
try {
	execSync('npm run clean', { stdio: 'inherit' })
	console.log('✅ Clean build successful\n')
} catch (error) {
	console.error('❌ Clean build failed:', error.message)
	process.exit(1)
}

// Test 2: Production build
console.log('2️⃣ Testing production build...')
try {
	execSync('npm run build', { stdio: 'inherit' })
	console.log('✅ Production build successful\n')
} catch (error) {
	console.error('❌ Production build failed:', error.message)
	process.exit(1)
}

// Test 3: Verify dist files exist
console.log('3️⃣ Verifying dist files...')
const distPath = path.join(__dirname, 'dist')
const requiredFiles = [
	'index.js',
	'index.esm.js',
	'index.d.ts',
	'server.js',
	'server.esm.js',
	'server.d.ts',
	'styles.css',
]

const missingFiles = requiredFiles.filter((file) => {
	const filePath = path.join(distPath, file)
	return !fs.existsSync(filePath)
})

if (missingFiles.length > 0) {
	console.error('❌ Missing dist files:', missingFiles)
	process.exit(1)
} else {
	console.log('✅ All required dist files exist\n')
}

// Test 4: Verify package.json exports
console.log('4️⃣ Verifying package.json exports...')
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const exports = packageJson.exports

const requiredExports = ['.', './server', './styles', './styles/theme']

const missingExports = requiredExports.filter(
	(exportPath) => !exports[exportPath],
)

if (missingExports.length > 0) {
	console.error('❌ Missing package exports:', missingExports)
	process.exit(1)
} else {
	console.log('✅ All required exports are defined\n')
}

// Test 5: Test TypeScript compilation
console.log('5️⃣ Testing TypeScript compilation...')
try {
	execSync('npm run type-check', { stdio: 'inherit' })
	console.log('✅ TypeScript compilation successful\n')
} catch (error) {
	console.error('❌ TypeScript compilation failed:', error.message)
	process.exit(1)
}

// Test 6: Test bundle size
console.log('6️⃣ Testing bundle size...')
try {
	execSync('npm run size', { stdio: 'inherit' })
	console.log('✅ Bundle size check passed\n')
} catch (error) {
	console.error('❌ Bundle size check failed:', error.message)
	process.exit(1)
}

// Test 7: Test optimized build
console.log('7️⃣ Testing optimized build...')
try {
	execSync('npm run build:optimized', { stdio: 'inherit' })
	console.log('✅ Optimized build successful\n')
} catch (error) {
	console.error('❌ Optimized build failed:', error.message)
	process.exit(1)
}

// Test 8: Verify all components can be imported
console.log('8️⃣ Testing component imports...')
const testImportScript = `
const { 
  Button, 
  Input, 
  Label, 
  Badge, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Switch,
  Textarea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Calendar,
  Toast,
  useToast
} = require('./dist/index.js')

console.log('✅ All components imported successfully')
`

try {
	execSync(`node -e "${testImportScript}"`, { stdio: 'inherit' })
	console.log('✅ Component imports test passed\n')
} catch (error) {
	console.error('❌ Component imports test failed:', error.message)
	process.exit(1)
}

// Test 9: Verify server components can be imported
console.log('9️⃣ Testing server component imports...')
const testServerImportScript = `
const { 
  Badge, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Input,
  Label,
  Separator,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea
} = require('./dist/server.js')

console.log('✅ All server components imported successfully')
`

try {
	execSync(`node -e "${testServerImportScript}"`, { stdio: 'inherit' })
	console.log('✅ Server component imports test passed\n')
} catch (error) {
	console.error('❌ Server component imports test failed:', error.message)
	process.exit(1)
}

// Test 10: Verify CSS can be imported
console.log('🔟 Testing CSS import...')
const testCssScript = `
const fs = require('fs')
const cssPath = './dist/styles.css'

if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, 'utf8')
  if (css.includes('--mbc-color-primary') && css.includes('--mbc-color-secondary')) {
    console.log('✅ CSS file contains MBC theme variables')
  } else {
    console.error('❌ CSS file missing MBC theme variables')
    process.exit(1)
  }
} else {
  console.error('❌ CSS file not found')
  process.exit(1)
}
`

try {
	execSync(`node -e "${testCssScript}"`, { stdio: 'inherit' })
	console.log('✅ CSS import test passed\n')
} catch (error) {
	console.error('❌ CSS import test failed:', error.message)
	process.exit(1)
}

console.log('🎉 All build process integration tests passed!')
console.log('📦 Package is ready for distribution')
console.log('🚀 Build process is working correctly')
