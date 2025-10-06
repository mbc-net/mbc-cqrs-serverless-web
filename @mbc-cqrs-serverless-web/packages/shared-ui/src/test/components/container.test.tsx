import React from 'react'
import { describe, expect, it } from 'vitest'
import { Container } from '../../components/ui/container'
import { render, screen } from '../utils'

describe('Container', () => {
	it('renders with default props', () => {
		render(<Container>Container content</Container>)
		const container = screen.getByText('Container content')
		expect(container).toBeInTheDocument()
		expect(container).toHaveClass('mx-auto', 'w-full', 'max-w-7xl')
	})

	it('renders with different sizes', () => {
		const { rerender } = render(
			<Container size="sm">Small container</Container>,
		)
		expect(screen.getByText('Small container')).toHaveClass('max-w-2xl')

		rerender(<Container size="md">Medium container</Container>)
		expect(screen.getByText('Medium container')).toHaveClass('max-w-4xl')

		rerender(<Container size="lg">Large container</Container>)
		expect(screen.getByText('Large container')).toHaveClass('max-w-6xl')

		rerender(<Container size="xl">Extra large container</Container>)
		expect(screen.getByText('Extra large container')).toHaveClass('max-w-7xl')
	})

	it('renders with custom className', () => {
		render(<Container className="custom-container">Custom container</Container>)
		const container = screen.getByText('Custom container')
		expect(container).toHaveClass('custom-container')
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(<Container ref={ref}>With ref</Container>)
		expect(ref).toHaveBeenCalled()
	})
})
