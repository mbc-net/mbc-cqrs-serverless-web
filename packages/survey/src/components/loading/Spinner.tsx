import { cn } from '../../utils'
import { Loader2 } from 'lucide-react'

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }[size]

  return (
    <Loader2
      className={cn('text-primary animate-spin', sizeClass, className)}
    />
  )
}
