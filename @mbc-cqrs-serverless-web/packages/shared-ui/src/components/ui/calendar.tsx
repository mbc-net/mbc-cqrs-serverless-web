'use client'

import * as React from 'react'
import {
	type DayButton,
	DayPicker,
	getDefaultClassNames,
} from 'react-day-picker'

import {
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from 'lucide-react'

import { cn } from '@/utils'
import { Button, buttonVariants } from './button'

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	captionLayout = 'label',
	buttonVariant = 'ghost',
	formatters,
	components,
	...props
}: React.ComponentProps<typeof DayPicker> & {
	buttonVariant?: React.ComponentProps<typeof Button>['variant']
}) {
	const defaultClassNames = getDefaultClassNames()

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn(
				'group/calendar bg-[var(--mbc-color-background)] p-[var(--mbc-spacing-3)] [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
				String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
				String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
				className,
			)}
			captionLayout={captionLayout}
			formatters={{
				formatMonthDropdown: (date) =>
					date.toLocaleString('default', { month: 'short' }),
				...formatters,
			}}
			classNames={{
				root: cn('w-fit', defaultClassNames.root),
				months: cn(
					'relative flex flex-col gap-4 md:flex-row',
					defaultClassNames.months,
				),
				month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
				nav: cn(
					'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
					defaultClassNames.nav,
				),
				button_previous: cn(
					buttonVariants({ variant: buttonVariant }),
					'h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50',
					defaultClassNames.button_previous,
				),
				button_next: cn(
					buttonVariants({ variant: buttonVariant }),
					'h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50',
					defaultClassNames.button_next,
				),
				month_caption: cn(
					'flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]',
					defaultClassNames.month_caption,
				),
				dropdowns: cn(
					'flex h-[--cell-size] w-full items-center justify-center gap-[var(--mbc-spacing-1)] text-[length:var(--mbc-text-sm)] leading-[var(--mbc-text-sm--line-height)] font-[var(--mbc-text-body-bold--font-weight)]',
					defaultClassNames.dropdowns,
				),
				dropdown_root: cn(
					'has-focus:border-[var(--mbc-color-ring)] border-[var(--mbc-color-border)] shadow-[var(--mbc-shadow-xs)] has-focus:ring-[var(--mbc-color-ring)]/50 has-focus:ring-[3px] relative rounded-[var(--mbc-radius-md)] border',
					defaultClassNames.dropdown_root,
				),
				dropdown: cn(
					'bg-[var(--mbc-color-popover)] absolute inset-0 opacity-0',
					defaultClassNames.dropdown,
				),
				caption_label: cn(
					'select-none font-[var(--mbc-text-body-bold--font-weight)]',
					captionLayout === 'label'
						? 'text-[length:var(--mbc-text-sm)] leading-[var(--mbc-text-sm--line-height)]'
						: '[&>svg]:text-[var(--mbc-color-muted-foreground)] flex h-8 items-center gap-[var(--mbc-spacing-1)] rounded-[var(--mbc-radius-md)] pl-[var(--mbc-spacing-2)] pr-[var(--mbc-spacing-1)] text-[length:var(--mbc-text-sm)] leading-[var(--mbc-text-sm--line-height)] [&>svg]:size-3.5',
					defaultClassNames.caption_label,
				),
				table: 'w-full border-collapse',
				weekdays: cn('flex', defaultClassNames.weekdays),
				weekday: cn(
					'text-[var(--mbc-color-muted-foreground)] flex-1 select-none rounded-[var(--mbc-radius-md)] text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)] font-[var(--mbc-text-body--font-weight)]',
					defaultClassNames.weekday,
				),
				week: cn(
					'mt-[var(--mbc-spacing-2)] flex w-full',
					defaultClassNames.week,
				),
				week_number_header: cn(
					'w-[--cell-size] select-none',
					defaultClassNames.week_number_header,
				),
				week_number: cn(
					'text-[var(--mbc-color-muted-foreground)] select-none text-[length:var(--mbc-text-xs)] leading-[var(--mbc-text-xs--line-height)]',
					defaultClassNames.week_number,
				),
				day: cn(
					'group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-[var(--mbc-radius-md)] [&:last-child[data-selected=true]_button]:rounded-r-[var(--mbc-radius-md)]',
					defaultClassNames.day,
				),
				range_start: cn(
					'bg-[var(--mbc-color-accent)] rounded-l-[var(--mbc-radius-md)]',
					defaultClassNames.range_start,
				),
				range_middle: cn('rounded-none', defaultClassNames.range_middle),
				range_end: cn(
					'bg-[var(--mbc-color-accent)] rounded-r-[var(--mbc-radius-md)]',
					defaultClassNames.range_end,
				),
				today: cn(
					'bg-[var(--mbc-color-accent)] text-[var(--mbc-color-accent-foreground)] rounded-[var(--mbc-radius-md)] data-[selected=true]:rounded-none',
					defaultClassNames.today,
				),
				outside: cn(
					'text-[var(--mbc-color-muted-foreground)] aria-selected:text-[var(--mbc-color-muted-foreground)]',
					defaultClassNames.outside,
				),
				disabled: cn(
					'text-[var(--mbc-color-muted-foreground)] opacity-50',
					defaultClassNames.disabled,
				),
				hidden: cn('invisible', defaultClassNames.hidden),
				...classNames,
			}}
			components={{
				Root: ({ className, rootRef, ...props }) => {
					return (
						<div
							data-slot="calendar"
							ref={rootRef}
							className={cn(className)}
							{...props}
						/>
					)
				},
				Chevron: ({ className, orientation, ...props }) => {
					if (orientation === 'left') {
						return (
							<ChevronLeftIcon className={cn('size-4', className)} {...props} />
						)
					}

					if (orientation === 'right') {
						return (
							<ChevronRightIcon
								className={cn('size-4', className)}
								{...props}
							/>
						)
					}

					return (
						<ChevronDownIcon className={cn('size-4', className)} {...props} />
					)
				},
				DayButton: CalendarDayButton,
				WeekNumber: ({ children, ...props }) => {
					return (
						<td {...props}>
							<div className="flex size-[--cell-size] items-center justify-center text-center">
								{children}
							</div>
						</td>
					)
				},
				...components,
			}}
			{...props}
		/>
	)
}

