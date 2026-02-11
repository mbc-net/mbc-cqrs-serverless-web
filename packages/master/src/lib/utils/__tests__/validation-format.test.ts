import {
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
} from '../validation'

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
