'use client'

import { cn } from '../utils/index'
import * as LabelPrimitive from '@radix-ui/react-label'
import * as React from 'react'

interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  required?: boolean
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, children, required, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    data-slot="label"
    className={cn(
      'flex select-none items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
      className
    )}
    {...props}
  >
    {children}
    {required && <span className="ml-1 text-red-500">*</span>}
  </LabelPrimitive.Root>
))

Label.displayName = LabelPrimitive.Root.displayName

export { Label }
