import { isBrowser, isServer } from '../hardNavigate'

describe('isBrowser', () => {
  it('should return true in jsdom environment', () => {
    expect(isBrowser()).toBe(true)
  })
})

describe('isServer', () => {
  it('should return false in jsdom environment', () => {
    expect(isServer()).toBe(false)
  })
})
