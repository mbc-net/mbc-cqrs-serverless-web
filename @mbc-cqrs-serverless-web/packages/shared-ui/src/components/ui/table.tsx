'use client'

import type * as React from 'react'

import { cn } from '../../utils/cn'

function Table({ className, ...props }: React.ComponentProps<'table'>) {
	return (
		<div
			data-slot="table-container"
			className="relative w-full overflow-x-auto rounded-[var(--mbc-radius-md)] border border-[var(--mbc-color-border)]"
		>
			<table
				data-slot="table"
				className={cn(
					'w-full caption-bottom rounded-[var(--mbc-radius-md)] text-[length:var(--mbc-text-body)] leading-[var(--mbc-text-body--line-height)]',
					className,
				)}
				{...props}
			/>
		</div>
	)
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
	return (
		<thead
			data-slot="table-header"
			className={cn(
				'sticky bg-[var(--mbc-color-neutral-50)] [&_tr]:border-[var(--mbc-color-border)] [&_tr]:border-b',
				className,
			)}
			{...props}
		/>
	)
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
	return (
		<tbody
			data-slot="table-body"
			className={cn('[&_tr:last-child]:border-0', className)}
			{...props}
		/>
	)
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
	return (
		<tfoot
			data-slot="table-footer"
			className={cn(
				'border-[var(--mbc-color-border)] border-t bg-[var(--mbc-color-muted)]/50 font-[var(--mbc-text-body-bold--font-weight)] [&>tr]:last:border-b-0',
				className,
			)}
			{...props}
		/>
	)
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
	return (
		<tr
			data-slot="table-row"
			className={cn(
				'max-w-[calc(100%-200px)] border-[var(--mbc-color-border)] border-b transition-colors hover:bg-[var(--mbc-color-muted)]/50 data-[state=selected]:bg-[var(--mbc-color-muted)]',
				className,
			)}
			{...props}
		/>
	)
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
	return (
		<th
			data-slot="table-head"
			className={cn(
				'h-[var(--mbc-spacing-11)] whitespace-nowrap border-[var(--mbc-color-border)] border-r px-[var(--mbc-spacing-3)] text-left align-middle font-[var(--mbc-text-body-bold--font-weight)] text-[length:var(--mbc-text-body)] text-[var(--mbc-color-neutral-600)] leading-[var(--mbc-text-body--line-height)] last:border-r-0 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
				className,
			)}
			{...props}
		/>
	)
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
	return (
		<td
			data-slot="table-cell"
			className={cn(
				'border-[var(--mbc-color-border)] border-r px-[var(--mbc-spacing-3)] py-[var(--mbc-spacing-2)] last:border-r-0 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
				className,
			)}
			{...props}
		/>
	)
}

function TableCaption({
	className,
	...props
}: React.ComponentProps<'caption'>) {
	return (
		<caption
			data-slot="table-caption"
			className={cn(
				'mt-[var(--mbc-spacing-4)] text-[length:var(--mbc-text-body)] text-[var(--mbc-color-muted-foreground)] leading-[var(--mbc-text-body--line-height)]',
				className,
			)}
			{...props}
		/>
	)
}

export {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableCaption,
}
