'use client'

import { ChevronsUpDown, X } from 'lucide-react'
import * as React from 'react'

import { cn } from '../../utils/cn'
import { Badge } from './badge'
import { Button } from './button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

interface MultiSelectProps extends React.HTMLAttributes<HTMLDivElement> {
	placeholder?: string
	options: {
		label: string | null
		value: string
		icon?: React.ComponentType<{ className?: string }>
	}[]
	value: string[]
	onValueChange: (value: string[]) => void
	onSearch?: (value: string) => void
	isLoading?: boolean
	error?: boolean
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
	(
		{
			className,
			placeholder,
			options,
			value,
			onValueChange,
			onSearch,
			isLoading,
			error,
		},
		ref,
	) => {
		const [open, setOpen] = React.useState(false)

		const handleUnselect = (selectedValue: string) => {
			onValueChange(value.filter((v) => v !== selectedValue))
		}

		const selectedOptions = options.filter((option) =>
			value.includes(option.value),
		)

		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						ref={ref}
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className={cn(
							'h-auto w-full justify-start border-[var(--mbc-color-border)] px-[var(--mbc-spacing-3)] py-[7px]',
							{
								'border-[var(--mbc-color-destructive)] ': error,
							},
							className,
						)}
						onClick={() => setOpen(!open)}
					>
						<div className="flex w-full items-center justify-between">
							<div className="flex flex-wrap items-center gap-[var(--mbc-spacing-1)]">
								{selectedOptions.length > 0 ? (
									selectedOptions.map((option) => (
										<Badge
											key={option.value}
											variant="selected"
											className="whitespace-nowrap"
										>
											{option.label}
											<button
												className="ml-[var(--mbc-spacing-1)] cursor-pointer rounded-full outline-none ring-offset-[var(--mbc-color-background)] focus:ring-2 focus:ring-[var(--mbc-color-ring)] focus:ring-offset-2"
												onMouseDown={(e) => {
													e.preventDefault()
													e.stopPropagation()
												}}
												onClick={(e) => {
													e.stopPropagation()
													handleUnselect(option.value)
												}}
											>
												<X className="size-4 text-white" />
											</button>
										</Badge>
									))
								) : (
									<span className="font-[var(--mbc-text-body--font-weight)] text-[var(--mbc-color-muted-foreground)]">
										{placeholder}
									</span>
								)}
							</div>
							<ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
						</div>
					</Button>
				</PopoverTrigger>

				<PopoverContent
					className="w-[--radix-popover-trigger-width] p-0"
					align="start"
				>
					<Command>
						<CommandInput placeholder="Search..." onValueChange={onSearch} />
						<CommandList>
							{isLoading ? (
								<div className="flex items-center justify-center p-5">
									<div className="text-[var(--mbc-color-muted-foreground)] text-sm">
										Loading...
									</div>
								</div>
							) : (
								<>
									<CommandEmpty>No results found.</CommandEmpty>
									<CommandGroup>
										{options
											.filter((option) => !value.includes(option.value))
											.map((option) => (
												<CommandItem
													key={option.value}
													onSelect={() =>
														onValueChange([...value, option.value])
													}
													className={'cursor-pointer'}
												>
													{option.label}
												</CommandItem>
											))}
									</CommandGroup>
								</>
							)}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		)
	},
)

MultiSelect.displayName = 'MultiSelect'

export { MultiSelect }
