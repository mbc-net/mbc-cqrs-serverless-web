'use client'

import * as SheetPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import type * as React from 'react'

import { cn } from '../../utils/cn'

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
	return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
	...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
	return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
	...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
	return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
	...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
	return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
	className,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
	return (
		<SheetPrimitive.Overlay
			data-slot="sheet-overlay"
			className={cn(
				'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-[var(--mbc-color-neutral-900)]/50 data-[state=closed]:animate-out data-[state=open]:animate-in',
				className,
			)}
			{...props}
		/>
	)
}

function SheetContent({
	className,
	children,
	side = 'right',
	...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
	side?: 'top' | 'right' | 'bottom' | 'left'
}) {
	return (
		<SheetPortal>
			<SheetOverlay />
			<SheetPrimitive.Content
				data-slot="sheet-content"
				className={cn(
					'fixed z-50 flex flex-col gap-[var(--mbc-spacing-4)] bg-[var(--mbc-color-background)] shadow-[var(--mbc-shadow-lg)] transition ease-[var(--mbc-transition-easing)] data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:duration-[var(--mbc-transition-duration)] data-[state=open]:duration-[var(--mbc-transition-duration)]',
					side === 'right' &&
						'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-[var(--mbc-color-border)] border-l sm:max-w-sm',
					side === 'left' &&
						'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-[var(--mbc-color-border)] border-r sm:max-w-sm',
					side === 'top' &&
						'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-[var(--mbc-color-border)] border-b',
					side === 'bottom' &&
						'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-[var(--mbc-color-border)] border-t',
					className,
				)}
				{...props}
			>
				{children}
				<SheetPrimitive.Close className="absolute top-[var(--mbc-spacing-10)] right-[var(--mbc-spacing-10)] rounded-[var(--mbc-radius-xs)] opacity-70 ring-offset-[var(--mbc-color-background)] transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-[var(--mbc-color-ring)] focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-[var(--mbc-color-secondary)]">
					<XIcon className="size-4" />
					<span className="sr-only">Close</span>
				</SheetPrimitive.Close>
			</SheetPrimitive.Content>
		</SheetPortal>
	)
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="sheet-header"
			className={cn(
				'flex flex-col gap-[var(--mbc-spacing-1)] p-[var(--mbc-spacing-4)]',
				className,
			)}
			{...props}
		/>
	)
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="sheet-footer"
			className={cn(
				'mt-auto flex flex-col gap-[var(--mbc-spacing-2)] p-[var(--mbc-spacing-4)]',
				className,
			)}
			{...props}
		/>
	)
}

function SheetTitle({
	className,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
	return (
		<SheetPrimitive.Title
			data-slot="sheet-title"
			className={cn(
				'font-[var(--mbc-text-heading-2--font-weight)] text-[length:var(--mbc-text-heading-2)] text-[var(--mbc-color-foreground)] leading-[var(--mbc-text-heading-2--line-height)]',
				className,
			)}
			{...props}
		/>
	)
}

function SheetDescription({
	className,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
	return (
		<SheetPrimitive.Description
			data-slot="sheet-description"
			className={cn(
				'text-[length:var(--mbc-text-body)] text-[var(--mbc-color-muted-foreground)] leading-[var(--mbc-text-body--line-height)]',
				className,
			)}
			{...props}
		/>
	)
}

export {
	Sheet,
	SheetTrigger,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetFooter,
	SheetTitle,
	SheetDescription,
}
