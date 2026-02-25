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
  it.each([
    [123, true, 'integer'],
    ['456', true, 'numeric string'],
    [0, true, 'zero'],
    ['0.5', true, 'decimal string'],
    ['-1', true, 'negative number string'],
    ['1e10', true, 'scientific notation string'],
    ['abc', false, 'alphabetic string'],
    [NaN, false, 'NaN'],
    [Infinity, false, 'Infinity'],
    ['', false, 'empty string'],
    [' ', false, 'space only'],
  ])('returns %s for %s', (input, expected) => {
    expect(isNumeric(input)).toBe(expected)
  })
})

describe('length', () => {
  it.each([
    [null, 5, false, true, 'null'],
    ['', 5, false, true, 'empty string'],
    ['hello', 5, false, true, 'matching length'],
    ['hi', 5, false, false, 'non-matching length'],
    ['1,000', 4, true, true, 'with addComma option'],
  ])('returns %s for %s', (input, len, addComma, expected) => {
    expect(length(input, len, addComma)).toBe(expected)
  })
})

describe('maxLength', () => {
  it.each([
    [null, 5, true, 'null'],
    ['hi', 5, true, 'within limit'],
    ['hello', 5, true, 'at limit'],
    ['toolong', 5, false, 'exceeding limit'],
  ])('returns %s for %s', (input, max, expected) => {
    expect(maxLength(input, max)).toBe(expected)
  })
})

describe('regex', () => {
  it.each([
    [null, /test/, true, 'null'],
    ['test123', /^test\d+$/, true, 'matching pattern'],
    ['hello', /^test\d+$/, false, 'non-matching pattern'],
  ])('returns %s for %s', (input, pattern, expected) => {
    expect(regex(input, pattern)).toBe(expected)
  })
})

describe('compareValue', () => {
  it('should return true when either value is null', () => {
    expect(compareValue(null, 5, CompareType.eq)).toBe(true)
    expect(compareValue(5, null, CompareType.eq)).toBe(true)
  })

  it.each([
    [5, 5, CompareType.eq, true, 'eq: equal values'],
    [5, 6, CompareType.eq, false, 'eq: different values'],
    [5, 6, CompareType.ne, true, 'ne: different values'],
    [5, 5, CompareType.ne, false, 'ne: equal values'],
    [3, 5, CompareType.lt, true, 'lt: less than'],
    [5, 3, CompareType.lt, false, 'lt: greater than'],
    [5, 5, CompareType.le, true, 'le: equal'],
    [6, 5, CompareType.le, false, 'le: greater than'],
    [5, 3, CompareType.gt, true, 'gt: greater than'],
    [3, 5, CompareType.gt, false, 'gt: less than'],
    [5, 5, CompareType.ge, true, 'ge: equal'],
    [3, 5, CompareType.ge, false, 'ge: less than'],
  ])('returns %s for %s', (a, b, type, expected) => {
    expect(compareValue(a, b, type)).toBe(expected)
  })
})

describe('CompareValueRule', () => {
  it.each([
    ['', null, 'empty string'],
    [null, null, 'null'],
    ['abc', null, 'non-numeric string'],
    [5, null, 'passing comparison'],
    [0, null, 'boundary value'],
  ])('validate returns %s for %s', (input, expected) => {
    const rule = new CompareValueRule(0, CompareType.ge)
    expect(rule.validate(input, 'Field')).toBe(expected)
  })

  it('returns error message when comparison fails', () => {
    const rule = new CompareValueRule(0, CompareType.ge)
    expect(rule.validate(-1, 'Field')).toBe(
      'Fieldは0以上の値を入力してください'
    )
  })
})
