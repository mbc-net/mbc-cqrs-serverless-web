import { getPaginationItems } from '../src/components/pagination/get-pagination-item'

describe('getPaginationItems', () => {
  describe('lastPage <= maxLength (no ellipsis)', () => {
    it('should return [1] for a single page', () => {
      expect(getPaginationItems(1, 1, 7)).toEqual([1])
    })

    it('should return all pages when lastPage equals maxLength', () => {
      expect(getPaginationItems(1, 7, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
    })

    it('should return all pages when lastPage is less than maxLength', () => {
      expect(getPaginationItems(3, 5, 7)).toEqual([1, 2, 3, 4, 5])
    })
  })

  describe('ellipsis placement (lastPage > maxLength)', () => {
    it('should place ellipsis in the middle when on first page', () => {
      const result = getPaginationItems(1, 20, 7)
      // Should have pages at start, NaN, pages at end
      expect(result.length).toBe(7)
      expect(result[0]).toBe(1)
      expect(result[result.length - 1]).toBe(20)
      // Should contain exactly one NaN
      const nanCount = result.filter((n) => Number.isNaN(n)).length
      expect(nanCount).toBe(1)
    })

    it('should place ellipsis in the middle when on last page', () => {
      const result = getPaginationItems(20, 20, 7)
      expect(result.length).toBe(7)
      expect(result[0]).toBe(1)
      expect(result[result.length - 1]).toBe(20)
      const nanCount = result.filter((n) => Number.isNaN(n)).length
      expect(nanCount).toBe(1)
    })

    it('should place two ellipses when page is in the middle', () => {
      const result = getPaginationItems(10, 20, 7)
      expect(result[0]).toBe(1)
      expect(result[result.length - 1]).toBe(20)
      // Should contain exactly two NaN values
      const nanCount = result.filter((n) => Number.isNaN(n)).length
      expect(nanCount).toBe(2)
    })

    it('should handle page near first page with asymmetric ellipsis', () => {
      const result = getPaginationItems(4, 20, 7)
      expect(result[0]).toBe(1)
      expect(result[result.length - 1]).toBe(20)
      // Should contain at least one NaN
      const nanCount = result.filter((n) => Number.isNaN(n)).length
      expect(nanCount).toBeGreaterThanOrEqual(1)
    })

    it('should handle page near last page with asymmetric ellipsis', () => {
      const result = getPaginationItems(17, 20, 7)
      expect(result[0]).toBe(1)
      expect(result[result.length - 1]).toBe(20)
      const nanCount = result.filter((n) => Number.isNaN(n)).length
      expect(nanCount).toBeGreaterThanOrEqual(1)
    })
  })

  describe('result invariants', () => {
    it('should always start with 1 and end with lastPage', () => {
      for (let page = 1; page <= 30; page++) {
        const result = getPaginationItems(page, 30, 7)
        expect(result[0]).toBe(1)
        expect(result[result.length - 1]).toBe(30)
      }
    })

    it('should keep non-NaN values in ascending order', () => {
      for (let page = 1; page <= 20; page++) {
        const result = getPaginationItems(page, 20, 7)
        const numbers = result.filter((n) => !Number.isNaN(n))
        for (let i = 1; i < numbers.length; i++) {
          expect(numbers[i]).toBeGreaterThan(numbers[i - 1])
        }
      }
    })

    it('should always include the current page in the result', () => {
      for (let page = 1; page <= 20; page++) {
        const result = getPaginationItems(page, 20, 7)
        const numbers = result.filter((n) => !Number.isNaN(n))
        expect(numbers).toContain(page)
      }
    })
  })
})
