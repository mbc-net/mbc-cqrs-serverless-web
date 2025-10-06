import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Toaster, useToast } from '../../components/ui/toaster'
import { fireEvent, render, screen, waitFor } from '../utils'

// Mock the toast hook
const MockToastComponent = () => {
	const { toast } = useToast()

	return (
		<div>
			<button
				onClick={() =>
					toast({ title: 'Test Toast', description: 'Test description' })
				}
			>
				Show Toast
			</button>
			<Toaster />
		</div>
	)
}

describe('Toast', () => {
	it('renders Toaster component', () => {
		render(<Toaster />)
		const toaster = screen.getByTestId('toaster')
		expect(toaster).toBeInTheDocument()
	})

	it('shows toast when triggered', async () => {
		render(<MockToastComponent />)

		const button = screen.getByText('Show Toast')
		fireEvent.click(button)

		await waitFor(() => {
			expect(screen.getByText('Test Toast')).toBeInTheDocument()
			expect(screen.getByText('Test description')).toBeInTheDocument()
		})
	})

	it('renders toast with different variants', async () => {
		const TestComponent = () => {
			const { toast } = useToast()

			return (
				<div>
					<button
						onClick={() =>
							toast({
								title: 'Success Toast',
								description: 'Success description',
								variant: 'success',
							})
						}
					>
						Show Success Toast
					</button>
					<button
						onClick={() =>
							toast({
								title: 'Error Toast',
								description: 'Error description',
								variant: 'destructive',
							})
						}
					>
						Show Error Toast
					</button>
					<Toaster />
				</div>
			)
		}

		render(<TestComponent />)

		const successButton = screen.getByText('Show Success Toast')
		fireEvent.click(successButton)

		await waitFor(() => {
			const successToast = screen.getByText('Success Toast')
			expect(successToast).toBeInTheDocument()
			expect(successToast.closest('[data-sonner-toast]')).toHaveClass('success')
		})

		const errorButton = screen.getByText('Show Error Toast')
		fireEvent.click(errorButton)

		await waitFor(() => {
			const errorToast = screen.getByText('Error Toast')
			expect(errorToast).toBeInTheDocument()
			expect(errorToast.closest('[data-sonner-toast]')).toHaveClass(
				'destructive',
			)
		})
	})

	it('renders toast with action', async () => {
		const TestComponent = () => {
			const { toast } = useToast()

			return (
				<div>
					<button
						onClick={() =>
							toast({
								title: 'Toast with Action',
								description: 'Click the action button',
								action: <button>Action</button>,
							})
						}
					>
						Show Toast with Action
					</button>
					<Toaster />
				</div>
			)
		}

		render(<TestComponent />)

		const button = screen.getByText('Show Toast with Action')
		fireEvent.click(button)

		await waitFor(() => {
			expect(screen.getByText('Toast with Action')).toBeInTheDocument()
			expect(screen.getByText('Click the action button')).toBeInTheDocument()
			expect(screen.getByText('Action')).toBeInTheDocument()
		})
	})

	it('renders toast with custom duration', async () => {
		const TestComponent = () => {
			const { toast } = useToast()

			return (
				<div>
					<button
						onClick={() =>
							toast({
								title: 'Custom Duration Toast',
								description: 'This toast has custom duration',
								duration: 5000,
							})
						}
					>
						Show Custom Duration Toast
					</button>
					<Toaster />
				</div>
			)
		}

		render(<TestComponent />)

		const button = screen.getByText('Show Custom Duration Toast')
		fireEvent.click(button)

		await waitFor(() => {
			expect(screen.getByText('Custom Duration Toast')).toBeInTheDocument()
		})
	})

	it('renders toast with custom position', async () => {
		const TestComponent = () => {
			const { toast } = useToast()

			return (
				<div>
					<button
						onClick={() =>
							toast({
								title: 'Top Left Toast',
								description: 'This toast is positioned top-left',
								position: 'top-left',
							})
						}
					>
						Show Top Left Toast
					</button>
					<Toaster />
				</div>
			)
		}

		render(<TestComponent />)

		const button = screen.getByText('Show Top Left Toast')
		fireEvent.click(button)

		await waitFor(() => {
			expect(screen.getByText('Top Left Toast')).toBeInTheDocument()
		})
	})

	it('dismisses toast after duration', async () => {
		vi.useFakeTimers()

		const TestComponent = () => {
			const { toast } = useToast()

			return (
				<div>
					<button
						onClick={() =>
							toast({
								title: 'Auto Dismiss Toast',
								description: 'This toast will auto dismiss',
								duration: 1000,
							})
						}
					>
						Show Auto Dismiss Toast
					</button>
					<Toaster />
				</div>
			)
		}

		render(<TestComponent />)

		const button = screen.getByText('Show Auto Dismiss Toast')
		fireEvent.click(button)

		await waitFor(() => {
			expect(screen.getByText('Auto Dismiss Toast')).toBeInTheDocument()
		})

		vi.advanceTimersByTime(1000)

		await waitFor(() => {
			expect(screen.queryByText('Auto Dismiss Toast')).not.toBeInTheDocument()
		})

		vi.useRealTimers()
	})
})
