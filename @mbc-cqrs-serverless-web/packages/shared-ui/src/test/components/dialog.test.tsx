import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../../components/ui/dialog'
import { fireEvent, render, screen } from '../utils'

describe('Dialog', () => {
	it('renders with default props', () => {
		render(
			<Dialog>
				<DialogTrigger>Open Dialog</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Dialog Title</DialogTitle>
						<DialogDescription>Dialog description</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>,
		)

		expect(screen.getByText('Open Dialog')).toBeInTheDocument()
	})

	it('opens and closes dialog', () => {
		const onOpenChange = vi.fn()
		render(
			<Dialog onOpenChange={onOpenChange}>
				<DialogTrigger>Open Dialog</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Dialog Title</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>,
		)

		const trigger = screen.getByText('Open Dialog')
		fireEvent.click(trigger)

		expect(onOpenChange).toHaveBeenCalledWith(true)
	})

	it('renders DialogContent with proper styling', () => {
		render(
			<Dialog open>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Test Dialog</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>,
		)

		const content = screen.getByRole('dialog')
		expect(content).toBeInTheDocument()
		expect(content).toHaveClass('fixed', 'left-[50%]', 'top-[50%]', 'z-50')
	})

	it('renders DialogHeader with proper styling', () => {
		render(
			<Dialog open>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Test Dialog</DialogTitle>
						<DialogDescription>Test description</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>,
		)

		const header = screen.getByText('Test Dialog').closest('div')
		expect(header).toHaveClass(
			'flex',
			'flex-col',
			'space-y-1.5',
			'text-center',
			'sm:text-left',
		)
	})

	it('renders DialogTitle with proper styling', () => {
		render(
			<Dialog open>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Test Title</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>,
		)

		const title = screen.getByText('Test Title')
		expect(title).toHaveClass(
			'text-lg',
			'font-semibold',
			'leading-none',
			'tracking-tight',
		)
	})

	it('renders DialogDescription with proper styling', () => {
		render(
			<Dialog open>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Test Title</DialogTitle>
						<DialogDescription>Test description</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>,
		)

		const description = screen.getByText('Test description')
		expect(description).toHaveClass(
			'text-[var(--mbc-color-muted-foreground)]',
			'text-sm',
		)
	})

	it('handles controlled open state', () => {
		const onOpenChange = vi.fn()
		const { rerender } = render(
			<Dialog open={false} onOpenChange={onOpenChange}>
				<DialogTrigger>Open Dialog</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Test Dialog</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>,
		)

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

		rerender(
			<Dialog open={true} onOpenChange={onOpenChange}>
				<DialogTrigger>Open Dialog</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Test Dialog</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>,
		)

		expect(screen.getByRole('dialog')).toBeInTheDocument()
	})

	it('renders DialogTrigger as child component', () => {
		render(
			<Dialog>
				<DialogTrigger asChild>
					<button>Custom Trigger</button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Test Dialog</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>,
		)

		const trigger = screen.getByRole('button')
		expect(trigger).toBeInTheDocument()
		expect(trigger).toHaveTextContent('Custom Trigger')
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(
			<Dialog>
				<DialogTrigger ref={ref}>Open Dialog</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Test Dialog</DialogTitle>
					</DialogHeader>
				</DialogContent>
			</Dialog>,
		)
		expect(ref).toHaveBeenCalled()
	})
})
