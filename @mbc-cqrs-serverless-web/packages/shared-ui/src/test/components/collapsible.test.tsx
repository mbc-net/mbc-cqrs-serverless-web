import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '../../components/ui/collapsible'
import { fireEvent, render, screen } from '../utils'

describe('Collapsible', () => {
	it('renders with default props', () => {
		render(
			<Collapsible>
				<CollapsibleTrigger>Toggle</CollapsibleTrigger>
				<CollapsibleContent>Content</CollapsibleContent>
			</Collapsible>,
		)

		expect(screen.getByText('Toggle')).toBeInTheDocument()
		expect(screen.getByText('Content')).toBeInTheDocument()
	})

	it('expands and collapses content', () => {
		const onOpenChange = vi.fn()
		render(
			<Collapsible onOpenChange={onOpenChange}>
				<CollapsibleTrigger>Toggle</CollapsibleTrigger>
				<CollapsibleContent>Content</CollapsibleContent>
			</Collapsible>,
		)

		const trigger = screen.getByRole('button')
		fireEvent.click(trigger)

		expect(onOpenChange).toHaveBeenCalledWith(true)
	})

	it('renders CollapsibleTrigger with proper styling', () => {
		render(
			<Collapsible>
				<CollapsibleTrigger>Toggle</CollapsibleTrigger>
				<CollapsibleContent>Content</CollapsibleContent>
			</Collapsible>,
		)

		const trigger = screen.getByRole('button')
		expect(trigger).toHaveClass(
			'flex',
			'h-9',
			'w-9',
			'items-center',
			'justify-center',
		)
	})

	it('renders CollapsibleContent with proper styling', () => {
		render(
			<Collapsible>
				<CollapsibleTrigger>Toggle</CollapsibleTrigger>
				<CollapsibleContent>Content</CollapsibleContent>
			</Collapsible>,
		)

		const content = screen.getByText('Content')
		expect(content).toHaveClass('overflow-hidden', 'text-sm')
	})

	it('can be disabled', () => {
		render(
			<Collapsible disabled>
				<CollapsibleTrigger>Disabled Toggle</CollapsibleTrigger>
				<CollapsibleContent>Content</CollapsibleContent>
			</Collapsible>,
		)

		const trigger = screen.getByRole('button')
		expect(trigger).toHaveAttribute('aria-disabled', 'true')
	})

	it('handles controlled open state', () => {
		const onOpenChange = vi.fn()
		const { rerender } = render(
			<Collapsible open={false} onOpenChange={onOpenChange}>
				<CollapsibleTrigger>Toggle</CollapsibleTrigger>
				<CollapsibleContent>Content</CollapsibleContent>
			</Collapsible>,
		)

		// Content should be hidden initially
		const content = screen.getByText('Content')
		expect(content).toHaveAttribute('data-state', 'closed')

		// Open the collapsible
		rerender(
			<Collapsible open={true} onOpenChange={onOpenChange}>
				<CollapsibleTrigger>Toggle</CollapsibleTrigger>
				<CollapsibleContent>Content</CollapsibleContent>
			</Collapsible>,
		)

		// Content should be visible
		expect(content).toHaveAttribute('data-state', 'open')
	})

	it('renders CollapsibleTrigger as child component', () => {
		render(
			<Collapsible>
				<CollapsibleTrigger asChild>
					<button>Custom Trigger</button>
				</CollapsibleTrigger>
				<CollapsibleContent>Content</CollapsibleContent>
			</Collapsible>,
		)

		const trigger = screen.getByRole('button')
		expect(trigger).toHaveTextContent('Custom Trigger')
	})

	it('renders CollapsibleContent with forceMount', () => {
		render(
			<Collapsible>
				<CollapsibleTrigger>Toggle</CollapsibleTrigger>
				<CollapsibleContent forceMount>Content</CollapsibleContent>
			</Collapsible>,
		)

		const content = screen.getByText('Content')
		expect(content).toBeInTheDocument()
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(
			<Collapsible ref={ref}>
				<CollapsibleTrigger>Toggle</CollapsibleTrigger>
				<CollapsibleContent>Content</CollapsibleContent>
			</Collapsible>,
		)
		expect(ref).toHaveBeenCalled()
	})

	it('handles keyboard navigation', () => {
		const onOpenChange = vi.fn()
		render(
			<Collapsible onOpenChange={onOpenChange}>
				<CollapsibleTrigger>Toggle</CollapsibleTrigger>
				<CollapsibleContent>Content</CollapsibleContent>
			</Collapsible>,
		)

		const trigger = screen.getByRole('button')
		trigger.focus()

		// Enter key should toggle
		fireEvent.keyDown(trigger, { key: 'Enter' })
		expect(onOpenChange).toHaveBeenCalledWith(true)

		// Space key should toggle
		fireEvent.keyDown(trigger, { key: ' ' })
		expect(onOpenChange).toHaveBeenCalledWith(false)
	})
})
