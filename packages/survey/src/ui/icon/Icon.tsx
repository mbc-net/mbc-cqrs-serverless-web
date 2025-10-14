import { cn } from '../../utils'
import type { FC } from 'react'
import { IconWrapper } from './IconWrapper'
import type { IconProps } from './types'
import { iconVariants } from './variants'
import {
  ChevronLeft as Left,
  ChevronRight as Right,
  Trash2 as Trash,
  Plus as Add,
  Check as CheckIcon,
  CheckCircle as CheckedSelect,
  ChevronDown,
  X as CloseModal,
  MoreHorizontal as PaginationEllipsis,
  PanelLeft,
  Calendar,
} from 'lucide-react'

// Icon mapping to lucide-react components
const iconMap = {
  Left,
  Right,
  Trash,
  Add,
  CheckIcon,
  CheckedSelect,
  ChevronDown,
  CloseModal,
  PaginationEllipsis,
  PanelLeft,
  Calendar,
} as const

export const Icon = Object.fromEntries(
  Object.entries(iconMap).map(([name, Component]) => [
    name,
    ({ className, wrapperClassName, ...props }: IconProps) => (
      <IconWrapper className={wrapperClassName}>
        <Component className={cn(iconVariants({ className }))} {...props} />
      </IconWrapper>
    ),
  ])
) as Record<keyof typeof iconMap, FC<IconProps>>
