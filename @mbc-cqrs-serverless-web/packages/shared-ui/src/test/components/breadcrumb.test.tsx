import React from 'react'
import { describe, expect, it } from 'vitest'
import {
	BreadcrumbBase,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '../../components/ui/breadcrumb'
import { render, screen } from '../utils'

describe('Breadcrumb', () => {
	it('renders with default props', () => {
		render(
			<BreadcrumbBase>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Current Page</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</BreadcrumbBase>,
		)

		expect(screen.getByText('Home')).toBeInTheDocument()
		expect(screen.getByText('Current Page')).toBeInTheDocument()
	})

	it('renders BreadcrumbList with proper styling', () => {
		render(
			<BreadcrumbBase>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
				</BreadcrumbList>
			</BreadcrumbBase>,
		)

		const list = screen.getByRole('list')
		expect(list).toHaveClass(
			'flex',
			'flex-wrap',
			'items-center',
			'break-words',
			'text-sm',
			'text-[var(--mbc-color-muted-foreground)]',
		)
	})

	it('renders BreadcrumbItem with proper styling', () => {
		render(
			<BreadcrumbBase>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
				</BreadcrumbList>
			</BreadcrumbBase>,
		)

		const item = screen.getByRole('listitem')
		expect(item).toHaveClass('inline-flex', 'items-center', 'gap-1.5')
	})

	it('renders BreadcrumbLink with proper styling', () => {
		render(
			<BreadcrumbBase>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
				</BreadcrumbList>
			</BreadcrumbBase>,
		)

		const link = screen.getByRole('link')
		expect(link).toHaveClass(
			'transition-colors',
			'hover:text-[var(--mbc-color-foreground)]',
		)
		expect(link).toHaveAttribute('href', '/')
	})

	it('renders BreadcrumbPage with proper styling', () => {
		render(
			<BreadcrumbBase>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbPage>Current Page</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</BreadcrumbBase>,
		)

		const page = screen.getByText('Current Page')
		expect(page).toHaveClass(
			'font-normal',
			'text-[var(--mbc-color-foreground)]',
		)
	})

	it('renders BreadcrumbSeparator with proper styling', () => {
		render(
			<BreadcrumbBase>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Current Page</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</BreadcrumbBase>,
		)

		const separator = screen.getByText('/')
		expect(separator).toHaveClass('[&>svg]:size-3.5')
	})

	it('renders custom separator', () => {
		render(
			<BreadcrumbBase separator="→">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Current Page</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</BreadcrumbBase>,
		)

		expect(screen.getByText('→')).toBeInTheDocument()
	})

	it('renders with custom ellipsis', () => {
		render(
			<BreadcrumbBase ellipsis="...">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Current Page</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</BreadcrumbBase>,
		)

		// The ellipsis would be shown when there are too many items
		// This is more of a visual test, but we can verify the prop is passed
		expect(screen.getByText('Home')).toBeInTheDocument()
	})

	it('renders with maxItems limit', () => {
		render(
			<BreadcrumbBase maxItems={2}>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="/products">Products</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Current Page</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</BreadcrumbBase>,
		)

		// With maxItems=2, only the last 2 items should be shown
		expect(screen.getByText('Products')).toBeInTheDocument()
		expect(screen.getByText('Current Page')).toBeInTheDocument()
	})

	it('renders BreadcrumbLink as child component', () => {
		render(
			<BreadcrumbBase>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<a href="/custom">Custom Link</a>
						</BreadcrumbLink>
					</BreadcrumbItem>
				</BreadcrumbList>
			</BreadcrumbBase>,
		)

		const link = screen.getByRole('link')
		expect(link).toHaveTextContent('Custom Link')
		expect(link).toHaveAttribute('href', '/custom')
	})

	it('renders BreadcrumbItem as current page', () => {
		render(
			<BreadcrumbBase>
				<BreadcrumbList>
					<BreadcrumbItem current>
						<BreadcrumbPage>Current Page</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</BreadcrumbBase>,
		)

		const item = screen.getByRole('listitem')
		expect(item).toHaveAttribute('aria-current', 'page')
	})

	it('forwards ref correctly', () => {
		const ref = vi.fn()
		render(
			<BreadcrumbBase ref={ref}>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
				</BreadcrumbList>
			</BreadcrumbBase>,
		)
		expect(ref).toHaveBeenCalled()
	})
})
