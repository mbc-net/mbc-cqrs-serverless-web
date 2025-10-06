import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from '../../components/ui/checkbox'
import { fireEvent, render, screen } from '../utils'

describe('Checkbox', () => {
	it('renders with default props', () => {
		render(<Checkbox />)
		const checkbox = screen.getByRole('checkbox')
		expect(checkbox).toBeInTheDocument()
		expect(checkbox).toHaveClass('h-4', 'w-4')
	})

	it('can be checked and unchecked', () => {
		const onCheckedChange = vi.fn()
		render(<Checkbox onCheckedChange={onCheckedChange} />)

		const checkbox = screen.getByRole('checkbox')
		expect(checkbox).not.toBeChecked()

		fireEvent.click(checkbox)
		expect(checkbox).toBeChecked()
		expect(onCheckedChange).toHaveBeenCalledWith(true)

		fireEvent.click(checkbox)
		expect(checkbox).not.toBeChecked()
		expect(onCheckedChange).toHaveBeenCalledWith(false)
	})

	it('can be disabled', () => {
		const onCheckedChange = vi.fn()
		render(<Checkbox disabled onCheckedChange={onCheckedChange} />)

		const checkbox = screen.getByRole('checkbox')
		expect(checkbox).toBeDisabled()

		fireEvent.click(checkbox)
		expect(onCheckedChange).not.toHaveBeenCalled()
	})

	it('can be required', () => {
		render(<Checkbox required />)
		const checkbox = screen.getByRole('checkbox')
		expect(checkbox).toBeRequired()
	})

	it('can be indeterminate', () => {
		render(<Checkbox indeterminate />)
		const checkbox = screen.getByRole('checkbox')
		expect(checkbox).toHaveAttribute('data-state', 'indeterminate')
	})

	it('shows error state', () => {
		render(<Checkbox error />)
		const checkbox = screen.getByRole('checkbox')
		expect(checkbox).toHaveClass('border-[var(--mbc-color-destructive)]')
	})

	it('shows success state', () => {
		render(<Checkbox success />)
		const checkbox = screen.getByRole('checkbox')
		expect(checkbox).toHaveClass('border-[var(--mbc-color-success)]')
	})

	it('renders with label', () => {
		render(<Checkbox label="Accept terms" />)
		expect(screen.getByText('Accept terms')).toBeInTheDocument()
	})

	it('renders with helper text', () => {
		render(<Checkbox helperText="Please check this box" />)
		expect(screen.getByText('Please check this box')).toBeInTheDocument()
	})

	it('renders with different sizes', () => {
		const { rerender } = render(<Checkbox size="sm" />)
		expect(screen.getByRole('checkbox')).toHaveClass('h-3', 'w-3')

		rerender(<Checkbox size="lg" />)
		expect(screen.getByRole('checkbox')).toHaveClass('h-5', 'w-5')

		rerender(<Checkbox size="xl" />)
		expect(screen.getByRole('checkbox')).toHaveClass('h-6', 'w-6')
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(<Checkbox ref={ref} />)
		expect(ref).toHaveBeenCalled()
	})

	it('handles controlled state', () => {
		const onCheckedChange = vi.fn()
		const { rerender } = render(
			<Checkbox checked={false} onCheckedChange={onCheckedChange} />,
		)

		const checkbox = screen.getByRole('checkbox')
		expect(checkbox).not.toBeChecked()

		rerender(<Checkbox checked={true} onCheckedChange={onCheckedChange} />)
		expect(checkbox).toBeChecked()
	})
})
