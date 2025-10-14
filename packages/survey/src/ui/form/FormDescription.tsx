'use client'

import type { HTMLAttributes } from 'react'

import { cn } from '../utils'
import { useFormField } from './hooks'

const FormDescription = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      className={cn('text-sm font-normal text-[#475467]', className)}
      id={formDescriptionId}
      {...props}
    />
  )
}

export { FormDescription }