function CalendarDayButton({
	className,
	day,
	modifiers,
	...props
}: React.ComponentProps<typeof DayButton>) {
	const defaultClassNames = getDefaultClassNames()

	const ref = React.useRef<HTMLButtonElement>(null)
	React.useEffect(() => {
		if (modifiers.focused) ref.current?.focus()
	}, [modifiers.focused])

	return (
		<Button
			ref={ref}
			variant="ghost"
			size="icon"
			data-day={day.date.toLocaleDateString()}
			data-selected-single={
				modifiers.selected &&
				!modifiers.range_start &&
				!modifiers.range_end &&
				!modifiers.range_middle
			}
			data-range-start={modifiers.range_start}
			data-range-end={modifiers.range_end}
			data-range-middle={modifiers.range_middle}
			className={cn(
				'flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-[var(--mbc-spacing-1)] font-[var(--mbc-text-body--font-weight)] leading-none data-[range-end=true]:rounded-[var(--mbc-radius-md)] data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-[var(--mbc-radius-md)] data-[range-end=true]:bg-[var(--mbc-color-primary)] data-[range-middle=true]:bg-[var(--mbc-color-accent)] data-[range-start=true]:bg-[var(--mbc-color-primary)] data-[selected-single=true]:bg-[var(--mbc-color-primary)] data-[range-end=true]:text-[var(--mbc-color-primary-foreground)] data-[range-middle=true]:text-[var(--mbc-color-accent-foreground)] data-[range-start=true]:text-[var(--mbc-color-primary-foreground)] data-[selected-single=true]:text-[var(--mbc-color-primary-foreground)] group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-[var(--mbc-color-ring)] group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-[var(--mbc-color-ring)]/50 [&>span]:text-[length:var(--mbc-text-xs)] [&>span]:leading-[var(--mbc-text-xs--line-height)] [&>span]:opacity-70',
				defaultClassNames.day,
				className,
			)}
			{...props}
		/>
	)
}

export { Calendar, CalendarDayButton }
