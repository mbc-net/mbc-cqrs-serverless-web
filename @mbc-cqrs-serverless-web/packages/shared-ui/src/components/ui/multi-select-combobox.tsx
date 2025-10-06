'use client'

import { Check, ChevronsUpDown, Inbox } from 'lucide-react'
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

export type OptionType = {
	label: string
	value: string
}

interface MultiSelectComboboxProps {
	options: OptionType[]
	selected: string[]
	onChange: (selected: string[]) => void
	className?: string
	placeholder?: string
}

export function MultiSelectCombobox({
	options,
	selected,
	onChange,
	className,
	placeholder = 'Select options...',
}: MultiSelectComboboxProps) {
	const [open, setOpen] = React.useState(false)

	const handleSelect = (value: string) => {
		const newSelected = selected.includes(value)
			? selected.filter((item) => item !== value)
			: [...selected, value]
		onChange(newSelected)
	}

	const selectedLabels = selected
		.map((value) => options.find((option) => option.value === value)?.label)
		.filter(Boolean) as string[]

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn('h-auto w-full justify-between', className)}
				>
					<div className="flex flex-wrap gap-1">
						{selectedLabels.length > 0 ? (
							selectedLabels.map((label) => (
								<Badge key={label} variant="secondary" className="mr-1">
									{label}
								</Badge>
							))
						) : (
							<span className="font-normal text-[var(--mbc-color-muted-foreground)]">
								{placeholder}
							</span>
						)}
					</div>
					<ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[--radix-popover-trigger-width] p-0">
				<Command>
					<CommandInput placeholder="Search..." />
					<CommandList>
						<CommandEmpty>
							<div className="flex flex-col items-center justify-center space-y-4 text-[var(--mbc-color-muted-foreground)] opacity-20">
								<Inbox className="h-16 w-16" />
								<p>データがありません</p>
							</div>
						</CommandEmpty>
						<CommandGroup>
							{options.map((option) => {
								const isSelected = selected.includes(option.value)
								return (
									<CommandItem
										key={option.value}
										value={`${option.label} ${option.value}`}
										onSelect={() => handleSelect(option.value)}
									>
										<Check
											className={cn(
												'mr-2 h-4 w-4',
												isSelected ? 'opacity-100' : 'opacity-0',
											)}
										/>
										{option.label}
									</CommandItem>
								)
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
