'use client'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDownIcon } from 'lucide-react'
import type * as React from 'react'

import { cn } from '../../utils/cn'

function Accordion({
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
	return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
	className,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
	return (
		<AccordionPrimitive.Item
			data-slot="accordion-item"
			className={cn(
				'border-[var(--mbc-color-border)] border-b last:border-b-0',
				className,
			)}
			{...props}
		/>
	)
}

function AccordionTrigger({
	className,
	children,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
	return (
		<AccordionPrimitive.Header className="flex">
			<AccordionPrimitive.Trigger
				data-slot="accordion-trigger"
				className={cn(
					'flex flex-1 items-start justify-between gap-[var(--mbc-spacing-4)] rounded-[var(--mbc-radius-md)] py-[var(--mbc-spacing-4)] text-left font-[var(--mbc-text-body-bold--font-weight)] text-[length:var(--mbc-text-body)] text-[var(--mbc-color-foreground)] leading-[var(--mbc-text-body--line-height)] outline-none transition-all hover:underline focus-visible:border-[var(--mbc-color-ring)] focus-visible:ring-[3px] focus-visible:ring-[var(--mbc-color-ring)]/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
					className,
				)}
				{...props}
			>
				{children}
				<ChevronDownIcon className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-[var(--mbc-color-muted-foreground)] transition-transform duration-[var(--mbc-transition-duration)]" />
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	)
}

function AccordionContent({
	className,
	children,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
	return (
		<AccordionPrimitive.Content
			data-slot="accordion-content"
			className="overflow-hidden text-[length:var(--mbc-text-body)] leading-[var(--mbc-text-body--line-height)] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
			{...props}
		>
			<div className={cn('pt-0 pb-[var(--mbc-spacing-4)]', className)}>
				{children}
			</div>
		</AccordionPrimitive.Content>
	)
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
