import type * as React from 'react'

import { cn } from '../utils/index'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'selection:bg-primary selection:text-primary-foreground file:text-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border border-transparent bg-transparent px-3 py-1 text-base outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[14px] placeholder:text-[#667085] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        className
      )}
      {...props}
    />
  )
}

export { Input }
