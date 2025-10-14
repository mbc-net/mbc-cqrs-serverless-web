// postbuild.js
const fs = require('fs')
const path = require('path')
const glob = require('glob')

// The directory where your built files are.
const distDir = path.join(__dirname, 'dist')

// Find all JavaScript files in the dist directory
const files = glob.sync(`${distDir}/**/*.js`)

files.forEach((file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${file}:`, err)
      return
    }

    // Check if '"use client"' is present but not at the start
    if (!data.startsWith('"use client"')) {
      console.log(`Fixing "use client" directive in: ${file}`)

      // Remove all occurrences of "use client"; (and variations) from the file
      const cleanedData = data.replace(/"use client";?/g, '')

      // Add "use client"; to the very top
      const newData = `"use client";\n${cleanedData}`

      fs.writeFile(file, newData, 'utf8', (writeErr) => {
        if (writeErr) {
          console.error(`Error writing file ${file}:`, writeErr)
        } else {
          console.log(`Successfully fixed ${file}`)
        }
      })
    }
  })
})
