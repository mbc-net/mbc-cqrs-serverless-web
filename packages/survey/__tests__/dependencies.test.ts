import fs from 'fs'
import path from 'path'

const pkg = require('../package.json')
const SRC = path.join(__dirname, '..', 'src')

const IMPORT_RE = /(?:from\s+|import\s*\(|require\s*\()\s*['"]([^'"]+)['"]/g

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return /\.tsx?$/.test(entry.name) ? [full] : []
  })
}

/** '@scope/pkg/sub' -> '@scope/pkg'; 'pkg/sub' -> 'pkg'; relative/alias/builtin -> null */
function packageNameOf(spec: string): string | null {
  if (spec.startsWith('.') || spec.startsWith('/')) return null
  if (spec.startsWith('@/')) return null // alias nội bộ, xem tsconfig paths
  if (spec.startsWith('node:')) return null
  if (spec.startsWith('@')) {
    const [scope, name] = spec.split('/')
    return name ? `${scope}/${name}` : null
  }
  return spec.split('/')[0]
}

function collectImportedPackages(): Set<string> {
  const found = new Set<string>()
  for (const file of walk(SRC)) {
    const source = fs.readFileSync(file, 'utf8').replace(/\/\/.*$/gm, '')
    for (const match of source.matchAll(IMPORT_RE)) {
      const name = packageNameOf(match[1])
      if (name) found.add(name)
    }
  }
  return found
}

describe('package.json dependency hygiene', () => {
  const imported = collectImportedPackages()
  const declared = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ])

  it('declares every package imported from src', () => {
    const missing = [...imported].filter((name) => !declared.has(name)).sort()
    expect(missing).toEqual([])
  })

  it('does not declare runtime dependencies that src never imports', () => {
    const unused = Object.keys(pkg.dependencies ?? {})
      .filter((name) => !imported.has(name))
      .sort()
    expect(unused).toEqual([])
  })

  it('does not declare react, react-dom or next as runtime dependencies', () => {
    const runtime = Object.keys(pkg.dependencies ?? {})
    expect(runtime).not.toContain('react')
    expect(runtime).not.toContain('react-dom')
    expect(runtime).not.toContain('next')
  })

  it('marks css as the only side effect', () => {
    expect(pkg.sideEffects).toEqual(['*.css'])
  })
})
