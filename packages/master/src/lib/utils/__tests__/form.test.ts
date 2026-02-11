import { removeCommaString, getOrderingString } from '../form'

describe('removeCommaString', () => {
  it('should return [false, value] for null/undefined/empty', () => {
    expect(removeCommaString(null)).toEqual([false, null])
    expect(removeCommaString(undefined)).toEqual([false, undefined])
    expect(removeCommaString('')).toEqual([false, ''])
  })

  it('should return [false, value] when no comma exists', () => {
    expect(removeCommaString('12345')).toEqual([false, '12345'])
  })

  it('should remove commas and return [true, cleaned]', () => {
    expect(removeCommaString('1,000')).toEqual([true, '1000'])
    expect(removeCommaString('1,000,000')).toEqual([true, '1000000'])
  })
})

describe('getOrderingString', () => {
  it('should return null when sorter is null', () => {
    expect(getOrderingString(null)).toBeNull()
  })

  it('should return null when columnKey is missing', () => {
    expect(getOrderingString({} as any)).toBeNull()
  })

  it('should return column key for ascending', () => {
    expect(
      getOrderingString({ columnKey: 'name', order: 'ascend' } as any)
    ).toBe('name')
  })

  it('should prefix with - for descending', () => {
    expect(
      getOrderingString({ columnKey: 'name', order: 'descend' } as any)
    ).toBe('-name')
  })
})
