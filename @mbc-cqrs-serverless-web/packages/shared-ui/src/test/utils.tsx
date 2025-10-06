import { type RenderOptions, render } from '@testing-library/react'
import type React from 'react'
import type { ReactElement } from 'react'

// Mock theme provider for testing
const MockThemeProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<div data-testid="theme-provider" className="mbc-theme">
			{children}
		</div>
	)
}

// Custom render function that includes theme provider
const customRender = (
	ui: ReactElement,
	options?: Omit<RenderOptions, 'wrapper'>,
) => {
	return render(ui, {
		wrapper: MockThemeProvider,
		...options,
	})
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Test utilities
export const createMockProps = <T extends Record<string, any>>(
	overrides: Partial<T> = {},
): T => {
	return {
		...overrides,
	} as T
}

// Mock user interactions
export const mockUser = {
	click: (element: HTMLElement) => {
		element.click()
	},
	type: (element: HTMLElement, text: string) => {
		element.focus()
		element.textContent = text
		element.dispatchEvent(new Event('input', { bubbles: true }))
	},
	keyDown: (element: HTMLElement, key: string) => {
		element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
	},
}

// Test data generators
export const testData = {
	user: {
		name: 'Test User',
		email: 'test@example.com',
		avatar: 'https://via.placeholder.com/40',
	},
	options: [
		{ label: 'Option 1', value: 'option1' },
		{ label: 'Option 2', value: 'option2' },
		{ label: 'Option 3', value: 'option3' },
	],
	tableData: [
		{ id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
		{
			id: 2,
			name: 'Jane Smith',
			email: 'jane@example.com',
			status: 'Inactive',
		},
	],
}
