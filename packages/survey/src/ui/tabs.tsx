'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import type * as React from 'react'

import { cn } from '../utils/index'

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-x-2 gap-y-6', className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'inline-flex h-9 w-fit items-center justify-center gap-5',
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        `data-[state=active]:border-b-primary data-[state=active]:text-primary dark:data-[state=active]:bg-input/30 inline-flex h-[calc(100%-1px)] flex-1 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap px-3 py-5 text-base font-normal transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-[2px] [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0`,
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
