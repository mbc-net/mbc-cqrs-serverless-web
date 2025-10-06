import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '../../components/ui/tabs'
import { fireEvent, render, screen } from '../utils'

describe('Tabs', () => {
	it('renders with default props', () => {
		render(
			<Tabs>
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
					<TabsTrigger value="tab2">Tab 2</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
				<TabsContent value="tab2">Content 2</TabsContent>
			</Tabs>,
		)

		expect(screen.getByText('Tab 1')).toBeInTheDocument()
		expect(screen.getByText('Tab 2')).toBeInTheDocument()
		expect(screen.getByText('Content 1')).toBeInTheDocument()
		expect(screen.getByText('Content 2')).toBeInTheDocument()
	})

	it('switches between tabs', () => {
		const onValueChange = vi.fn()
		render(
			<Tabs onValueChange={onValueChange}>
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
					<TabsTrigger value="tab2">Tab 2</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
				<TabsContent value="tab2">Content 2</TabsContent>
			</Tabs>,
		)

		const tab2 = screen.getByText('Tab 2')
		fireEvent.click(tab2)

		expect(onValueChange).toHaveBeenCalledWith('tab2')
	})

	it('renders TabsList with proper styling', () => {
		render(
			<Tabs>
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
					<TabsTrigger value="tab2">Tab 2</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
				<TabsContent value="tab2">Content 2</TabsContent>
			</Tabs>,
		)

		const tabsList = screen.getByRole('tablist')
		expect(tabsList).toHaveClass(
			'inline-flex',
			'h-9',
			'items-center',
			'justify-center',
		)
	})

	it('renders TabsTrigger with proper styling', () => {
		render(
			<Tabs>
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
					<TabsTrigger value="tab2">Tab 2</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
				<TabsContent value="tab2">Content 2</TabsContent>
			</Tabs>,
		)

		const tab1 = screen.getByRole('tab', { name: 'Tab 1' })
		expect(tab1).toHaveClass('inline-flex', 'items-center', 'justify-center')
	})

	it('renders TabsContent with proper styling', () => {
		render(
			<Tabs>
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
					<TabsTrigger value="tab2">Tab 2</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
				<TabsContent value="tab2">Content 2</TabsContent>
			</Tabs>,
		)

		const content1 = screen.getByText('Content 1')
		expect(content1).toHaveClass('mt-2', 'ring-offset-background')
	})

	it('can be disabled', () => {
		render(
			<Tabs>
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
					<TabsTrigger value="tab2" disabled>
						Disabled Tab
					</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
				<TabsContent value="tab2">Content 2</TabsContent>
			</Tabs>,
		)

		const disabledTab = screen.getByRole('tab', { name: 'Disabled Tab' })
		expect(disabledTab).toHaveAttribute('aria-disabled', 'true')
	})

	it('handles controlled value', () => {
		const onValueChange = vi.fn()
		const { rerender } = render(
			<Tabs value="tab1" onValueChange={onValueChange}>
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
					<TabsTrigger value="tab2">Tab 2</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
				<TabsContent value="tab2">Content 2</TabsContent>
			</Tabs>,
		)

		// Tab 1 should be active
		const tab1 = screen.getByRole('tab', { name: 'Tab 1' })
		expect(tab1).toHaveAttribute('aria-selected', 'true')

		// Change to tab 2
		rerender(
			<Tabs value="tab2" onValueChange={onValueChange}>
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
					<TabsTrigger value="tab2">Tab 2</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
				<TabsContent value="tab2">Content 2</TabsContent>
			</Tabs>,
		)

		// Tab 2 should be active
		const tab2 = screen.getByRole('tab', { name: 'Tab 2' })
		expect(tab2).toHaveAttribute('aria-selected', 'true')
	})

	it('supports keyboard navigation', () => {
		const onValueChange = vi.fn()
		render(
			<Tabs onValueChange={onValueChange}>
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
					<TabsTrigger value="tab2">Tab 2</TabsTrigger>
					<TabsTrigger value="tab3">Tab 3</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
				<TabsContent value="tab2">Content 2</TabsContent>
				<TabsContent value="tab3">Content 3</TabsContent>
			</Tabs>,
		)

		const tab1 = screen.getByRole('tab', { name: 'Tab 1' })
		tab1.focus()

		// Arrow right should move to next tab
		fireEvent.keyDown(tab1, { key: 'ArrowRight' })
		const tab2 = screen.getByRole('tab', { name: 'Tab 2' })
		expect(tab2).toHaveFocus()

		// Arrow left should move to previous tab
		fireEvent.keyDown(tab2, { key: 'ArrowLeft' })
		expect(tab1).toHaveFocus()
	})

	it('supports loop navigation', () => {
		const onValueChange = vi.fn()
		render(
			<Tabs loop onValueChange={onValueChange}>
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
					<TabsTrigger value="tab2">Tab 2</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
				<TabsContent value="tab2">Content 2</TabsContent>
			</Tabs>,
		)

		const tab1 = screen.getByRole('tab', { name: 'Tab 1' })
		tab1.focus()

		// Arrow right from last tab should loop to first
		fireEvent.keyDown(tab1, { key: 'ArrowRight' })
		const tab2 = screen.getByRole('tab', { name: 'Tab 2' })
		expect(tab2).toHaveFocus()

		fireEvent.keyDown(tab2, { key: 'ArrowRight' })
		expect(tab1).toHaveFocus()
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(
			<Tabs ref={ref}>
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content 1</TabsContent>
			</Tabs>,
		)
		expect(ref).toHaveBeenCalled()
	})
})
