import { renderHook } from '@testing-library/react'
import { usePaginationRange, DOTS } from '../usePaginationRange'

describe('usePaginationRange', () => {
  const render = (props: {
    totalPageCount: number
    currentPage: number
    siblingCount?: number
  }) => renderHook(() => usePaginationRange(props)).result.current

  describe('when totalPageCount is small (show all pages)', () => {
    it('totalPageCount=0 returns empty array', () => {
      expect(render({ totalPageCount: 0, currentPage: 1 })).toEqual([])
    })

    it('totalPageCount=1 returns [1]', () => {
      expect(render({ totalPageCount: 1, currentPage: 1 })).toEqual([1])
    })

    it('totalPageCount=6 returns [1,2,3,4,5,6] (siblingCount+5=6, show all)', () => {
      expect(render({ totalPageCount: 6, currentPage: 1 })).toEqual([
        1, 2, 3, 4, 5, 6,
      ])
    })
  })

  describe('right DOTS only (currentPage in first half)', () => {
    it('totalPageCount=10, currentPage=1', () => {
      const result = render({ totalPageCount: 10, currentPage: 1 })
      expect(result).toEqual([1, 2, 3, 4, 5, DOTS, 10])
    })

    it('totalPageCount=10, currentPage=3', () => {
      const result = render({ totalPageCount: 10, currentPage: 3 })
      expect(result).toEqual([1, 2, 3, 4, 5, DOTS, 10])
    })
  })

  describe('left DOTS only (currentPage in second half)', () => {
    it('totalPageCount=10, currentPage=10', () => {
      const result = render({ totalPageCount: 10, currentPage: 10 })
      expect(result).toEqual([1, DOTS, 6, 7, 8, 9, 10])
    })

    it('totalPageCount=10, currentPage=8', () => {
      const result = render({ totalPageCount: 10, currentPage: 8 })
      expect(result).toEqual([1, DOTS, 6, 7, 8, 9, 10])
    })
  })

  describe('both DOTS (currentPage in middle)', () => {
    it('totalPageCount=10, currentPage=5', () => {
      const result = render({ totalPageCount: 10, currentPage: 5 })
      expect(result).toEqual([1, DOTS, 4, 5, 6, DOTS, 10])
    })

    it('totalPageCount=20, currentPage=10', () => {
      const result = render({ totalPageCount: 20, currentPage: 10 })
      expect(result).toEqual([1, DOTS, 9, 10, 11, DOTS, 20])
    })
  })

  describe('custom siblingCount', () => {
    it('siblingCount=2, totalPageCount=20, currentPage=10', () => {
      const result = render({
        totalPageCount: 20,
        currentPage: 10,
        siblingCount: 2,
      })
      expect(result).toEqual([1, DOTS, 8, 9, 10, 11, 12, DOTS, 20])
    })

    it('siblingCount=2 shows all when totalPageCount is small', () => {
      const result = render({
        totalPageCount: 7,
        currentPage: 4,
        siblingCount: 2,
      })
      // siblingCount+5 = 7 >= totalPageCount なので全表示
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7])
    })

    it('siblingCount=0 shows DOTS without adjacent pages', () => {
      const result = render({
        totalPageCount: 10,
        currentPage: 5,
        siblingCount: 0,
      })
      expect(result).toEqual([1, DOTS, 5, DOTS, 10])
    })

    it('siblingCount=0, currentPage=1', () => {
      const result = render({
        totalPageCount: 10,
        currentPage: 1,
        siblingCount: 0,
      })
      expect(result).toEqual([1, 2, 3, DOTS, 10])
    })
  })

  describe('boundary value tests', () => {
    it('when currentPage exceeds totalPageCount', () => {
      const result = render({ totalPageCount: 5, currentPage: 10 })
      // 関数は例外を投げずに結果を返すこと
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })

    it('when currentPage=0', () => {
      const result = render({ totalPageCount: 10, currentPage: 0 })
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })
  })
})
