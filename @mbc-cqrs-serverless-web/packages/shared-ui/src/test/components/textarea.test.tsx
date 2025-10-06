import { describe, expect, it, vi } from 'vitest'
import { Textarea } from '../../components/ui/textarea'
import { fireEvent, render, screen } from '../utils'

describe('Textarea', () => {
	it('renders with default props', () => {
		render(<Textarea placeholder="Enter text" />)
		const textarea = screen.getByPlaceholderText('Enter text')
		expect(textarea).toBeInTheDocument()
		expect(textarea).toHaveClass('flex', 'min-h-[60px]', 'w-full', 'rounded-md')
	})

	it('handles value changes', () => {
		const onChange = vi.fn()
		render(<Textarea onChange={onChange} placeholder="Enter text" />)

		const textarea = screen.getByPlaceholderText('Enter text')
		fireEvent.change(textarea, { target: { value: 'test text' } })

		expect(onChange).toHaveBeenCalled()
		expect(textarea).toHaveValue('test text')
	})

	it('can be disabled', () => {
		render(<Textarea disabled placeholder="Disabled textarea" />)
		const textarea = screen.getByPlaceholderText('Disabled textarea')
		expect(textarea).toBeDisabled()
	})

	it('can be required', () => {
		render(<Textarea required placeholder="Required textarea" />)
		const textarea = screen.getByPlaceholderText('Required textarea')
		expect(textarea).toBeRequired()
	})

	it('shows error state', () => {
		render(<Textarea error placeholder="Error textarea" />)
		const textarea = screen.getByPlaceholderText('Error textarea')
		expect(textarea).toHaveClass('border-[var(--mbc-color-destructive)]')
	})

	it('shows success state', () => {
		render(<Textarea success placeholder="Success textarea" />)
		const textarea = screen.getByPlaceholderText('Success textarea')
		expect(textarea).toHaveClass('border-[var(--mbc-color-success)]')
	})

	it('renders with label', () => {
		render(<Textarea label="Description" placeholder="Enter description" />)
		expect(screen.getByText('Description')).toBeInTheDocument()
	})

	it('renders with helper text', () => {
		render(
			<Textarea
				helperText="Enter a detailed description"
				placeholder="Description"
			/>,
		)
		expect(screen.getByText('Enter a detailed description')).toBeInTheDocument()
	})

	it('renders with different sizes', () => {
		const { rerender } = render(
			<Textarea size="sm" placeholder="Small textarea" />,
		)
		expect(screen.getByPlaceholderText('Small textarea')).toHaveClass(
			'min-h-[40px]',
		)

		rerender(<Textarea size="lg" placeholder="Large textarea" />)
		expect(screen.getByPlaceholderText('Large textarea')).toHaveClass(
			'min-h-[80px]',
		)

		rerender(<Textarea size="xl" placeholder="Extra large textarea" />)
		expect(screen.getByPlaceholderText('Extra large textarea')).toHaveClass(
			'min-h-[100px]',
		)
	})

	it('renders with different resize options', () => {
		const { rerender } = render(
			<Textarea resize="none" placeholder="No resize" />,
		)
		expect(screen.getByPlaceholderText('No resize')).toHaveClass('resize-none')

		rerender(<Textarea resize="both" placeholder="Both resize" />)
		expect(screen.getByPlaceholderText('Both resize')).toHaveClass('resize')

		rerender(<Textarea resize="horizontal" placeholder="Horizontal resize" />)
		expect(screen.getByPlaceholderText('Horizontal resize')).toHaveClass(
			'resize-x',
		)

		rerender(<Textarea resize="vertical" placeholder="Vertical resize" />)
		expect(screen.getByPlaceholderText('Vertical resize')).toHaveClass(
			'resize-y',
		)
	})

	it('renders with min and max rows', () => {
		render(<Textarea minRows={3} maxRows={10} placeholder="Rows textarea" />)
		const textarea = screen.getByPlaceholderText('Rows textarea')
		expect(textarea).toHaveAttribute('rows', '3')
	})

	it('renders with custom className', () => {
		render(<Textarea className="custom-class" placeholder="Custom textarea" />)
		const textarea = screen.getByPlaceholderText('Custom textarea')
		expect(textarea).toHaveClass('custom-class')
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(<Textarea ref={ref} placeholder="With ref" />)
		expect(ref).toHaveBeenCalled()
	})

	it('handles focus events', () => {
		const onFocus = vi.fn()
		const onBlur = vi.fn()
		render(
			<Textarea onFocus={onFocus} onBlur={onBlur} placeholder="Focus test" />,
		)

		const textarea = screen.getByPlaceholderText('Focus test')

		fireEvent.focus(textarea)
		expect(onFocus).toHaveBeenCalled()

		fireEvent.blur(textarea)
		expect(onBlur).toHaveBeenCalled()
	})

	it('handles keyboard events', () => {
		const onKeyDown = vi.fn()
		const onKeyUp = vi.fn()
		render(
			<Textarea
				onKeyDown={onKeyDown}
				onKeyUp={onKeyUp}
				placeholder="Keyboard test"
			/>,
		)

		const textarea = screen.getByPlaceholderText('Keyboard test')

		fireEvent.keyDown(textarea, { key: 'Enter' })
		expect(onKeyDown).toHaveBeenCalled()

		fireEvent.keyUp(textarea, { key: 'Enter' })
		expect(onKeyUp).toHaveBeenCalled()
	})

	it('renders with all props combined', () => {
		render(
			<Textarea
				label="Complete textarea"
				helperText="Enter detailed information"
				placeholder="Type here"
				required
				error
				size="lg"
				resize="vertical"
				minRows={5}
				maxRows={15}
				className="custom-textarea"
			/>,
		)

		const textarea = screen.getByPlaceholderText('Type here')
		expect(textarea).toHaveClass(
			'custom-textarea',
			'min-h-[80px]',
			'resize-y',
			'border-[var(--mbc-color-destructive)]',
		)
		expect(textarea).toHaveAttribute('rows', '5')
		expect(screen.getByText('Complete textarea')).toBeInTheDocument()
		expect(screen.getByText('Enter detailed information')).toBeInTheDocument()
	})
})
