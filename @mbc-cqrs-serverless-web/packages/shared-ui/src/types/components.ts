/**
 * Component Prop Interface Definitions
 *
 * This file contains TypeScript interfaces for all shared-ui components.
 * These interfaces ensure type safety and provide better developer experience.
 */

import type { VariantProps } from 'class-variance-authority'
import type {
	ButtonHTMLAttributes,
	HTMLAttributes,
	InputHTMLAttributes,
	ReactNode,
} from 'react'

// Simple utility types for component props
export type ComponentSize = 'xs' | 'sm' | 'default' | 'lg' | 'xl' | 'extra-md'
export type ComponentVariant =
	| 'default'
	| 'destructive'
	| 'outline'
	| 'secondary'
	| 'ghost'
	| 'link'
export type ComponentState =
	| 'default'
	| 'hover'
	| 'focus'
	| 'active'
	| 'disabled'
	| 'loading'
	| 'error'
	| 'success'

// Base component props
export interface BaseComponentProps {
	className?: string
	children?: ReactNode
	'data-testid'?: string
	'data-slot'?: string
}

// Button component props
export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		BaseComponentProps,
		VariantProps<typeof import('../components/ui/button').buttonVariants> {
	asChild?: boolean
	loading?: boolean
	leftIcon?: ReactNode
	rightIcon?: ReactNode
	fullWidth?: boolean
	state?: ComponentState
}

// Input component props
export interface InputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
		BaseComponentProps {
	showIconError?: boolean
	showSearchIcon?: boolean
	leftIcon?: ReactNode
	rightIcon?: ReactNode
	error?: boolean
	success?: boolean
	helperText?: string
	label?: string
	required?: boolean
	size?: ComponentSize
}

// Input Table component props
export interface InputTableProps
	extends InputHTMLAttributes<HTMLInputElement>,
		BaseComponentProps {
	error?: boolean
	success?: boolean
}

// Label component props
export interface LabelProps
	extends HTMLAttributes<HTMLLabelElement>,
		BaseComponentProps {
	required?: boolean
	error?: boolean
	disabled?: boolean
	htmlFor?: string
}

// Badge component props
export interface BadgeProps
	extends HTMLAttributes<HTMLDivElement>,
		BaseComponentProps,
		VariantProps<typeof import('../components/ui/badge').badgeVariants> {
	asChild?: boolean
	leftIcon?: ReactNode
	rightIcon?: ReactNode
	removable?: boolean
	onRemove?: () => void
}

// Avatar component props
export interface AvatarProps
	extends HTMLAttributes<HTMLDivElement>,
		BaseComponentProps {
	src?: string
	alt?: string
	fallback?: ReactNode
	size?: ComponentSize
	shape?: 'circle' | 'square'
	status?: 'online' | 'offline' | 'away' | 'busy'
	statusColor?: string
}

// Select component props
export interface SelectProps extends BaseComponentProps {
	value?: string
	defaultValue?: string
	onValueChange?: (value: string) => void
	disabled?: boolean
	required?: boolean
	placeholder?: string
	error?: boolean
	success?: boolean
	helperText?: string
	label?: string
	size?: ComponentSize
}

export interface SelectItemProps extends BaseComponentProps {
	value: string
	disabled?: boolean
	textValue?: string
}

export interface SelectTriggerProps extends BaseComponentProps {
	size?: ComponentSize
	error?: boolean
	disabled?: boolean
	placeholder?: string
}

export interface SelectContentProps extends BaseComponentProps {
	position?: 'popper' | 'item-aligned'
	side?: 'top' | 'right' | 'bottom' | 'left'
	align?: 'start' | 'center' | 'end'
	sideOffset?: number
	alignOffset?: number
	avoidCollisions?: boolean
	collisionBoundary?: Element | null | Array<Element | null>
	collisionPadding?:
		| number
		| Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>
	arrowPadding?: number
	sticky?: 'partial' | 'always'
	hideWhenDetached?: boolean
}

// Select Table component props
export interface SelectTableProps extends BaseComponentProps {
	value?: string
	defaultValue?: string
	onValueChange?: (value: string) => void
	disabled?: boolean
	required?: boolean
	placeholder?: string
	error?: boolean
	success?: boolean
	helperText?: string
	label?: string
	size?: 'sm' | 'default'
}

export interface SelectTableTriggerProps extends BaseComponentProps {
	size?: 'sm' | 'default'
	error?: boolean
	disabled?: boolean
	placeholder?: string
}

// Checkbox component props
export interface CheckboxProps extends BaseComponentProps {
	checked?: boolean
	defaultChecked?: boolean
	onCheckedChange?: (checked: boolean) => void
	disabled?: boolean
	required?: boolean
	indeterminate?: boolean
	error?: boolean
	success?: boolean
	helperText?: string
	label?: string
	size?: ComponentSize
}

