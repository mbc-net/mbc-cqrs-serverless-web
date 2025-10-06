import React from 'react'
import { describe, expect, it } from 'vitest'
import { Label } from '../../components/ui/label'
import { render, screen } from '../utils'

describe('Label', () => {
	it('renders with default props', () => {
		render(<Label>Label text</Label>)
		const label = screen.getByText('Label text')
		expect(label).toBeInTheDocument()
		expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none')
	})

	it('renders with required indicator', () => {
		render(<Label required>Required label</Label>)
		const label = screen.getByText('Required label')
		expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none')
	})

	it('renders with error state', () => {
		render(<Label error>Error label</Label>)
		const label = screen.getByText('Error label')
		expect(label).toHaveClass('text-[var(--mbc-color-destructive)]')
	})

	it('renders with disabled state', () => {
		render(<Label disabled>Disabled label</Label>)
		const label = screen.getByText('Disabled label')
		expect(label).toHaveClass('text-[var(--mbc-color-muted-foreground)]')
	})

	it('renders with htmlFor attribute', () => {
		render(<Label htmlFor="input-id">Label for input</Label>)
		const label = screen.getByText('Label for input')
		expect(label).toHaveAttribute('for', 'input-id')
	})

	it('renders with custom className', () => {
		render(<Label className="custom-class">Custom label</Label>)
		const label = screen.getByText('Custom label')
		expect(label).toHaveClass('custom-class')
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(<Label ref={ref}>With ref</Label>)
		expect(ref).toHaveBeenCalled()
	})

	it('renders with all props combined', () => {
		render(
			<Label required error htmlFor="test-input" className="custom-label">
				Complete label
			</Label>,
		)

		const label = screen.getByText('Complete label')
		expect(label).toHaveClass(
			'custom-label',
			'text-[var(--mbc-color-destructive)]',
		)
		expect(label).toHaveAttribute('for', 'test-input')
	})

	it('renders as child component', () => {
		render(
			<Label asChild>
				<span>Child label</span>
			</Label>,
		)

		const label = screen.getByText('Child label')
		expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none')
	})
})
