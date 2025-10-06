import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '../../utils/cn'

const badgeVariants = cva(
	'inline-flex items-center justify-center rounded-[var(--mbc-radius-2xl)] border px-[var(--mbc-spacing-4)] py-[var(--mbc-spacing-2)] text-[length:var(--mbc-text-caption)] leading-[var(--mbc-text-caption--line-height)] w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-[var(--mbc-spacing-1)] [&>svg]:pointer-events-none focus-visible:border-[var(--mbc-color-ring)] focus-visible:ring-[var(--mbc-color-ring)]/50 focus-visible:ring-[3px] aria-invalid:ring-[var(--mbc-color-destructive)]/20 dark:aria-invalid:ring-[var(--mbc-color-destructive)]/40 aria-invalid:border-[var(--mbc-color-destructive)] transition-[color,box-shadow] overflow-hidden font-[var(--mbc-text-body-bold--font-weight)]',
	{
		variants: {
			variant: {
				default:
					'border-transparent bg-[var(--mbc-color-neutral-300)] text-[var(--mbc-color-neutral-900)] [a&]:bg-[var(--mbc-color-accent)] [a&]:text-[var(--mbc-color-accent-foreground)] [a&]:hover:bg-[var(--mbc-color-primary)]/90',
				secondary:
					'border-transparent bg-[var(--mbc-color-secondary)] text-[var(--mbc-color-secondary-foreground)] [a&]:hover:bg-[var(--mbc-color-secondary)]/90',
				destructive:
					'border-transparent bg-[var(--mbc-color-destructive)] text-[var(--mbc-color-destructive-foreground)] [a&]:hover:bg-[var(--mbc-color-destructive)]/90 focus-visible:ring-[var(--mbc-color-destructive)]/20 dark:focus-visible:ring-[var(--mbc-color-destructive)]/40 dark:bg-[var(--mbc-color-destructive)]/60',
				outline:
					'text-[var(--mbc-color-foreground)] [a&]:hover:bg-[var(--mbc-color-accent)] [a&]:hover:text-[var(--mbc-color-accent-foreground)]',
				selected:
					'bg-[var(--mbc-color-primary)] border-[var(--mbc-color-primary)] border text-[var(--mbc-color-primary-foreground)] text-[length:var(--mbc-text-caption)] leading-[var(--mbc-text-caption--line-height)] select-none font-[var(--mbc-text-body-bold--font-weight)] cursor-pointer',
				un_selected:
					'select-none border border-[var(--mbc-color-neutral-500)] bg-[var(--mbc-color-neutral-200)] text-[var(--mbc-color-neutral-900)] hover:bg-[var(--mbc-color-neutral-300)] cursor-pointer',
				active:
					'rounded-[var(--mbc-radius-xl)] bg-[var(--mbc-color-success-50)] flex py-[var(--mbc-spacing-0)] px-[var(--mbc-spacing-2)] justify-center items-center text-[var(--mbc-color-success-700)] text-[length:var(--mbc-text-body)] leading-[var(--mbc-text-body--line-height)] border-none',
				invited:
					'rounded-[var(--mbc-radius-xl)] bg-[var(--mbc-color-warning-50)] flex py-[var(--mbc-spacing-0)] px-[var(--mbc-spacing-2)] justify-center items-center text-[var(--mbc-color-warning-700)] text-[length:var(--mbc-text-body)] leading-[var(--mbc-text-body--line-height)] border-none',
				inactive:
					'rounded-[var(--mbc-radius-xl)] bg-[var(--mbc-color-error-50)] flex py-[var(--mbc-spacing-0)] px-[var(--mbc-spacing-2)] justify-center items-center text-[var(--mbc-color-error-700)] text-[length:var(--mbc-text-body)] leading-[var(--mbc-text-body--line-height)] border-none',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
)

function Badge({
	className,
	variant,
	asChild = false,
	...props
}: React.ComponentProps<'span'> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : 'span'

	return (
		<Comp
			data-slot="badge"
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	)
}

export { Badge, badgeVariants }
