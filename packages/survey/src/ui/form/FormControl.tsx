'use client'

import { cn } from '../../utils'
import { Slot } from '@radix-ui/react-slot'
import type { ComponentProps, HTMLAttributes } from 'react'
import { useFormField } from './hooks'

const FormControl = ({
  className,
  ...props
}: ComponentProps<typeof Slot> & HTMLAttributes<HTMLDivElement>) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      id={formItemId}
      aria-invalid={!!error}
      aria-describedby={`${formDescriptionId} ${formMessageId}`}
      className={cn(className)}
      {...props}
    />
  )
}

export { FormControl }
