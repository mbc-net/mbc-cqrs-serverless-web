'use client'

import type * as React from 'react'

import { cn } from '../../utils/cn'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card"
			className={cn(
				'flex flex-col gap-[var(--mbc-spacing-6)] rounded-[var(--mbc-radius-xl)] border border-[var(--mbc-color-border)] bg-[var(--mbc-color-card)] py-[var(--mbc-spacing-6)] text-[var(--mbc-color-card-foreground)] shadow-[var(--mbc-shadow-sm)]',
				className,
			)}
			{...props}
		/>
	)
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				'@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-[var(--mbc-spacing-1)] px-[var(--mbc-spacing-6)] has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-[var(--mbc-spacing-6)]',
				className,
			)}
			{...props}
		/>
	)
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-title"
			className={cn(
				'font-[var(--mbc-text-heading-3--font-weight)] leading-[var(--mbc-text-heading-3--line-height)]',
				className,
			)}
			{...props}
		/>
	)
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-description"
			className={cn(
				'text-[length:var(--mbc-text-body)] leading-[var(--mbc-text-body--line-height)]',
				className,
			)}
			{...props}
		/>
	)
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-action"
			className={cn(
				'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
				className,
			)}
			{...props}
		/>
	)
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-content"
			className={cn('px-[var(--mbc-spacing-6)]', className)}
			{...props}
		/>
	)
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-footer"
			className={cn(
				'flex items-center px-[var(--mbc-spacing-6)] [.border-t]:pt-[var(--mbc-spacing-6)]',
				className,
			)}
			{...props}
		/>
	)
}

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardAction,
	CardDescription,
	CardContent,
}
