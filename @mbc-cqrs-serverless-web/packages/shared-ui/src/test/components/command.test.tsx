import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '../../components/ui/command'
import { fireEvent, render, screen } from '../utils'

describe('Command', () => {
	it('renders with default props', () => {
		render(
			<Command>
				<CommandInput placeholder="Search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup>
						<CommandItem>Item 1</CommandItem>
						<CommandItem>Item 2</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>,
		)

		expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
		expect(screen.getByText('Item 1')).toBeInTheDocument()
		expect(screen.getByText('Item 2')).toBeInTheDocument()
	})

	it('handles search input', () => {
		const onValueChange = vi.fn()
		render(
			<Command onValueChange={onValueChange}>
				<CommandInput placeholder="Search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup>
						<CommandItem>Item 1</CommandItem>
						<CommandItem>Item 2</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>,
		)

		const input = screen.getByPlaceholderText('Search...')
		fireEvent.change(input, { target: { value: 'test' } })

		expect(onValueChange).toHaveBeenCalledWith('test')
	})

	it('renders CommandInput with proper styling', () => {
		render(
			<Command>
				<CommandInput placeholder="Search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
				</CommandList>
			</Command>,
		)

		const input = screen.getByPlaceholderText('Search...')
		expect(input).toHaveClass('flex', 'h-10', 'w-full', 'rounded-md', 'border')
	})

	it('renders CommandList with proper styling', () => {
		render(
			<Command>
				<CommandInput placeholder="Search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
				</CommandList>
			</Command>,
		)

		const list = screen.getByRole('listbox')
		expect(list).toHaveClass(
			'max-h-[300px]',
			'overflow-y-auto',
			'overflow-x-hidden',
		)
	})

	it('renders CommandEmpty with proper styling', () => {
		render(
			<Command>
				<CommandInput placeholder="Search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
				</CommandList>
			</Command>,
		)

		const empty = screen.getByText('No results found.')
		expect(empty).toHaveClass('py-6', 'text-center', 'text-sm')
	})

	it('renders CommandGroup with proper styling', () => {
		render(
			<Command>
				<CommandInput placeholder="Search..." />
				<CommandList>
					<CommandGroup>
						<CommandItem>Item 1</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>,
		)

		const group = screen.getByText('Item 1').closest('div')
		expect(group).toHaveClass(
			'overflow-hidden',
			'p-1',
			'text-[var(--mbc-color-foreground)]',
		)
	})

	it('renders CommandItem with proper styling', () => {
		render(
			<Command>
				<CommandInput placeholder="Search..." />
				<CommandList>
					<CommandGroup>
						<CommandItem>Item 1</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>,
		)

		const item = screen.getByText('Item 1')
		expect(item).toHaveClass(
			'relative',
			'flex',
			'cursor-default',
			'select-none',
		)
	})

	it('handles item selection', () => {
		const onSelect = vi.fn()
		render(
			<Command>
				<CommandInput placeholder="Search..." />
				<CommandList>
					<CommandGroup>
						<CommandItem onSelect={onSelect}>Item 1</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>,
		)

		const item = screen.getByText('Item 1')
		fireEvent.click(item)

		expect(onSelect).toHaveBeenCalled()
	})

	it('can be disabled', () => {
		render(
			<Command disabled>
				<CommandInput placeholder="Search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
				</CommandList>
			</Command>,
		)

		const input = screen.getByPlaceholderText('Search...')
		expect(input).toBeDisabled()
	})

	it('renders with custom className', () => {
		render(
			<Command className="custom-command">
				<CommandInput placeholder="Search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
				</CommandList>
			</Command>,
		)

		const command = screen
			.getByPlaceholderText('Search...')
			.closest('[data-radix-command]')
		expect(command).toHaveClass('custom-command')
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(
			<Command ref={ref}>
				<CommandInput placeholder="Search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
				</CommandList>
			</Command>,
		)
		expect(ref).toHaveBeenCalled()
	})
})
