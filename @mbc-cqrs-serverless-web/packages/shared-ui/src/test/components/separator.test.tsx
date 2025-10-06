import React from 'react'
import { describe, expect, it } from 'vitest'
import { Separator } from '../../components/ui/separator'
import { render, screen } from '../utils'

describe('Separator', () => {
	it('renders with default props', () => {
		render(<Separator />)
		const separator = screen.getByRole('separator')
		expect(separator).toBeInTheDocument()
		expect(separator).toHaveClass('shrink-0', 'bg-[var(--mbc-color-border)]')
	})

	it('renders with different orientations', () => {
		const { rerender } = render(<Separator orientation="horizontal" />)
		expect(screen.getByRole('separator')).toHaveClass('h-[1px]', 'w-full')

		rerender(<Separator orientation="vertical" />)
		expect(screen.getByRole('separator')).toHaveClass('h-full', 'w-[1px]')
	})

	it('renders with custom className', () => {
		render(<Separator className="custom-separator" />)
		const separator = screen.getByRole('separator')
		expect(separator).toHaveClass('custom-separator')
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(<Separator ref={ref} />)
		expect(ref).toHaveBeenCalled()
	})
})
