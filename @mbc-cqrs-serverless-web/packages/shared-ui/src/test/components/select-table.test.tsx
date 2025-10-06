import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
	SelectTable,
	SelectTableContent,
	SelectTableItem,
	SelectTableTrigger,
	SelectTableValue,
} from '../../components/ui/select-table'
import { fireEvent, render, screen, waitFor } from '../utils'

describe('SelectTable', () => {
	it('renders with default props', () => {
		render(
			<SelectTable>
				<SelectTableTrigger>
					<SelectTableValue placeholder="Select option" />
				</SelectTableTrigger>
				<SelectTableContent>
					<SelectTableItem value="option1">Option 1</SelectTableItem>
					<SelectTableItem value="option2">Option 2</SelectTableItem>
				</SelectTableContent>
			</SelectTable>,
		)

		expect(screen.getByText('Select option')).toBeInTheDocument()
	})

	it('handles value changes', () => {
		const onValueChange = vi.fn()
		render(
			<SelectTable onValueChange={onValueChange}>
				<SelectTableTrigger>
					<SelectTableValue placeholder="Select option" />
				</SelectTableTrigger>
				<SelectTableContent>
					<SelectTableItem value="option1">Option 1</SelectTableItem>
					<SelectTableItem value="option2">Option 2</SelectTableItem>
				</SelectTableContent>
			</SelectTable>,
		)

		const trigger = screen.getByRole('combobox')
		fireEvent.click(trigger)

		waitFor(() => {
			const option1 = screen.getByText('Option 1')
			fireEvent.click(option1)
		})

		expect(onValueChange).toHaveBeenCalledWith('option1')
	})

	it('can be disabled', () => {
		render(
			<SelectTable disabled>
				<SelectTableTrigger>
					<SelectTableValue placeholder="Disabled select" />
				</SelectTableTrigger>
				<SelectTableContent>
					<SelectTableItem value="option1">Option 1</SelectTableItem>
				</SelectTableContent>
			</SelectTable>,
		)

		const trigger = screen.getByRole('combobox')
		expect(trigger).toHaveAttribute('aria-disabled', 'true')
	})

	it('shows error state', () => {
		render(
			<SelectTable error>
				<SelectTableTrigger>
					<SelectTableValue placeholder="Error select" />
				</SelectTableTrigger>
				<SelectTableContent>
					<SelectTableItem value="option1">Option 1</SelectTableItem>
				</SelectTableContent>
			</SelectTable>,
		)

		const trigger = screen.getByRole('combobox')
		expect(trigger).toHaveClass('border-[var(--mbc-color-destructive)]')
	})

	it('shows success state', () => {
		render(
			<SelectTable success>
				<SelectTableTrigger>
					<SelectTableValue placeholder="Success select" />
				</SelectTableTrigger>
				<SelectTableContent>
					<SelectTableItem value="option1">Option 1</SelectTableItem>
				</SelectTableContent>
			</SelectTable>,
		)

		const trigger = screen.getByRole('combobox')
		expect(trigger).toHaveClass('border-[var(--mbc-color-success)]')
	})

	it('renders with different sizes', () => {
		const { rerender } = render(
			<SelectTable>
				<SelectTableTrigger size="sm">
					<SelectTableValue placeholder="Small select" />
				</SelectTableTrigger>
				<SelectTableContent>
					<SelectTableItem value="option1">Option 1</SelectTableItem>
				</SelectTableContent>
			</SelectTable>,
		)
		expect(screen.getByRole('combobox')).toHaveClass('h-8')

		rerender(
			<SelectTable>
				<SelectTableTrigger size="default">
					<SelectTableValue placeholder="Default select" />
				</SelectTableTrigger>
				<SelectTableContent>
					<SelectTableItem value="option1">Option 1</SelectTableItem>
				</SelectTableContent>
			</SelectTable>,
		)
		expect(screen.getByRole('combobox')).toHaveClass('h-9')
	})

	it('renders SelectTableItem with disabled state', () => {
		render(
			<SelectTable>
				<SelectTableTrigger>
					<SelectTableValue placeholder="Select option" />
				</SelectTableTrigger>
				<SelectTableContent>
					<SelectTableItem value="option1">Option 1</SelectTableItem>
					<SelectTableItem value="option2" disabled>
						Disabled Option
					</SelectTableItem>
				</SelectTableContent>
			</SelectTable>,
		)

		const trigger = screen.getByRole('combobox')
		fireEvent.click(trigger)

		waitFor(() => {
			const disabledOption = screen.getByText('Disabled Option')
			expect(disabledOption).toHaveAttribute('aria-disabled', 'true')
		})
	})

	it('renders SelectTableTrigger with proper styling', () => {
		render(
			<SelectTable>
				<SelectTableTrigger>
					<SelectTableValue placeholder="Select option" />
				</SelectTableTrigger>
				<SelectTableContent>
					<SelectTableItem value="option1">Option 1</SelectTableItem>
				</SelectTableContent>
			</SelectTable>,
		)

		const trigger = screen.getByRole('combobox')
		expect(trigger).toHaveClass(
			'flex',
			'h-9',
			'w-full',
			'items-center',
			'justify-between',
		)
	})

	it('renders SelectTableValue with proper styling', () => {
		render(
			<SelectTable>
				<SelectTableTrigger>
					<SelectTableValue placeholder="Select option" />
				</SelectTableTrigger>
				<SelectTableContent>
					<SelectTableItem value="option1">Option 1</SelectTableItem>
				</SelectTableContent>
			</SelectTable>,
		)

		const value = screen.getByText('Select option')
		expect(value).toHaveClass('text-left', 'font-normal')
	})

	it('renders SelectTableContent with proper styling', () => {
		render(
			<SelectTable>
				<SelectTableTrigger>
					<SelectTableValue placeholder="Select option" />
				</SelectTableTrigger>
				<SelectTableContent>
					<SelectTableItem value="option1">Option 1</SelectTableItem>
				</SelectTableContent>
			</SelectTable>,
		)

		const trigger = screen.getByRole('combobox')
		fireEvent.click(trigger)

		waitFor(() => {
			const content = screen.getByRole('listbox')
			expect(content).toHaveClass(
				'relative',
				'z-50',
				'max-h-96',
				'min-w-[8rem]',
			)
		})
	})

	it('renders SelectTableItem with proper styling', () => {
		render(
			<SelectTable>
				<SelectTableTrigger>
					<SelectTableValue placeholder="Select option" />
				</SelectTableTrigger>
				<SelectTableContent>
					<SelectTableItem value="option1">Option 1</SelectTableItem>
				</SelectTableContent>
			</SelectTable>,
		)

		const trigger = screen.getByRole('combobox')
		fireEvent.click(trigger)

		waitFor(() => {
			const item = screen.getByText('Option 1')
			expect(item).toHaveClass('relative', 'flex', 'w-full', 'cursor-default')
		})
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(
			<SelectTable ref={ref}>
				<SelectTableTrigger>
					<SelectTableValue placeholder="With ref" />
				</SelectTableTrigger>
				<SelectTableContent>
					<SelectTableItem value="option1">Option 1</SelectTableItem>
				</SelectTableContent>
			</SelectTable>,
		)
		expect(ref).toHaveBeenCalled()
	})
})
