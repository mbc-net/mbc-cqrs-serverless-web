'use client'

import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import type * as React from 'react'
import { cn } from '../../utils/cn'

type VariantProps<T> = T extends (...args: any) => any
	? Parameters<T>[0]
	: never

const buttonVariants = cva(
	"disabled:pointer-events-none inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					'bg-[var(--mbc-color-primary)] text-[var(--mbc-color-primary-foreground)] shadow-sm hover:bg-[var(--mbc-color-primary)]/90',
				destructive:
					'bg-[var(--mbc-color-destructive)] text-[var(--mbc-color-destructive-foreground)] shadow-sm hover:bg-[var(--mbc-color-destructive)]/90 focus-visible:ring-[var(--mbc-color-destructive)]/20',
				outline:
					'border border-[var(--mbc-color-border)] text-[var(--mbc-color-foreground)] bg-[var(--mbc-color-background)] shadow-sm hover:bg-[var(--mbc-color-muted)] hover:text-[var(--mbc-color-foreground)]',
				secondary:
					'bg-[var(--mbc-color-secondary)] text-[var(--mbc-color-secondary-foreground)] shadow-sm hover:bg-[var(--mbc-color-secondary)]/80',
				ghost:
					'hover:bg-[var(--mbc-color-muted)] hover:text-[var(--mbc-color-accent-foreground)]',
				link: 'text-[var(--mbc-color-primary)] underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-9 px-4 py-2 has-[>svg]:px-3',
				sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
				lg: 'h-10 rounded-md px-6 has-[>svg]:px-4 text-base',
				icon: 'size-9',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
)

function Button({
	className,
	variant,
	size,
	asChild = false,
	loading = false,
	children,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean
		loading?: boolean
	}) {
	const Comp = asChild ? Slot : 'button'

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			disabled={loading || props.disabled}
			{...props}
		>
			{loading && <Loader2 className="animate-spin" />}
			{children}
		</Comp>
	)
}

export { Button, buttonVariants }
