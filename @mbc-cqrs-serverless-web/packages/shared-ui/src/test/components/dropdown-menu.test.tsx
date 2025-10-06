import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import { fireEvent, render, screen, waitFor } from '../utils'

describe('DropdownMenu', () => {
	it('renders with default props', () => {
		render(
			<DropdownMenu>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Item 1</DropdownMenuItem>
					<DropdownMenuItem>Item 2</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		)

		expect(screen.getByText('Open Menu')).toBeInTheDocument()
	})

	it('opens and closes dropdown menu', () => {
		const onOpenChange = vi.fn()
		render(
			<DropdownMenu onOpenChange={onOpenChange}>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Item 1</DropdownMenuItem>
					<DropdownMenuItem>Item 2</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		)

		const trigger = screen.getByText('Open Menu')
		fireEvent.click(trigger)

		expect(onOpenChange).toHaveBeenCalledWith(true)
	})

	it('renders DropdownMenuTrigger with proper styling', () => {
		render(
			<DropdownMenu>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Item 1</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		)

		const trigger = screen.getByText('Open Menu')
		expect(trigger).toHaveClass('inline-flex', 'items-center', 'justify-center')
	})

	it('renders DropdownMenuContent with proper styling', () => {
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Item 1</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		)

		const content = screen
			.getByText('Item 1')
			.closest('[data-radix-dropdown-menu-content]')
		expect(content).toHaveClass(
			'z-50',
			'min-w-[8rem]',
			'overflow-hidden',
			'rounded-md',
		)
	})

	it('renders DropdownMenuItem with proper styling', () => {
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Item 1</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
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
			<DropdownMenu open>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onSelect={onSelect}>Item 1</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		)

		const item = screen.getByText('Item 1')
		fireEvent.click(item)

		expect(onSelect).toHaveBeenCalled()
	})

	it('can be disabled', () => {
		render(
			<DropdownMenu disabled>
				<DropdownMenuTrigger>Disabled Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Item 1</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		)

		const trigger = screen.getByText('Disabled Menu')
		fireEvent.click(trigger)

		// Menu should not open
		expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
	})

	it('handles controlled open state', () => {
		const onOpenChange = vi.fn()
		const { rerender } = render(
			<DropdownMenu open={false} onOpenChange={onOpenChange}>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Item 1</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		)

		// Menu should be closed initially
		expect(screen.queryByText('Item 1')).not.toBeInTheDocument()

		// Open the menu
		rerender(
			<DropdownMenu open={true} onOpenChange={onOpenChange}>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Item 1</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		)

		// Menu should be open
		expect(screen.getByText('Item 1')).toBeInTheDocument()
	})

	it('renders DropdownMenuTrigger as child component', () => {
		render(
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button>Custom Trigger</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Item 1</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		)

		const trigger = screen.getByRole('button')
		expect(trigger).toHaveTextContent('Custom Trigger')
	})

	it('renders with custom className', () => {
		render(
			<DropdownMenu>
				<DropdownMenuTrigger className="custom-trigger">
					Open Menu
				</DropdownMenuTrigger>
				<DropdownMenuContent className="custom-content">
					<DropdownMenuItem>Item 1</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		)

		const trigger = screen.getByText('Open Menu')
		expect(trigger).toHaveClass('custom-trigger')

		fireEvent.click(trigger)

		waitFor(() => {
			const content = screen
				.getByText('Item 1')
				.closest('[data-radix-dropdown-menu-content]')
			expect(content).toHaveClass('custom-content')
		})
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(
			<DropdownMenu ref={ref}>
				<DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Item 1</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		)
		expect(ref).toHaveBeenCalled()
	})

	it('renders with all props combined', () => {
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger className="custom-trigger">
					Open Menu
				</DropdownMenuTrigger>
				<DropdownMenuContent className="custom-content">
					<DropdownMenuItem>Complete Menu</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		)

		const trigger = screen.getByText('Open Menu')
		expect(trigger).toHaveClass('custom-trigger')

		const content = screen
			.getByText('Complete Menu')
			.closest('[data-radix-dropdown-menu-content]')
		expect(content).toHaveClass('custom-content')
		expect(screen.getByText('Complete Menu')).toBeInTheDocument()
	})
})
