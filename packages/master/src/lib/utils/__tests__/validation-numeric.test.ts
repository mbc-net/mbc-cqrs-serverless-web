import {
  isNumeric,
  length,
  maxLength,
  regex,
  compareValue,
  CompareType,
  CompareValueRule,
} from '../validation'

describe('isNumeric', () => {
  it('should return true for numbers', () => {
    expect(isNumeric(123)).toBe(true)
    expect(isNumeric('456')).toBe(true)
    expect(isNumeric(0)).toBe(true)
    expect(isNumeric('0.5')).toBe(true)
  })

  it('should return false for non-numbers', () => {
    expect(isNumeric('abc')).toBe(false)
    expect(isNumeric(NaN)).toBe(false)
    expect(isNumeric(Infinity)).toBe(false)
  })
})

describe('length', () => {
  it('should return true for null/empty', () => {
    expect(length(null, 5)).toBe(true)
    expect(length('', 5)).toBe(true)
  })

  it('should return true when length matches', () => {
    expect(length('hello', 5)).toBe(true)
  })

  it('should return false when length does not match', () => {
    expect(length('hi', 5)).toBe(false)
  })

  it('should handle addComma option', () => {
    expect(length('1,000', 4, true)).toBe(true) // "1000" has 4 chars
  })
})

describe('maxLength', () => {
  it('should return true for null/empty', () => {
    expect(maxLength(null, 5)).toBe(true)
  })

  it('should return true when within limit', () => {
    expect(maxLength('hi', 5)).toBe(true)
    expect(maxLength('hello', 5)).toBe(true)
  })

  it('should return false when exceeding limit', () => {
    expect(maxLength('toolong', 5)).toBe(false)
  })
})

describe('regex', () => {
  it('should return true for null/empty', () => {
    expect(regex(null, /test/)).toBe(true)
  })

  it('should return true when value matches pattern', () => {
    expect(regex('test123', /^test\d+$/)).toBe(true)
  })

  it('should return false when value does not match', () => {
    expect(regex('hello', /^test\d+$/)).toBe(false)
  })
})

describe('compareValue', () => {
  it('should return true when either value is null', () => {
    expect(compareValue(null, 5, CompareType.eq)).toBe(true)
    expect(compareValue(5, null, CompareType.eq)).toBe(true)
  })

  it('should compare eq', () => {
    expect(compareValue(5, 5, CompareType.eq)).toBe(true)
    expect(compareValue(5, 6, CompareType.eq)).toBe(false)
  })

  it('should compare ne', () => {
    expect(compareValue(5, 6, CompareType.ne)).toBe(true)
    expect(compareValue(5, 5, CompareType.ne)).toBe(false)
  })

  it('should compare lt', () => {
    expect(compareValue(3, 5, CompareType.lt)).toBe(true)
    expect(compareValue(5, 3, CompareType.lt)).toBe(false)
  })

  it('should compare le', () => {
    expect(compareValue(5, 5, CompareType.le)).toBe(true)
    expect(compareValue(6, 5, CompareType.le)).toBe(false)
  })

  it('should compare gt', () => {
    expect(compareValue(5, 3, CompareType.gt)).toBe(true)
    expect(compareValue(3, 5, CompareType.gt)).toBe(false)
  })

  it('should compare ge', () => {
    expect(compareValue(5, 5, CompareType.ge)).toBe(true)
    expect(compareValue(3, 5, CompareType.ge)).toBe(false)
  })
})

describe('CompareValueRule', () => {
  it('should return null when value is empty', () => {
    const rule = new CompareValueRule(0, CompareType.ge)
    expect(rule.validate('', 'Field')).toBeNull()
    expect(rule.validate(null, 'Field')).toBeNull()
  })

  it('should return null when value is not numeric', () => {
    const rule = new CompareValueRule(0, CompareType.ge)
    expect(rule.validate('abc', 'Field')).toBeNull()
  })

  it('should return null when comparison passes', () => {
    const rule = new CompareValueRule(0, CompareType.ge)
    expect(rule.validate(5, 'Field')).toBeNull()
    expect(rule.validate(0, 'Field')).toBeNull()
  })

  it('should return error message when comparison fails', () => {
    const rule = new CompareValueRule(0, CompareType.ge)
    expect(rule.validate(-1, 'Field')).toBe(
      'Fieldは0以上の値を入力してください'
    )
  })
})
