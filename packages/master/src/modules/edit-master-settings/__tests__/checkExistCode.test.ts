import { isCodeUnique } from '../checkExistCode'
import { createMockHttpClient } from '../../../testing/test-utils'

describe('isCodeUnique (edit-master-settings)', () => {
  it('returns false for empty string', async () => {
    const client = createMockHttpClient()
    expect(await isCodeUnique(client, '')).toBe(false)
    expect(client.post).not.toHaveBeenCalled()
  })

  it('returns false for whitespace-only string', async () => {
    const client = createMockHttpClient()
    expect(await isCodeUnique(client, '   ')).toBe(false)
    expect(client.post).not.toHaveBeenCalled()
  })

  it('returns false when API indicates code exists', async () => {
    const client = createMockHttpClient(true)
    expect(await isCodeUnique(client, 'SETTING001')).toBe(false)
  })

  it('returns true when API indicates code does not exist', async () => {
    const client = createMockHttpClient(false)
    expect(await isCodeUnique(client, 'SETTING001')).toBe(true)
  })

  it('returns false on API error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    const client = createMockHttpClient(null, true)
    expect(await isCodeUnique(client, 'SETTING001')).toBe(false)
    consoleSpy.mockRestore()
  })

  it('trims whitespace from code', async () => {
    const client = createMockHttpClient(false)
    await isCodeUnique(client, '  SETTING001  ')
    expect(client.post).toHaveBeenCalledWith(
      expect.stringContaining('SETTING001')
    )
  })
})
