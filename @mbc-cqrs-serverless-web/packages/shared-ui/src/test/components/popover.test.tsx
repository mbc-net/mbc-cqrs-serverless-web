import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '../../components/ui/popover'
import { fireEvent, render, screen, waitFor } from '../utils'

describe('Popover', () => {
	it('renders with default props', () => {
		render(
			<Popover>
				<PopoverTrigger>Open Popover</PopoverTrigger>
				<PopoverContent>Popover content</PopoverContent>
			</Popover>,
		)

		expect(screen.getByText('Open Popover')).toBeInTheDocument()
	})

	it('opens and closes popover', () => {
		const onOpenChange = vi.fn()
		render(
			<Popover onOpenChange={onOpenChange}>
				<PopoverTrigger>Open Popover</PopoverTrigger>
				<PopoverContent>Popover content</PopoverContent>
			</Popover>,
		)

		const trigger = screen.getByText('Open Popover')
		fireEvent.click(trigger)

		expect(onOpenChange).toHaveBeenCalledWith(true)
	})

	it('renders PopoverTrigger with proper styling', () => {
		render(
			<Popover>
				<PopoverTrigger>Open Popover</PopoverTrigger>
				<PopoverContent>Popover content</PopoverContent>
			</Popover>,
		)

		const trigger = screen.getByText('Open Popover')
		expect(trigger).toHaveClass('inline-flex', 'items-center', 'justify-center')
	})

	it('renders PopoverContent with proper styling', () => {
		render(
			<Popover open>
				<PopoverTrigger>Open Popover</PopoverTrigger>
				<PopoverContent>Popover content</PopoverContent>
			</Popover>,
		)

		const content = screen.getByText('Popover content')
		expect(content).toHaveClass('z-50', 'w-72', 'rounded-md', 'border')
	})

	it('can be disabled', () => {
		render(
			<Popover disabled>
				<PopoverTrigger>Disabled Popover</PopoverTrigger>
				<PopoverContent>Popover content</PopoverContent>
			</Popover>,
		)

		const trigger = screen.getByText('Disabled Popover')
		fireEvent.click(trigger)

		// Popover should not open
		expect(screen.queryByText('Popover content')).not.toBeInTheDocument()
	})

	it('handles controlled open state', () => {
		const onOpenChange = vi.fn()
		const { rerender } = render(
			<Popover open={false} onOpenChange={onOpenChange}>
				<PopoverTrigger>Open Popover</PopoverTrigger>
				<PopoverContent>Popover content</PopoverContent>
			</Popover>,
		)

		// Popover should be closed initially
		expect(screen.queryByText('Popover content')).not.toBeInTheDocument()

		// Open the popover
		rerender(
			<Popover open={true} onOpenChange={onOpenChange}>
				<PopoverTrigger>Open Popover</PopoverTrigger>
				<PopoverContent>Popover content</PopoverContent>
			</Popover>,
		)

		// Popover should be open
		expect(screen.getByText('Popover content')).toBeInTheDocument()
	})

	it('renders PopoverTrigger as child component', () => {
		render(
			<Popover>
				<PopoverTrigger asChild>
					<button>Custom Trigger</button>
				</PopoverTrigger>
				<PopoverContent>Popover content</PopoverContent>
			</Popover>,
		)

		const trigger = screen.getByRole('button')
		expect(trigger).toHaveTextContent('Custom Trigger')
	})

	it('renders with custom side', () => {
		render(
			<Popover open>
				<PopoverTrigger>Open Popover</PopoverTrigger>
				<PopoverContent side="top">Popover content</PopoverContent>
			</Popover>,
		)

		const content = screen.getByText('Popover content')
		expect(content).toHaveAttribute('data-side', 'top')
	})

	it('renders with custom align', () => {
		render(
			<Popover open>
				<PopoverTrigger>Open Popover</PopoverTrigger>
				<PopoverContent align="start">Popover content</PopoverContent>
			</Popover>,
		)

		const content = screen.getByText('Popover content')
		expect(content).toHaveAttribute('data-align', 'start')
	})

	it('renders with custom sideOffset', () => {
		render(
			<Popover open>
				<PopoverTrigger>Open Popover</PopoverTrigger>
				<PopoverContent sideOffset={10}>Popover content</PopoverContent>
			</Popover>,
		)

		const content = screen.getByText('Popover content')
		expect(content).toHaveAttribute('data-side-offset', '10')
	})

	it('renders with custom alignOffset', () => {
		render(
			<Popover open>
				<PopoverTrigger>Open Popover</PopoverTrigger>
				<PopoverContent alignOffset={10}>Popover content</PopoverContent>
			</Popover>,
		)

		const content = screen.getByText('Popover content')
		expect(content).toHaveAttribute('data-align-offset', '10')
	})

	it('renders with custom className', () => {
		render(
			<Popover>
				<PopoverTrigger className="custom-trigger">Open Popover</PopoverTrigger>
				<PopoverContent className="custom-content">
					Popover content
				</PopoverContent>
			</Popover>,
		)

		const trigger = screen.getByText('Open Popover')
		expect(trigger).toHaveClass('custom-trigger')

		fireEvent.click(trigger)

		waitFor(() => {
			const content = screen.getByText('Popover content')
			expect(content).toHaveClass('custom-content')
		})
	})

	it('renders with custom width', () => {
		render(
			<Popover open>
				<PopoverTrigger>Open Popover</PopoverTrigger>
				<PopoverContent className="w-96">Popover content</PopoverContent>
			</Popover>,
		)

		const content = screen.getByText('Popover content')
		expect(content).toHaveClass('w-96')
	})

	it('renders with custom height', () => {
		render(
			<Popover open>
				<PopoverTrigger>Open Popover</PopoverTrigger>
				<PopoverContent className="h-64">Popover content</PopoverContent>
			</Popover>,
		)

		const content = screen.getByText('Popover content')
		expect(content).toHaveClass('h-64')
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(
			<Popover ref={ref}>
				<PopoverTrigger>Open Popover</PopoverTrigger>
				<PopoverContent>Popover content</PopoverContent>
			</Popover>,
		)
		expect(ref).toHaveBeenCalled()
	})

	it('renders with all props combined', () => {
		render(
			<Popover open>
				<PopoverTrigger className="custom-trigger">Open Popover</PopoverTrigger>
				<PopoverContent
					side="top"
					align="start"
					sideOffset={15}
					alignOffset={10}
					className="custom-content h-48 w-80"
				>
					Complete popover
				</PopoverContent>
			</Popover>,
		)

		const trigger = screen.getByText('Open Popover')
		expect(trigger).toHaveClass('custom-trigger')

		const content = screen.getByText('Complete popover')
		expect(content).toHaveClass('custom-content', 'w-80', 'h-48')
		expect(content).toHaveAttribute('data-side', 'top')
		expect(content).toHaveAttribute('data-align', 'start')
		expect(content).toHaveAttribute('data-side-offset', '15')
		expect(content).toHaveAttribute('data-align-offset', '10')
	})
})
