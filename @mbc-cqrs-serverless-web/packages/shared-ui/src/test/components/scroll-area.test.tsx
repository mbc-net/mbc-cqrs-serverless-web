import React from 'react'
import { describe, expect, it } from 'vitest'
import { ScrollArea, ScrollBar } from '../../components/ui/scroll-area'
import { render, screen } from '../utils'

describe('ScrollArea', () => {
	it('renders with default props', () => {
		render(
			<ScrollArea>
				<div>Content</div>
			</ScrollArea>,
		)

		expect(screen.getByText('Content')).toBeInTheDocument()
	})

	it('renders with custom className', () => {
		render(
			<ScrollArea className="custom-class">
				<div>Content</div>
			</ScrollArea>,
		)

		const scrollArea = screen
			.getByText('Content')
			.closest('[data-radix-scroll-area-viewport]')
		expect(scrollArea).toHaveClass('custom-class')
	})

	it('renders with different types', () => {
		const { rerender } = render(
			<ScrollArea type="auto">
				<div>Content</div>
			</ScrollArea>,
		)

		const scrollArea = screen
			.getByText('Content')
			.closest('[data-radix-scroll-area-viewport]')
		expect(scrollArea).toHaveClass('overflow-auto')

		rerender(
			<ScrollArea type="always">
				<div>Content</div>
			</ScrollArea>,
		)

		expect(scrollArea).toHaveClass('overflow-scroll')

		rerender(
			<ScrollArea type="scroll">
				<div>Content</div>
			</ScrollArea>,
		)

		expect(scrollArea).toHaveClass('overflow-scroll')

		rerender(
			<ScrollArea type="hover">
				<div>Content</div>
			</ScrollArea>,
		)

		expect(scrollArea).toHaveClass('overflow-hidden', 'hover:overflow-auto')
	})

	it('renders with custom scrollHideDelay', () => {
		render(
			<ScrollArea scrollHideDelay={1000}>
				<div>Content</div>
			</ScrollArea>,
		)

		const scrollArea = screen
			.getByText('Content')
			.closest('[data-radix-scroll-area-viewport]')
		expect(scrollArea).toHaveClass('overflow-hidden', 'hover:overflow-auto')
	})

	it('renders with different directions', () => {
		const { rerender } = render(
			<ScrollArea dir="ltr">
				<div>Content</div>
			</ScrollArea>,
		)

		const scrollArea = screen
			.getByText('Content')
			.closest('[data-radix-scroll-area-viewport]')
		expect(scrollArea).toHaveAttribute('dir', 'ltr')

		rerender(
			<ScrollArea dir="rtl">
				<div>Content</div>
			</ScrollArea>,
		)

		expect(scrollArea).toHaveAttribute('dir', 'rtl')
	})

	it('renders ScrollBar with different orientations', () => {
		render(
			<ScrollArea>
				<div>Content</div>
				<ScrollBar orientation="horizontal" />
				<ScrollBar orientation="vertical" />
			</ScrollArea>,
		)

		const horizontalBar = screen.getByRole('scrollbar', { name: /horizontal/i })
		const verticalBar = screen.getByRole('scrollbar', { name: /vertical/i })

		expect(horizontalBar).toBeInTheDocument()
		expect(verticalBar).toBeInTheDocument()
	})

	it('renders ScrollBar with forceMount', () => {
		render(
			<ScrollArea>
				<div>Content</div>
				<ScrollBar orientation="vertical" forceMount />
			</ScrollArea>,
		)

		const verticalBar = screen.getByRole('scrollbar', { name: /vertical/i })
		expect(verticalBar).toBeInTheDocument()
	})

	it('renders with long content to test scrolling', () => {
		const longContent = Array.from({ length: 100 }, (_, i) => (
			<div key={i}>Item {i + 1}</div>
		))

		render(<ScrollArea className="h-32">{longContent}</ScrollArea>)

		expect(screen.getByText('Item 1')).toBeInTheDocument()
		expect(screen.getByText('Item 100')).toBeInTheDocument()
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(
			<ScrollArea ref={ref}>
				<div>Content</div>
			</ScrollArea>,
		)
		expect(ref).toHaveBeenCalled()
	})

	it('renders with custom scrollbar styling', () => {
		render(
			<ScrollArea>
				<div>Content</div>
				<ScrollBar orientation="vertical" className="custom-scrollbar" />
			</ScrollArea>,
		)

		const verticalBar = screen.getByRole('scrollbar', { name: /vertical/i })
		expect(verticalBar).toHaveClass('custom-scrollbar')
	})
})
