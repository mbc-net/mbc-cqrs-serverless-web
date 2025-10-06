import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { InputTable } from '../../components/ui/input-table'
import { fireEvent, render, screen } from '../utils'

describe('InputTable', () => {
	it('renders with default props', () => {
		render(<InputTable placeholder="Enter value" />)
		const input = screen.getByPlaceholderText('Enter value')
		expect(input).toBeInTheDocument()
		expect(input).toHaveClass('flex', 'h-8', 'w-full')
	})

	it('handles value changes', () => {
		const onChange = vi.fn()
		render(<InputTable onChange={onChange} placeholder="Enter value" />)

		const input = screen.getByPlaceholderText('Enter value')
		fireEvent.change(input, { target: { value: 'test input' } })

		expect(onChange).toHaveBeenCalled()
		expect(input).toHaveValue('test input')
	})

	it('can be disabled', () => {
		render(<InputTable disabled placeholder="Disabled input" />)
		const input = screen.getByPlaceholderText('Disabled input')
		expect(input).toBeDisabled()
	})

	it('shows error state', () => {
		render(<InputTable error placeholder="Error input" />)
		const input = screen.getByPlaceholderText('Error input')
		expect(input).toHaveClass('border-[var(--mbc-color-destructive)]')
	})

	it('shows success state', () => {
		render(<InputTable success placeholder="Success input" />)
		const input = screen.getByPlaceholderText('Success input')
		expect(input).toHaveClass('border-[var(--mbc-color-success)]')
	})

	it('renders with custom className', () => {
		render(<InputTable className="custom-class" placeholder="Custom input" />)
		const input = screen.getByPlaceholderText('Custom input')
		expect(input).toHaveClass('custom-class')
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(<InputTable ref={ref} placeholder="With ref" />)
		expect(ref).toHaveBeenCalled()
	})

	it('handles focus events', () => {
		const onFocus = vi.fn()
		const onBlur = vi.fn()
		render(
			<InputTable onFocus={onFocus} onBlur={onBlur} placeholder="Focus test" />,
		)

		const input = screen.getByPlaceholderText('Focus test')

		fireEvent.focus(input)
		expect(onFocus).toHaveBeenCalled()

		fireEvent.blur(input)
		expect(onBlur).toHaveBeenCalled()
	})

	it('handles keyboard events', () => {
		const onKeyDown = vi.fn()
		const onKeyUp = vi.fn()
		render(
			<InputTable
				onKeyDown={onKeyDown}
				onKeyUp={onKeyUp}
				placeholder="Keyboard test"
			/>,
		)

		const input = screen.getByPlaceholderText('Keyboard test')

		fireEvent.keyDown(input, { key: 'Enter' })
		expect(onKeyDown).toHaveBeenCalled()

		fireEvent.keyUp(input, { key: 'Enter' })
		expect(onKeyUp).toHaveBeenCalled()
	})

	it('renders with different input types', () => {
		const { rerender } = render(
			<InputTable type="text" placeholder="Text input" />,
		)
		expect(screen.getByPlaceholderText('Text input')).toHaveAttribute(
			'type',
			'text',
		)

		rerender(<InputTable type="number" placeholder="Number input" />)
		expect(screen.getByPlaceholderText('Number input')).toHaveAttribute(
			'type',
			'number',
		)

		rerender(<InputTable type="email" placeholder="Email input" />)
		expect(screen.getByPlaceholderText('Email input')).toHaveAttribute(
			'type',
			'email',
		)
	})

	it('renders with required attribute', () => {
		render(<InputTable required placeholder="Required input" />)
		const input = screen.getByPlaceholderText('Required input')
		expect(input).toBeRequired()
	})

	it('renders with readonly attribute', () => {
		render(<InputTable readOnly placeholder="Readonly input" />)
		const input = screen.getByPlaceholderText('Readonly input')
		expect(input).toHaveAttribute('readonly')
	})
})
