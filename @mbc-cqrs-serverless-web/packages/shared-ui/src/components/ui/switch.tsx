import * as SwitchPrimitive from '@radix-ui/react-switch'
import type * as React from 'react'
import { cn } from '../../utils/cn'

function Switch({
	className,
	...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
	return (
		<SwitchPrimitive.Root
			data-slot="switch"
			className={cn(
				'peer inline-flex h-[1.15rem] w-8 shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-[var(--mbc-shadow-sm)] outline-none transition-all focus-visible:border-[var(--mbc-color-ring)] focus-visible:ring-[3px] focus-visible:ring-[var(--mbc-color-ring)]/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--mbc-color-primary)] data-[state=unchecked]:bg-[var(--mbc-color-muted)]',
				className,
			)}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-slot="switch-thumb"
				className={cn(
					'pointer-events-none block size-4 rounded-full bg-[var(--mbc-color-background)] ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-[var(--mbc-color-primary-foreground)] data-[state=unchecked]:bg-[var(--mbc-color-neutral-300)]',
				)}
			/>
		</SwitchPrimitive.Root>
	)
}

export { Switch }
