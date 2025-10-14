'use client'

import { cn } from '../../utils'
import type { ComponentProps } from 'react'
import { Label } from '../label'
import { useFormField } from './hooks'

type Props = ComponentProps<typeof Label> & {
  required?: boolean
}

const FormLabel = ({ className, children, required, ...props }: Props) => {
  const { formItemId } = useFormField()

  return (
    <Label htmlFor={formItemId} className={cn(className)} {...props}>
      {children}
      {required && <span className="text-[#F04A4A]">*</span>}
    </Label>
  )
}

export { FormLabel }
