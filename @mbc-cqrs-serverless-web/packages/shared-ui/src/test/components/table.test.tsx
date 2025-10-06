import React from 'react'
import { describe, expect, it } from 'vitest'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '../../components/ui/table'
import { render, screen } from '../utils'

describe('Table', () => {
	it('renders with default props', () => {
		render(
			<Table>
				<TableBody>
					<TableRow>
						<TableCell>Cell content</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		)

		const table = screen.getByRole('table')
		expect(table).toBeInTheDocument()
		expect(table).toHaveClass('w-full', 'caption-bottom', 'text-sm')
	})

	it('renders with striped rows', () => {
		render(
			<Table striped>
				<TableBody>
					<TableRow>
						<TableCell>Row 1</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Row 2</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		)

		const table = screen.getByRole('table')
		expect(table).toHaveClass('striped')
	})

	it('renders with hover effect', () => {
		render(
			<Table hover>
				<TableBody>
					<TableRow>
						<TableCell>Row 1</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		)

		const table = screen.getByRole('table')
		expect(table).toHaveClass('hover')
	})

	it('renders with bordered style', () => {
		render(
			<Table bordered>
				<TableBody>
					<TableRow>
						<TableCell>Row 1</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		)

		const table = screen.getByRole('table')
		expect(table).toHaveClass('bordered')
	})

	it('renders with compact style', () => {
		render(
			<Table compact>
				<TableBody>
					<TableRow>
						<TableCell>Row 1</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		)

		const table = screen.getByRole('table')
		expect(table).toHaveClass('compact')
	})

	it('renders complete table structure', () => {
		render(
			<Table>
				<TableCaption>Test table</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>John Doe</TableCell>
						<TableCell>john@example.com</TableCell>
					</TableRow>
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell colSpan={2}>Total: 1 user</TableCell>
					</TableRow>
				</TableFooter>
			</Table>,
		)

		expect(screen.getByText('Test table')).toBeInTheDocument()
		expect(screen.getByText('Name')).toBeInTheDocument()
		expect(screen.getByText('Email')).toBeInTheDocument()
		expect(screen.getByText('John Doe')).toBeInTheDocument()
		expect(screen.getByText('john@example.com')).toBeInTheDocument()
		expect(screen.getByText('Total: 1 user')).toBeInTheDocument()
	})

	it('renders TableHead with sortable functionality', () => {
		const onSort = vi.fn()
		render(
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead sortable onSort={onSort}>
							Sortable Column
						</TableHead>
					</TableRow>
				</TableHeader>
			</Table>,
		)

		const header = screen.getByText('Sortable Column')
		expect(header).toHaveClass('cursor-pointer', 'select-none')
	})

	it('renders TableCell with different alignments', () => {
		render(
			<Table>
				<TableBody>
					<TableRow>
						<TableCell align="left">Left</TableCell>
						<TableCell align="center">Center</TableCell>
						<TableCell align="right">Right</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		)

		expect(screen.getByText('Left')).toHaveClass('text-left')
		expect(screen.getByText('Center')).toHaveClass('text-center')
		expect(screen.getByText('Right')).toHaveClass('text-right')
	})

	it('renders TableCell with numeric content', () => {
		render(
			<Table>
				<TableBody>
					<TableRow>
						<TableCell numeric>123.45</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		)

		expect(screen.getByText('123.45')).toHaveClass('text-right', 'tabular-nums')
	})

	it('renders TableCell with truncated content', () => {
		render(
			<Table>
				<TableBody>
					<TableRow>
						<TableCell truncate>
							Very long content that should be truncated
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		)

		expect(
			screen.getByText('Very long content that should be truncated'),
		).toHaveClass('truncate')
	})

	it('renders TableCaption with different placements', () => {
		const { rerender } = render(
			<Table>
				<TableCaption placement="top">Top caption</TableCaption>
				<TableBody>
					<TableRow>
						<TableCell>Content</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		)

		expect(screen.getByText('Top caption')).toHaveClass('caption-top')

		rerender(
			<Table>
				<TableCaption placement="bottom">Bottom caption</TableCaption>
				<TableBody>
					<TableRow>
						<TableCell>Content</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		)

		expect(screen.getByText('Bottom caption')).toHaveClass('caption-bottom')
	})
})
