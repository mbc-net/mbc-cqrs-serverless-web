import React from 'react'
import { describe, expect, it } from 'vitest'
import { Skeleton } from '../../components/ui/skeleton'
import { render, screen } from '../utils'

describe('Skeleton', () => {
	it('renders with default props', () => {
		render(<Skeleton />)
		const skeleton = screen.getByTestId('skeleton')
		expect(skeleton).toBeInTheDocument()
		expect(skeleton).toHaveClass(
			'animate-pulse',
			'rounded-md',
			'bg-[var(--mbc-color-muted)]',
		)
	})

	it('renders with custom className', () => {
		render(<Skeleton className="custom-skeleton" />)
		const skeleton = screen.getByTestId('skeleton')
		expect(skeleton).toHaveClass('custom-skeleton')
	})

	it('renders with different sizes', () => {
		const { rerender } = render(<Skeleton size="sm" />)
		let skeleton = screen.getByTestId('skeleton')
		expect(skeleton).toHaveClass('h-4', 'w-4')

		rerender(<Skeleton size="default" />)
		skeleton = screen.getByTestId('skeleton')
		expect(skeleton).toHaveClass('h-4', 'w-full')

		rerender(<Skeleton size="lg" />)
		skeleton = screen.getByTestId('skeleton')
		expect(skeleton).toHaveClass('h-8', 'w-full')

		rerender(<Skeleton size="xl" />)
		skeleton = screen.getByTestId('skeleton')
		expect(skeleton).toHaveClass('h-12', 'w-full')
	})

	it('renders with custom dimensions', () => {
		render(<Skeleton className="h-20 w-32" />)
		const skeleton = screen.getByTestId('skeleton')
		expect(skeleton).toHaveClass('h-20', 'w-32')
	})

	it('renders with rounded corners', () => {
		const { rerender } = render(<Skeleton className="rounded-full" />)
		let skeleton = screen.getByTestId('skeleton')
		expect(skeleton).toHaveClass('rounded-full')

		rerender(<Skeleton className="rounded-lg" />)
		skeleton = screen.getByTestId('skeleton')
		expect(skeleton).toHaveClass('rounded-lg')
	})

	it('renders with different shapes', () => {
		const { rerender } = render(<Skeleton shape="circle" />)
		let skeleton = screen.getByTestId('skeleton')
		expect(skeleton).toHaveClass('rounded-full', 'h-4', 'w-4')

		rerender(<Skeleton shape="square" />)
		skeleton = screen.getByTestId('skeleton')
		expect(skeleton).toHaveClass('rounded-md', 'h-4', 'w-4')

		rerender(<Skeleton shape="rectangle" />)
		skeleton = screen.getByTestId('skeleton')
		expect(skeleton).toHaveClass('rounded-md', 'h-4', 'w-full')
	})

	it('renders with custom animation', () => {
		render(<Skeleton className="animate-bounce" />)
		const skeleton = screen.getByTestId('skeleton')
		expect(skeleton).toHaveClass('animate-bounce')
	})

	it('renders with custom background color', () => {
		render(<Skeleton className="bg-gray-200" />)
		const skeleton = screen.getByTestId('skeleton')
		expect(skeleton).toHaveClass('bg-gray-200')
	})

	it('renders with all props combined', () => {
		render(
			<Skeleton
				size="lg"
				shape="circle"
				className="custom-skeleton animate-pulse bg-blue-200"
			/>,
		)

		const skeleton = screen.getByTestId('skeleton')
		expect(skeleton).toHaveClass(
			'custom-skeleton',
			'bg-blue-200',
			'animate-pulse',
			'rounded-full',
			'h-8',
			'w-8',
		)
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(<Skeleton ref={ref} />)
		expect(ref).toHaveBeenCalled()
	})

	it('renders with children', () => {
		render(
			<Skeleton>
				<div>Loading content</div>
			</Skeleton>,
		)

		const skeleton = screen.getByTestId('skeleton')
		expect(skeleton).toHaveTextContent('Loading content')
	})

	it('renders with multiple skeletons', () => {
		render(
			<div>
				<Skeleton className="h-4 w-32" />
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-4 w-40" />
			</div>,
		)

		const skeletons = screen.getAllByTestId('skeleton')
		expect(skeletons).toHaveLength(3)
		expect(skeletons[0]).toHaveClass('h-4', 'w-32')
		expect(skeletons[1]).toHaveClass('h-4', 'w-24')
		expect(skeletons[2]).toHaveClass('h-4', 'w-40')
	})
})
