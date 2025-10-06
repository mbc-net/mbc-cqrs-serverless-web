import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '../../components/ui/alert-dialog'
import { fireEvent, render, screen } from '../utils'

describe('AlertDialog', () => {
	it('renders with default props', () => {
		render(
			<AlertDialog>
				<AlertDialogTrigger>Open Alert</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Alert Title</AlertDialogTitle>
						<AlertDialogDescription>Alert description</AlertDialogDescription>
					</AlertDialogHeader>
				</AlertDialogContent>
			</AlertDialog>,
		)

		expect(screen.getByText('Open Alert')).toBeInTheDocument()
	})

	it('opens and closes alert dialog', () => {
		const onOpenChange = vi.fn()
		render(
			<AlertDialog onOpenChange={onOpenChange}>
				<AlertDialogTrigger>Open Alert</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Alert Title</AlertDialogTitle>
					</AlertDialogHeader>
				</AlertDialogContent>
			</AlertDialog>,
		)

		const trigger = screen.getByText('Open Alert')
		fireEvent.click(trigger)

		expect(onOpenChange).toHaveBeenCalledWith(true)
	})

	it('renders AlertDialogTrigger with proper styling', () => {
		render(
			<AlertDialog>
				<AlertDialogTrigger>Open Alert</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Alert Title</AlertDialogTitle>
					</AlertDialogHeader>
				</AlertDialogContent>
			</AlertDialog>,
		)

		const trigger = screen.getByText('Open Alert')
		expect(trigger).toHaveClass('inline-flex', 'items-center', 'justify-center')
	})

	it('renders AlertDialogContent with proper styling', () => {
		render(
			<AlertDialog open>
				<AlertDialogTrigger>Open Alert</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Alert Title</AlertDialogTitle>
					</AlertDialogHeader>
				</AlertDialogContent>
			</AlertDialog>,
		)

		const content = screen
			.getByText('Alert Title')
			.closest('[data-radix-alert-dialog-content]')
		expect(content).toHaveClass('fixed', 'left-[50%]', 'top-[50%]', 'z-50')
	})

	it('renders AlertDialogHeader with proper styling', () => {
		render(
			<AlertDialog open>
				<AlertDialogTrigger>Open Alert</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Alert Title</AlertDialogTitle>
						<AlertDialogDescription>Alert description</AlertDialogDescription>
					</AlertDialogHeader>
				</AlertDialogContent>
			</AlertDialog>,
		)

		const header = screen.getByText('Alert Title').closest('div')
		expect(header).toHaveClass(
			'flex',
			'flex-col',
			'space-y-1.5',
			'text-center',
			'sm:text-left',
		)
	})

	it('renders AlertDialogTitle with proper styling', () => {
		render(
			<AlertDialog open>
				<AlertDialogTrigger>Open Alert</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Alert Title</AlertDialogTitle>
					</AlertDialogHeader>
				</AlertDialogContent>
			</AlertDialog>,
		)

		const title = screen.getByText('Alert Title')
		expect(title).toHaveClass(
			'text-lg',
			'font-semibold',
			'leading-none',
			'tracking-tight',
		)
	})

	it('renders AlertDialogDescription with proper styling', () => {
		render(
			<AlertDialog open>
				<AlertDialogTrigger>Open Alert</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Alert Title</AlertDialogTitle>
						<AlertDialogDescription>Alert description</AlertDialogDescription>
					</AlertDialogHeader>
				</AlertDialogContent>
			</AlertDialog>,
		)

		const description = screen.getByText('Alert description')
		expect(description).toHaveClass(
			'text-[var(--mbc-color-muted-foreground)]',
			'text-sm',
		)
	})

	it('can be disabled', () => {
		render(
			<AlertDialog disabled>
				<AlertDialogTrigger>Disabled Alert</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Alert Title</AlertDialogTitle>
					</AlertDialogHeader>
				</AlertDialogContent>
			</AlertDialog>,
		)

		const trigger = screen.getByText('Disabled Alert')
		fireEvent.click(trigger)

		// Alert should not open
		expect(screen.queryByText('Alert Title')).not.toBeInTheDocument()
	})

	it('handles controlled open state', () => {
		const onOpenChange = vi.fn()
		const { rerender } = render(
			<AlertDialog open={false} onOpenChange={onOpenChange}>
				<AlertDialogTrigger>Open Alert</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Alert Title</AlertDialogTitle>
					</AlertDialogHeader>
				</AlertDialogContent>
			</AlertDialog>,
		)

		// Alert should be closed initially
		expect(screen.queryByText('Alert Title')).not.toBeInTheDocument()

		// Open the alert
		rerender(
			<AlertDialog open={true} onOpenChange={onOpenChange}>
				<AlertDialogTrigger>Open Alert</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Alert Title</AlertDialogTitle>
					</AlertDialogHeader>
				</AlertDialogContent>
			</AlertDialog>,
		)

		// Alert should be open
		expect(screen.getByText('Alert Title')).toBeInTheDocument()
	})

	it('renders AlertDialogTrigger as child component', () => {
		render(
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<button>Custom Trigger</button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Alert Title</AlertDialogTitle>
					</AlertDialogHeader>
				</AlertDialogContent>
			</AlertDialog>,
		)

		const trigger = screen.getByRole('button')
		expect(trigger).toHaveTextContent('Custom Trigger')
	})

	it('renders with custom className', () => {
		render(
			<AlertDialog>
				<AlertDialogTrigger className="custom-trigger">
					Open Alert
				</AlertDialogTrigger>
				<AlertDialogContent className="custom-content">
					<AlertDialogHeader>
						<AlertDialogTitle>Alert Title</AlertDialogTitle>
					</AlertDialogHeader>
				</AlertDialogContent>
			</AlertDialog>,
		)

		const trigger = screen.getByText('Open Alert')
		expect(trigger).toHaveClass('custom-trigger')

		fireEvent.click(trigger)

		waitFor(() => {
			const content = screen
				.getByText('Alert Title')
				.closest('[data-radix-alert-dialog-content]')
			expect(content).toHaveClass('custom-content')
		})
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(
			<AlertDialog ref={ref}>
				<AlertDialogTrigger>Open Alert</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Alert Title</AlertDialogTitle>
					</AlertDialogHeader>
				</AlertDialogContent>
			</AlertDialog>,
		)
		expect(ref).toHaveBeenCalled()
	})

	it('renders with all props combined', () => {
		render(
			<AlertDialog open>
				<AlertDialogTrigger className="custom-trigger">
					Open Alert
				</AlertDialogTrigger>
				<AlertDialogContent className="custom-content">
					<AlertDialogHeader>
						<AlertDialogTitle>Complete Alert</AlertDialogTitle>
						<AlertDialogDescription>
							Alert with all props
						</AlertDialogDescription>
					</AlertDialogHeader>
				</AlertDialogContent>
			</AlertDialog>,
		)

		const trigger = screen.getByText('Open Alert')
		expect(trigger).toHaveClass('custom-trigger')

		const content = screen
			.getByText('Complete Alert')
			.closest('[data-radix-alert-dialog-content]')
		expect(content).toHaveClass('custom-content')
		expect(screen.getByText('Complete Alert')).toBeInTheDocument()
		expect(screen.getByText('Alert with all props')).toBeInTheDocument()
	})
})