// Radio Group component props
export interface RadioGroupProps extends BaseComponentProps {
	value?: string
	defaultValue?: string
	onValueChange?: (value: string) => void
	disabled?: boolean
	required?: boolean
	error?: boolean
	success?: boolean
	helperText?: string
	label?: string
	orientation?: 'horizontal' | 'vertical'
	size?: ComponentSize
}

export interface RadioGroupItemProps extends BaseComponentProps {
	value: string
	disabled?: boolean
	required?: boolean
}

// Textarea component props
export interface TextareaProps
	extends HTMLAttributes<HTMLTextAreaElement>,
		BaseComponentProps {
	error?: boolean
	success?: boolean
	helperText?: string
	label?: string
	required?: boolean
	disabled?: boolean
	resize?: 'none' | 'both' | 'horizontal' | 'vertical'
	minRows?: number
	maxRows?: number
	size?: ComponentSize
}

// Switch component props
export interface SwitchProps extends BaseComponentProps {
	checked?: boolean
	defaultChecked?: boolean
	onCheckedChange?: (checked: boolean) => void
	disabled?: boolean
	required?: boolean
	error?: boolean
	success?: boolean
	helperText?: string
	label?: string
	size?: ComponentSize
}

// Card component props
export interface CardProps
	extends HTMLAttributes<HTMLDivElement>,
		BaseComponentProps {
	variant?: ComponentVariant
	padding?: ComponentSize
	shadow?: boolean
	border?: boolean
	hover?: boolean
}

export interface CardHeaderProps
	extends HTMLAttributes<HTMLDivElement>,
		BaseComponentProps {
	padding?: ComponentSize
}

export interface CardContentProps
	extends HTMLAttributes<HTMLDivElement>,
		BaseComponentProps {
	padding?: ComponentSize
}

export interface CardFooterProps
	extends HTMLAttributes<HTMLDivElement>,
		BaseComponentProps {
	padding?: ComponentSize
}

export interface CardTitleProps
	extends HTMLAttributes<HTMLHeadingElement>,
		BaseComponentProps {
	as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
	size?: ComponentSize
}

export interface CardDescriptionProps
	extends HTMLAttributes<HTMLParagraphElement>,
		BaseComponentProps {
	size?: ComponentSize
}

// Table component props
export interface TableProps
	extends HTMLAttributes<HTMLTableElement>,
		BaseComponentProps {
	striped?: boolean
	hover?: boolean
	bordered?: boolean
	compact?: boolean
	responsive?: boolean
}

export interface TableHeaderProps
	extends HTMLAttributes<HTMLTableSectionElement>,
		BaseComponentProps {}

export interface TableBodyProps
	extends HTMLAttributes<HTMLTableSectionElement>,
		BaseComponentProps {}

export interface TableFooterProps
	extends HTMLAttributes<HTMLTableSectionElement>,
		BaseComponentProps {}

export interface TableRowProps
	extends HTMLAttributes<HTMLTableRowElement>,
		BaseComponentProps {
	selected?: boolean
	hover?: boolean
	striped?: boolean
}

export interface TableHeadProps
	extends HTMLAttributes<HTMLTableCellElement>,
		BaseComponentProps {
	sortable?: boolean
	sortDirection?: 'asc' | 'desc' | 'none'
	onSort?: () => void
	width?: string | number
	align?: 'left' | 'center' | 'right'
}

export interface TableCellProps
	extends HTMLAttributes<HTMLTableCellElement>,
		BaseComponentProps {
	align?: 'left' | 'center' | 'right'
	numeric?: boolean
	truncate?: boolean
}

export interface TableCaptionProps
	extends HTMLAttributes<HTMLTableCaptionElement>,
		BaseComponentProps {
	placement?: 'top' | 'bottom'
}

// Dialog component props
export interface DialogProps extends BaseComponentProps {
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
	modal?: boolean
}

export interface DialogTriggerProps extends BaseComponentProps {
	asChild?: boolean
}

export interface DialogContentProps extends BaseComponentProps {
	forceMount?: boolean
	onOpenAutoFocus?: (event: Event) => void
	onCloseAutoFocus?: (event: Event) => void
	onEscapeKeyDown?: (event: KeyboardEvent) => void
	onPointerDownOutside?: (event: PointerEvent) => void
	onInteractOutside?: (event: Event) => void
}

export interface DialogHeaderProps extends BaseComponentProps {
	padding?: ComponentSize
}

export interface DialogFooterProps extends BaseComponentProps {
	padding?: ComponentSize
}

