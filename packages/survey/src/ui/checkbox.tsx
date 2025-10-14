'use client'

import { Icon } from '../ui/icon'
import { cn } from '../utils/index'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import type * as React from 'react'

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'border-input shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-[#FDA29B] aria-invalid:ring-[#FDA29B]/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:bg-input/30 dark:data-[state=checked]:bg-primary dark:aria-invalid:ring-destructive/40 peer size-[19px] shrink-0 rounded-[4px] border bg-white outline-none transition-shadow focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <Icon.CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
