import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, expect } from 'vitest'

// Extend Vitest's expect with jest-dom matchers
import * as matchers from '@testing-library/jest-dom/matchers'
expect.extend(matchers)

// Add type declarations for jest-dom matchers
declare module 'vitest' {
	interface Assertion<T = any> extends jest.Matchers<void, T> {}
	interface AsymmetricMatchersContaining extends jest.Matchers<void, any> {}
}

// Cleanup after each test case
afterEach(() => {
	cleanup()
})

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
	constructor() {}
	observe() {}
	unobserve() {}
	disconnect() {}
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => {},
	}),
})

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
	writable: true,
	value: () => {},
})
