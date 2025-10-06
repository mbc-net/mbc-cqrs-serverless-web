'use client'

import type * as React from 'react'

import { cn } from '../../utils/cn'

function InputTable({
	className,
	type,
	...props
}: React.ComponentProps<'input'>) {
	return (
		<input
			type={type}
			data-slot="input-table"
			className={cn(
				'flex h-9 w-full min-w-0 rounded-[var(--mbc-radius-md)] border border-transparent bg-transparent px-[var(--mbc-spacing-3)] py-[var(--mbc-spacing-1)] text-[length:var(--mbc-text-base)] leading-[var(--mbc-text-base--line-height)] outline-none transition-[color,box-shadow] selection:bg-[var(--mbc-color-primary)] selection:text-[var(--mbc-color-primary-foreground)] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-[var(--mbc-text-body-bold--font-weight)] file:text-[length:var(--mbc-text-sm)] file:text-[var(--mbc-color-foreground)] file:leading-[var(--mbc-text-sm--line-height)] placeholder:text-[#667085] placeholder:text-[14px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-[length:var(--mbc-text-sm)] md:leading-[var(--mbc-text-sm--line-height)] dark:bg-[var(--mbc-color-input)]/30',
				'aria-invalid:border-[var(--mbc-color-destructive)] aria-invalid:ring-[var(--mbc-color-destructive)]/20 dark:aria-invalid:ring-[var(--mbc-color-destructive)]/40',
				className,
			)}
			{...props}
		/>
	)
}

export { InputTable }
