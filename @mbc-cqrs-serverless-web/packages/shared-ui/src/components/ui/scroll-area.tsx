'use client'

import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import type * as React from 'react'

import { cn } from '../../utils/cn'

function ScrollArea({
	className,
	children,
	...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
	return (
		<ScrollAreaPrimitive.Root
			data-slot="scroll-area"
			className={cn('relative', className)}
			{...props}
		>
			<ScrollAreaPrimitive.Viewport
				data-slot="scroll-area-viewport"
				className="size-full rounded-[inherit] outline-none transition-[color,box-shadow] focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-[var(--mbc-color-ring)]/50"
			>
				{children}
			</ScrollAreaPrimitive.Viewport>
			<ScrollBar />
			<ScrollAreaPrimitive.Corner />
		</ScrollAreaPrimitive.Root>
	)
}

function ScrollBar({
	className,
	orientation = 'vertical',
	...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
	return (
		<ScrollAreaPrimitive.ScrollAreaScrollbar
			data-slot="scroll-area-scrollbar"
			orientation={orientation}
			className={cn(
				'flex touch-none select-none p-px transition-colors',
				orientation === 'vertical' &&
					'h-full w-[var(--mbc-spacing-2)] border-l border-l-transparent',
				orientation === 'horizontal' &&
					'h-[var(--mbc-spacing-2)] flex-col border-t border-t-transparent',
				className,
			)}
			{...props}
		>
			<ScrollAreaPrimitive.ScrollAreaThumb
				data-slot="scroll-area-thumb"
				className="relative flex-1 rounded-full bg-[var(--mbc-color-border)]"
			/>
		</ScrollAreaPrimitive.ScrollAreaScrollbar>
	)
}

export { ScrollArea, ScrollBar }
