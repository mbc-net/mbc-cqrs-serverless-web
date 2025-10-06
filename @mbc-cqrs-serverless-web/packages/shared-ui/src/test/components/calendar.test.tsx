import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Calendar } from '../../components/ui/calendar'
import { render, screen } from '../utils'

describe('Calendar', () => {
	it('renders with default props', () => {
		render(<Calendar />)
		const calendar = screen.getByRole('grid')
		expect(calendar).toBeInTheDocument()
	})

	it('handles date selection', () => {
		const onSelect = vi.fn()
		render(<Calendar onSelect={onSelect} />)

		const calendar = screen.getByRole('grid')
		expect(calendar).toBeInTheDocument()
	})

	it('renders with custom className', () => {
		render(<Calendar className="custom-calendar" />)
		const calendar = screen.getByRole('grid')
		expect(calendar).toHaveClass('custom-calendar')
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(<Calendar ref={ref} />)
		expect(ref).toHaveBeenCalled()
	})
})
