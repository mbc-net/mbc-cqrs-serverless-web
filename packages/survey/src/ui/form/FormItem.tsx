'use client'

import { cn } from '../../utils'
import { createContext, useId } from 'react'
import { Container } from '../container'
import type { FormItemContextValue, FormItemProps } from './types'
import { formItemVariants } from './variants'

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = ({ className, children, ...props }: FormItemProps) => {
  return (
    <FormItemContext.Provider value={{ id: useId() }}>
      <Container className={cn(formItemVariants({ className }))} {...props}>
        {children}
      </Container>
    </FormItemContext.Provider>
  )
}

export { FormItem, FormItemContext }
