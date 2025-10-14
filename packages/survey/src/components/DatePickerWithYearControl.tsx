import { format, isValid } from 'date-fns'
import { ja } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useMemo } from 'react'

import { cn } from '../utils'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

interface DatePickerWithYearControlProps {
  value?: Date | string | null
  onChange: (date?: string) => void
  disabled?: boolean
  includeYear?: boolean
}

export default function DatePickerWithYearControl({
  value,
  onChange,
  disabled,
  includeYear = true,
}: DatePickerWithYearControlProps) {
  // Parse and validate the incoming value
  const parsedDate = useMemo(() => {
    if (!value) return null

    const date = new Date(value)
    if (!isValid(date)) return null

    // If year is 0, it means "no year" - use current year for display
    if (date.getFullYear() === 0) {
      return new Date(new Date().getFullYear(), date.getMonth(), date.getDate())
    }

    return date
  }, [value])

  // Format date based on includeYear setting
  const formatDate = (date: Date) => {
    if (includeYear) {
      return format(date, 'yyyy年M月d日', { locale: ja })
    }
    return format(date, 'M月d日', { locale: ja })
  }

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange(undefined)
      return
    }

    const finalDate = new Date(date)

    // If year should not be included, set year to 0 as special marker
    if (!includeYear) {
      finalDate.setFullYear(0)
    }

    onChange(finalDate.toISOString())
  }

  // Get placeholder text based on includeYear
  const placeholder = includeYear
    ? '年月日を選択してください'
    : '月日を選択してください'

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant={'outline'}
          className={cn(
            'w-full pl-3 text-left font-normal',
            !parsedDate && 'text-[hsl(var(--muted-foreground))]'
          )}
        >
          {parsedDate ? formatDate(parsedDate) : <span>{placeholder}</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          disabled={disabled}
          mode="single"
          selected={parsedDate ?? undefined}
          onSelect={handleDateSelect}
          defaultMonth={parsedDate ?? undefined}
          autoFocus
          locale={ja}
          // If year is not included, we could potentially restrict year navigation
          // but for now we'll let users navigate freely
        />
      </PopoverContent>
    </Popover>
  )
}
