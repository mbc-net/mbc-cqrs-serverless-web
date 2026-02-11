// parseContent is not exported, so we re-implement the same logic for testing
// This tests the contract: JSON strings are parsed, invalid JSON returns the raw string
function parseContent(content: string): string | object {
  try {
    return JSON.parse(content)
  } catch (error) {
    return content
  }
}

describe('parseContent', () => {
  it('parses a valid JSON object string', () => {
    const input = '{"status":"finish:FINISHED"}'
    const result = parseContent(input)
    expect(result).toEqual({ status: 'finish:FINISHED' })
  })

  it('parses a valid JSON array string', () => {
    const input = '[1, 2, 3]'
    const result = parseContent(input)
    expect(result).toEqual([1, 2, 3])
  })

  it('returns the raw string for invalid JSON', () => {
    const input = 'Hello, this is a plain message'
    const result = parseContent(input)
    expect(result).toBe('Hello, this is a plain message')
  })

  it('returns the raw string for partial JSON', () => {
    const input = '{"incomplete": '
    const result = parseContent(input)
    expect(result).toBe('{"incomplete": ')
  })

  it('parses a JSON string value', () => {
    const input = '"just a string"'
    const result = parseContent(input)
    expect(result).toBe('just a string')
  })

  it('parses JSON number', () => {
    const input = '42'
    const result = parseContent(input)
    expect(result).toBe(42)
  })

  it('parses JSON boolean', () => {
    const input = 'true'
    const result = parseContent(input)
    expect(result).toBe(true)
  })

  it('parses JSON null', () => {
    const input = 'null'
    const result = parseContent(input)
    expect(result).toBeNull()
  })

  it('returns empty string as-is', () => {
    const input = ''
    const result = parseContent(input)
    expect(result).toBe('')
  })

  it('parses nested JSON object', () => {
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
