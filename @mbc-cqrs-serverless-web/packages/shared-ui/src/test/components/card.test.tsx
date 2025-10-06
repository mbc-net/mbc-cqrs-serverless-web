import React from 'react'
import { describe, expect, it } from 'vitest'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../../components/ui/card'
import { render, screen } from '../utils'

describe('Card', () => {
	it('renders with default props', () => {
		render(<Card>Card content</Card>)
		const card = screen.getByText('Card content')
		expect(card).toBeInTheDocument()
		expect(card).toHaveClass(
			'rounded-lg',
			'border',
			'bg-[var(--mbc-color-card)]',
		)
	})

	it('renders with different variants', () => {
		const { rerender } = render(<Card variant="outline">Outline Card</Card>)
		expect(screen.getByText('Outline Card')).toHaveClass(
			'border-[var(--mbc-color-border)]',
		)

		rerender(<Card variant="secondary">Secondary Card</Card>)
		expect(screen.getByText('Secondary Card')).toHaveClass(
			'bg-[var(--mbc-color-secondary)]',
		)
	})

	it('renders with shadow when shadow prop is true', () => {
		render(<Card shadow>Card with shadow</Card>)
		expect(screen.getByText('Card with shadow')).toHaveClass('shadow-md')
	})

	it('renders with border when border prop is true', () => {
		render(<Card border>Card with border</Card>)
		expect(screen.getByText('Card with border')).toHaveClass('border')
	})

	it('renders with hover effect when hover prop is true', () => {
		render(<Card hover>Card with hover</Card>)
		expect(screen.getByText('Card with hover')).toHaveClass('hover:shadow-md')
	})

	it('renders CardHeader correctly', () => {
		render(
			<Card>
				<CardHeader>Header content</CardHeader>
			</Card>,
		)
		expect(screen.getByText('Header content')).toHaveClass(
			'flex',
			'flex-col',
			'space-y-1.5',
			'p-6',
		)
	})

	it('renders CardContent correctly', () => {
		render(
			<Card>
				<CardContent>Content</CardContent>
			</Card>,
		)
		expect(screen.getByText('Content')).toHaveClass('p-6', 'pt-0')
	})

	it('renders CardFooter correctly', () => {
		render(
			<Card>
				<CardFooter>Footer content</CardFooter>
			</Card>,
		)
		expect(screen.getByText('Footer content')).toHaveClass(
			'flex',
			'items-center',
			'p-6',
			'pt-0',
		)
	})

	it('renders CardTitle correctly', () => {
		render(
			<Card>
				<CardHeader>
					<CardTitle>Card Title</CardTitle>
				</CardHeader>
			</Card>,
		)
		expect(screen.getByText('Card Title')).toHaveClass(
			'text-2xl',
			'font-semibold',
			'leading-none',
			'tracking-tight',
		)
	})

	it('renders CardDescription correctly', () => {
		render(
			<Card>
				<CardHeader>
					<CardDescription>Card description</CardDescription>
				</CardHeader>
			</Card>,
		)
		expect(screen.getByText('Card description')).toHaveClass(
			'text-[var(--mbc-color-muted-foreground)]',
			'text-sm',
		)
	})

	it('renders complete card structure', () => {
		render(
			<Card>
				<CardHeader>
					<CardTitle>Test Card</CardTitle>
					<CardDescription>This is a test card</CardDescription>
				</CardHeader>
				<CardContent>
					<p>Card content goes here</p>
				</CardContent>
				<CardFooter>
					<button>Action</button>
				</CardFooter>
			</Card>,
		)

		expect(screen.getByText('Test Card')).toBeInTheDocument()
		expect(screen.getByText('This is a test card')).toBeInTheDocument()
		expect(screen.getByText('Card content goes here')).toBeInTheDocument()
		expect(screen.getByText('Action')).toBeInTheDocument()
	})
})
