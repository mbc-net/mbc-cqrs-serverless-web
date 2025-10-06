'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import type * as React from 'react'

import { cn } from '../../utils/cn'

function SelectTable({
	...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
	return <SelectPrimitive.Root data-slot="select-table" {...props} />
}

function SelectTableGroup({
	...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
	return <SelectPrimitive.Group data-slot="select-table-group" {...props} />
}

function SelectTableValue({
	...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
	return <SelectPrimitive.Value data-slot="select-table-value" {...props} />
}

function SelectTableTrigger({
	className,
	size = 'default',
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
	size?: 'sm' | 'default'
}) {
	return (
		<SelectPrimitive.Trigger
			data-slot="select-table-trigger"
			data-size={size}
			className={cn(
				'relative flex w-full items-center justify-center gap-[var(--mbc-spacing-2)] border border-transparent bg-transparent px-[var(--mbc-spacing-3)] py-[var(--mbc-spacing-2)] text-[length:var(--mbc-text-sm)] leading-[var(--mbc-text-sm--line-height)] shadow-none outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[var(--mbc-color-destructive)] aria-invalid:ring-[var(--mbc-color-destructive)]/20 data-[size=default]:h-9 data-[size=sm]:h-8 data-[placeholder]:text-[#667085] dark:bg-[var(--mbc-color-input)]/30 dark:aria-invalid:ring-[var(--mbc-color-destructive)]/40 dark:hover:bg-[var(--mbc-color-input)]/50',
				className,
			)}
			{...props}
		>
			{children}
			<SelectPrimitive.Icon asChild>
				<ChevronDownIcon className="-translate-y-1/2 pointer-events-none absolute right-2 h-4 w-4" />
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	)
}

function SelectTableContent({
	className,
	children,
	position = 'popper',
	...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				data-slot="select-table-content"
				className={cn(
					'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-y-auto overflow-x-hidden rounded-[var(--mbc-radius-md)] border border-[var(--mbc-color-border)] bg-[var(--mbc-color-popover)] text-[var(--mbc-color-popover-foreground)] shadow-[var(--mbc-shadow-md)] data-[state=closed]:animate-out data-[state=open]:animate-in',
					position === 'popper' &&
						'data-[side=left]:-translate-x-1 data-[side=top]:-translate-y-1 data-[side=right]:translate-x-1 data-[side=bottom]:translate-y-1',
					className,
				)}
				position={position}
				{...props}
			>
				<SelectTableScrollUpButton />
				<SelectPrimitive.Viewport
					className={cn(
						'p-[var(--mbc-spacing-1)]',
						position === 'popper' &&
							'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1',
					)}
				>
					{children}
				</SelectPrimitive.Viewport>
				<SelectTableScrollDownButton />
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	)
}

function SelectTableLabel({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
	return (
		<SelectPrimitive.Label
			data-slot="select-table-label"
			className={cn(
				'px-[var(--mbc-spacing-2)] py-[var(--mbc-spacing-1)] text-[length:var(--mbc-text-xs)] text-[var(--mbc-color-muted-foreground)] leading-[var(--mbc-text-xs--line-height)]',
				className,
			)}
			{...props}
		/>
	)
}

function SelectTableItem({
	className,
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
	return (
		<SelectPrimitive.Item
			data-slot="select-table-item"
			className={cn(
				`relative flex w-full cursor-default select-none items-center gap-[var(--mbc-spacing-2)] rounded-[var(--mbc-radius-sm)] py-[var(--mbc-spacing-1)] pr-8 pl-[var(--mbc-spacing-2)] text-[length:var(--mbc-text-sm)] leading-[var(--mbc-text-sm--line-height)] outline-hidden hover:bg-[var(--mbc-color-primary)]/25 focus:bg-[var(--mbc-color-primary)]/25 focus:text-[var(--mbc-color-accent-foreground)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*="size-"])]:size-4 [&_svg:not([class*="text-"])]:text-[var(--mbc-color-muted-foreground)] [&_svg]:pointer-events-none [&_svg]:shrink-0 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-[var(--mbc-spacing-2)]`,
				className,
			)}
			{...props}
		>
			<span className="absolute right-[var(--mbc-spacing-2)] flex size-3.5 items-center justify-center">
				<SelectPrimitive.ItemIndicator>
					<CheckIcon className="h-4 w-4" />
				</SelectPrimitive.ItemIndicator>
			</span>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	)
}

function SelectTableSeparator({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
	return (
		<SelectPrimitive.Separator
			data-slot="select-table-separator"
			className={cn(
				'-mx-[var(--mbc-spacing-1)] pointer-events-none my-[var(--mbc-spacing-1)] h-px bg-[var(--mbc-color-border)]',
				className,
			)}
			{...props}
		/>
	)
}

function SelectTableScrollUpButton({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
	return (
		<SelectPrimitive.ScrollUpButton
			data-slot="select-table-scroll-up-button"
			className={cn(
				'flex cursor-default items-center justify-center py-[var(--mbc-spacing-1)]',
				className,
			)}
			{...props}
		>
			<ChevronUpIcon className="h-4 w-4" />
		</SelectPrimitive.ScrollUpButton>
	)
}

function SelectTableScrollDownButton({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
	return (
		<SelectPrimitive.ScrollDownButton
			data-slot="select-table-scroll-down-button"
			className={cn(
				'flex cursor-default items-center justify-center py-[var(--mbc-spacing-1)]',
				className,
			)}
			{...props}
		>
			<ChevronDownIcon className="h-4 w-4" />
		</SelectPrimitive.ScrollDownButton>
	)
}

export {
	SelectTable,
	SelectTableContent,
	SelectTableGroup,
	SelectTableItem,
	SelectTableLabel,
	SelectTableScrollDownButton,
	SelectTableScrollUpButton,
	SelectTableSeparator,
	SelectTableTrigger,
	SelectTableValue,
}
