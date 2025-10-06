import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../components/ui/select'
import { fireEvent, render, screen } from '../utils'

describe('Select', () => {
	it('renders with default props', () => {
		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select an option" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
					<SelectItem value="option2">Option 2</SelectItem>
				</SelectContent>
			</Select>,
		)

		expect(screen.getByRole('combobox')).toBeInTheDocument()
		expect(screen.getByText('Select an option')).toBeInTheDocument()
	})

	it('handles value changes', () => {
		const onValueChange = vi.fn()
		render(
			<Select onValueChange={onValueChange}>
				<SelectTrigger>
					<SelectValue placeholder="Select an option" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
					<SelectItem value="option2">Option 2</SelectItem>
				</SelectContent>
			</Select>,
		)

		const trigger = screen.getByRole('combobox')
		fireEvent.click(trigger)

		const option1 = screen.getByText('Option 1')
		fireEvent.click(option1)

		expect(onValueChange).toHaveBeenCalledWith('option1')
	})

	it('can be disabled', () => {
		render(
			<Select disabled>
				<SelectTrigger>
					<SelectValue placeholder="Disabled select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
				</SelectContent>
			</Select>,
		)

		const trigger = screen.getByRole('combobox')
		expect(trigger).toHaveAttribute('aria-disabled', 'true')
	})

	it('shows error state', () => {
		render(
			<Select error>
				<SelectTrigger>
					<SelectValue placeholder="Error select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
				</SelectContent>
			</Select>,
		)

		const trigger = screen.getByRole('combobox')
		expect(trigger).toHaveClass('border-[var(--mbc-color-destructive)]')
	})

	it('shows success state', () => {
		render(
			<Select success>
				<SelectTrigger>
					<SelectValue placeholder="Success select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
				</SelectContent>
			</Select>,
		)

		const trigger = screen.getByRole('combobox')
		expect(trigger).toHaveClass('border-[var(--mbc-color-success)]')
	})

	it('renders with different sizes', () => {
		const { rerender } = render(
			<Select>
				<SelectTrigger size="sm">
					<SelectValue placeholder="Small" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
				</SelectContent>
			</Select>,
		)
		expect(screen.getByRole('combobox')).toHaveClass('h-8')

		rerender(
			<Select>
				<SelectTrigger size="lg">
					<SelectValue placeholder="Large" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
				</SelectContent>
			</Select>,
		)
		expect(screen.getByRole('combobox')).toHaveClass('h-10')
	})

	it('renders with label and helper text', () => {
		render(
			<Select label="Choose option" helperText="Select one option">
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
				</SelectContent>
			</Select>,
		)

		expect(screen.getByText('Choose option')).toBeInTheDocument()
		expect(screen.getByText('Select one option')).toBeInTheDocument()
	})

	it('renders SelectItem with disabled state', () => {
		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
					<SelectItem value="option2" disabled>
						Disabled Option
					</SelectItem>
				</SelectContent>
			</Select>,
		)

		const trigger = screen.getByRole('combobox')
		fireEvent.click(trigger)

		const disabledOption = screen.getByText('Disabled Option')
		expect(disabledOption).toHaveAttribute('aria-disabled', 'true')
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(
			<Select>
				<SelectTrigger ref={ref}>
					<SelectValue placeholder="With ref" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
				</SelectContent>
			</Select>,
		)
		expect(ref).toHaveBeenCalled()
	})
})
