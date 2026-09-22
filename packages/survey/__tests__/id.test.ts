import { createId } from '../src/utils/id'

describe('createId', () => {
  it('prefixes question ids with q_', () => {
    expect(createId('q')).toMatch(/^q_/)
  })

  it('prefixes section ids with sec_', () => {
    expect(createId('sec')).toMatch(/^sec_/)
  })

  it('never collides across a tight loop', () => {
    const ids = new Set<string>()
    for (let i = 0; i < 10_000; i++) {
      ids.add(createId('q'))
    }
    expect(ids.size).toBe(10_000)
  })

  it('keeps question and section ids in separate namespaces', () => {
    const question = createId('q')
    const section = createId('sec')
    expect(question).not.toBe(section)
    expect(question.startsWith('sec_')).toBe(false)
  })

  it('produces ids usable as react-hook-form field names', () => {
    // RHF treats '.' and '[' as path separators, so an id must contain neither.
    const id = createId('q')
    expect(id).not.toMatch(/[.[\]]/)
  })
})
