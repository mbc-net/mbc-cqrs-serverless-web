'use client'

import type * as React from 'react'

import { cn } from '../../utils/cn'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="skeleton"
			className={cn(
				'animate-pulse rounded-[var(--mbc-radius-md)] bg-[var(--mbc-color-accent)]',
				className,
			)}
			{...props}
		/>
	)
}

export { Skeleton }
