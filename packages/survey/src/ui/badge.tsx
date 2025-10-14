import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '../utils/index'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-xs w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden font-bold',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[#B7BDC6] text-black [a&]:bg-accent [a&]:text-white [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        selected:
          'bg-primary border-primary border text-white text-xs select-none font-bold cursor-pointer',
        un_selected:
          'select-none border border-[#636F80] bg-[#EEEEEE] text-[#101827] hover:bg-[#B7BDC6] cursor-pointer',
        active:
          'rounded-xl bg-success-50 flex py-0.5 px-2 justify-center items-center text-success-700 text-sm border-none',
        invited:
          'rounded-xl bg-warning-50 flex py-0.5 px-2 justify-center items-center text-warning-700 text-sm border-none',
        inactive:
          'rounded-xl bg-error-50 flex py-0.5 px-2 justify-center items-center text-error-700 text-sm border-none',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
