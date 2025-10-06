/**
 * Utility Type Definitions
 *
 * This file contains utility types for the shared-ui library.
 * These types provide common patterns and helpers for better TypeScript experience.
 */

import type { ReactNode } from 'react'

// Common utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] }
export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Component utility types
export type AsChildProps = {
	asChild?: boolean
}

export type PolymorphicRef<T> = T extends React.ElementType
	? React.ComponentPropsWithRef<T>['ref']
	: never

export type PolymorphicComponentProps<
	T extends React.ElementType,
	P = {},
> = P & {
	as?: T
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | keyof P> & {
		ref?: PolymorphicRef<T>
	}

// Event handler types
export type EventHandler<T = Event> = (event: T) => void
export type ChangeHandler<T = string> = (value: T) => void
export type FocusHandler = (event: React.FocusEvent) => void
export type BlurHandler = (event: React.FocusEvent) => void
export type KeyboardHandler = (event: React.KeyboardEvent) => void
export type MouseHandler = (event: React.MouseEvent) => void

// Form field types
export type FormFieldValue =
	| string
	| number
	| boolean
	| string[]
	| FileList
	| null
export type FormFieldError = string | string[] | null
export type FormFieldState = 'idle' | 'loading' | 'success' | 'error'

// Validation types
export type ValidationRule<T = any> = {
	required?: boolean
	min?: number
	max?: number
	minLength?: number
	maxLength?: number
	pattern?: RegExp
	validate?: (value: T) => boolean | string
	message?: string
}

export type ValidationResult = {
	isValid: boolean
	errors: FormFieldError
}

// API response types
export type ApiResponse<T = any> = {
	data: T
	success: boolean
	message?: string
	errors?: string[]
}

export type PaginatedResponse<T = any> = ApiResponse<T[]> & {
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
		hasNext: boolean
		hasPrev: boolean
	}
}

// Theme utility types (for CSS variable usage)
export type CSSVariable = `var(--${string})`
export type MBCVariable = `var(--mbc-${string})`

// Size and spacing utilities
export type Size = 'xs' | 'sm' | 'default' | 'lg' | 'xl'
export type Spacing =
	| 'none'
	| 'xs'
	| 'sm'
	| 'default'
	| 'lg'
	| 'xl'
	| '2xl'
	| '3xl'
export type Radius = 'none' | 'sm' | 'default' | 'lg' | 'xl' | 'full'

// Layout utilities
export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse'
export type JustifyContent =
	| 'start'
	| 'end'
	| 'center'
	| 'between'
	| 'around'
	| 'evenly'
export type AlignItems = 'start' | 'end' | 'center' | 'baseline' | 'stretch'
export type TextAlign = 'left' | 'center' | 'right' | 'justify'

// Animation utilities
export type AnimationDuration = 'fast' | 'normal' | 'slow'
export type AnimationEasing =
	| 'linear'
	| 'ease'
	| 'ease-in'
	| 'ease-out'
	| 'ease-in-out'

// Breakpoint utilities
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>

// Accessibility types
export type AriaLabel = string
export type AriaDescribedBy = string
export type AriaExpanded = boolean
export type AriaSelected = boolean
export type AriaChecked = boolean | 'mixed'
export type AriaPressed = boolean | 'mixed'

// Common component props
export interface BaseProps {
	className?: string
	children?: ReactNode
	id?: string
	'data-testid'?: string
	'data-slot'?: string
	'aria-label'?: AriaLabel
	'aria-describedby'?: AriaDescribedBy
}

// Forward ref utility
export type ForwardRefComponent<T, P = {}> = React.ForwardRefExoticComponent<
	P & React.RefAttributes<T>
>

// Ref utility
export type Ref<T> =
	| React.Ref<T>
	| React.RefObject<T>
	| React.MutableRefObject<T>

// Component variant utility
export type VariantProps<T> = T extends (...args: any) => any
	? Parameters<T>[0]
	: never

// Conditional types
export type If<T extends boolean, A, B> = T extends true ? A : B
export type IsArray<T> = T extends any[] ? true : false
export type IsString<T> = T extends string ? true : false
export type IsNumber<T> = T extends number ? true : false
export type IsBoolean<T> = T extends boolean ? true : false

// Object utilities
export type Keys<T> = keyof T
export type Values<T> = T[keyof T]
export type Entries<T> = Array<[Keys<T>, Values<T>]>

// Array utilities
export type Head<T extends any[]> = T extends [infer H, ...any[]] ? H : never
export type Tail<T extends any[]> = T extends [any, ...infer T] ? T : never
export type Last<T extends any[]> = T extends [...any[], infer L] ? L : never

// String utilities
export type Capitalize<S extends string> = S extends `${infer F}${infer R}`
	? `${Uppercase<F>}${R}`
	: S

export type Uncapitalize<S extends string> = S extends `${infer F}${infer R}`
	? `${Lowercase<F>}${R}`
	: S

// Union to intersection
export type UnionToIntersection<U> = (
	U extends any
		? (k: U) => void
		: never
) extends (k: infer I) => void
	? I
	: never

// Merge types
export type Merge<T, U> = Omit<T, keyof U> & U

// Pick by value type
export type PickByValue<T, V> = Pick<
	T,
	{ [K in keyof T]: T[K] extends V ? K : never }[keyof T]
>

// Omit by value type
export type OmitByValue<T, V> = Omit<
	T,
	{ [K in keyof T]: T[K] extends V ? K : never }[keyof T]
>
