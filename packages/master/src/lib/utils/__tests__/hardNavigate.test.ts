import { isBrowser, isServer } from '../hardNavigate'

describe('environment detection', () => {
  it.each([
    ['isBrowser', isBrowser, true],
    ['isServer', isServer, false],
  ] as const)(
    '%s() should return %s in jsdom environment',
    (_, fn, expected) => {
      expect(fn()).toBe(expected)
    }
  )
})
