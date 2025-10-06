import React from 'react'
import { describe, expect, it } from 'vitest'
import { Avatar } from '../../components/ui/avatar'
import { render, screen } from '../utils'

describe('Avatar', () => {
	it('renders with default props', () => {
		render(<Avatar>Avatar</Avatar>)
		const avatar = screen.getByText('Avatar')
		expect(avatar).toBeInTheDocument()
		expect(avatar).toHaveClass('relative', 'flex', 'h-10', 'w-10', 'shrink-0')
	})

	it('renders with image source', () => {
		render(<Avatar src="https://via.placeholder.com/40" alt="User avatar" />)
		const img = screen.getByRole('img')
		expect(img).toHaveAttribute('src', 'https://via.placeholder.com/40')
		expect(img).toHaveAttribute('alt', 'User avatar')
	})

	it('renders with fallback when image fails to load', () => {
		render(
			<Avatar src="invalid-url" fallback="JD">
				<img src="invalid-url" alt="User" />
			</Avatar>,
		)

		const fallback = screen.getByText('JD')
		expect(fallback).toBeInTheDocument()
		expect(fallback).toHaveClass(
			'flex',
			'h-full',
			'w-full',
			'items-center',
			'justify-center',
		)
	})

	it('renders with different sizes', () => {
		const { rerender } = render(<Avatar size="sm">Small</Avatar>)
		expect(screen.getByText('Small')).toHaveClass('h-8', 'w-8')

		rerender(<Avatar size="lg">Large</Avatar>)
		expect(screen.getByText('Large')).toHaveClass('h-12', 'w-12')

		rerender(<Avatar size="xl">Extra Large</Avatar>)
		expect(screen.getByText('Extra Large')).toHaveClass('h-16', 'w-16')
	})

	it('renders with different shapes', () => {
		const { rerender } = render(<Avatar shape="circle">Circle</Avatar>)
		expect(screen.getByText('Circle')).toHaveClass('rounded-full')

		rerender(<Avatar shape="square">Square</Avatar>)
		expect(screen.getByText('Square')).toHaveClass('rounded-md')
	})

	it('renders with status indicator', () => {
		render(<Avatar status="online">Online</Avatar>)
		const avatar = screen.getByText('Online')
		expect(avatar).toHaveClass('relative')
	})

	it('renders with custom status color', () => {
		render(
			<Avatar status="away" statusColor="yellow">
				Away
			</Avatar>,
		)
		const avatar = screen.getByText('Away')
		expect(avatar).toHaveClass('relative')
	})

	it('renders with custom className', () => {
		render(<Avatar className="custom-class">Custom</Avatar>)
		const avatar = screen.getByText('Custom')
		expect(avatar).toHaveClass('custom-class')
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(<Avatar ref={ref}>With Ref</Avatar>)
		expect(ref).toHaveBeenCalled()
	})

	it('renders with all props combined', () => {
		render(
			<Avatar
				src="https://via.placeholder.com/40"
				alt="User avatar"
				fallback="JD"
				size="lg"
				shape="circle"
				status="online"
				statusColor="green"
				className="custom-avatar"
			>
				<img src="https://via.placeholder.com/40" alt="User" />
			</Avatar>,
		)

		const avatar = screen.getByText('JD')
		expect(avatar).toHaveClass('custom-avatar', 'h-12', 'w-12', 'rounded-full')
	})

	it('handles image load error', () => {
		render(
			<Avatar src="invalid-url" fallback="Error">
				<img src="invalid-url" alt="User" onError={() => {}} />
			</Avatar>,
		)

		const fallback = screen.getByText('Error')
		expect(fallback).toBeInTheDocument()
	})
})
