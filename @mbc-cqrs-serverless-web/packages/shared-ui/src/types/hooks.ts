/**
 * Hook Type Definitions
 *
 * This file contains TypeScript types for custom hooks in the shared-ui library.
 */

import type { ReactNode } from 'react'
import type { ValidationRule } from './utils'

// Toast hook types
export interface Toast {
	id: string
	title?: ReactNode
	description?: ReactNode
	action?: ReactNode
	variant?: 'default' | 'destructive' | 'secondary' | 'success'
	duration?: number
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

export interface ToastState {
	toasts: Toast[]
}

export interface ToastAction {
	type: 'ADD_TOAST' | 'UPDATE_TOAST' | 'DISMISS_TOAST' | 'REMOVE_TOAST'
	toast?: Toast
	toastId?: string
}

export interface UseToastReturn {
	toasts: Toast[]
	toast: (toast: Omit<Toast, 'id'>) => {
		id: string
		dismiss: () => void
		update: (props: Toast) => void
	}
	dismiss: (toastId?: string) => void
}

// Form hook types
export interface UseFormFieldProps {
	name: string
	defaultValue?: any
	required?: boolean
	disabled?: boolean
	onChange?: (value: any) => void
	onBlur?: () => void
	onFocus?: () => void
}

export interface UseFormFieldReturn {
	value: any
	error: string | null
	touched: boolean
	disabled: boolean
	required: boolean
	onChange: (value: any) => void
	onBlur: () => void
	onFocus: () => void
	setError: (error: string | null) => void
	setTouched: (touched: boolean) => void
}

// Validation hook types
export interface UseValidationProps {
	value: any
	rules?: ValidationRule[]
	validateOnChange?: boolean
	validateOnBlur?: boolean
}

// ValidationRule is imported from utils.ts

export interface UseValidationReturn {
	isValid: boolean
	error: string | null
	validate: () => boolean
	clearError: () => void
}

// Toggle hook types
export interface UseToggleProps {
	defaultValue?: boolean
	onChange?: (value: boolean) => void
}

export interface UseToggleReturn {
	value: boolean
	toggle: () => void
	setValue: (value: boolean) => void
	setTrue: () => void
	setFalse: () => void
}

// Debounce hook types
export interface UseDebounceProps<T> {
	value: T
	delay?: number
}

export interface UseDebounceReturn<T> {
	debouncedValue: T
	isDebouncing: boolean
}

// Local storage hook types
export interface UseLocalStorageProps<T> {
	key: string
	defaultValue: T
	serializer?: {
		serialize: (value: T) => string
		deserialize: (value: string) => T
	}
}

export interface UseLocalStorageReturn<T> {
	value: T
	setValue: (value: T | ((prev: T) => T)) => void
	removeValue: () => void
}

// Click outside hook types
export interface UseClickOutsideProps {
	ref: React.RefObject<HTMLElement>
	handler: () => void
	enabled?: boolean
}

// Intersection observer hook types
export interface UseIntersectionObserverProps {
	threshold?: number | number[]
	root?: Element | null
	rootMargin?: string
	enabled?: boolean
}

export interface UseIntersectionObserverReturn {
	ref: React.RefObject<HTMLElement>
	isIntersecting: boolean
	entry: IntersectionObserverEntry | null
}

// Media query hook types
export interface UseMediaQueryProps {
	query: string
	defaultValue?: boolean
}

export interface UseMediaQueryReturn {
	matches: boolean
	mediaQueryList: MediaQueryList | null
}

// Previous value hook types
export interface UsePreviousProps<T> {
	value: T
}

export interface UsePreviousReturn<T> {
	previousValue: T | undefined
}

// Copy to clipboard hook types
export interface UseCopyToClipboardProps {
	timeout?: number
}

export interface UseCopyToClipboardReturn {
	copy: (text: string) => Promise<boolean>
	copied: boolean
	error: Error | null
}

// Async hook types
export interface UseAsyncProps<T> {
	asyncFunction: () => Promise<T>
	immediate?: boolean
	dependencies?: any[]
}

export interface UseAsyncReturn<T> {
	data: T | null
	loading: boolean
	error: Error | null
	execute: () => Promise<void>
	reset: () => void
}

// Focus trap hook types
export interface UseFocusTrapProps {
	enabled?: boolean
	initialFocus?: React.RefObject<HTMLElement>
	returnFocus?: boolean
}

export interface UseFocusTrapReturn {
	ref: React.RefObject<HTMLElement>
	active: boolean
	activate: () => void
	deactivate: () => void
}

// Portal hook types
export interface UsePortalProps {
	container?: Element | null
	className?: string
}

export interface UsePortalReturn {
	portalRef: React.RefObject<HTMLDivElement>
	portal: ReactNode | null
}

// Theme hook types (if needed in the future)
export interface UseThemeProps {
	defaultTheme?: 'light' | 'dark' | 'system'
	storageKey?: string
}

export interface UseThemeReturn {
	theme: 'light' | 'dark' | 'system'
	setTheme: (theme: 'light' | 'dark' | 'system') => void
	toggleTheme: () => void
	resolvedTheme: 'light' | 'dark'
}

// Component state hook types
export interface UseComponentStateProps {
	initialState?: Record<string, any>
	reducers?: Record<string, (state: any, action: any) => any>
}

export interface UseComponentStateReturn {
	state: Record<string, any>
	dispatch: (action: { type: string; payload?: any }) => void
	setState: (updates: Record<string, any>) => void
	resetState: () => void
}

// Event listener hook types
export interface UseEventListenerProps {
	eventName: string
	handler: (event: Event) => void
	element?: Element | Window | Document | null
	options?: AddEventListenerOptions
}

// Window size hook types
export interface UseWindowSizeReturn {
	width: number
	height: number
}

// Scroll position hook types
export interface UseScrollPositionReturn {
	x: number
	y: number
}

// Keyboard hook types
export interface UseKeyboardProps {
	key: string | string[]
	handler: (event: KeyboardEvent) => void
	enabled?: boolean
	preventDefault?: boolean
	stopPropagation?: boolean
}

// Mouse position hook types
export interface UseMousePositionReturn {
	x: number
	y: number
}

// Hover hook types
export interface UseHoverProps {
	disabled?: boolean
	onHoverChange?: (hovered: boolean) => void
}

export interface UseHoverReturn {
	hovered: boolean
	ref: React.RefObject<HTMLElement>
}
