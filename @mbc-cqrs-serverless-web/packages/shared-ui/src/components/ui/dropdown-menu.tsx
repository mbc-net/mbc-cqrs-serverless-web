'use client'

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react'
import type * as React from 'react'

import { cn } from '../../utils/cn'

function DropdownMenu({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
	return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
	return (
		<DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
	)
}

function DropdownMenuTrigger({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
	return (
		<DropdownMenuPrimitive.Trigger
			data-slot="dropdown-menu-trigger"
			{...props}
		/>
	)
}

function DropdownMenuContent({
	className,
	sideOffset = 4,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
	return (
		<DropdownMenuPrimitive.Portal>
			<DropdownMenuPrimitive.Content
				data-slot="dropdown-menu-content"
				sideOffset={sideOffset}
				className={cn(
					'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-y-auto overflow-x-hidden rounded-[var(--mbc-radius-md)] border border-[var(--mbc-color-border)] bg-[var(--mbc-color-popover)] p-[var(--mbc-spacing-1)] text-[var(--mbc-color-popover-foreground)] shadow-[var(--mbc-shadow-md)] data-[state=closed]:animate-out data-[state=open]:animate-in',
					className,
				)}
				{...props}
			/>
		</DropdownMenuPrimitive.Portal>
	)
}

function DropdownMenuGroup({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
	return (
		<DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
	)
}

function DropdownMenuItem({
	className,
	inset,
	variant = 'default',
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
	inset?: boolean
	variant?: 'default' | 'destructive'
}) {
	return (
		<DropdownMenuPrimitive.Item
			data-slot="dropdown-menu-item"
			data-inset={inset}
			data-variant={variant}
			className={cn(
				`data-[variant=destructive]:*:[svg]:!text-[var(--mbc-color-destructive)] relative flex cursor-default select-none items-center gap-[var(--mbc-spacing-2)] rounded-[var(--mbc-radius-md)] px-[var(--mbc-spacing-2)] py-[var(--mbc-spacing-1)] text-[length:var(--mbc-text-sm)] leading-[var(--mbc-text-sm--line-height)] outline-hidden hover:outline-none focus:bg-[var(--mbc-color-primary)]/50 focus:text-black data-[disabled]:pointer-events-none data-[inset]:pl-8 data-[variant=destructive]:text-[var(--mbc-color-destructive)] data-[disabled]:opacity-50 data-[variant=destructive]:focus:bg-[var(--mbc-color-destructive)]/10 data-[variant=destructive]:focus:text-[var(--mbc-color-destructive)] dark:data-[variant=destructive]:focus:bg-[var(--mbc-color-destructive)]/20 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-[var(--mbc-color-muted-foreground)] [&_svg]:pointer-events-none [&_svg]:shrink-0`,
				className,
			)}
			{...props}
		/>
	)
}

function DropdownMenuCheckboxItem({
	className,
	children,
	checked,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
	return (
		<DropdownMenuPrimitive.CheckboxItem
			data-slot="dropdown-menu-checkbox-item"
			className={cn(
				`relative flex cursor-default select-none items-center gap-[var(--mbc-spacing-2)] rounded-[var(--mbc-radius-sm)] py-[var(--mbc-spacing-1)] pr-[var(--mbc-spacing-2)] pl-8 text-[length:var(--mbc-text-sm)] leading-[var(--mbc-text-sm--line-height)] outline-hidden focus:bg-[var(--mbc-color-accent)] focus:text-[var(--mbc-color-accent-foreground)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0`,
				className,
			)}
			checked={checked}
			{...props}
		>
			<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
				<DropdownMenuPrimitive.ItemIndicator>
					<CheckIcon className="h-4 w-4" />
				</DropdownMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</DropdownMenuPrimitive.CheckboxItem>
	)
}

function DropdownMenuRadioGroup({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
	return (
		<DropdownMenuPrimitive.RadioGroup
			data-slot="dropdown-menu-radio-group"
			{...props}
		/>
	)
}

function DropdownMenuRadioItem({
	className,
	children,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
	return (
		<DropdownMenuPrimitive.RadioItem
			data-slot="dropdown-menu-radio-item"
			className={cn(
				`relative flex cursor-default select-none items-center gap-[var(--mbc-spacing-2)] rounded-[var(--mbc-radius-sm)] py-[var(--mbc-spacing-1)] pr-[var(--mbc-spacing-2)] pl-8 text-[length:var(--mbc-text-sm)] leading-[var(--mbc-text-sm--line-height)] outline-hidden focus:bg-[var(--mbc-color-accent)] focus:text-[var(--mbc-color-accent-foreground)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0`,
				className,
			)}
			{...props}
		>
			<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
				<DropdownMenuPrimitive.ItemIndicator>
					<CircleIcon className="h-2 w-2 fill-current" />
				</DropdownMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</DropdownMenuPrimitive.RadioItem>
	)
}

function DropdownMenuLabel({
	className,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label>) {
	return (
		<DropdownMenuPrimitive.Label
			data-slot="dropdown-menu-label"
			className={cn(
				'px-[var(--mbc-spacing-2)] py-[var(--mbc-spacing-1)] font-[var(--mbc-text-body-bold--font-weight)] text-[length:var(--mbc-text-sm)]',
				className,
			)}
			{...props}
		/>
	)
}

function DropdownMenuSeparator({
	className,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
	return (
		<DropdownMenuPrimitive.Separator
			data-slot="dropdown-menu-separator"
			className={cn('-mx-1 my-1 h-px bg-[var(--mbc-color-border)]', className)}
			{...props}
		/>
	)
}

function DropdownMenuShortcut({
	className,
	...props
}: React.ComponentProps<'span'>) {
	return (
		<span
			data-slot="dropdown-menu-shortcut"
			className={cn(
				'ml-auto text-[length:var(--mbc-text-xs)] tracking-widest opacity-60',
				className,
			)}
			{...props}
		/>
	)
}

function DropdownMenuSub({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
	return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
	className,
	inset,
	children,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
	inset?: boolean
}) {
	return (
		<DropdownMenuPrimitive.SubTrigger
			data-slot="dropdown-menu-sub-trigger"
			className={cn(
				'flex cursor-default select-none items-center gap-[var(--mbc-spacing-2)] rounded-[var(--mbc-radius-sm)] px-[var(--mbc-spacing-2)] py-[var(--mbc-spacing-1)] text-[length:var(--mbc-text-sm)] outline-hidden focus:bg-[var(--mbc-color-accent)] data-[state=open]:bg-[var(--mbc-color-accent)] data-[inset]:pl-8 [&_svg:not([class*="size-"])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0',
				className,
			)}
			{...props}
		>
			{children}
			<ChevronRightIcon className="ml-auto h-4 w-4" />
		</DropdownMenuPrimitive.SubTrigger>
	)
}

function DropdownMenuSubContent({
	className,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
	return (
		<DropdownMenuPrimitive.SubContent
			data-slot="dropdown-menu-sub-content"
			className={cn(
				'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-[var(--mbc-radius-md)] border border-[var(--mbc-color-border)] bg-[var(--mbc-color-popover)] p-[var(--mbc-spacing-1)] text-[var(--mbc-color-popover-foreground)] shadow-[var(--mbc-shadow-md)] data-[state=closed]:animate-out data-[state=open]:animate-in',
				className,
			)}
			{...props}
		/>
	)
}

export {
	DropdownMenu,
	DropdownMenuPortal,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuCheckboxItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
}
