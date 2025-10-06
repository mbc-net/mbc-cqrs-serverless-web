'use client'

import { Slot } from '@radix-ui/react-slot'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import * as React from 'react'

import { cn } from '../../utils/cn'

const BreadcrumbBase = React.forwardRef<
	HTMLElement,
	React.ComponentPropsWithoutRef<'nav'> & {
		separator?: React.ReactNode
	}
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
BreadcrumbBase.displayName = 'BreadcrumbBase'

const BreadcrumbList = React.forwardRef<
	HTMLOListElement,
	React.ComponentPropsWithoutRef<'ol'>
>(({ className, ...props }, ref) => (
	<ol
		ref={ref}
		className={cn(
			'flex items-center break-words text-[length:var(--mbc-text-body)] text-[var(--mbc-color-muted-foreground)] leading-[var(--mbc-text-body--line-height)]',
			className,
		)}
		{...props}
	/>
))
BreadcrumbList.displayName = 'BreadcrumbList'

const BreadcrumbItem = React.forwardRef<
	HTMLLIElement,
	React.ComponentPropsWithoutRef<'li'>
>(({ className, ...props }, ref) => (
	<li
		ref={ref}
		className={cn(
			'inline-flex items-center gap-[var(--mbc-spacing-1)]',
			className,
		)}
		{...props}
	/>
))
BreadcrumbItem.displayName = 'BreadcrumbItem'

const BreadcrumbLink = React.forwardRef<
	HTMLAnchorElement,
	React.ComponentPropsWithoutRef<'a'> & {
		asChild?: boolean
	}
>(({ asChild, className, ...props }, ref) => {
	const Comp = asChild ? Slot : 'a'

	return (
		<Comp
			ref={ref}
			className={cn('text-[var(--mbc-color-muted-foreground)]', className)}
			{...props}
		/>
	)
})
BreadcrumbLink.displayName = 'BreadcrumbLink'

const BreadcrumbPage = React.forwardRef<
	HTMLSpanElement,
	React.ComponentPropsWithoutRef<'span'>
>(({ className, ...props }, ref) => (
	<span
		ref={ref}
		role="link"
		aria-disabled="true"
		aria-current="page"
		className={cn(
			'font-[var(--mbc-text-body--font-weight)] text-[var(--mbc-color-foreground)]',
			className,
		)}
		{...props}
	/>
))
BreadcrumbPage.displayName = 'BreadcrumbPage'

const BreadcrumbSeparator = ({
	children,
	className,
	...props
}: React.ComponentProps<'li'>) => (
	<li
		role="presentation"
		aria-hidden="true"
		className={cn(
			'mx-[var(--mbc-spacing-2)] text-[var(--mbc-color-primary)] [&>svg]:h-3 [&>svg]:w-3',
			className,
		)}
		{...props}
	>
		{children ?? <ChevronRight />}
	</li>
)
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

const BreadcrumbEllipsis = ({
	className,
	...props
}: React.ComponentProps<'span'>) => (
	<span
		role="presentation"
		aria-hidden="true"
		className={cn(
			'flex h-[var(--mbc-spacing-9)] w-[var(--mbc-spacing-9)] items-center justify-center',
			className,
		)}
		{...props}
	>
		<MoreHorizontal className="h-4 w-4" />
		<span className="sr-only">More</span>
	</span>
)
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis'

export {
	BreadcrumbBase,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbPage,
	BreadcrumbSeparator,
	BreadcrumbEllipsis,
}
