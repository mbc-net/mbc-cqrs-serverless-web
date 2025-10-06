# Calendar

A date picker component built on react-day-picker with multiple selection modes and customization options.

## Import

```tsx
import { Calendar } from '@mbc-cqrs-serverless-web/shared-ui'
```

## Basic Usage

```tsx
import { Calendar } from '@mbc-cqrs-serverless-web/shared-ui'
import { useState } from 'react'

export default function MyComponent() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  )
}
```

## Single Date Selection

```tsx
import { Calendar } from '@mbc-cqrs-serverless-web/shared-ui'
import { useState } from 'react'

export default function SingleDatePicker() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
      {date && (
        <p className="text-sm text-gray-600">
          Selected date: {date.toLocaleDateString()}
        </p>
      )}
    </div>
  )
}
```

## Multiple Date Selection

```tsx
import { Calendar } from '@mbc-cqrs-serverless-web/shared-ui'
import { useState } from 'react'

export default function MultipleDatePicker() {
  const [dates, setDates] = useState<Date[] | undefined>([])

  return (
    <div className="space-y-4">
      <Calendar
        mode="multiple"
        selected={dates}
        onSelect={setDates}
        className="rounded-md border"
      />
      {dates && dates.length > 0 && (
        <div className="text-sm text-gray-600">
          <p>Selected dates:</p>
          <ul className="list-disc list-inside">
            {dates.map((date, index) => (
              <li key={index}>{date.toLocaleDateString()}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

## Date Range Selection

```tsx
import { Calendar } from '@mbc-cqrs-serverless-web/shared-ui'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

export default function DateRangePicker() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  return (
    <div className="space-y-4">
      <Calendar
        mode="range"
        selected={dateRange}
        onSelect={setDateRange}
        className="rounded-md border"
      />
      {dateRange?.from && (
        <div className="text-sm text-gray-600">
          <p>From: {dateRange.from.toLocaleDateString()}</p>
          {dateRange.to && (
            <p>To: {dateRange.to.toLocaleDateString()}</p>
          )}
        </div>
      )}
    </div>
  )
}
```

## With Date Restrictions

```tsx
import { Calendar } from '@mbc-cqrs-serverless-web/shared-ui'
import { useState } from 'react'

export default function RestrictedCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
      disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
      fromDate={new Date()}
      toDate={new Date("2025-12-31")}
    />
  )
}
```

## Custom Day Rendering

```tsx
import { Calendar } from '@mbc-cqrs-serverless-web/shared-ui'
import { useState } from 'react'

export default function CustomDayCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
      modifiers={{
        today: new Date(),
        weekend: { dayOfWeek: [0, 6] },
      }}
      modifiersClassNames={{
        today: "bg-blue-100 text-blue-900",
        weekend: "text-red-500",
      }}
    />
  )
}
```

## With Form Integration

```tsx
import { Calendar } from '@mbc-cqrs-serverless-web/shared-ui'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { Input } from '@mbc-cqrs-serverless-web/shared-ui'
import { Label } from '@mbc-cqrs-serverless-web/shared-ui'
import { useState } from 'react'

