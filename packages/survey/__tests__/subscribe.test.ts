import { parseContent } from '../src/client/appsync/subscribe'

describe('parseContent', () => {
  it('should parse a valid JSON object string', () => {
    const input = '{"status":"finish:FINISHED"}'
    const result = parseContent(input)
    expect(result).toEqual({ status: 'finish:FINISHED' })
  })

  it('should parse a valid JSON array string', () => {
    const input = '[1, 2, 3]'
    const result = parseContent(input)
    expect(result).toEqual([1, 2, 3])
  })

  it('should return the raw string for invalid JSON', () => {
    const input = 'Hello, this is a plain message'
    const result = parseContent(input)
    expect(result).toBe('Hello, this is a plain message')
  })

  it('should return the raw string for partial JSON', () => {
    const input = '{"incomplete": '
    const result = parseContent(input)
    expect(result).toBe('{"incomplete": ')
  })

  it('should parse a JSON string value', () => {
    const input = '"just a string"'
    const result = parseContent(input)
    expect(result).toBe('just a string')
  })

  it('should parse JSON number', () => {
    const input = '42'
    const result = parseContent(input)
    expect(result).toBe(42)
  })

  it('should parse JSON boolean', () => {
    const input = 'true'
    const result = parseContent(input)
    expect(result).toBe(true)
  })

  it('should parse JSON null', () => {
    const input = 'null'
    const result = parseContent(input)
    expect(result).toBeNull()
  })

  it('should return empty string as-is', () => {
    const input = ''
    const result = parseContent(input)
    expect(result).toBe('')
  })

  it('should parse nested JSON object', () => {
    const input = JSON.stringify({
      status: 'sync_data:STARTED',
      metadata: { count: 5 },
    })
    const result = parseContent(input)
    expect(result).toEqual({
      status: 'sync_data:STARTED',
      metadata: { count: 5 },
    })
  })
})
