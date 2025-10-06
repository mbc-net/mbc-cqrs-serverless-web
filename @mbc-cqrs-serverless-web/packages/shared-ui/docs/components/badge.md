# Badge

A versatile badge component for displaying status, labels, and notifications with multiple variants.

## Import

```tsx
import { Badge } from '@mbc-cqrs-serverless-web/shared-ui'
// or for server components
import { Badge } from '@mbc-cqrs-serverless-web/shared-ui/server'
```

## Basic Usage

```tsx
import { Badge } from '@mbc-cqrs-serverless-web/shared-ui'

export default function MyComponent() {
  return (
    <div className="space-y-4">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Error</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  )
}
```

## Variants

| Variant | Description | Use Case |
|---------|-------------|----------|
| `default` | Primary badge with solid background | General labels |
| `secondary` | Gray badge with solid background | Secondary information |
| `destructive` | Red badge for errors/warnings | Error states |
| `outline` | Badge with border and transparent background | Subtle labels |
| `selected` | Blue badge for selected items | Active selection |
| `un_selected` | Gray badge for unselected items | Inactive selection |
| `active` | Green badge for active status | Success states |
| `invited` | Yellow badge for pending status | Pending states |
| `inactive` | Red badge for inactive status | Inactive states |

## Status Badges

```tsx
<div className="space-y-2">
  <Badge variant="active">Active</Badge>
  <Badge variant="invited">Invited</Badge>
  <Badge variant="inactive">Inactive</Badge>
  <Badge variant="destructive">Error</Badge>
</div>
```

## Selection Badges

```tsx
import { useState } from 'react'
import { Badge } from '@mbc-cqrs-serverless-web/shared-ui'

export default function SelectionBadges() {
  const [selected, setSelected] = useState(false)

  return (
    <Badge 
      variant={selected ? "selected" : "un_selected"}
      onClick={() => setSelected(!selected)}
      className="cursor-pointer"
    >
      {selected ? "Selected" : "Unselected"}
    </Badge>
  )
}
```

## With Icons

```tsx
import { Badge } from '@mbc-cqrs-serverless-web/shared-ui'
import { Check, X, Alert } from 'lucide-react'

export default function BadgeWithIcons() {
  return (
    <div className="space-x-2">
      <Badge variant="active">
        <Check className="mr-1 h-3 w-3" />
        Success
      </Badge>
      <Badge variant="destructive">
        <X className="mr-1 h-3 w-3" />
        Error
      </Badge>
      <Badge variant="invited">
        <Alert className="mr-1 h-3 w-3" />
        Warning
      </Badge>
    </div>
  )
}
```

## As Child Component

```tsx
import { Badge } from '@mbc-cqrs-serverless-web/shared-ui'
import Link from 'next/link'

export default function BadgeAsLink() {
  return (
    <Badge asChild>
      <Link href="/notifications">
        <span className="flex items-center">
          🔔 3 New Notifications
        </span>
      </Link>
    </Badge>
  )
}
```

## Custom Styling

```tsx
<Badge 
  variant="outline" 
  className="bg-blue-50 text-blue-700 border-blue-200"
>
  Custom Badge
</Badge>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'selected' \| 'un_selected' \| 'active' \| 'invited' \| 'inactive'` | `'default'` | Visual style variant |
| `asChild` | `boolean` | `false` | Render as child component |
| `className` | `string` | - | Additional CSS classes |
| `onClick` | `(event: MouseEvent) => void` | - | Click handler |

## Styling

The Badge component uses CSS variables for theming:

```css
:root {
  --mbc-color-primary: #your-primary-color;
  --mbc-color-primary-foreground: #your-primary-text-color;
  --mbc-color-destructive: #your-destructive-color;
  --mbc-color-destructive-foreground: #your-destructive-text-color;
  --mbc-color-success-50: #your-success-background;
  --mbc-color-success-700: #your-success-text;
  --mbc-color-warning-50: #your-warning-background;
  --mbc-color-warning-700: #your-warning-text;
  --mbc-color-error-50: #your-error-background;
  --mbc-color-error-700: #your-error-text;
  --mbc-radius-2xl: 16px;
  --mbc-spacing-1: 4px;
  --mbc-spacing-2: 8px;
  --mbc-spacing-4: 16px;
}
```

## Accessibility

- ✅ High contrast support
- ✅ Screen reader friendly
- ✅ Keyboard navigation (when interactive)
- ✅ Proper color contrast ratios

## Examples

### Notification Badge

```tsx
import { Badge } from '@mbc-cqrs-serverless-web/shared-ui'
import { Bell } from 'lucide-react'

export default function NotificationBadge({ count }: { count: number }) {
  return (
    <div className="relative">
      <Bell className="h-6 w-6" />
      {count > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {count > 99 ? '99+' : count}
        </Badge>
      )}
    </div>
  )
}
```

### Status Indicators

```tsx
export default function StatusIndicators() {
  const users = [
    { name: 'John Doe', status: 'active' },
    { name: 'Jane Smith', status: 'invited' },
    { name: 'Bob Johnson', status: 'inactive' }
  ]

  return (
    <div className="space-y-2">
      {users.map(user => (
        <div key={user.name} className="flex items-center justify-between">
          <span>{user.name}</span>
          <Badge variant={user.status as any}>
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </Badge>
        </div>
      ))}
    </div>
  )
}
```

### Filter Tags

```tsx
import { useState } from 'react'
import { Badge } from '@mbc-cqrs-serverless-web/shared-ui'

export default function FilterTags() {
  const [filters, setFilters] = useState(['react', 'typescript', 'nextjs'])

  const removeFilter = (filter: string) => {
    setFilters(filters.filter(f => f !== filter))
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(filter => (
        <Badge 
          key={filter}
          variant="selected"
          className="cursor-pointer"
          onClick={() => removeFilter(filter)}
        >
          {filter} ×
        </Badge>
      ))}
    </div>
  )
}
```

### Progress Badges

```tsx
export default function ProgressBadges() {
  const steps = [
    { name: 'Draft', status: 'completed' },
    { name: 'Review', status: 'active' },
    { name: 'Publish', status: 'pending' }
  ]

  return (
    <div className="flex space-x-2">
      {steps.map((step, index) => (
        <Badge 
          key={step.name}
          variant={
            step.status === 'completed' ? 'active' :
            step.status === 'active' ? 'selected' : 'un_selected'
          }
        >
          {index + 1}. {step.name}
        </Badge>
      ))}
    </div>
  )
}
```
