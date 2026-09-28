// postbuild.js
const fs = require('fs')
const path = require('path')
const glob = require('glob')

// The directory where your built files are.
const distDir = path.join(__dirname, 'dist')

// Find all JavaScript files in the dist directory
const jsFiles = glob.sync(`${distDir}/**/*.js`)
const mjsFiles = glob.sync(`${distDir}/**/*.mjs`)
const files = [...jsFiles, ...mjsFiles]

/**
 * tsup banner injects `import React from "react"` for classic JSX. Source files
 * often also emit `import * as React from "react"` into the same chunk, which
 * Turbopack rejects ("React is defined multiple times"). Keep a single default
 * import; drop namespace / duplicate default imports of the same binding.
 */
function dedupeReactImports(code) {
  let next = code
  const hasDefaultReact = /import\s+React\s+from\s+["']react["']/.test(next)

  if (hasDefaultReact) {
    // Banner (or first default import) already binds `React`.
    next = next.replace(
      /import\s*\*\s*as\s+React\s+from\s+["']react["']\s*;?\s*\n?/g,
      ''
    )
  }

  let seenDefault = false
  next = next.replace(
    /import\s+React\s+from\s+["']react["']\s*;?\s*\n?/g,
    (match) => {
      if (seenDefault) return ''
      seenDefault = true
      return match.endsWith('\n') ? match : `${match}\n`
    }
  )

  return next
}

function ensureUseClient(code) {
  if (code.startsWith('"use client"') || code.startsWith("'use client'")) {
    return code
  }
  const cleaned = code.replace(/["']use client["'];?\s*/g, '')
  return `"use client";\n${cleaned}`
}

for (const file of files) {
  const data = fs.readFileSync(file, 'utf8')
  let next = ensureUseClient(data)
  next = dedupeReactImports(next)

  if (next !== data) {
    fs.writeFileSync(file, next, 'utf8')
    console.log(`Fixed: ${file}`)
  }
}
