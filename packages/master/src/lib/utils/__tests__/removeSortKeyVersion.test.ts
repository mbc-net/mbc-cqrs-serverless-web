import { removeSortKeyVersion } from '../removeSortKeyVersion'

describe('removeSortKeyVersion', () => {
  it('should remove version suffix after @', () => {
    expect(removeSortKeyVersion('ITEM#001@1')).toBe('ITEM#001')
  })

  it('should remove only the last @ segment', () => {
    expect(removeSortKeyVersion('A@B@3')).toBe('A@B')
  })

  it('should return the original string if no @ exists', () => {
    expect(removeSortKeyVersion('ITEM#001')).toBe('ITEM#001')
  })

  it('should handle empty string', () => {
    expect(removeSortKeyVersion('')).toBe('')
  })

  it('should handle string ending with @', () => {
    expect(removeSortKeyVersion('ITEM@')).toBe('ITEM')
  })

  it('should handle string starting with @', () => {
    expect(removeSortKeyVersion('@version')).toBe('')
  })

  it('should handle multiple consecutive @ characters', () => {
    expect(removeSortKeyVersion('ITEM@@@')).toBe('ITEM@@')
  })

  it('should handle @ only string', () => {
    expect(removeSortKeyVersion('@')).toBe('')
  })
})
