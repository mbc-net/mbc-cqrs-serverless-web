import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Badge } from '../../components/ui/badge'
import { fireEvent, render, screen } from '../utils'

describe('Badge', () => {
	it('renders with default props', () => {
		render(<Badge>Default Badge</Badge>)
		const badge = screen.getByText('Default Badge')
		expect(badge).toBeInTheDocument()
		expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full')
	})

	it('renders with different variants', () => {
		const { rerender } = render(<Badge variant="secondary">Secondary</Badge>)
		expect(screen.getByText('Secondary')).toHaveClass(
			'bg-[var(--mbc-color-secondary)]',
		)

		rerender(<Badge variant="destructive">Destructive</Badge>)
		expect(screen.getByText('Destructive')).toHaveClass(
			'bg-[var(--mbc-color-destructive)]',
		)

		rerender(<Badge variant="outline">Outline</Badge>)
		expect(screen.getByText('Outline')).toHaveClass(
			'border',
			'border-[var(--mbc-color-border)]',
		)
	})

	it('renders with left and right icons', () => {
		const LeftIcon = () => <span data-testid="left-icon">★</span>
		const RightIcon = () => <span data-testid="right-icon">→</span>

		render(
			<Badge leftIcon={<LeftIcon />} rightIcon={<RightIcon />}>
				With Icons
			</Badge>,
		)

		expect(screen.getByTestId('left-icon')).toBeInTheDocument()
		expect(screen.getByTestId('right-icon')).toBeInTheDocument()
	})

	it('renders as removable when removable prop is true', () => {
		const onRemove = vi.fn()
		render(
			<Badge removable onRemove={onRemove}>
				Removable Badge
			</Badge>,
		)

		const removeButton = screen.getByRole('button')
		expect(removeButton).toBeInTheDocument()
		expect(removeButton).toHaveClass('ml-1', 'h-auto', 'p-0.5')
	})

	it('calls onRemove when remove button is clicked', () => {
		const onRemove = vi.fn()
		render(
			<Badge removable onRemove={onRemove}>
				Removable Badge
			</Badge>,
		)

		const removeButton = screen.getByRole('button')
		fireEvent.click(removeButton)
		expect(onRemove).toHaveBeenCalledTimes(1)
	})

	it('renders with custom className', () => {
		render(<Badge className="custom-class">Custom Badge</Badge>)
		expect(screen.getByText('Custom Badge')).toHaveClass('custom-class')
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(<Badge ref={ref}>With Ref</Badge>)
		expect(ref).toHaveBeenCalled()
	})

	it('renders as child component when asChild is true', () => {
		render(
			<Badge asChild>
				<a href="/test">Link Badge</a>
			</Badge>,
		)

		const link = screen.getByRole('link')
		expect(link).toBeInTheDocument()
		expect(link).toHaveTextContent('Link Badge')
	})
})
