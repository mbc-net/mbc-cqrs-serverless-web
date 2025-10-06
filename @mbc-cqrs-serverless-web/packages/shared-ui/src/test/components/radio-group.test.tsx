import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group'
import { fireEvent, render, screen } from '../utils'

describe('RadioGroup', () => {
	it('renders with default props', () => {
		render(
			<RadioGroup>
				<RadioGroupItem value="option1" />
				<RadioGroupItem value="option2" />
			</RadioGroup>,
		)

		const radioGroup = screen.getByRole('radiogroup')
		expect(radioGroup).toBeInTheDocument()
	})

	it('handles value changes', () => {
		const onValueChange = vi.fn()
		render(
			<RadioGroup onValueChange={onValueChange}>
				<RadioGroupItem value="option1" />
				<RadioGroupItem value="option2" />
			</RadioGroup>,
		)

		const option1 = screen.getByRole('radio', { name: 'option1' })
		fireEvent.click(option1)

		expect(onValueChange).toHaveBeenCalledWith('option1')
	})

	it('can be disabled', () => {
		render(
			<RadioGroup disabled>
				<RadioGroupItem value="option1" />
				<RadioGroupItem value="option2" />
			</RadioGroup>,
		)

		const option1 = screen.getByRole('radio', { name: 'option1' })
		const option2 = screen.getByRole('radio', { name: 'option2' })

		expect(option1).toBeDisabled()
		expect(option2).toBeDisabled()
	})

	it('can be required', () => {
		render(
			<RadioGroup required>
				<RadioGroupItem value="option1" />
				<RadioGroupItem value="option2" />
			</RadioGroup>,
		)

		const radioGroup = screen.getByRole('radiogroup')
		expect(radioGroup).toHaveAttribute('aria-required', 'true')
	})

	it('shows error state', () => {
		render(
			<RadioGroup error>
				<RadioGroupItem value="option1" />
				<RadioGroupItem value="option2" />
			</RadioGroup>,
		)

		const radioGroup = screen.getByRole('radiogroup')
		expect(radioGroup).toHaveClass('text-[var(--mbc-color-destructive)]')
	})

	it('shows success state', () => {
		render(
			<RadioGroup success>
				<RadioGroupItem value="option1" />
				<RadioGroupItem value="option2" />
			</RadioGroup>,
		)

		const radioGroup = screen.getByRole('radiogroup')
		expect(radioGroup).toHaveClass('text-[var(--mbc-color-success)]')
	})

	it('renders with label', () => {
		render(
			<RadioGroup label="Choose option">
				<RadioGroupItem value="option1" />
				<RadioGroupItem value="option2" />
			</RadioGroup>,
		)

		expect(screen.getByText('Choose option')).toBeInTheDocument()
	})

	it('renders with helper text', () => {
		render(
			<RadioGroup helperText="Select one option">
				<RadioGroupItem value="option1" />
				<RadioGroupItem value="option2" />
			</RadioGroup>,
		)

		expect(screen.getByText('Select one option')).toBeInTheDocument()
	})

	it('renders with different orientations', () => {
		const { rerender } = render(
			<RadioGroup orientation="horizontal">
				<RadioGroupItem value="option1" />
				<RadioGroupItem value="option2" />
			</RadioGroup>,
		)

		const radioGroup = screen.getByRole('radiogroup')
		expect(radioGroup).toHaveClass('flex', 'flex-row', 'space-x-2')

		rerender(
			<RadioGroup orientation="vertical">
				<RadioGroupItem value="option1" />
				<RadioGroupItem value="option2" />
			</RadioGroup>,
		)

		expect(radioGroup).toHaveClass('flex', 'flex-col', 'space-y-2')
	})

	it('renders with different sizes', () => {
		const { rerender } = render(
			<RadioGroup size="sm">
				<RadioGroupItem value="option1" />
				<RadioGroupItem value="option2" />
			</RadioGroup>,
		)

		const option1 = screen.getByRole('radio', { name: 'option1' })
		expect(option1).toHaveClass('h-3', 'w-3')

		rerender(
			<RadioGroup size="lg">
				<RadioGroupItem value="option1" />
				<RadioGroupItem value="option2" />
			</RadioGroup>,
		)

		expect(option1).toHaveClass('h-5', 'w-5')

		rerender(
			<RadioGroup size="xl">
				<RadioGroupItem value="option1" />
				<RadioGroupItem value="option2" />
			</RadioGroup>,
		)

		expect(option1).toHaveClass('h-6', 'w-6')
	})

	it('renders RadioGroupItem with proper styling', () => {
		render(
			<RadioGroup>
				<RadioGroupItem value="option1" />
			</RadioGroup>,
		)

		const option = screen.getByRole('radio', { name: 'option1' })
		expect(option).toHaveClass('aspect-square', 'h-4', 'w-4')
	})

	it('renders RadioGroupItem as disabled', () => {
		render(
			<RadioGroup>
				<RadioGroupItem value="option1" disabled />
				<RadioGroupItem value="option2" />
			</RadioGroup>,
		)

		const option1 = screen.getByRole('radio', { name: 'option1' })
		const option2 = screen.getByRole('radio', { name: 'option2' })

		expect(option1).toBeDisabled()
		expect(option2).not.toBeDisabled()
	})

	it('renders RadioGroupItem as required', () => {
		render(
			<RadioGroup>
				<RadioGroupItem value="option1" required />
				<RadioGroupItem value="option2" />
			</RadioGroup>,
		)

		const option1 = screen.getByRole('radio', { name: 'option1' })
		const option2 = screen.getByRole('radio', { name: 'option2' })

		expect(option1).toBeRequired()
		expect(option2).not.toBeRequired()
	})

	it('handles controlled value', () => {
		const onValueChange = vi.fn()
		const { rerender } = render(
			<RadioGroup value="option1" onValueChange={onValueChange}>
				<RadioGroupItem value="option1" />
				<RadioGroupItem value="option2" />
			</RadioGroup>,
		)

		const option1 = screen.getByRole('radio', { name: 'option1' })
		const option2 = screen.getByRole('radio', { name: 'option2' })

		expect(option1).toBeChecked()
		expect(option2).not.toBeChecked()

		// Change to option2
		rerender(
			<RadioGroup value="option2" onValueChange={onValueChange}>
				<RadioGroupItem value="option1" />
				<RadioGroupItem value="option2" />
			</RadioGroup>,
		)

		expect(option1).not.toBeChecked()
		expect(option2).toBeChecked()
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(
			<RadioGroup ref={ref}>
				<RadioGroupItem value="option1" />
				<RadioGroupItem value="option2" />
			</RadioGroup>,
		)
		expect(ref).toHaveBeenCalled()
	})

	it('renders with all props combined', () => {
		render(
			<RadioGroup
				label="Complete radio group"
				helperText="Select one option"
				required
				error
				orientation="vertical"
				size="lg"
				className="custom-radio-group"
			>
				<RadioGroupItem value="option1" />
				<RadioGroupItem value="option2" />
			</RadioGroup>,
		)

		const radioGroup = screen.getByRole('radiogroup')
		expect(radioGroup).toHaveClass(
			'custom-radio-group',
			'flex',
			'flex-col',
			'space-y-2',
			'text-[var(--mbc-color-destructive)]',
		)
		expect(radioGroup).toHaveAttribute('aria-required', 'true')
		expect(screen.getByText('Complete radio group')).toBeInTheDocument()
		expect(screen.getByText('Select one option')).toBeInTheDocument()
	})
})
