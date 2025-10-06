import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../../components/ui/button'
import { fireEvent, render, screen } from '../utils'

describe('Button', () => {
	it('renders with default props', () => {
		render(<Button>Click me</Button>)
		const button = screen.getByRole('button', { name: /click me/i })
		expect(button).toBeInTheDocument()
		expect(button).toHaveClass('bg-[var(--mbc-color-primary)]')
	})

	it('renders with different variants', () => {
		const { rerender } = render(<Button variant="secondary">Secondary</Button>)
		expect(screen.getByRole('button')).toHaveClass(
			'bg-[var(--mbc-color-secondary)]',
		)

		rerender(<Button variant="destructive">Destructive</Button>)
		expect(screen.getByRole('button')).toHaveClass(
			'bg-[var(--mbc-color-destructive)]',
		)

		rerender(<Button variant="outline">Outline</Button>)
		expect(screen.getByRole('button')).toHaveClass(
			'border-[var(--mbc-color-border)]',
		)
	})

	it('renders with different sizes', () => {
		const { rerender } = render(<Button size="sm">Small</Button>)
		expect(screen.getByRole('button')).toHaveClass('h-8')

		rerender(<Button size="lg">Large</Button>)
		expect(screen.getByRole('button')).toHaveClass('h-10')

		rerender(<Button size="xl">Extra Large</Button>)
		expect(screen.getByRole('button')).toHaveClass('h-12')
	})

	it('handles click events', () => {
		const handleClick = vi.fn()
		render(<Button onClick={handleClick}>Click me</Button>)

		fireEvent.click(screen.getByRole('button'))
		expect(handleClick).toHaveBeenCalledTimes(1)
	})

	it('can be disabled', () => {
		const handleClick = vi.fn()
		render(
			<Button disabled onClick={handleClick}>
				Disabled
			</Button>,
		)

		const button = screen.getByRole('button')
		expect(button).toBeDisabled()

		fireEvent.click(button)
		expect(handleClick).not.toHaveBeenCalled()
	})

	it('shows loading state', () => {
		render(<Button loading>Loading</Button>)
		const button = screen.getByRole('button')
		expect(button).toBeDisabled()
		expect(button).toHaveClass('opacity-50')
	})

	it('renders with left and right icons', () => {
		const LeftIcon = () => <span data-testid="left-icon">←</span>
		const RightIcon = () => <span data-testid="right-icon">→</span>

		render(
			<Button leftIcon={<LeftIcon />} rightIcon={<RightIcon />}>
				With Icons
			</Button>,
		)

		expect(screen.getByTestId('left-icon')).toBeInTheDocument()
		expect(screen.getByTestId('right-icon')).toBeInTheDocument()
	})

	it('supports full width', () => {
		render(<Button fullWidth>Full Width</Button>)
		expect(screen.getByRole('button')).toHaveClass('w-full')
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(<Button ref={ref}>With Ref</Button>)
		expect(ref).toHaveBeenCalled()
	})
})
