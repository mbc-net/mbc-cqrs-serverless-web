import { isNullish } from '../isNullish'

describe('isNullish', () => {
  it('should return true for null', () => {
    expect(isNullish(null)).toBe(true)
  })

  it('should return true for undefined', () => {
    expect(isNullish(undefined)).toBe(true)
  })

  it('should return false for 0', () => {
    expect(isNullish(0)).toBe(false)
  })

  it('should return false for empty string', () => {
    expect(isNullish('')).toBe(false)
  })

  it('should return false for false', () => {
    expect(isNullish(false)).toBe(false)
  })

  it('should return false for an object', () => {
    expect(isNullish({})).toBe(false)
  })

  it('should return false for a non-empty string', () => {
    expect(isNullish('hello')).toBe(false)
  })
})