export interface DialogTitleProps
	extends HTMLAttributes<HTMLHeadingElement>,
		BaseComponentProps {
	as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export interface DialogDescriptionProps
	extends HTMLAttributes<HTMLParagraphElement>,
		BaseComponentProps {}

// Multi-select component props
export interface MultiSelectProps extends BaseComponentProps {
	placeholder?: string
	options: MultiSelectOption[]
	value: string[]
	onValueChange: (value: string[]) => void
	onSearch?: (value: string) => void
	isLoading?: boolean
	error?: boolean
	disabled?: boolean
	maxSelections?: number
	searchable?: boolean
	clearable?: boolean
	size?: ComponentSize
}

export interface MultiSelectOption {
	label: string | null
	value: string
	icon?: React.ComponentType<{ className?: string }>
	disabled?: boolean
	group?: string
}

export interface MultiSelectComboboxProps extends BaseComponentProps {
	options: MultiSelectComboboxOption[]
	selected: string[]
	onChange: (selected: string[]) => void
	className?: string
	placeholder?: string
	searchable?: boolean
	clearable?: boolean
	disabled?: boolean
	maxSelections?: number
	size?: ComponentSize
}

export interface MultiSelectComboboxOption {
	label: string
	value: string
	disabled?: boolean
	group?: string
}

// Toast component props
export interface ToastProps extends BaseComponentProps {
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
	duration?: number
	title?: ReactNode
	description?: ReactNode
	action?: ReactNode
	closeButton?: boolean
	variant?: 'default' | 'destructive' | 'secondary' | 'success'
	position?:
		| 'top-left'
		| 'top-center'
		| 'top-right'
		| 'bottom-left'
		| 'bottom-center'
		| 'bottom-right'
}

export interface ToastActionProps extends BaseComponentProps {
	altText: string
	onClick?: () => void
}

// Accordion component props
export interface AccordionProps extends BaseComponentProps {
	type?: 'single' | 'multiple'
	collapsible?: boolean
	value?: string | string[]
	defaultValue?: string | string[]
	onValueChange?: (value: string | string[]) => void
	orientation?: 'horizontal' | 'vertical'
}

export interface AccordionItemProps extends BaseComponentProps {
	value: string
	disabled?: boolean
}

export interface AccordionTriggerProps extends BaseComponentProps {
	disabled?: boolean
}

export interface AccordionContentProps extends BaseComponentProps {
	forceMount?: boolean
}

// Tabs component props
export interface TabsProps extends BaseComponentProps {
	value?: string
	defaultValue?: string
	onValueChange?: (value: string) => void
	orientation?: 'horizontal' | 'vertical'
	activationMode?: 'automatic' | 'manual'
}

export interface TabsListProps extends BaseComponentProps {
	loop?: boolean
}

export interface TabsTriggerProps extends BaseComponentProps {
	value: string
	disabled?: boolean
}

export interface TabsContentProps extends BaseComponentProps {
	value: string
	forceMount?: boolean
}

// Breadcrumb component props
export interface BreadcrumbProps extends BaseComponentProps {
	separator?: ReactNode
	maxItems?: number
	ellipsis?: ReactNode
}

export interface BreadcrumbItemProps extends BaseComponentProps {
	current?: boolean
}

export interface BreadcrumbLinkProps extends BaseComponentProps {
	href?: string
	asChild?: boolean
}

export interface BreadcrumbPageProps extends BaseComponentProps {
	current?: boolean
}

// Collapsible component props
export interface CollapsibleProps extends BaseComponentProps {
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
	disabled?: boolean
}

export interface CollapsibleTriggerProps extends BaseComponentProps {
	asChild?: boolean
	disabled?: boolean
}

export interface CollapsibleContentProps extends BaseComponentProps {
	forceMount?: boolean
}

// Scroll Area component props
export interface ScrollAreaProps extends BaseComponentProps {
	type?: 'auto' | 'always' | 'scroll' | 'hover'
	scrollHideDelay?: number
	dir?: 'ltr' | 'rtl'
}

export interface ScrollBarProps extends BaseComponentProps {
	orientation?: 'horizontal' | 'vertical'
	forceMount?: boolean
}

// Form field props
export interface FormFieldProps {
	label?: string
	helperText?: string
	errorText?: string
	successText?: string
	required?: boolean
	id?: string
	name?: string
	loading?: boolean
	error?: boolean
	success?: boolean
	disabled?: boolean
}

// Icon component props
export interface IconProps extends BaseComponentProps {
	size?: ComponentSize
	color?: string
	strokeWidth?: number
	fill?: string
	stroke?: string
}

// Loading component props
export interface LoadingProps extends BaseComponentProps {
	size?: ComponentSize
	color?: string
	text?: string
	overlay?: boolean
}

// Error boundary props
export interface ErrorBoundaryProps extends BaseComponentProps {
	fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
	onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

// Portal props
export interface PortalProps extends BaseComponentProps {
	container?: Element | null
	forceMount?: boolean
}
