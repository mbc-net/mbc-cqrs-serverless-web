import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '../utils/index'
import { AlertCircle, Search } from 'lucide-react'

const inputVariants = cva(
  [
    'flex w-full min-w-0 rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] outline-none',
    'file:border-0 file:bg-transparent file:text-foreground file:font-medium',
    'placeholder:text-[#545454]',
    'selection:bg-primary selection:text-primary-foreground',
    'dark:bg-input/30',
    'disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:border-[#19647E]',
    'aria-invalid:border-error-300 aria-invalid:ring-[#FDA29B]/20 dark:aria-invalid:ring-[#FDA29B]/40',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 px-2 py-1 text-xs file:h-6 file:text-xs placeholder:text-xs',
        md: 'h-9 px-3 py-1 text-sm file:h-7 file:text-sm placeholder:text-[14px]',
        'extra-md':
          'h-10 px-3 py-2 text-sm file:h-8 file:text-sm placeholder:text-sm',
        lg: 'h-[44px] px-4 py-2 text-base file:h-8 file:text-base placeholder:text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  showIconError?: boolean
  showSearchIcon?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, size, showSearchIcon, showIconError = true, ...props },
    ref
  ) => {
    const isInvalid = props['aria-invalid'] === 'true'

    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(inputVariants({ size, className }))}
          ref={ref}
          {...props}
        />

        {showSearchIcon && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        )}

        {!!isInvalid && (
          <div
            className={cn(
              'pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3',
              size === 'lg' && 'translate-y-[4px]'
            )}
          >
            <AlertCircle className="text-error-500 h-5 w-5" />
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
