'use client'

import {
	ChevronLeftIcon,
	ChevronRightIcon,
	MoreHorizontalIcon,
} from 'lucide-react'
import type * as React from 'react'

import { cn } from '../../utils/cn'

function PaginationBase({ className, ...props }: React.ComponentProps<'nav'>) {
	return (
		<nav
			role="navigation"
			aria-label="pagination"
			data-slot="pagination"
			className={cn('flex gap-[var(--mbc-spacing-2)]', className)}
			{...props}
		/>
	)
}

function PaginationContent({
	className,
	...props
}: React.ComponentProps<'ul'>) {
	return (
		<ul
			data-slot="pagination-content"
			className={cn(
				'flex flex-row items-center gap-[var(--mbc-spacing-2)]',
				className,
			)}
			{...props}
		/>
	)
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
	return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
	isActive?: boolean
	size?: 'default' | 'sm' | 'lg' | 'icon'
} & React.ComponentProps<'a'>

function PaginationLink({
	className,
	isActive,
	size = 'icon',
	...props
}: PaginationLinkProps) {
	const baseClasses =
		'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

	const sizeClasses = {
		default: 'h-10 px-4 py-2',
		sm: 'h-9 rounded-md px-3',
		lg: 'h-11 rounded-md px-8',
		icon: 'h-10 w-10',
	}

	const variantClasses = isActive
		? 'border border-[var(--mbc-color-border)] bg-[var(--mbc-color-background)] text-[var(--mbc-color-foreground)] hover:bg-[var(--mbc-color-accent)] hover:text-[var(--mbc-color-accent-foreground)]'
		: 'border border-transparent bg-transparent text-[var(--mbc-color-foreground)] hover:bg-[var(--mbc-color-accent)] hover:text-[var(--mbc-color-accent-foreground)]'

	return (
		<a
			aria-current={isActive ? 'page' : undefined}
			data-slot="pagination-link"
			data-active={isActive}
			className={cn(
				baseClasses,
				sizeClasses[size],
				variantClasses,
				'h-[var(--mbc-spacing-8)] w-[var(--mbc-spacing-8)] border text-[length:var(--mbc-text-body)] text-[var(--mbc-color-neutral-900)] leading-[var(--mbc-text-body--line-height)] hover:border-[var(--mbc-color-primary)] hover:bg-[var(--mbc-color-background)] hover:text-[var(--mbc-color-primary)]',
				className,
			)}
			{...props}
		/>
	)
}

function PaginationPrevious({
	className,
	...props
}: React.ComponentProps<typeof PaginationLink>) {
	return (
		<PaginationLink
			aria-label="Go to previous page"
			className={cn(
				'h-[var(--mbc-spacing-8)] w-[var(--mbc-spacing-8)] gap-[var(--mbc-spacing-1)] border',
				className,
			)}
			{...props}
		>
			<ChevronLeftIcon className="h-4 w-4" />
		</PaginationLink>
	)
}

function PaginationNext({
	className,
	...props
}: React.ComponentProps<typeof PaginationLink>) {
	return (
		<PaginationLink
			aria-label="Go to next page"
			className={cn(
				'h-[var(--mbc-spacing-8)] w-[var(--mbc-spacing-8)] gap-[var(--mbc-spacing-1)] border',
				className,
			)}
			{...props}
		>
			<ChevronRightIcon className="h-4 w-4" />
		</PaginationLink>
	)
}

function PaginationEllipsis({
	className,
	...props
}: React.ComponentProps<'span'>) {
	return (
		<span
			aria-hidden
			data-slot="pagination-ellipsis"
			className={cn(
				'flex size-[var(--mbc-spacing-9)] items-center justify-center',
				className,
			)}
			{...props}
		>
			<MoreHorizontalIcon className="h-4 w-4" />
			<span className="sr-only">More pages</span>
		</span>
	)
}

export {
	PaginationBase,
	PaginationContent,
	PaginationLink,
	PaginationItem,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
}
