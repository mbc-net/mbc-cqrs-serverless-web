'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import type * as React from 'react'

import { cn } from '../../utils/cn'

function Dialog({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
	return (
		<DialogPrimitive.Overlay
			data-slot="dialog-overlay"
			className={cn(
				'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-[var(--mbc-color-neutral-900)]/50 data-[state=closed]:animate-out data-[state=open]:animate-in',
				className,
			)}
			{...props}
		/>
	)
}

function DialogContent({
	className,
	children,
	showCloseButton = true,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
	showCloseButton?: boolean
}) {
	return (
		<DialogPortal data-slot="dialog-portal">
			<DialogOverlay />
			<DialogPrimitive.Content
				data-slot="dialog-content"
				className={cn(
					'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-[var(--mbc-spacing-4)] rounded-[var(--mbc-radius-lg)] border border-[var(--mbc-color-border)] bg-[var(--mbc-color-background)] p-[var(--mbc-spacing-6)] shadow-[var(--mbc-shadow-lg)] duration-[var(--mbc-transition-duration)] data-[state=closed]:animate-out data-[state=open]:animate-in sm:max-w-lg',
					className,
				)}
				{...props}
			>
				{children}
				{showCloseButton && (
					<DialogPrimitive.Close
						data-slot="dialog-close"
						className="absolute top-[var(--mbc-spacing-4)] right-[var(--mbc-spacing-4)] cursor-pointer rounded-[var(--mbc-radius-xs)] opacity-70 ring-offset-[var(--mbc-color-background)] transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-[var(--mbc-color-ring)] focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-[var(--mbc-color-accent)] data-[state=open]:text-[var(--mbc-color-muted-foreground)] [&_svg:not([class*='size-'])]:size-6 [&_svg]:pointer-events-none [&_svg]:shrink-0"
					>
						<XIcon className="h-6 w-6" />
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				)}
			</DialogPrimitive.Content>
		</DialogPortal>
	)
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="dialog-header"
			className={cn(
				'flex flex-col gap-[var(--mbc-spacing-2)] text-center sm:text-left',
				className,
			)}
			{...props}
		/>
	)
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="dialog-footer"
			className={cn(
				'flex flex-col-reverse gap-[var(--mbc-spacing-2)] sm:flex-row sm:justify-end',
				className,
			)}
			{...props}
		/>
	)
}

function DialogTitle({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
	return (
		<DialogPrimitive.Title
			data-slot="dialog-title"
			className={cn(
				'font-[var(--mbc-text-heading-2--font-weight)] text-[length:var(--mbc-text-heading-2)] leading-[var(--mbc-text-heading-2--line-height)]',
				className,
			)}
			{...props}
		/>
	)
}

function DialogDescription({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			className={cn(
				'text-[length:var(--mbc-text-body)] text-[var(--mbc-color-muted-foreground)] leading-[var(--mbc-text-body--line-height)]',
				className,
			)}
			{...props}
		/>
	)
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
}
