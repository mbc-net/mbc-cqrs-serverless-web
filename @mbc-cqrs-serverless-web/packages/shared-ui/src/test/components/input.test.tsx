import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Input } from '../../components/ui/input'
import { fireEvent, render, screen } from '../utils'

describe('Input', () => {
	it('renders with default props', () => {
		render(<Input placeholder="Enter text" />)
		const input = screen.getByPlaceholderText('Enter text')
		expect(input).toBeInTheDocument()
		expect(input).toHaveClass('flex', 'h-9', 'w-full')
	})

	it('renders with different sizes', () => {
		const { rerender } = render(<Input size="sm" placeholder="Small" />)
		expect(screen.getByPlaceholderText('Small')).toHaveClass('h-8')

		rerender(<Input size="lg" placeholder="Large" />)
		expect(screen.getByPlaceholderText('Large')).toHaveClass('h-10')

		rerender(<Input size="xl" placeholder="Extra Large" />)
		expect(screen.getByPlaceholderText('Extra Large')).toHaveClass('h-12')
	})

	it('handles value changes', () => {
		const handleChange = vi.fn()
		render(<Input onChange={handleChange} placeholder="Type here" />)

		const input = screen.getByPlaceholderText('Type here')
		fireEvent.change(input, { target: { value: 'test input' } })

		expect(handleChange).toHaveBeenCalled()
		expect(input).toHaveValue('test input')
	})

	it('can be disabled', () => {
		render(<Input disabled placeholder="Disabled" />)
		const input = screen.getByPlaceholderText('Disabled')
		expect(input).toBeDisabled()
	})

	it('shows error state', () => {
		render(<Input error placeholder="Error input" />)
		const input = screen.getByPlaceholderText('Error input')
		expect(input).toHaveClass('border-[var(--mbc-color-destructive)]')
	})

	it('shows success state', () => {
		render(<Input success placeholder="Success input" />)
		const input = screen.getByPlaceholderText('Success input')
		expect(input).toHaveClass('border-[var(--mbc-color-success)]')
	})

	it('renders with label', () => {
		render(<Input label="Email" placeholder="Enter email" />)
		expect(screen.getByText('Email')).toBeInTheDocument()
	})

	it('renders with helper text', () => {
		render(<Input helperText="This is helper text" placeholder="Input" />)
		expect(screen.getByText('This is helper text')).toBeInTheDocument()
	})

	it('renders with left and right icons', () => {
		const LeftIcon = () => <span data-testid="left-icon">🔍</span>
		const RightIcon = () => <span data-testid="right-icon">✓</span>

		render(
			<Input
				leftIcon={<LeftIcon />}
				rightIcon={<RightIcon />}
				placeholder="With icons"
			/>,
		)

		expect(screen.getByTestId('left-icon')).toBeInTheDocument()
		expect(screen.getByTestId('right-icon')).toBeInTheDocument()
	})

	it('shows search icon when showSearchIcon is true', () => {
		render(<Input showSearchIcon placeholder="Search" />)
		// The search icon should be present
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(<Input ref={ref} placeholder="With ref" />)
		expect(ref).toHaveBeenCalled()
	})
})
