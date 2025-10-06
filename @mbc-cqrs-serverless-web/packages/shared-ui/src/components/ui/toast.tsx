'use client'

import * as ToastPrimitives from '@radix-ui/react-toast'
import { type VariantProps, cva } from 'class-variance-authority'
import { X } from 'lucide-react'
import * as React from 'react'
import { cn } from '../../utils/cn'

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Viewport>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Viewport
		ref={ref}
		className={cn(
			'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-[var(--mbc-spacing-4)] sm:top-auto sm:right-0 sm:bottom-0 sm:flex-col md:max-w-[420px]',
			className,
		)}
		{...props}
	/>
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
	'group pointer-events-auto relative flex w-full items-center justify-between space-x-[var(--mbc-spacing-4)] overflow-hidden rounded-[var(--mbc-radius-md)] border p-[var(--mbc-spacing-6)] pr-[var(--mbc-spacing-8)] shadow-[var(--mbc-shadow-lg)] transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
	{
		variants: {
			variant: {
				default:
					'border border-[var(--mbc-color-border)] bg-[var(--mbc-color-background)] text-[var(--mbc-color-foreground)]',
				destructive:
					'destructive group border-[var(--mbc-color-destructive)] bg-[var(--mbc-color-destructive)] text-[var(--mbc-color-destructive-foreground)]',
				secondary:
					'secondary group border-[var(--mbc-color-secondary)] bg-[var(--mbc-color-secondary)] text-[var(--mbc-color-secondary-foreground)]',
				success:
					'success group bg-[var(--mbc-color-success-500)] text-[var(--mbc-color-neutral-50)] border-[var(--mbc-color-success-500)]',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
)

const Toast = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Root>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
		VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
	return (
		<ToastPrimitives.Root
			ref={ref}
			className={cn(toastVariants({ variant }), className)}
			{...props}
		/>
	)
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Action>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Action
		ref={ref}
		className={cn(
			'inline-flex h-[var(--mbc-spacing-8)] shrink-0 items-center justify-center rounded-[var(--mbc-radius-md)] border bg-transparent px-[var(--mbc-spacing-3)] font-[var(--mbc-text-body-bold--font-weight)] text-[length:var(--mbc-text-body)] leading-[var(--mbc-text-body--line-height)] ring-offset-[var(--mbc-color-background)] transition-colors hover:bg-[var(--mbc-color-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--mbc-color-ring)] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-[var(--mbc-color-muted)]/40 group-[.destructive]:focus:ring-[var(--mbc-color-destructive)] group-[.destructive]:hover:border-[var(--mbc-color-destructive)]/30 group-[.destructive]:hover:bg-[var(--mbc-color-destructive)] group-[.destructive]:hover:text-[var(--mbc-color-destructive-foreground)]',
			className,
		)}
		{...props}
	/>
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Close>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Close
		ref={ref}
		className={cn(
			'absolute top-[var(--mbc-spacing-2)] right-[var(--mbc-spacing-2)] rounded-[var(--mbc-radius-md)] p-[var(--mbc-spacing-1)] text-[var(--mbc-color-foreground)]/50 opacity-0 transition-opacity hover:text-[var(--mbc-color-foreground)] focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-[var(--mbc-color-error-300)] group-[.destructive]:focus:ring-[var(--mbc-color-error-400)] group-[.destructive]:focus:ring-offset-[var(--mbc-color-error-600)] group-[.destructive]:hover:text-[var(--mbc-color-error-50)]',
			className,
		)}
		toast-close=""
		{...props}
	>
		<X className="h-4 w-4" />
	</ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Title>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Title
		ref={ref}
		className={cn(
			'font-[var(--mbc-text-body-bold--font-weight)] text-[length:var(--mbc-text-body)] leading-[var(--mbc-text-body--line-height)]',
			className,
		)}
		{...props}
	/>
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Description>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Description
		ref={ref}
		className={cn(
			'text-[length:var(--mbc-text-body)] leading-[var(--mbc-text-body--line-height)] opacity-90',
			className,
		)}
		{...props}
	/>
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
	Toast,
	ToastAction,
	type ToastActionElement,
	ToastClose,
	ToastDescription,
	type ToastProps,
	ToastProvider,
	ToastTitle,
	ToastViewport,
}