export default function FormWithCalendar() {
  const [date, setDate] = useState<Date | undefined>()
  const [showCalendar, setShowCalendar] = useState(false)

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="event-date">Event Date</Label>
        <Input
          id="event-date"
          value={date ? date.toLocaleDateString() : ''}
          readOnly
          onClick={() => setShowCalendar(!showCalendar)}
          placeholder="Select a date"
        />
        {showCalendar && (
          <div className="absolute z-10 mt-1">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                setDate(selectedDate)
                setShowCalendar(false)
              }}
              className="rounded-md border bg-white shadow-lg"
            />
          </div>
        )}
      </div>
      <Button type="submit">Create Event</Button>
    </form>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'single' \| 'multiple' \| 'range'` | `'single'` | Selection mode |
| `selected` | `Date \| Date[] \| DateRange \| undefined` | - | Selected date(s) |
| `onSelect` | `(date: Date \| Date[] \| DateRange \| undefined) => void` | - | Selection handler |
| `defaultMonth` | `Date` | `new Date()` | Default month to display |
| `fromDate` | `Date` | - | Minimum selectable date |
| `toDate` | `Date` | - | Maximum selectable date |
| `disabled` | `(date: Date) => boolean` | - | Function to disable dates |
| `required` | `boolean` | `false` | Mark as required |
| `className` | `string` | - | Additional CSS classes |
| `modifiers` | `object` | - | Custom day modifiers |
| `modifiersClassNames` | `object` | - | CSS classes for modifiers |
| `locale` | `Locale` | - | Calendar locale |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | First day of week |

## Styling

The Calendar component uses CSS variables for theming:

```css
:root {
  --mbc-color-background: #your-background-color;
  --mbc-color-foreground: #your-text-color;
  --mbc-color-border: #your-border-color;
  --mbc-color-primary: #your-primary-color;
  --mbc-color-primary-foreground: #your-primary-text;
  --mbc-color-accent: #your-accent-color;
  --mbc-color-accent-foreground: #your-accent-text;
  --mbc-radius-md: 8px;
  --mbc-spacing-2: 8px;
  --mbc-spacing-4: 16px;
}
```

## Accessibility

- ✅ Keyboard navigation (Arrow keys, Enter, Escape)
- ✅ Screen reader support
- ✅ ARIA attributes
- ✅ Focus management
- ✅ High contrast support

## Examples

### Event Calendar

```tsx
import { Calendar } from '@mbc-cqrs-serverless-web/shared-ui'
import { useState } from 'react'

export default function EventCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  
  const events = [
    { date: new Date(2024, 0, 15), title: "Team Meeting" },
    { date: new Date(2024, 0, 20), title: "Project Deadline" },
    { date: new Date(2024, 0, 25), title: "Client Presentation" },
  ]

  const modifiers = {
    hasEvent: events.map(event => event.date),
  }

  const modifiersClassNames = {
    hasEvent: "bg-blue-100 text-blue-900 font-semibold",
  }

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border"
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
      />
      {selectedDate && (
        <div className="text-sm">
          <p className="font-medium">Events on {selectedDate.toLocaleDateString()}:</p>
          <ul className="list-disc list-inside">
            {events
              .filter(event => 
                event.date.toDateString() === selectedDate.toDateString()
              )
              .map((event, index) => (
                <li key={index}>{event.title}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

### Booking Calendar

```tsx
import { Calendar } from '@mbc-cqrs-serverless-web/shared-ui'
import { useState } from 'react'

export default function BookingCalendar() {
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  
  // Disable past dates and weekends
  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today || date.getDay() === 0 || date.getDay() === 6
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Available Dates</h3>
      <Calendar
        mode="multiple"
        selected={selectedDates}
        onSelect={setSelectedDates}
        className="rounded-md border"
        disabled={isDateDisabled}
        min={1} // Minimum 1 day selection
        max={7} // Maximum 7 days selection
      />
      {selectedDates.length > 0 && (
        <div className="text-sm text-gray-600">
          <p>Selected {selectedDates.length} day(s):</p>
          <ul className="list-disc list-inside">
            {selectedDates.map((date, index) => (
              <li key={index}>{date.toLocaleDateString()}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

### Date Range Picker with Presets

```tsx
import { Calendar } from '@mbc-cqrs-serverless-web/shared-ui'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

export default function DateRangePickerWithPresets() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const presets = [
    {
      label: "Last 7 days",
      range: {
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        to: new Date(),
      },
    },
    {
      label: "Last 30 days",
      range: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(),
      },
    },
    {
      label: "This month",
      range: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      },
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        {presets.map((preset, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => setDateRange(preset.range)}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <Calendar
        mode="range"
        selected={dateRange}
        onSelect={setDateRange}
        className="rounded-md border"
      />
      {dateRange?.from && (
        <div className="text-sm text-gray-600">
          <p>From: {dateRange.from.toLocaleDateString()}</p>
          {dateRange.to && (
            <p>To: {dateRange.to.toLocaleDateString()}</p>
          )}
        </div>
      )}
    </div>
  )
}
```
