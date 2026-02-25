import {
  formatDate,
  getDayOfWeek,
  getFinancialYearByYear,
  toISOStringWithTimezone,
  getYYYYMMDD_HHMMSS,
  getDate,
} from '../datetime'

describe('formatDate', () => {
  it('should return empty string for undefined/null', () => {
    expect(formatDate(undefined)).toBe('')
    expect(formatDate(null as any)).toBe('')
  })

  it('should format Date object with default format', () => {
    // Create a date in JST
    const date = new Date(2024, 0, 15, 12, 0, 0) // Jan 15, 2024
    const result = formatDate(date)
    expect(result).toMatch(/2024年01月15日/)
  })

  it('should format with custom format', () => {
    const date = new Date(2024, 5, 3, 14, 30, 45) // Jun 3, 2024
    const result = formatDate(date, 'yyyy/mm/dd HH:MM:SS')
    expect(result).toMatch(/2024\/06\/03/)
  })

  it('should accept string dates', () => {
    const result = formatDate('2024-01-01T00:00:00Z')
    expect(result).toContain('2024')
  })

  it('should accept numeric timestamps', () => {
    const timestamp = new Date(2024, 0, 1).getTime()
    const result = formatDate(timestamp)
    expect(result).toContain('2024')
  })

  it('should include day of week when requested', () => {
    const date = new Date(2024, 0, 15) // Monday
    const result = formatDate(date, 'yyyy年mm月dd日', true)
    expect(result).toMatch(/（[日月火水木金土]）$/)
  })
})

describe('getDayOfWeek', () => {
  it('should return correct Japanese day names', () => {
    const sunday = new Date(2024, 0, 7) // Sunday
    expect(getDayOfWeek(sunday)).toBe('日')

    const monday = new Date(2024, 0, 8) // Monday
    expect(getDayOfWeek(monday)).toBe('月')

    const saturday = new Date(2024, 0, 6) // Saturday
    expect(getDayOfWeek(saturday)).toBe('土')
  })
})

describe('getFinancialYearByYear', () => {
  it('should return correct financial year range', () => {
    const fy = getFinancialYearByYear(2024)
    expect(fy.start.getMonth()).toBe(3) // April = month 3
    expect(fy.start.getDate()).toBe(1)
    expect(fy.end.getMonth()).toBe(2) // March = month 2
    expect(fy.end.getDate()).toBe(31)
  })

  it('should set mid to 6 months after start', () => {
    const fy = getFinancialYearByYear(2024)
    expect(fy.mid.getMonth()).toBe(9) // October = month 9
  })
})

describe('toISOStringWithTimezone', () => {
  it('should return undefined for falsy input', () => {
    expect(toISOStringWithTimezone(null as any)).toBeUndefined()
  })

  it('should return ISO string with timezone offset', () => {
    const date = new Date(2024, 0, 15, 10, 30, 45)
    const result = toISOStringWithTimezone(date)
    expect(result).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/
    )
  })
})

describe('getYYYYMMDD_HHMMSS', () => {
  it('should return null for null input', () => {
    expect(getYYYYMMDD_HHMMSS(null)).toBeNull()
  })

  it('should format Date object', () => {
    const date = new Date(2024, 0, 15, 10, 30, 45)
    const result = getYYYYMMDD_HHMMSS(date)
    expect(result).toBe('2024/01/15 10:30:45')
  })

  it('should handle string date input', () => {
    const result = getYYYYMMDD_HHMMSS('20240115')
    expect(result).toContain('2024/01/15')
  })
})

describe('getDate', () => {
  it('should return null for null/empty', () => {
    expect(getDate(null)).toBeNull()
    expect(getDate('')).toBeNull()
  })

  it('should return Date object as-is', () => {
    const date = new Date(2024, 0, 15)
    expect(getDate(date)).toBe(date)
  })

  it('should parse ISO string', () => {
    const result = getDate('2024-01-15T00:00:00.000Z')
    expect(result).toBeInstanceOf(Date)
    expect(result.getFullYear()).toBe(2024)
  })

  it('should parse YYYYMMDD string', () => {
    const result = getDate('20240115')
    expect(result).toBeInstanceOf(Date)
    expect(result.getFullYear()).toBe(2024)
    expect(result.getMonth()).toBe(0) // January
    expect(result.getDate()).toBe(15)
  })

  it('should parse YYYYMMDD with time', () => {
    const result = getDate('20240115', '103045')
    expect(result).toBeInstanceOf(Date)
    expect(result.getHours()).toBe(10)
    expect(result.getMinutes()).toBe(30)
    expect(result.getSeconds()).toBe(45)
  })

  it('should return null for unparseable string', () => {
    expect(getDate('not-a-date')).toBeNull()
  })
})
