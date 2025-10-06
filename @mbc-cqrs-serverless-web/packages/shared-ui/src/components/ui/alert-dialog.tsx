'use client'

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import type * as React from 'react'

import { cn } from '../../utils/cn'

function AlertDialog({
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
	return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
	return (
		<AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
	)
}

function AlertDialogPortal({
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
	return (
		<AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
	)
}

function AlertDialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
	return (
		<AlertDialogPrimitive.Overlay
			data-slot="alert-dialog-overlay"
			className={cn(
				'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-[var(--mbc-color-neutral-900)]/50 data-[state=closed]:animate-out data-[state=open]:animate-in',
				className,
			)}
			{...props}
		/>
	)
}

function AlertDialogContent({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
	return (
		<AlertDialogPortal>
			<AlertDialogOverlay />
			<AlertDialogPrimitive.Content
				data-slot="alert-dialog-content"
				className={cn(
					'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-[var(--mbc-spacing-4)] rounded-[var(--mbc-radius-lg)] border border-[var(--mbc-color-border)] bg-[var(--mbc-color-background)] p-[var(--mbc-spacing-6)] shadow-[var(--mbc-shadow-lg)] duration-[var(--mbc-transition-duration)] data-[state=closed]:animate-out data-[state=open]:animate-in sm:max-w-lg',
					className,
				)}
				{...props}
			/>
		</AlertDialogPortal>
	)
}

function AlertDialogHeader({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="alert-dialog-header"
			className={cn(
				'flex flex-col gap-[var(--mbc-spacing-2)] text-center sm:text-left',
				className,
			)}
			{...props}
		/>
	)
}

function AlertDialogFooter({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="alert-dialog-footer"
			className={cn(
				'flex flex-col-reverse gap-[var(--mbc-spacing-2)] sm:flex-row sm:justify-end',
				className,
			)}
			{...props}
		/>
	)
}

function AlertDialogTitle({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
	return (
		<AlertDialogPrimitive.Title
			data-slot="alert-dialog-title"
			className={cn(
				'font-[var(--mbc-text-heading-2--font-weight)] text-[length:var(--mbc-text-heading-2)] leading-[var(--mbc-text-heading-2--line-height)]',
				className,
			)}
			{...props}
		/>
	)
}

function AlertDialogDescription({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
	return (
		<AlertDialogPrimitive.Description
			data-slot="alert-dialog-description"
			className={cn(
				'text-[length:var(--mbc-text-body)] leading-[var(--mbc-text-body--line-height)]',
				className,
			)}
			{...props}
		/>
	)
}

function AlertDialogAction({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
	return (
		<AlertDialogPrimitive.Action
			className={cn(
				'inline-flex h-10 items-center justify-center rounded-md bg-[var(--mbc-color-primary)] px-4 py-2 font-medium text-[var(--mbc-color-primary-foreground)] text-sm ring-offset-background transition-colors hover:bg-[var(--mbc-color-primary)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
				className,
			)}
			{...props}
		/>
	)
}

function AlertDialogCancel({
	className,
	...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
	return (
		<AlertDialogPrimitive.Cancel
			className={cn(
				'mt-2 inline-flex h-10 items-center justify-center rounded-md border border-[var(--mbc-color-border)] bg-background px-4 py-2 font-medium text-sm ring-offset-background transition-colors hover:bg-[var(--mbc-color-accent)] hover:text-[var(--mbc-color-accent-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:mt-0',
				className,
			)}
			{...props}
		/>
	)
}

export {
	AlertDialog,
	AlertDialogPortal,
	AlertDialogOverlay,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel,
}
