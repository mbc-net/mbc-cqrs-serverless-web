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
  it.each([
    [null, true, 'null'],
    ['', true, 'empty string'],
    ['12345', true, 'digits only'],
    ['1,000', true, 'digits with comma'],
    ['abc', false, 'alphabetic'],
    ['12.5', false, 'decimal'],
  ])('returns %s for %s', (input, expected) => {
    expect(hankakuNum(input)).toBe(expected)
  })
})

describe('hankakuEisu', () => {
  it.each([
    [null, true, 'null'],
    ['abc123', true, 'alphanumeric'],
    ['Hello World', true, 'alphanumeric with space'],
    ['abc!', false, 'with special character'],
    ['あ', false, 'full-width character'],
  ])('returns %s for %s', (input, expected) => {
    expect(hankakuEisu(input)).toBe(expected)
  })
})

describe('hankakuEisuKigo', () => {
  it.each([
    ['abc123!@#', true, 'alphanumeric and symbols'],
    ['あ', false, 'full-width character'],
  ])('returns %s for %s', (input, expected) => {
    expect(hankakuEisuKigo(input)).toBe(expected)
  })
})

describe('tel', () => {
  it.each([
    [null, true, 'null'],
    ['', true, 'empty string'],
    ['03-1234-5678', true, 'landline number'],
    ['090-1234-5678', true, 'mobile number'],
    ['123', false, 'too short number'],
  ])('returns %s for %s', (input, expected) => {
    expect(tel(input)).toBe(expected)
  })
})

describe('email', () => {
  it.each([
    [null, true, 'null'],
    ['', true, 'empty string'],
    ['test@example.com', true, 'standard email'],
    ['user+tag@domain.co.jp', true, 'email with plus tag'],
    ['user.name@domain.com', true, 'dotted local part'],
    ['a@sub.domain.co.jp', true, 'subdomain email'],
    ['notanemail', false, 'no at sign'],
    ['@domain.com', false, 'missing local part'],
    ['user@', false, 'missing domain'],
  ])('returns %s for %s', (input, expected) => {
    expect(email(input)).toBe(expected)
  })
})

describe('emailMultiple', () => {
  it.each([
    [null, true, 'null'],
    ['a@b.com,c@d.com', true, 'multiple valid emails'],
    ['a@b.com,invalid', false, 'one invalid email'],
  ])('returns %s for %s', (input, expected) => {
    expect(emailMultiple(input)).toBe(expected)
  })
})

describe('url', () => {
  it.each([
    [null, true, 'null'],
    ['https://example.com', true, 'HTTPS URL'],
    ['http://localhost:3000', true, 'localhost URL'],
    ['https://example.com:8080/path', true, 'URL with port'],
    ['https://example.com/path?q=1&r=2', true, 'URL with query string'],
    ['https://example.com#section', true, 'URL with hash'],
    ['not a url', false, 'plain text'],
    ['ftp://example.com', false, 'FTP URL'],
  ])('returns %s for %s', (input, expected) => {
    expect(url(input)).toBe(expected)
  })
})

describe('date', () => {
  it.each([
    [null, true, 'null'],
    ['', true, 'empty string'],
    ['20240101', true, 'YYYYMMDD format'],
    ['20241231', true, 'year end date'],
    ['2024-01-01', true, 'ISO date string'],
    ['20240229', true, 'leap year Feb 29'],
    ['20230229', false, 'non-leap year Feb 29'],
    ['20241301', false, 'month 13'],
    ['20240230', false, 'Feb 30'],
    ['abcdefgh', false, 'non-date string'],
    ['20240001', false, 'month 00'],
  ])('returns %s for %s', (input, expected) => {
    expect(date(input)).toBe(expected)
  })
})

describe('time', () => {
  it.each([
    [null, true, 'null'],
    ['', true, 'empty string'],
    ['000000', true, 'midnight'],
    ['235959', true, 'end of day'],
    ['120000', true, 'noon'],
    ['250000', false, 'hour 25'],
    ['126000', false, 'minute 60'],
    ['12', false, 'too short'],
    ['240000', false, 'hour 24'],
    ['235960', false, 'second 60'],
    ['1200', false, 'missing seconds'],
  ])('returns %s for %s', (input, expected) => {
    expect(time(input)).toBe(expected)
  })
})

describe('password', () => {
  it.each([
    [null, true, 'null'],
    ['', true, 'empty string'],
    ['abcd1234', true, 'valid mixed password'],
    ['Pass1234', true, 'valid uppercase password'],
    ['ab1', false, 'too short'],
    ['abcdefghij1234567', false, 'too long'],
    ['abcdefgh', false, 'letters only'],
    ['12345678', false, 'digits only'],
    ['abcd123!', false, 'special characters'],
  ])('returns %s for %s', (input, expected) => {
    expect(password(input)).toBe(expected)
  })
})

describe('ip', () => {
  it.each([
    [null, true, 'null'],
    ['', true, 'empty string'],
    ['192.168.1.1', true, 'private IP'],
    ['0.0.0.0', true, 'all zeros'],
    ['255.255.255.255', true, 'max IP'],
    ['01.02.03.04', true, 'leading zero IP'],
    ['256.0.0.1', false, 'octet > 255'],
    ['1.2.3', false, 'only 3 octets'],
    ['abc.def.ghi.jkl', false, 'alphabetic octets'],
    ['::1', false, 'IPv6'],
  ])('returns %s for %s', (input, expected) => {
    expect(ip(input)).toBe(expected)
  })
})

describe('json', () => {
  it.each([
    [null, true, 'null'],
    ['', true, 'empty string'],
    [{ key: 'value' }, true, 'object'],
    [[], true, 'array'],
    ['{"key":"value"}', true, 'valid JSON string'],
    ['[1,2,3]', true, 'valid JSON array string'],
    ['{invalid}', false, 'invalid JSON string'],
    ['not json', false, 'plain text'],
  ])('returns %s for %s', (input, expected) => {
    expect(json(input)).toBe(expected)
  })
})
