/**
 * TypeScript Type Definitions
 *
 * This file exports all TypeScript types and interfaces for the shared-ui library.
 * We use CSS variables + Tailwind classes for theming, so we focus on component prop types.
 */

// Component prop interfaces
export * from './components'

// Utility types
export * from './utils'

// Hook types
export * from './hooks'

// Re-export common React types for convenience
export type {
	ReactNode,
	ComponentProps,
	ComponentPropsWithoutRef,
	ComponentPropsWithRef,
} from 'react'
