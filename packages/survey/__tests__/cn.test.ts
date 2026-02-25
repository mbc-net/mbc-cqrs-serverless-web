import { cn } from '../src/utils/cn'

describe('cn', () => {
  it('should combine multiple class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('should handle conditional classes via clsx', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })

  it('should handle undefined and null values', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end')
  })

  it('should handle empty string inputs', () => {
    expect(cn('', 'foo', '')).toBe('foo')
  })

  it('should handle array inputs', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar')
  })

  it('should handle object inputs', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
  })

  it('should merge conflicting Tailwind classes (last wins)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('should merge conflicting Tailwind color classes', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('should keep non-conflicting Tailwind classes', () => {
    expect(cn('px-2', 'py-4')).toBe('px-2 py-4')
  })

  it('should handle complex Tailwind merge scenario', () => {
    const result = cn('rounded-md bg-white p-4', 'bg-gray-100 p-2')
    expect(result).toBe('rounded-md bg-gray-100 p-2')
  })

  it('should return empty string when called with no arguments', () => {
    expect(cn()).toBe('')
  })
})
