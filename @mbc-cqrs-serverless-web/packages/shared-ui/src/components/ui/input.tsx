'use client'

import { cva } from 'class-variance-authority'
import { AlertCircle, Search } from 'lucide-react'
import * as React from 'react'
import { cn } from '../../utils/cn'

type VariantProps<T> = T extends (...args: any) => any
	? Parameters<T>[0]
	: never

const inputVariants = cva(
	[
		'flex w-full min-w-0 rounded-[var(--mbc-radius-md)] border border-[var(--mbc-color-border)] bg-[var(--mbc-color-input)] shadow-[var(--mbc-shadow-sm)] transition-[color,box-shadow] outline-none',
		'file:border-0 file:bg-transparent file:text-[var(--mbc-color-foreground)] file:font-[var(--mbc-text-body--font-weight)]',
		'placeholder:text-[var(--mbc-color-muted-foreground)]',
		'selection:bg-[var(--mbc-color-primary)] selection:text-[var(--mbc-color-primary-foreground)]',
		'disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50',
		'focus-visible:border-[var(--mbc-color-ring)] focus-visible:ring-2 focus-visible:ring-[var(--mbc-color-ring)]/40 focus-visible:shadow-[var(--mbc-shadow-md)]',
		'aria-invalid:border-[var(--mbc-color-destructive)] aria-invalid:ring-2 aria-invalid:ring-[var(--mbc-color-destructive)]/20',
	],
	{
		variants: {
			size: {
				sm: 'h-8 px-[var(--mbc-spacing-2)] py-[var(--mbc-spacing-1)] text-[length:var(--mbc-text-caption)] leading-[var(--mbc-text-caption--line-height)] file:h-6 file:text-[length:var(--mbc-text-caption)] file:leading-[var(--mbc-text-caption--line-height)] placeholder:text-[length:var(--mbc-text-caption)] placeholder:leading-[var(--mbc-text-caption--line-height)]',
				md: 'h-9 px-[var(--mbc-spacing-3)] py-[var(--mbc-spacing-1)] text-[length:var(--mbc-text-body)] leading-[var(--mbc-text-body--line-height)] file:h-7 file:text-[length:var(--mbc-text-body)] file:leading-[var(--mbc-text-body--line-height)] placeholder:text-[length:var(--mbc-text-body)] placeholder:leading-[var(--mbc-text-body--line-height)]',
				'extra-md':
					'h-10 px-[var(--mbc-spacing-3)] py-[var(--mbc-spacing-2)] text-[length:var(--mbc-text-body)] leading-[var(--mbc-text-body--line-height)] file:h-8 file:text-[length:var(--mbc-text-body)] file:leading-[var(--mbc-text-body--line-height)] placeholder:text-[length:var(--mbc-text-body)] placeholder:leading-[var(--mbc-text-body--line-height)]',
				lg: 'h-[44px] px-[var(--mbc-spacing-4)] py-[var(--mbc-spacing-2)] text-[length:var(--mbc-text-heading-3)] leading-[var(--mbc-text-heading-3--line-height)] file:h-8 file:text-[length:var(--mbc-text-heading-3)] file:leading-[var(--mbc-text-heading-3--line-height)] placeholder:text-[length:var(--mbc-text-heading-3)] placeholder:leading-[var(--mbc-text-heading-3--line-height)]',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
)

const Input = React.forwardRef<
	HTMLInputElement,
	Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> &
		VariantProps<typeof inputVariants> & {
			showIconError?: boolean
			showSearchIcon?: boolean
		}
>(
	(
		{ className, type, size, showSearchIcon, showIconError = true, ...props },
		ref,
	) => {
		const isInvalid = props['aria-invalid'] === 'true'

		return (
			<div className="relative w-full">
				<input
					type={type}
					className={cn(inputVariants({ size, className }))}
					ref={ref}
					{...props}
				/>

				{showSearchIcon && (
					<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-[var(--mbc-spacing-3)]">
						<Search className="h-5 w-5 text-[var(--mbc-color-muted-foreground)]" />
					</div>
				)}

				{!!isInvalid && (
					<div
						className={cn(
							'pointer-events-none absolute inset-y-0 right-0 flex items-center pr-[var(--mbc-spacing-3)]',
							size === 'lg' && 'translate-y-[4px]',
						)}
					>
						<AlertCircle className="h-5 w-5 text-[var(--mbc-color-destructive)]" />
					</div>
				)}
			</div>
		)
	},
)
Input.displayName = 'Input'

export { Input, inputVariants }
