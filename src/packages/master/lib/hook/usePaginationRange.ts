import { useMemo } from 'react'

const range = (start: number, end: number) => {
  const length = end - start + 1
  return Array.from({ length }, (_, idx) => idx + start)
}

export const DOTS = '...'

interface PaginationRangeProps {
  totalPageCount: number
  currentPage: number
  siblingCount?: number
}

export const usePaginationRange = ({
  totalPageCount,
  currentPage,
  siblingCount = 1,
}: PaginationRangeProps): (number | string)[] => {
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 5

    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPageCount

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = range(1, leftItemCount)
      return [...leftRange, DOTS, totalPageCount]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount)
      return [firstPageIndex, DOTS, ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex)
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]
    }

    return range(1, totalPageCount)
  }, [totalPageCount, siblingCount, currentPage])

  return paginationRange
}
