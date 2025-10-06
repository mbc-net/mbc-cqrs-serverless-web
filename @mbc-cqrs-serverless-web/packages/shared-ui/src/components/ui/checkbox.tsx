import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import type * as React from 'react'
import { cn } from '../../utils/cn'

function Checkbox({
	className,
	...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
	return (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			className={cn(
				'peer size-[19px] shrink-0 rounded-[var(--mbc-radius-sm)] border border-[var(--mbc-color-border)] bg-[var(--mbc-color-input)] shadow-[var(--mbc-shadow-sm)] outline-none transition-shadow focus-visible:border-[var(--mbc-color-ring)] focus-visible:ring-[3px] focus-visible:ring-[var(--mbc-color-ring)]/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[var(--mbc-color-destructive)] aria-invalid:ring-[var(--mbc-color-destructive)]/20 data-[state=checked]:border-[var(--mbc-color-primary)] data-[state=checked]:bg-[var(--mbc-color-primary)] data-[state=checked]:text-[var(--mbc-color-primary-foreground)]',
				className,
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				data-slot="checkbox-indicator"
				className="flex items-center justify-center text-current transition-none"
			>
				<Check className="size-4" />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	)
}

export { Checkbox }
