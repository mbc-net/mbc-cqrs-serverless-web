import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Switch } from '../../components/ui/switch'
import { fireEvent, render, screen } from '../utils'

describe('Switch', () => {
	it('renders with default props', () => {
		render(<Switch />)
		const switchElement = screen.getByRole('switch')
		expect(switchElement).toBeInTheDocument()
		expect(switchElement).toHaveClass('peer', 'inline-flex')
	})

	it('can be toggled on and off', () => {
		const onCheckedChange = vi.fn()
		render(<Switch onCheckedChange={onCheckedChange} />)

		const switchElement = screen.getByRole('switch')
		expect(switchElement).not.toBeChecked()

		fireEvent.click(switchElement)
		expect(switchElement).toBeChecked()
		expect(onCheckedChange).toHaveBeenCalledWith(true)

		fireEvent.click(switchElement)
		expect(switchElement).not.toBeChecked()
		expect(onCheckedChange).toHaveBeenCalledWith(false)
	})

	it('can be disabled', () => {
		const onCheckedChange = vi.fn()
		render(<Switch disabled onCheckedChange={onCheckedChange} />)

		const switchElement = screen.getByRole('switch')
		expect(switchElement).toBeDisabled()

		fireEvent.click(switchElement)
		expect(onCheckedChange).not.toHaveBeenCalled()
	})

	it('can be required', () => {
		render(<Switch required />)
		const switchElement = screen.getByRole('switch')
		expect(switchElement).toBeRequired()
	})

	it('shows error state', () => {
		render(<Switch error />)
		const switchElement = screen.getByRole('switch')
		expect(switchElement).toHaveClass('border-[var(--mbc-color-destructive)]')
	})

	it('shows success state', () => {
		render(<Switch success />)
		const switchElement = screen.getByRole('switch')
		expect(switchElement).toHaveClass('border-[var(--mbc-color-success)]')
	})

	it('renders with label', () => {
		render(<Switch label="Enable notifications" />)
		expect(screen.getByText('Enable notifications')).toBeInTheDocument()
	})

	it('renders with helper text', () => {
		render(<Switch helperText="Turn on to receive notifications" />)
		expect(
			screen.getByText('Turn on to receive notifications'),
		).toBeInTheDocument()
	})

	it('renders with different sizes', () => {
		const { rerender } = render(<Switch size="sm" />)
		expect(screen.getByRole('switch')).toHaveClass('h-4', 'w-7')

		rerender(<Switch size="lg" />)
		expect(screen.getByRole('switch')).toHaveClass('h-6', 'w-11')

		rerender(<Switch size="xl" />)
		expect(screen.getByRole('switch')).toHaveClass('h-7', 'w-12')
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(<Switch ref={ref} />)
		expect(ref).toHaveBeenCalled()
	})

	it('handles controlled state', () => {
		const onCheckedChange = vi.fn()
		const { rerender } = render(
			<Switch checked={false} onCheckedChange={onCheckedChange} />,
		)

		const switchElement = screen.getByRole('switch')
		expect(switchElement).not.toBeChecked()

		rerender(<Switch checked={true} onCheckedChange={onCheckedChange} />)
		expect(switchElement).toBeChecked()
	})

	it('handles keyboard navigation', () => {
		const onCheckedChange = vi.fn()
		render(<Switch onCheckedChange={onCheckedChange} />)

		const switchElement = screen.getByRole('switch')
		switchElement.focus()

		fireEvent.keyDown(switchElement, { key: ' ' })
		expect(switchElement).toBeChecked()
		expect(onCheckedChange).toHaveBeenCalledWith(true)
	})
})
