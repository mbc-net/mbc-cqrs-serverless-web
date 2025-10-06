import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '../../components/ui/accordion'
import { fireEvent, render, screen } from '../utils'

describe('Accordion', () => {
	it('renders with default props', () => {
		render(
			<Accordion type="single">
				<AccordionItem value="item-1">
					<AccordionTrigger>Item 1</AccordionTrigger>
					<AccordionContent>Content 1</AccordionContent>
				</AccordionItem>
			</Accordion>,
		)

		expect(screen.getByText('Item 1')).toBeInTheDocument()
		expect(screen.getByText('Content 1')).toBeInTheDocument()
	})

	it('expands and collapses items', () => {
		const onValueChange = vi.fn()
		render(
			<Accordion onValueChange={onValueChange}>
				<AccordionItem value="item-1">
					<AccordionTrigger>Item 1</AccordionTrigger>
					<AccordionContent>Content 1</AccordionContent>
				</AccordionItem>
			</Accordion>,
		)

		const trigger = screen.getByRole('button')
		fireEvent.click(trigger)

		expect(onValueChange).toHaveBeenCalledWith('item-1')
	})

	it('renders multiple items', () => {
		render(
			<Accordion>
				<AccordionItem value="item-1">
					<AccordionTrigger>Item 1</AccordionTrigger>
					<AccordionContent>Content 1</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>Item 2</AccordionTrigger>
					<AccordionContent>Content 2</AccordionContent>
				</AccordionItem>
			</Accordion>,
		)

		expect(screen.getByText('Item 1')).toBeInTheDocument()
		expect(screen.getByText('Item 2')).toBeInTheDocument()
		expect(screen.getByText('Content 1')).toBeInTheDocument()
		expect(screen.getByText('Content 2')).toBeInTheDocument()
	})

	it('supports multiple selection', () => {
		const onValueChange = vi.fn()
		render(
			<Accordion type="multiple" onValueChange={onValueChange}>
				<AccordionItem value="item-1">
					<AccordionTrigger>Item 1</AccordionTrigger>
					<AccordionContent>Content 1</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>Item 2</AccordionTrigger>
					<AccordionContent>Content 2</AccordionContent>
				</AccordionItem>
			</Accordion>,
		)

		const trigger1 = screen.getByText('Item 1')
		const trigger2 = screen.getByText('Item 2')

		fireEvent.click(trigger1)
		expect(onValueChange).toHaveBeenCalledWith(['item-1'])

		fireEvent.click(trigger2)
		expect(onValueChange).toHaveBeenCalledWith(['item-1', 'item-2'])
	})

	it('supports collapsible single selection', () => {
		const onValueChange = vi.fn()
		render(
			<Accordion type="single" collapsible onValueChange={onValueChange}>
				<AccordionItem value="item-1">
					<AccordionTrigger>Item 1</AccordionTrigger>
					<AccordionContent>Content 1</AccordionContent>
				</AccordionItem>
			</Accordion>,
		)

		const trigger = screen.getByRole('button')

		// First click opens
		fireEvent.click(trigger)
		expect(onValueChange).toHaveBeenCalledWith('item-1')

		// Second click closes
		fireEvent.click(trigger)
		expect(onValueChange).toHaveBeenCalledWith('')
	})

	it('renders AccordionTrigger with proper styling', () => {
		render(
			<Accordion>
				<AccordionItem value="item-1">
					<AccordionTrigger>Item 1</AccordionTrigger>
					<AccordionContent>Content 1</AccordionContent>
				</AccordionItem>
			</Accordion>,
		)

		const trigger = screen.getByRole('button')
		expect(trigger).toHaveClass(
			'flex',
			'flex-1',
			'items-center',
			'justify-between',
		)
	})

	it('renders AccordionContent with proper styling', () => {
		render(
			<Accordion>
				<AccordionItem value="item-1">
					<AccordionTrigger>Item 1</AccordionTrigger>
					<AccordionContent>Content 1</AccordionContent>
				</AccordionItem>
			</Accordion>,
		)

		const content = screen.getByText('Content 1')
		expect(content).toHaveClass('overflow-hidden', 'text-sm')
	})

	it('can be disabled', () => {
		render(
			<Accordion>
				<AccordionItem value="item-1" disabled>
					<AccordionTrigger>Disabled Item</AccordionTrigger>
					<AccordionContent>Content 1</AccordionContent>
				</AccordionItem>
			</Accordion>,
		)

		const trigger = screen.getByRole('button')
		expect(trigger).toHaveAttribute('aria-disabled', 'true')
	})

	it('handles controlled value', () => {
		const onValueChange = vi.fn()
		const { rerender } = render(
			<Accordion value="item-1" onValueChange={onValueChange}>
				<AccordionItem value="item-1">
					<AccordionTrigger>Item 1</AccordionTrigger>
					<AccordionContent>Content 1</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>Item 2</AccordionTrigger>
					<AccordionContent>Content 2</AccordionContent>
				</AccordionItem>
			</Accordion>,
		)

		// Item 1 should be open
		expect(screen.getByText('Content 1')).toBeInTheDocument()

		// Change to item 2
		rerender(
			<Accordion value="item-2" onValueChange={onValueChange}>
				<AccordionItem value="item-1">
					<AccordionTrigger>Item 1</AccordionTrigger>
					<AccordionContent>Content 1</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>Item 2</AccordionTrigger>
					<AccordionContent>Content 2</AccordionContent>
				</AccordionItem>
			</Accordion>,
		)

		// Item 2 should be open
		expect(screen.getByText('Content 2')).toBeInTheDocument()
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(
			<Accordion ref={ref}>
				<AccordionItem value="item-1">
					<AccordionTrigger>Item 1</AccordionTrigger>
					<AccordionContent>Content 1</AccordionContent>
				</AccordionItem>
			</Accordion>,
		)
		expect(ref).toHaveBeenCalled()
	})
})
