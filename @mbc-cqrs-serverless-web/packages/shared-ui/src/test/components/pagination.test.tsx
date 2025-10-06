import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Pagination } from '../../components/ui/pagination'
import { fireEvent, render, screen } from '../utils'

describe('Pagination', () => {
	it('renders with default props', () => {
		render(
			<Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />,
		)

		expect(screen.getByText('1')).toBeInTheDocument()
		expect(screen.getByText('10')).toBeInTheDocument()
	})

	it('handles page changes', () => {
		const onPageChange = vi.fn()
		render(
			<Pagination
				currentPage={1}
				totalPages={10}
				onPageChange={onPageChange}
			/>,
		)

		const page2 = screen.getByText('2')
		fireEvent.click(page2)

		expect(onPageChange).toHaveBeenCalledWith(2)
	})

	it('renders with different current pages', () => {
		const { rerender } = render(
			<Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />,
		)

		expect(screen.getByText('1')).toHaveClass('bg-[var(--mbc-color-primary)]')

		rerender(
			<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />,
		)

		expect(screen.getByText('5')).toHaveClass('bg-[var(--mbc-color-primary)]')
	})

	it('renders with different total pages', () => {
		const { rerender } = render(
			<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />,
		)

		expect(screen.getByText('5')).toBeInTheDocument()
		expect(screen.queryByText('6')).not.toBeInTheDocument()

		rerender(
			<Pagination currentPage={1} totalPages={20} onPageChange={vi.fn()} />,
		)

		expect(screen.getByText('20')).toBeInTheDocument()
	})

	it('renders with custom className', () => {
		render(
			<Pagination
				currentPage={1}
				totalPages={10}
				onPageChange={vi.fn()}
				className="custom-pagination"
			/>,
		)

		const pagination = screen.getByRole('navigation')
		expect(pagination).toHaveClass('custom-pagination')
	})

	it('renders with custom page size', () => {
		render(
			<Pagination
				currentPage={1}
				totalPages={10}
				onPageChange={vi.fn()}
				pageSize={5}
			/>,
		)

		// With pageSize=5, only 5 pages should be visible
		expect(screen.getByText('1')).toBeInTheDocument()
		expect(screen.getByText('5')).toBeInTheDocument()
		expect(screen.queryByText('6')).not.toBeInTheDocument()
	})

	it('renders with showFirstLast', () => {
		render(
			<Pagination
				currentPage={5}
				totalPages={10}
				onPageChange={vi.fn()}
				showFirstLast
			/>,
		)

		expect(screen.getByText('First')).toBeInTheDocument()
		expect(screen.getByText('Last')).toBeInTheDocument()
	})

	it('renders with showPrevNext', () => {
		render(
			<Pagination
				currentPage={5}
				totalPages={10}
				onPageChange={vi.fn()}
				showPrevNext
			/>,
		)

		expect(screen.getByText('Previous')).toBeInTheDocument()
		expect(screen.getByText('Next')).toBeInTheDocument()
	})

	it('renders with showEllipsis', () => {
		render(
			<Pagination
				currentPage={5}
				totalPages={20}
				onPageChange={vi.fn()}
				showEllipsis
			/>,
		)

		expect(screen.getByText('...')).toBeInTheDocument()
	})

	it('renders with custom ellipsis text', () => {
		render(
			<Pagination
				currentPage={5}
				totalPages={20}
				onPageChange={vi.fn()}
				showEllipsis
				ellipsisText="---"
			/>,
		)

		expect(screen.getByText('---')).toBeInTheDocument()
	})

	it('renders with custom first text', () => {
		render(
			<Pagination
				currentPage={5}
				totalPages={10}
				onPageChange={vi.fn()}
				showFirstLast
				firstText="<<"
			/>,
		)

		expect(screen.getByText('<<')).toBeInTheDocument()
	})

	it('renders with custom last text', () => {
		render(
			<Pagination
				currentPage={5}
				totalPages={10}
				onPageChange={vi.fn()}
				showFirstLast
				lastText=">>"
			/>,
		)

		expect(screen.getByText('>>')).toBeInTheDocument()
	})

	it('renders with custom previous text', () => {
		render(
			<Pagination
				currentPage={5}
				totalPages={10}
				onPageChange={vi.fn()}
				showPrevNext
				prevText="<"
			/>,
		)

		expect(screen.getByText('<')).toBeInTheDocument()
	})

	it('renders with custom next text', () => {
		render(
			<Pagination
				currentPage={5}
				totalPages={10}
				onPageChange={vi.fn()}
				showPrevNext
				nextText=">"
			/>,
		)

		expect(screen.getByText('>')).toBeInTheDocument()
	})

	it('handles first page click', () => {
		const onPageChange = vi.fn()
		render(
			<Pagination
				currentPage={5}
				totalPages={10}
				onPageChange={onPageChange}
				showFirstLast
			/>,
		)

		const firstButton = screen.getByText('First')
		fireEvent.click(firstButton)

		expect(onPageChange).toHaveBeenCalledWith(1)
	})

	it('handles last page click', () => {
		const onPageChange = vi.fn()
		render(
			<Pagination
				currentPage={5}
				totalPages={10}
				onPageChange={onPageChange}
				showFirstLast
			/>,
		)

		const lastButton = screen.getByText('Last')
		fireEvent.click(lastButton)

		expect(onPageChange).toHaveBeenCalledWith(10)
	})

	it('handles previous page click', () => {
		const onPageChange = vi.fn()
		render(
			<Pagination
				currentPage={5}
				totalPages={10}
				onPageChange={onPageChange}
				showPrevNext
			/>,
		)

		const prevButton = screen.getByText('Previous')
		fireEvent.click(prevButton)

		expect(onPageChange).toHaveBeenCalledWith(4)
	})

	it('handles next page click', () => {
		const onPageChange = vi.fn()
		render(
			<Pagination
				currentPage={5}
				totalPages={10}
				onPageChange={onPageChange}
				showPrevNext
			/>,
		)

		const nextButton = screen.getByText('Next')
		fireEvent.click(nextButton)

		expect(onPageChange).toHaveBeenCalledWith(6)
	})

	it('disables previous button on first page', () => {
		render(
			<Pagination
				currentPage={1}
				totalPages={10}
				onPageChange={vi.fn()}
				showPrevNext
			/>,
		)

		const prevButton = screen.getByText('Previous')
		expect(prevButton).toHaveAttribute('aria-disabled', 'true')
	})

	it('disables next button on last page', () => {
		render(
			<Pagination
				currentPage={10}
				totalPages={10}
				onPageChange={vi.fn()}
				showPrevNext
			/>,
		)

		const nextButton = screen.getByText('Next')
		expect(nextButton).toHaveAttribute('aria-disabled', 'true')
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(
			<Pagination
				ref={ref}
				currentPage={1}
				totalPages={10}
				onPageChange={vi.fn()}
			/>,
		)
		expect(ref).toHaveBeenCalled()
	})

	it('renders with all props combined', () => {
		render(
			<Pagination
				currentPage={5}
				totalPages={20}
				onPageChange={vi.fn()}
				pageSize={5}
				showFirstLast
				showPrevNext
				showEllipsis
				firstText="<<"
				lastText=">>"
				prevText="<"
				nextText=">"
				ellipsisText="---"
				className="custom-pagination"
			/>,
		)

		const pagination = screen.getByRole('navigation')
		expect(pagination).toHaveClass('custom-pagination')
		expect(screen.getByText('<<')).toBeInTheDocument()
		expect(screen.getByText('>>')).toBeInTheDocument()
		expect(screen.getByText('<')).toBeInTheDocument()
		expect(screen.getByText('>')).toBeInTheDocument()
		expect(screen.getByText('---')).toBeInTheDocument()
	})
})
