'use client'

import { cn } from '../utils'
import { Container } from '../container'
import { useFormField } from './hooks'
import type { FormMessageProps } from './types'
import { formMessageVariants } from './variants'

const FormMessage = ({ className, children, ...props }: FormMessageProps) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <Container
      id={formMessageId}
      className={cn(formMessageVariants({ className }))}
      {...props}
    >
      <p>{body}</p>
    </Container>
  )
}

export { FormMessage }
