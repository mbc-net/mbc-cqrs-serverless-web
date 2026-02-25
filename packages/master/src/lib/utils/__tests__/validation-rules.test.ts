import {
  BreakAndNumberRule,
  NotLastJapanRule,
  LastJapanRule,
} from '../validation'

describe('BreakAndNumberRule', () => {
  it('should return null for empty value', () => {
    const rule = new BreakAndNumberRule(3)
    expect(rule.validate('', 'Field')).toBeNull()
  })

  it('should return error when exceeding max rows', () => {
    const rule = new BreakAndNumberRule(2)
    expect(rule.validate('1\n2\n3', 'Field')).toBe('Fieldは2行まで入力可能です')
  })

  it('should return null for valid input within rows', () => {
    const rule = new BreakAndNumberRule(3)
    expect(rule.validate('1\n2\n3', 'Field')).toBeNull()
  })

  it('should check maxLength per line', () => {
    const rule = new BreakAndNumberRule(5, { maxLength: 3 })
    expect(rule.validate('1234', 'Field')).toBe(
      'Fieldは1行あたり3文字以内で入力してください'
    )
  })

  it('should check number format per line', () => {
    const rule = new BreakAndNumberRule(5, { isCheckNumber: true })
    expect(rule.validate('abc', 'Field')).toBe(
      'Fieldは半角数字で入力してください'
    )
  })
})

describe('NotLastJapanRule', () => {
  it('should return null for empty value', () => {
    const rule = new NotLastJapanRule()
    expect(rule.validate('', 'Field')).toBeNull()
  })

  it('should return null when not ending with Japan', () => {
    const rule = new NotLastJapanRule()
    expect(rule.validate('Tokyo', 'Field')).toBeNull()
  })

  it('should return error when ending with Japan', () => {
    const rule = new NotLastJapanRule()
    expect(rule.validate('Tokyo Japan', 'Field')).toBe(
      'Fieldの末尾には、国名を含めずに記入してください'
    )
  })

  it('should be case-insensitive', () => {
    const rule = new NotLastJapanRule()
    expect(rule.validate('Tokyo JAPAN', 'Field')).toBe(
      'Fieldの末尾には、国名を含めずに記入してください'
    )
  })
})

describe('LastJapanRule', () => {
  it('should return null for empty value', () => {
    const rule = new LastJapanRule()
    expect(rule.validate('', 'Field')).toBeNull()
  })

  it('should return null when ending with Japan', () => {
    const rule = new LastJapanRule()
    expect(rule.validate('Tokyo Japan', 'Field')).toBeNull()
  })

  it('should return error when not ending with Japan', () => {
    const rule = new LastJapanRule()
    expect(rule.validate('Tokyo', 'Field')).toBe(
      'Fieldの末尾には、「Japan」で終了するように記入してください'
    )
  })
})
