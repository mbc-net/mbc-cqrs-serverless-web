import { format, isValid } from 'date-fns'
import { ja } from 'date-fns/locale'
import { useMemo } from 'react'

import { cn } from '../utils'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { Icon } from '../ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

interface DateTimePickerWithYearControlProps {
  value?: Date | string | null
  onChange: (date?: string) => void
  disabled?: boolean
  includeYear?: boolean
}

type TimePickerProps = {
  value: Date | null
  onTimeChange: (part: 'hours' | 'minutes', value: string) => void
  disabled?: boolean
}
const TimePicker = ({ value, onTimeChange, disabled }: TimePickerProps) => {
  const hourOptions = useMemo(
    () => Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')),
    []
  )
  const minuteOptions = useMemo(
    () => Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')),
    []
  )

  return (
    <div className="flex items-center gap-2 md:col-span-2">
      {/* <ClockIcon className="h-5 w-5 text-gray-400" /> */}
      <Select
        onValueChange={(val) => onTimeChange('hours', val)}
        // FIX: Use padStart to match option values and handle null/undefined
        value={value ? value.getHours().toString().padStart(2, '0') : ''}
        disabled={disabled || !value}
      >
        <SelectTrigger className="w-full max-w-[120px] justify-between bg-white">
          <SelectValue placeholder="時" />
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto">
          {hourOptions.map((hour) => (
            <SelectItem key={hour} value={hour}>
              {hour}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="mr-8 font-normal text-gray-500">時</span>
      <Select
        onValueChange={(val) => onTimeChange('minutes', val)}
        value={value ? value.getMinutes().toString().padStart(2, '0') : ''}
        disabled={disabled || !value}
      >
        <SelectTrigger className="w-full max-w-[120px] justify-between bg-white">
          <SelectValue placeholder="分" />
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto">
          {minuteOptions.map((minute) => (
            <SelectItem key={minute} value={minute}>
              {minute}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="font-normal text-gray-500">分</span>
    </div>
  )
}

const DateTimePickerWithYearControl = ({
  value,
  onChange,
  disabled,
  includeYear = true,
}: DateTimePickerWithYearControlProps) => {
  // Parse and validate the incoming value
  const parsedDate = useMemo(() => {
    if (!value) return null

    const date = new Date(value)

    // Special handling for year=0 dates (when includeYear=false)
    if (date.getFullYear() === 0) {
      // Return the original date with year=0 - don't modify it
      return date
    }

    // For normal dates, check if valid
    if (!isValid(date)) return null

    return date
  }, [value])

  // Format date based on includeYear setting
  const formatDate = (date: Date) => {
    if (includeYear) {
      return format(date, 'yyyy年M月d日', { locale: ja })
    }
    return format(date, 'M月d日', { locale: ja })
  }

  // Get placeholder text based on includeYear
  const placeholder = includeYear
    ? '年月日時を選択してください'
    : '月日時を選択してください'

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange(undefined)
      return
    }

    const finalDate = new Date(date)

    // Preserve existing time if available, otherwise set to 00:00
    if (parsedDate) {
      finalDate.setHours(parsedDate.getHours())
      finalDate.setMinutes(parsedDate.getMinutes())
    } else {
      // Set default time to 00:00 when no existing time
      finalDate.setHours(0)
      finalDate.setMinutes(0)
    }

    // If year should not be included, set year to 1900 as special marker
    if (!includeYear) {
      finalDate.setFullYear(2000)
    }

    onChange(finalDate.toISOString())
  }

  // Handle time change
  const handleTimeChange = (part: 'hours' | 'minutes', timeValue: string) => {
    // Get the original date from value (which might have year=0)
    const originalDate = value ? new Date(value) : new Date()
    const newDate = new Date(originalDate)

    if (part === 'hours') {
      newDate.setHours(Number.parseInt(timeValue, 10))
    } else {
      newDate.setMinutes(Number.parseInt(timeValue, 10))
    }

    // If year should not be included, set year to 0 as special marker
    if (!includeYear) {
      newDate.setFullYear(0)
    }

    onChange(newDate.toISOString())
  }

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <Popover modal>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              disabled={disabled}
              className={cn(
                'w-full justify-start text-left font-normal',
                !parsedDate && 'text-gray-400'
              )}
            >
              <Icon.Calendar className="mr-2 !h-5 !w-5" />
              {parsedDate ? formatDate(parsedDate) : <span>{placeholder}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={parsedDate ?? undefined}
              onSelect={handleDateSelect}
              disabled={disabled}
              locale={ja}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <TimePicker
          value={parsedDate}
          onTimeChange={handleTimeChange}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default DateTimePickerWithYearControl
