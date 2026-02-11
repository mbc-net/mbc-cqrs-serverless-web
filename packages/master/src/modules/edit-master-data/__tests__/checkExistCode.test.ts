import { isCodeUnique } from '../checkExistCode'
import { createMockHttpClient } from '../../../testing/test-utils'

describe('isCodeUnique (edit-master-data)', () => {
  it('returns false for empty string', async () => {
    const client = createMockHttpClient()
    expect(await isCodeUnique(client, 'setting1', '')).toBe(false)
    expect(client.post).not.toHaveBeenCalled()
  })

  it('returns false for whitespace-only string', async () => {
    const client = createMockHttpClient()
    expect(await isCodeUnique(client, 'setting1', '   ')).toBe(false)
    expect(client.post).not.toHaveBeenCalled()
  })

  it('returns false when API indicates code exists', async () => {
    const client = createMockHttpClient(true)
    expect(await isCodeUnique(client, 'setting1', 'CODE001')).toBe(false)
  })

  it('returns true when API indicates code does not exist', async () => {
    const client = createMockHttpClient(false)
    expect(await isCodeUnique(client, 'setting1', 'CODE001')).toBe(true)
  })

  it('returns false on API error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    const client = createMockHttpClient(null, true)
    expect(await isCodeUnique(client, 'setting1', 'CODE001')).toBe(false)
    consoleSpy.mockRestore()
  })

  it('trims whitespace from code', async () => {
    const client = createMockHttpClient(false)
    await isCodeUnique(client, 'setting1', '  CODE001  ')
    expect(client.post).toHaveBeenCalledWith(expect.stringContaining('CODE001'))
    expect(client.post).not.toHaveBeenCalledWith(expect.stringContaining('%20'))
  })

  it('URL-encodes settingCode and code', async () => {
    const client = createMockHttpClient(false)
    await isCodeUnique(client, 'setting/code', 'code&value')
    const calledUrl = client.post.mock.calls[0][0]
    expect(calledUrl).toContain(encodeURIComponent('setting/code'))
    expect(calledUrl).toContain(encodeURIComponent('code&value'))
  })
})
