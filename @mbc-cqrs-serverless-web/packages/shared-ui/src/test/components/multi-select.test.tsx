import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { MultiSelect } from '../../components/ui/multi-select'
import { fireEvent, render, screen, waitFor } from '../utils'

const mockOptions = [
	{ label: 'React', value: 'react' },
	{ label: 'Vue', value: 'vue' },
	{ label: 'Angular', value: 'angular' },
	{ label: 'Svelte', value: 'svelte' },
]

describe('MultiSelect', () => {
	it('renders with default props', () => {
		render(
			<MultiSelect
				options={mockOptions}
				value={[]}
				onValueChange={vi.fn()}
				placeholder="Select frameworks"
			/>,
		)

		expect(screen.getByText('Select frameworks')).toBeInTheDocument()
	})

	it('renders with selected values', () => {
		render(
			<MultiSelect
				options={mockOptions}
				value={['react', 'vue']}
				onValueChange={vi.fn()}
				placeholder="Select frameworks"
			/>,
		)

		expect(screen.getByText('React')).toBeInTheDocument()
		expect(screen.getByText('Vue')).toBeInTheDocument()
	})

	it('opens dropdown when clicked', async () => {
		render(
			<MultiSelect
				options={mockOptions}
				value={[]}
				onValueChange={vi.fn()}
				placeholder="Select frameworks"
			/>,
		)

		const trigger = screen.getByRole('combobox')
		fireEvent.click(trigger)

		await waitFor(() => {
			expect(screen.getByText('React')).toBeInTheDocument()
			expect(screen.getByText('Vue')).toBeInTheDocument()
			expect(screen.getByText('Angular')).toBeInTheDocument()
			expect(screen.getByText('Svelte')).toBeInTheDocument()
		})
	})

	it('selects and deselects options', async () => {
		const onValueChange = vi.fn()
		render(
			<MultiSelect
				options={mockOptions}
				value={[]}
				onValueChange={onValueChange}
				placeholder="Select frameworks"
			/>,
		)

		const trigger = screen.getByRole('combobox')
		fireEvent.click(trigger)

		await waitFor(() => {
			const reactOption = screen.getByText('React')
			fireEvent.click(reactOption)
		})

		expect(onValueChange).toHaveBeenCalledWith(['react'])

		// Select another option
		await waitFor(() => {
			const vueOption = screen.getByText('Vue')
			fireEvent.click(vueOption)
		})

		expect(onValueChange).toHaveBeenCalledWith(['react', 'vue'])
	})

	it('can be disabled', () => {
		render(
			<MultiSelect
				options={mockOptions}
				value={[]}
				onValueChange={vi.fn()}
				placeholder="Disabled select"
				disabled
			/>,
		)

		const trigger = screen.getByRole('combobox')
		expect(trigger).toHaveAttribute('aria-disabled', 'true')
	})

	it('shows error state', () => {
		render(
			<MultiSelect
				options={mockOptions}
				value={[]}
				onValueChange={vi.fn()}
				placeholder="Error select"
				error
			/>,
		)

		const trigger = screen.getByRole('combobox')
		expect(trigger).toHaveClass('border-[var(--mbc-color-destructive)]')
	})

	it('shows success state', () => {
		render(
			<MultiSelect
				options={mockOptions}
				value={[]}
				onValueChange={vi.fn()}
				placeholder="Success select"
				success
			/>,
		)

		const trigger = screen.getByRole('combobox')
		expect(trigger).toHaveClass('border-[var(--mbc-color-success)]')
	})

	it('renders with different sizes', () => {
		const { rerender } = render(
			<MultiSelect
				options={mockOptions}
				value={[]}
				onValueChange={vi.fn()}
				placeholder="Small select"
				size="sm"
			/>,
		)
		expect(screen.getByRole('combobox')).toHaveClass('h-8')

		rerender(
			<MultiSelect
				options={mockOptions}
				value={[]}
				onValueChange={vi.fn()}
				placeholder="Large select"
				size="lg"
			/>,
		)
		expect(screen.getByRole('combobox')).toHaveClass('h-10')
	})

	it('renders with label and helper text', () => {
		render(
			<MultiSelect
				options={mockOptions}
				value={[]}
				onValueChange={vi.fn()}
				placeholder="Select frameworks"
				label="Choose frameworks"
				helperText="Select one or more frameworks"
			/>,
		)

		expect(screen.getByText('Choose frameworks')).toBeInTheDocument()
		expect(
			screen.getByText('Select one or more frameworks'),
		).toBeInTheDocument()
	})

	it('handles search functionality', async () => {
		const onSearch = vi.fn()
		render(
			<MultiSelect
				options={mockOptions}
				value={[]}
				onValueChange={vi.fn()}
				placeholder="Search frameworks"
				searchable
				onSearch={onSearch}
			/>,
		)

		const trigger = screen.getByRole('combobox')
		fireEvent.click(trigger)

		await waitFor(() => {
			const searchInput = screen.getByPlaceholderText('Search...')
			fireEvent.change(searchInput, { target: { value: 'react' } })
		})

		expect(onSearch).toHaveBeenCalledWith('react')
	})

	it('respects maxSelections limit', async () => {
		const onValueChange = vi.fn()
		render(
			<MultiSelect
				options={mockOptions}
				value={['react']}
				onValueChange={onValueChange}
				placeholder="Select frameworks"
				maxSelections={2}
			/>,
		)

		const trigger = screen.getByRole('combobox')
		fireEvent.click(trigger)

		await waitFor(() => {
			const vueOption = screen.getByText('Vue')
			fireEvent.click(vueOption)
		})

		expect(onValueChange).toHaveBeenCalledWith(['react', 'vue'])

		// Try to select another option (should be disabled)
		await waitFor(() => {
			const angularOption = screen.getByText('Angular')
			expect(angularOption).toHaveAttribute('aria-disabled', 'true')
		})
	})

	it('clears all selections when clearable', async () => {
		const onValueChange = vi.fn()
		render(
			<MultiSelect
				options={mockOptions}
				value={['react', 'vue']}
				onValueChange={onValueChange}
				placeholder="Select frameworks"
				clearable
			/>,
		)

		const clearButton = screen.getByRole('button', { name: /clear/i })
		fireEvent.click(clearButton)

		expect(onValueChange).toHaveBeenCalledWith([])
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(
			<MultiSelect
				ref={ref}
				options={mockOptions}
				value={[]}
				onValueChange={vi.fn()}
				placeholder="With ref"
			/>,
		)
		expect(ref).toHaveBeenCalled()
	})
})
