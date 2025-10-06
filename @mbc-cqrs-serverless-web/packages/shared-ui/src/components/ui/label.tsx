'use client'

import * as LabelPrimitive from '@radix-ui/react-label'
import * as React from 'react'
import { cn } from '../../utils/cn'

const Label = React.forwardRef<
	React.ElementRef<typeof LabelPrimitive.Root>,
	React.ComponentProps<typeof LabelPrimitive.Root> & { required?: boolean }
>(({ className, children, required, ...props }, ref) => (
	<LabelPrimitive.Root
		ref={ref}
		data-slot="label"
		className={cn(
			'flex select-none items-center font-[var(--mbc-text-body-bold--font-weight)] text-[length:var(--mbc-text-body)] leading-[var(--mbc-text-body--line-height)] peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
			className,
		)}
		{...props}
	>
		{children}
		{required && (
			<span className="ml-[var(--mbc-spacing-1)] text-[var(--mbc-color-destructive)]">
				*
			</span>
		)}
	</LabelPrimitive.Root>
))

Label.displayName = LabelPrimitive.Root.displayName

export { Label }
