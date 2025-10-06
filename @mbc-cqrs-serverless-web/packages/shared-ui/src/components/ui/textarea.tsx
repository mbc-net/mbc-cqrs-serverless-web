import type * as React from 'react'
import { cn } from '../../utils/cn'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				'field-sizing-content flex min-h-16 w-full rounded-[var(--mbc-radius-md)] border border-[var(--mbc-color-border)] bg-[var(--mbc-color-input)] px-[var(--mbc-spacing-3)] py-[var(--mbc-spacing-2)] text-[length:var(--mbc-text-body)] leading-[var(--mbc-text-body--line-height)] shadow-[var(--mbc-shadow-sm)] outline-none transition-[color,box-shadow] placeholder:text-[var(--mbc-color-muted-foreground)] focus-visible:border-[var(--mbc-color-ring)] focus-visible:shadow-[var(--mbc-shadow-md)] focus-visible:ring-2 focus-visible:ring-[var(--mbc-color-ring)]/40 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[var(--mbc-color-destructive)] aria-invalid:ring-2 aria-invalid:ring-[var(--mbc-color-destructive)]/20',
				className,
			)}
			{...props}
		/>
	)
}

export { Textarea }
