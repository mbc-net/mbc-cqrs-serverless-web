import {
  required,
  requiredIf,
  zenkaku,
  katakana,
  zenkakuSpace,
} from '../validation'

describe('required', () => {
  it('should return false for null, undefined, empty string', () => {
    expect(required(null)).toBe(false)
    expect(required(undefined)).toBe(false)
    expect(required('')).toBe(false)
  })

  it('should return false for empty array', () => {
    expect(required([])).toBe(false)
  })

  it('should return true for 0', () => {
    expect(required(0)).toBe(true)
  })

  it('should return true for non-empty values', () => {
    expect(required('hello')).toBe(true)
    expect(required(123)).toBe(true)
    expect(required([1])).toBe(true)
    expect(required(false)).toBe(true)
  })
})

describe('requiredIf', () => {
  it('should return true when other field does not match', () => {
    expect(requiredIf('', 'a', 'b')).toBe(true)
  })

  it('should return false when field matches and value is empty', () => {
    expect(requiredIf('', 'a', 'a')).toBe(false)
  })

  it('should return true when field matches and value is present', () => {
    expect(requiredIf('hello', 'a', 'a')).toBe(true)
  })
})

describe('zenkaku', () => {
  it('should return true for null/empty', () => {
    expect(zenkaku(null)).toBe(true)
    expect(zenkaku('')).toBe(true)
  })

  it('should return true for full-width characters', () => {
    expect(zenkaku('あいう')).toBe(true)
    expect(zenkaku('漢字')).toBe(true)
  })

  it('should return false for half-width characters', () => {
    expect(zenkaku('abc')).toBe(false)
    expect(zenkaku('123')).toBe(false)
  })
})

describe('katakana', () => {
  it('should return true for null/empty', () => {
    expect(katakana(null)).toBe(true)
    expect(katakana('')).toBe(true)
  })

  it('should return true for katakana', () => {
    expect(katakana('アイウ')).toBe(true)
    expect(katakana('カタカナ')).toBe(true)
  })

  it('should return false for non-katakana', () => {
    expect(katakana('abc')).toBe(false)
    expect(katakana('あいう')).toBe(false)
  })
})

describe('zenkakuSpace', () => {
  it('should return true for null/empty', () => {
    expect(zenkakuSpace(null)).toBe(true)
    expect(zenkakuSpace('')).toBe(true)
  })

  it('should return true when full-width space exists between chars', () => {
    expect(zenkakuSpace('東京　太郎')).toBe(true)
  })

  it('should return false when no full-width space', () => {
    expect(zenkakuSpace('東京太郎')).toBe(false)
  })
})
