import {
  required,
  requiredIf,
  zenkaku,
  katakana,
  zenkakuSpace,
} from '../validation'

describe('required', () => {
  it.each([
    [null, false, 'null'],
    [undefined, false, 'undefined'],
    ['', false, 'empty string'],
    [[], false, 'empty array'],
    [0, true, '0'],
    ['hello', true, 'non-empty string'],
    [123, true, 'number'],
    [[1], true, 'non-empty array'],
    [false, true, 'false'],
  ])('returns %s for %s', (input, expected) => {
    expect(required(input)).toBe(expected)
  })
})

describe('requiredIf', () => {
  it.each([
    ['', 'a', 'b', true, 'other field does not match'],
    ['', 'a', 'a', false, 'field matches and value is empty'],
    ['hello', 'a', 'a', true, 'field matches and value is present'],
  ])('returns %s when %s', (value, otherField, otherValue, expected) => {
    expect(requiredIf(value, otherField, otherValue)).toBe(expected)
  })
})

describe('zenkaku', () => {
  it.each([
    [null, true, 'null'],
    ['', true, 'empty string'],
    ['あいう', true, 'hiragana'],
    ['漢字', true, 'kanji'],
    ['１２３', true, 'full-width numbers'],
    ['＋＝', true, 'full-width symbols'],
    ['abc', false, 'half-width letters'],
    ['123', false, 'half-width numbers'],
  ])('returns %s for %s', (input, expected) => {
    expect(zenkaku(input)).toBe(expected)
  })
})

describe('katakana', () => {
  it.each([
    [null, true, 'null'],
    ['', true, 'empty string'],
    ['アイウ', true, 'katakana'],
    ['カタカナ', true, 'katakana word'],
    ['ー', true, 'prolonged sound mark'],
    ['・', true, 'middle dot'],
    ['カタカナ　テスト', true, 'katakana with full-width space'],
    ['abc', false, 'half-width letters'],
    ['あいう', false, 'hiragana'],
  ])('returns %s for %s', (input, expected) => {
    expect(katakana(input)).toBe(expected)
  })
})

describe('zenkakuSpace', () => {
  it.each([
    [null, true, 'null'],
    ['', true, 'empty string'],
    ['東京　太郎', true, 'with full-width space'],
    ['東京太郎', false, 'without full-width space'],
  ])('returns %s for %s', (input, expected) => {
    expect(zenkakuSpace(input)).toBe(expected)
  })
})
