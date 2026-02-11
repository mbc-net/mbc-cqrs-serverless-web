import { cn } from '../src/utils/cn'

describe('cn', () => {
  it('combines multiple class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes via clsx', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })

  it('handles undefined and null values', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end')
  })

  it('handles empty string inputs', () => {
    expect(cn('', 'foo', '')).toBe('foo')
  })

  it('handles array inputs', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar')
  })

  it('handles object inputs', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
  })

  it('merges conflicting Tailwind classes (last wins)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('merges conflicting Tailwind color classes', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('keeps non-conflicting Tailwind classes', () => {
    expect(cn('px-2', 'py-4')).toBe('px-2 py-4')
  })

  it('handles complex Tailwind merge scenario', () => {
    const result = cn('rounded-md bg-white p-4', 'bg-gray-100 p-2')
    expect(result).toBe('rounded-md bg-gray-100 p-2')
  })

  it('returns empty string when called with no arguments', () => {
    expect(cn()).toBe('')
  })
})
