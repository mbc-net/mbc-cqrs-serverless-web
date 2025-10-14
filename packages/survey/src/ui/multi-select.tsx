'use client'

import { ChevronsUpDown, X } from 'lucide-react'
import * as React from 'react'

import { cn } from '../utils'
import { LoadingOverlay } from '../components/loading/Loading'
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
    ref
  ) => {
    const [open, setOpen] = React.useState(false)

    const handleUnselect = (selectedValue: string) => {
      onValueChange(value.filter((v) => v !== selectedValue))
    }

    const selectedOptions = options.filter((option) =>
      value.includes(option.value)
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
              'border-input h-auto w-full justify-start px-3 py-[7px]',
              {
                'border-error-300': error,
              },
              className
            )}
            onClick={() => setOpen(!open)}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-wrap items-center gap-1">
                {selectedOptions.length > 0 ? (
                  selectedOptions.map((option) => (
                    <Badge
                      key={option.value}
                      variant="selected"
                      className="whitespace-nowrap"
                    >
                      {option.label}
                      <button
                        className="ring-offset-background focus:ring-ring ml-1 cursor-pointer rounded-full outline-none focus:ring-2 focus:ring-offset-2"
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
                  <span className="text-muted-foreground font-normal">
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
                <LoadingOverlay loading size="sm">
                  <div className="flex items-center justify-center p-5" />
                </LoadingOverlay>
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
  }
)

MultiSelect.displayName = 'MultiSelect'

export { MultiSelect }
