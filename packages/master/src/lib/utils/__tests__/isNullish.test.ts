import { isNullish } from '../isNullish'

describe('isNullish', () => {
  it.each([
    [null, 'null'],
    [undefined, 'undefined'],
  ])('should return true for %s', (value) => {
    expect(isNullish(value)).toBe(true)
  })

  it.each([
    [0, '0'],
    ['', 'empty string'],
    [false, 'false'],
    [{}, 'object'],
    ['hello', 'non-empty string'],
  ])('should return false for %s', (value) => {
    expect(isNullish(value)).toBe(false)
  })
})
