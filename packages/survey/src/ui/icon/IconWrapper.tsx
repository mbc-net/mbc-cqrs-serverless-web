import { cn } from '../../utils'
import { Container } from '../container'
import type { IconWrapperProps } from './types'
import { iconWrapperVariants } from './variants'

export const IconWrapper = ({ className, ...props }: IconWrapperProps) => {
  return (
    <Container className={cn(iconWrapperVariants({ className }))} {...props} />
  )
}
