import {
  required,
  requiredIf,
  zenkaku,
  katakana,
  hankakuNum,
  hankakuEisu,
  hankakuEisuKigo,
  tel,
  email,
  emailMultiple,
  url,
  date,
  time,
  password,
  ip,
  json,
  length,
  maxLength,
  regex,
  isNumeric,
  zenkakuSpace,
  compareValue,
  CompareType,
  CompareValueRule,
  BreakAndNumberRule,
  NotLastJapanRule,
  LastJapanRule,
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

describe('hankakuNum', () => {
  it('should return true for null/empty', () => {
    expect(hankakuNum(null)).toBe(true)
    expect(hankakuNum('')).toBe(true)
  })

  it('should return true for digits and commas', () => {
    expect(hankakuNum('12345')).toBe(true)
    expect(hankakuNum('1,000')).toBe(true)
  })

  it('should return false for non-numeric', () => {
    expect(hankakuNum('abc')).toBe(false)
    expect(hankakuNum('12.5')).toBe(false)
  })
})

describe('hankakuEisu', () => {
  it('should return true for null/empty', () => {
    expect(hankakuEisu(null)).toBe(true)
  })

  it('should return true for alphanumeric', () => {
    expect(hankakuEisu('abc123')).toBe(true)
    expect(hankakuEisu('Hello World')).toBe(true)
  })

  it('should return false for non-alphanumeric', () => {
    expect(hankakuEisu('abc!')).toBe(false)
    expect(hankakuEisu('あ')).toBe(false)
  })
})

describe('hankakuEisuKigo', () => {
  it('should return true for alphanumeric and symbols', () => {
    expect(hankakuEisuKigo('abc123!@#')).toBe(true)
  })

  it('should return false for full-width', () => {
    expect(hankakuEisuKigo('あ')).toBe(false)
  })
})

describe('tel', () => {
  it('should return true for null/empty', () => {
    expect(tel(null)).toBe(true)
    expect(tel('')).toBe(true)
  })

  it('should return true for valid phone numbers', () => {
    expect(tel('03-1234-5678')).toBe(true)
    expect(tel('090-1234-5678')).toBe(true)
  })

  it('should return false for too short numbers', () => {
    expect(tel('123')).toBe(false)
  })
})

describe('email', () => {
  it('should return true for null/empty', () => {
    expect(email(null)).toBe(true)
    expect(email('')).toBe(true)
  })

  it('should return true for valid emails', () => {
    expect(email('test@example.com')).toBe(true)
    expect(email('user+tag@domain.co.jp')).toBe(true)
  })

  it('should return false for invalid emails', () => {
    expect(email('notanemail')).toBe(false)
    expect(email('@domain.com')).toBe(false)
  })
})

describe('emailMultiple', () => {
  it('should return true for null/empty', () => {
    expect(emailMultiple(null)).toBe(true)
  })

  it('should return true for multiple valid emails', () => {
    expect(emailMultiple('a@b.com,c@d.com')).toBe(true)
  })

  it('should return false if any email is invalid', () => {
    expect(emailMultiple('a@b.com,invalid')).toBe(false)
  })
})

describe('url', () => {
  it('should return true for null/empty', () => {
    expect(url(null)).toBe(true)
  })

  it('should return true for valid URLs', () => {
    expect(url('https://example.com')).toBe(true)
    expect(url('http://localhost:3000')).toBe(true)
  })

  it('should return false for invalid URLs', () => {
    expect(url('not a url')).toBe(false)
    expect(url('ftp://example.com')).toBe(false)
  })
})

describe('date', () => {
  it('should return true for null/empty', () => {
    expect(date(null)).toBe(true)
    expect(date('')).toBe(true)
  })

  it('should return true for YYYYMMDD format', () => {
    expect(date('20240101')).toBe(true)
    expect(date('20241231')).toBe(true)
  })

  it('should return true for ISO date string', () => {
    expect(date('2024-01-01')).toBe(true)
  })

  it('should return false for invalid dates', () => {
    expect(date('20241301')).toBe(false) // month 13
    expect(date('20240230')).toBe(false) // Feb 30
    expect(date('abcdefgh')).toBe(false)
  })
})

describe('time', () => {
  it('should return true for null/empty', () => {
    expect(time(null)).toBe(true)
    expect(time('')).toBe(true)
  })

  it('should return true for valid hhmmss', () => {
    expect(time('000000')).toBe(true)
    expect(time('235959')).toBe(true)
    expect(time('120000')).toBe(true)
  })

  it('should return false for invalid time', () => {
    expect(time('250000')).toBe(false)
    expect(time('126000')).toBe(false)
    expect(time('12')).toBe(false)
  })
})

describe('password', () => {
  it('should return true for null/empty', () => {
    expect(password(null)).toBe(true)
    expect(password('')).toBe(true)
  })

  it('should return true for valid passwords', () => {
    expect(password('abcd1234')).toBe(true)
    expect(password('Pass1234')).toBe(true)
  })

  it('should return false for too short', () => {
    expect(password('ab1')).toBe(false)
  })

  it('should return false for too long', () => {
    expect(password('abcdefghij1234567')).toBe(false)
  })

  it('should return false for letters only', () => {
    expect(password('abcdefgh')).toBe(false)
  })

  it('should return false for digits only', () => {
    expect(password('12345678')).toBe(false)
  })

  it('should return false for special characters', () => {
    expect(password('abcd123!')).toBe(false)
  })
})

describe('ip', () => {
  it('should return true for null/empty', () => {
    expect(ip(null)).toBe(true)
    expect(ip('')).toBe(true)
  })

  it('should return true for valid IPs', () => {
    expect(ip('192.168.1.1')).toBe(true)
    expect(ip('0.0.0.0')).toBe(true)
    expect(ip('255.255.255.255')).toBe(true)
  })

  it('should return false for invalid IPs', () => {
    expect(ip('256.0.0.1')).toBe(false)
    expect(ip('1.2.3')).toBe(false)
    expect(ip('abc.def.ghi.jkl')).toBe(false)
  })
})

describe('json', () => {
  it('should return true for null/empty', () => {
    expect(json(null)).toBe(true)
    expect(json('')).toBe(true)
  })

  it('should return true for objects', () => {
    expect(json({ key: 'value' })).toBe(true)
    expect(json([])).toBe(true)
  })

  it('should return true for valid JSON strings', () => {
    expect(json('{"key":"value"}')).toBe(true)
    expect(json('[1,2,3]')).toBe(true)
  })

  it('should return false for invalid JSON strings', () => {
    expect(json('{invalid}')).toBe(false)
    expect(json('not json')).toBe(false)
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
