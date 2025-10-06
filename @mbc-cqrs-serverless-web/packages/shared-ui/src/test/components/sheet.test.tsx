import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '../../components/ui/sheet'
import { fireEvent, render, screen } from '../utils'

describe('Sheet', () => {
	it('renders with default props', () => {
		render(
			<Sheet>
				<SheetTrigger>Open Sheet</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Sheet Title</SheetTitle>
						<SheetDescription>Sheet description</SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>,
		)

		expect(screen.getByText('Open Sheet')).toBeInTheDocument()
	})

	it('opens and closes sheet', () => {
		const onOpenChange = vi.fn()
		render(
			<Sheet onOpenChange={onOpenChange}>
				<SheetTrigger>Open Sheet</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Sheet Title</SheetTitle>
					</SheetHeader>
				</SheetContent>
			</Sheet>,
		)

		const trigger = screen.getByText('Open Sheet')
		fireEvent.click(trigger)

		expect(onOpenChange).toHaveBeenCalledWith(true)
	})

	it('renders SheetTrigger with proper styling', () => {
		render(
			<Sheet>
				<SheetTrigger>Open Sheet</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Sheet Title</SheetTitle>
					</SheetHeader>
				</SheetContent>
			</Sheet>,
		)

		const trigger = screen.getByText('Open Sheet')
		expect(trigger).toHaveClass('inline-flex', 'items-center', 'justify-center')
	})

	it('renders SheetContent with proper styling', () => {
		render(
			<Sheet open>
				<SheetTrigger>Open Sheet</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Sheet Title</SheetTitle>
					</SheetHeader>
				</SheetContent>
			</Sheet>,
		)

		const content = screen
			.getByText('Sheet Title')
			.closest('[data-radix-sheet-content]')
		expect(content).toHaveClass(
			'fixed',
			'inset-y-0',
			'right-0',
			'z-50',
			'h-full',
			'w-3/4',
		)
	})

	it('renders SheetHeader with proper styling', () => {
		render(
			<Sheet open>
				<SheetTrigger>Open Sheet</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Sheet Title</SheetTitle>
						<SheetDescription>Sheet description</SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>,
		)

		const header = screen.getByText('Sheet Title').closest('div')
		expect(header).toHaveClass(
			'flex',
			'flex-col',
			'space-y-1.5',
			'text-center',
			'sm:text-left',
		)
	})

	it('renders SheetTitle with proper styling', () => {
		render(
			<Sheet open>
				<SheetTrigger>Open Sheet</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Sheet Title</SheetTitle>
					</SheetHeader>
				</SheetContent>
			</Sheet>,
		)

		const title = screen.getByText('Sheet Title')
		expect(title).toHaveClass(
			'text-lg',
			'font-semibold',
			'leading-none',
			'tracking-tight',
		)
	})

	it('renders SheetDescription with proper styling', () => {
		render(
			<Sheet open>
				<SheetTrigger>Open Sheet</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Sheet Title</SheetTitle>
						<SheetDescription>Sheet description</SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>,
		)

		const description = screen.getByText('Sheet description')
		expect(description).toHaveClass(
			'text-[var(--mbc-color-muted-foreground)]',
			'text-sm',
		)
	})

	it('can be disabled', () => {
		render(
			<Sheet disabled>
				<SheetTrigger>Disabled Sheet</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Sheet Title</SheetTitle>
					</SheetHeader>
				</SheetContent>
			</Sheet>,
		)

		const trigger = screen.getByText('Disabled Sheet')
		fireEvent.click(trigger)

		// Sheet should not open
		expect(screen.queryByText('Sheet Title')).not.toBeInTheDocument()
	})

	it('handles controlled open state', () => {
		const onOpenChange = vi.fn()
		const { rerender } = render(
			<Sheet open={false} onOpenChange={onOpenChange}>
				<SheetTrigger>Open Sheet</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Sheet Title</SheetTitle>
					</SheetHeader>
				</SheetContent>
			</Sheet>,
		)

		// Sheet should be closed initially
		expect(screen.queryByText('Sheet Title')).not.toBeInTheDocument()

		// Open the sheet
		rerender(
			<Sheet open={true} onOpenChange={onOpenChange}>
				<SheetTrigger>Open Sheet</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Sheet Title</SheetTitle>
					</SheetHeader>
				</SheetContent>
			</Sheet>,
		)

		// Sheet should be open
		expect(screen.getByText('Sheet Title')).toBeInTheDocument()
	})

	it('renders SheetTrigger as child component', () => {
		render(
			<Sheet>
				<SheetTrigger asChild>
					<button>Custom Trigger</button>
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Sheet Title</SheetTitle>
					</SheetHeader>
				</SheetContent>
			</Sheet>,
		)

		const trigger = screen.getByRole('button')
		expect(trigger).toHaveTextContent('Custom Trigger')
	})

	it('renders with different sides', () => {
		const { rerender } = render(
			<Sheet open>
				<SheetTrigger>Open Sheet</SheetTrigger>
				<SheetContent side="left">
					<SheetHeader>
						<SheetTitle>Left Sheet</SheetTitle>
					</SheetHeader>
				</SheetContent>
			</Sheet>,
		)

		const content = screen
			.getByText('Left Sheet')
			.closest('[data-radix-sheet-content]')
		expect(content).toHaveClass('left-0', 'right-auto')

		rerender(
			<Sheet open>
				<SheetTrigger>Open Sheet</SheetTrigger>
				<SheetContent side="right">
					<SheetHeader>
						<SheetTitle>Right Sheet</SheetTitle>
					</SheetHeader>
				</SheetContent>
			</Sheet>,
		)

		const rightContent = screen
			.getByText('Right Sheet')
			.closest('[data-radix-sheet-content]')
		expect(rightContent).toHaveClass('right-0', 'left-auto')

		rerender(
			<Sheet open>
				<SheetTrigger>Open Sheet</SheetTrigger>
				<SheetContent side="top">
					<SheetHeader>
						<SheetTitle>Top Sheet</SheetTitle>
					</SheetHeader>
				</SheetContent>
			</Sheet>,
		)

		const topContent = screen
			.getByText('Top Sheet')
			.closest('[data-radix-sheet-content]')
		expect(topContent).toHaveClass('top-0', 'bottom-auto', 'h-auto', 'w-full')

		rerender(
			<Sheet open>
				<SheetTrigger>Open Sheet</SheetTrigger>
				<SheetContent side="bottom">
					<SheetHeader>
						<SheetTitle>Bottom Sheet</SheetTitle>
					</SheetHeader>
				</SheetContent>
			</Sheet>,
		)

		const bottomContent = screen
			.getByText('Bottom Sheet')
			.closest('[data-radix-sheet-content]')
		expect(bottomContent).toHaveClass(
			'bottom-0',
			'top-auto',
			'h-auto',
			'w-full',
		)
	})

	it('renders with custom className', () => {
		render(
			<Sheet>
				<SheetTrigger className="custom-trigger">Open Sheet</SheetTrigger>
				<SheetContent className="custom-content">
					<SheetHeader>
						<SheetTitle>Sheet Title</SheetTitle>
					</SheetHeader>
				</SheetContent>
			</Sheet>,
		)

		const trigger = screen.getByText('Open Sheet')
		expect(trigger).toHaveClass('custom-trigger')

		fireEvent.click(trigger)

		waitFor(() => {
			const content = screen
				.getByText('Sheet Title')
				.closest('[data-radix-sheet-content]')
			expect(content).toHaveClass('custom-content')
		})
	})

	it('renders with custom width', () => {
		render(
			<Sheet open>
				<SheetTrigger>Open Sheet</SheetTrigger>
				<SheetContent className="w-96">
					<SheetHeader>
						<SheetTitle>Sheet Title</SheetTitle>
					</SheetHeader>
				</SheetContent>
			</Sheet>,
		)

		const content = screen
			.getByText('Sheet Title')
			.closest('[data-radix-sheet-content]')
		expect(content).toHaveClass('w-96')
	})

	it('renders with custom height', () => {
		render(
			<Sheet open>
				<SheetTrigger>Open Sheet</SheetTrigger>
				<SheetContent className="h-64">
					<SheetHeader>
						<SheetTitle>Sheet Title</SheetTitle>
					</SheetHeader>
				</SheetContent>
			</Sheet>,
		)

		const content = screen
			.getByText('Sheet Title')
			.closest('[data-radix-sheet-content]')
		expect(content).toHaveClass('h-64')
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(
			<Sheet ref={ref}>
				<SheetTrigger>Open Sheet</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Sheet Title</SheetTitle>
					</SheetHeader>
				</SheetContent>
			</Sheet>,
		)
		expect(ref).toHaveBeenCalled()
	})

	it('renders with all props combined', () => {
		render(
			<Sheet open>
				<SheetTrigger className="custom-trigger">Open Sheet</SheetTrigger>
				<SheetContent side="left" className="custom-content h-64 w-80">
					<SheetHeader>
						<SheetTitle>Complete Sheet</SheetTitle>
						<SheetDescription>Sheet with all props</SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>,
		)

		const trigger = screen.getByText('Open Sheet')
		expect(trigger).toHaveClass('custom-trigger')

		const content = screen
			.getByText('Complete Sheet')
			.closest('[data-radix-sheet-content]')
		expect(content).toHaveClass(
			'custom-content',
			'w-80',
			'h-64',
			'left-0',
			'right-auto',
		)
		expect(screen.getByText('Complete Sheet')).toBeInTheDocument()
		expect(screen.getByText('Sheet with all props')).toBeInTheDocument()
	})
})
