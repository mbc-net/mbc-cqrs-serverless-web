import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../../components/ui/tooltip'
import { fireEvent, render, screen, waitFor } from '../utils'

describe('Tooltip', () => {
	it('renders with default props', () => {
		render(
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>Hover me</TooltipTrigger>
					<TooltipContent>Tooltip content</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		)

		expect(screen.getByText('Hover me')).toBeInTheDocument()
	})

	it('shows tooltip on hover', async () => {
		render(
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>Hover me</TooltipTrigger>
					<TooltipContent>Tooltip content</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		)

		const trigger = screen.getByText('Hover me')
		fireEvent.mouseEnter(trigger)

		await waitFor(() => {
			expect(screen.getByText('Tooltip content')).toBeInTheDocument()
		})
	})

	it('hides tooltip on mouse leave', async () => {
		render(
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>Hover me</TooltipTrigger>
					<TooltipContent>Tooltip content</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		)

		const trigger = screen.getByText('Hover me')
		fireEvent.mouseEnter(trigger)

		await waitFor(() => {
			expect(screen.getByText('Tooltip content')).toBeInTheDocument()
		})

		fireEvent.mouseLeave(trigger)

		await waitFor(() => {
			expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument()
		})
	})

	it('renders TooltipTrigger with proper styling', () => {
		render(
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>Hover me</TooltipTrigger>
					<TooltipContent>Tooltip content</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		)

		const trigger = screen.getByText('Hover me')
		expect(trigger).toHaveClass('inline-flex', 'items-center', 'justify-center')
	})

	it('renders TooltipContent with proper styling', async () => {
		render(
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>Hover me</TooltipTrigger>
					<TooltipContent>Tooltip content</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		)

		const trigger = screen.getByText('Hover me')
		fireEvent.mouseEnter(trigger)

		await waitFor(() => {
			const content = screen.getByText('Tooltip content')
			expect(content).toHaveClass('z-50', 'overflow-hidden', 'rounded-md')
		})
	})

	it('renders TooltipProvider with proper styling', () => {
		render(
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>Hover me</TooltipTrigger>
					<TooltipContent>Tooltip content</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		)

		const provider = screen
			.getByText('Hover me')
			.closest('[data-radix-tooltip-provider]')
		expect(provider).toBeInTheDocument()
	})

	it('can be disabled', () => {
		render(
			<TooltipProvider>
				<Tooltip disabled>
					<TooltipTrigger>Disabled tooltip</TooltipTrigger>
					<TooltipContent>Tooltip content</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		)

		const trigger = screen.getByText('Disabled tooltip')
		fireEvent.mouseEnter(trigger)

		// Tooltip should not appear
		expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument()
	})

	it('renders with custom delay', async () => {
		vi.useFakeTimers()

		render(
			<TooltipProvider delayDuration={1000}>
				<Tooltip>
					<TooltipTrigger>Hover me</TooltipTrigger>
					<TooltipContent>Tooltip content</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		)

		const trigger = screen.getByText('Hover me')
		fireEvent.mouseEnter(trigger)

		// Tooltip should not appear immediately
		expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument()

		// Advance timers by 1000ms
		vi.advanceTimersByTime(1000)

		await waitFor(() => {
			expect(screen.getByText('Tooltip content')).toBeInTheDocument()
		})

		vi.useRealTimers()
	})

	it('renders with custom side', async () => {
		render(
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>Hover me</TooltipTrigger>
					<TooltipContent side="top">Tooltip content</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		)

		const trigger = screen.getByText('Hover me')
		fireEvent.mouseEnter(trigger)

		await waitFor(() => {
			const content = screen.getByText('Tooltip content')
			expect(content).toHaveAttribute('data-side', 'top')
		})
	})

	it('renders with custom align', async () => {
		render(
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>Hover me</TooltipTrigger>
					<TooltipContent align="start">Tooltip content</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		)

		const trigger = screen.getByText('Hover me')
		fireEvent.mouseEnter(trigger)

		await waitFor(() => {
			const content = screen.getByText('Tooltip content')
			expect(content).toHaveAttribute('data-align', 'start')
		})
	})

	it('renders with custom offset', async () => {
		render(
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>Hover me</TooltipTrigger>
					<TooltipContent sideOffset={10}>Tooltip content</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		)

		const trigger = screen.getByText('Hover me')
		fireEvent.mouseEnter(trigger)

		await waitFor(() => {
			const content = screen.getByText('Tooltip content')
			expect(content).toHaveAttribute('data-side-offset', '10')
		})
	})

	it('renders with custom className', () => {
		render(
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger className="custom-trigger">Hover me</TooltipTrigger>
					<TooltipContent className="custom-content">
						Tooltip content
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		)

		const trigger = screen.getByText('Hover me')
		expect(trigger).toHaveClass('custom-trigger')

		fireEvent.mouseEnter(trigger)

		waitFor(() => {
			const content = screen.getByText('Tooltip content')
			expect(content).toHaveClass('custom-content')
		})
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(
			<TooltipProvider>
				<Tooltip ref={ref}>
					<TooltipTrigger>Hover me</TooltipTrigger>
					<TooltipContent>Tooltip content</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		)
		expect(ref).toHaveBeenCalled()
	})

	it('renders with all props combined', async () => {
		render(
			<TooltipProvider delayDuration={500}>
				<Tooltip>
					<TooltipTrigger className="custom-trigger">Hover me</TooltipTrigger>
					<TooltipContent
						side="top"
						align="start"
						sideOffset={15}
						className="custom-content"
					>
						Complete tooltip
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>,
		)

		const trigger = screen.getByText('Hover me')
		expect(trigger).toHaveClass('custom-trigger')

		fireEvent.mouseEnter(trigger)

		await waitFor(() => {
			const content = screen.getByText('Complete tooltip')
			expect(content).toHaveClass('custom-content')
			expect(content).toHaveAttribute('data-side', 'top')
			expect(content).toHaveAttribute('data-align', 'start')
			expect(content).toHaveAttribute('data-side-offset', '15')
		})
	})
})
