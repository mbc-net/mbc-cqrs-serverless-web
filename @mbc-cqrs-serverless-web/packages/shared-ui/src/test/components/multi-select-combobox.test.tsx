import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { MultiSelectCombobox } from '../../components/ui/multi-select-combobox'
import { fireEvent, render, screen, waitFor } from '../utils'

const mockOptions = [
	{ label: 'TypeScript', value: 'typescript' },
	{ label: 'JavaScript', value: 'javascript' },
	{ label: 'Python', value: 'python' },
	{ label: 'Java', value: 'java' },
]

describe('MultiSelectCombobox', () => {
	it('renders with default props', () => {
		render(
			<MultiSelectCombobox
				options={mockOptions}
				selected={[]}
				onChange={vi.fn()}
				placeholder="Select languages"
			/>,
		)

		expect(screen.getByText('Select languages')).toBeInTheDocument()
	})

	it('renders with selected values', () => {
		render(
			<MultiSelectCombobox
				options={mockOptions}
				selected={['typescript', 'javascript']}
				onChange={vi.fn()}
				placeholder="Select languages"
			/>,
		)

		expect(screen.getByText('TypeScript')).toBeInTheDocument()
		expect(screen.getByText('JavaScript')).toBeInTheDocument()
	})

	it('opens dropdown when clicked', async () => {
		render(
			<MultiSelectCombobox
				options={mockOptions}
				selected={[]}
				onChange={vi.fn()}
				placeholder="Select languages"
			/>,
		)

		const trigger = screen.getByRole('combobox')
		fireEvent.click(trigger)

		await waitFor(() => {
			expect(screen.getByText('TypeScript')).toBeInTheDocument()
			expect(screen.getByText('JavaScript')).toBeInTheDocument()
			expect(screen.getByText('Python')).toBeInTheDocument()
			expect(screen.getByText('Java')).toBeInTheDocument()
		})
	})

	it('selects and deselects options', async () => {
		const onChange = vi.fn()
		render(
			<MultiSelectCombobox
				options={mockOptions}
				selected={[]}
				onChange={onChange}
				placeholder="Select languages"
			/>,
		)

		const trigger = screen.getByRole('combobox')
		fireEvent.click(trigger)

		await waitFor(() => {
			const typescriptOption = screen.getByText('TypeScript')
			fireEvent.click(typescriptOption)
		})

		expect(onChange).toHaveBeenCalledWith(['typescript'])

		// Select another option
		await waitFor(() => {
			const javascriptOption = screen.getByText('JavaScript')
			fireEvent.click(javascriptOption)
		})

		expect(onChange).toHaveBeenCalledWith(['typescript', 'javascript'])
	})

	it('can be disabled', () => {
		render(
			<MultiSelectCombobox
				options={mockOptions}
				selected={[]}
				onChange={vi.fn()}
				placeholder="Disabled select"
				disabled
			/>,
		)

		const trigger = screen.getByRole('combobox')
		expect(trigger).toHaveAttribute('aria-disabled', 'true')
	})

	it('renders with different sizes', () => {
		const { rerender } = render(
			<MultiSelectCombobox
				options={mockOptions}
				selected={[]}
				onChange={vi.fn()}
				placeholder="Small select"
				size="sm"
			/>,
		)
		expect(screen.getByRole('combobox')).toHaveClass('h-8')

		rerender(
			<MultiSelectCombobox
				options={mockOptions}
				selected={[]}
				onChange={vi.fn()}
				placeholder="Large select"
				size="lg"
			/>,
		)
		expect(screen.getByRole('combobox')).toHaveClass('h-10')
	})

	it('handles search functionality', async () => {
		render(
			<MultiSelectCombobox
				options={mockOptions}
				selected={[]}
				onChange={vi.fn()}
				placeholder="Search languages"
				searchable
			/>,
		)

		const trigger = screen.getByRole('combobox')
		fireEvent.click(trigger)

		await waitFor(() => {
			const searchInput = screen.getByPlaceholderText('Search...')
			fireEvent.change(searchInput, { target: { value: 'typescript' } })
		})

		// Only TypeScript should be visible
		expect(screen.getByText('TypeScript')).toBeInTheDocument()
		expect(screen.queryByText('JavaScript')).not.toBeInTheDocument()
	})

	it('respects maxSelections limit', async () => {
		const onChange = vi.fn()
		render(
			<MultiSelectCombobox
				options={mockOptions}
				selected={['typescript']}
				onChange={onChange}
				placeholder="Select languages"
				maxSelections={2}
			/>,
		)

		const trigger = screen.getByRole('combobox')
		fireEvent.click(trigger)

		await waitFor(() => {
			const javascriptOption = screen.getByText('JavaScript')
			fireEvent.click(javascriptOption)
		})

		expect(onChange).toHaveBeenCalledWith(['typescript', 'javascript'])

		// Try to select another option (should be disabled)
		await waitFor(() => {
			const pythonOption = screen.getByText('Python')
			expect(pythonOption).toHaveAttribute('aria-disabled', 'true')
		})
	})

	it('clears all selections when clearable', async () => {
		const onChange = vi.fn()
		render(
			<MultiSelectCombobox
				options={mockOptions}
				selected={['typescript', 'javascript']}
				onChange={onChange}
				placeholder="Select languages"
				clearable
			/>,
		)

		const clearButton = screen.getByRole('button', { name: /clear/i })
		fireEvent.click(clearButton)

		expect(onChange).toHaveBeenCalledWith([])
	})

	it('renders with custom className', () => {
		render(
			<MultiSelectCombobox
				options={mockOptions}
				selected={[]}
				onChange={vi.fn()}
				placeholder="Custom select"
				className="custom-class"
			/>,
		)

		const trigger = screen.getByRole('combobox')
		expect(trigger).toHaveClass('custom-class')
	})

	it('renders with grouped options', () => {
		const groupedOptions = [
			{ label: 'TypeScript', value: 'typescript', group: 'Web' },
			{ label: 'JavaScript', value: 'javascript', group: 'Web' },
			{ label: 'Python', value: 'python', group: 'Backend' },
			{ label: 'Java', value: 'java', group: 'Backend' },
		]

		render(
			<MultiSelectCombobox
				options={groupedOptions}
				selected={[]}
				onChange={vi.fn()}
				placeholder="Select languages"
			/>,
		)

		const trigger = screen.getByRole('combobox')
		fireEvent.click(trigger)

		waitFor(() => {
			expect(screen.getByText('Web')).toBeInTheDocument()
			expect(screen.getByText('Backend')).toBeInTheDocument()
		})
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(
			<MultiSelectCombobox
				ref={ref}
				options={mockOptions}
				selected={[]}
				onChange={vi.fn()}
				placeholder="With ref"
			/>,
		)
		expect(ref).toHaveBeenCalled()
	})
})
