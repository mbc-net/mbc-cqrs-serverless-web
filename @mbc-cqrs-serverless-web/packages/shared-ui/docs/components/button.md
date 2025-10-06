# Button

A versatile button component with multiple variants and sizes, built on Radix UI primitives.

## Import

```tsx
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
// or for server components
import { Button } from '@mbc-cqrs-serverless-web/shared-ui/server'
```

## Basic Usage

```tsx
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'

export default function MyComponent() {
  return (
    <div className="space-y-4">
      <Button>Default Button</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  )
}
```

## Variants

| Variant | Description | Use Case |
|---------|-------------|----------|
| `default` | Primary button with solid background | Main actions |
| `destructive` | Red button for dangerous actions | Delete, remove |
| `outline` | Button with border and transparent background | Secondary actions |
| `secondary` | Gray button with solid background | Alternative actions |
| `ghost` | Transparent button with hover effects | Subtle actions |
| `link` | Text-only button that looks like a link | Navigation |

## Sizes

```tsx
<div className="space-y-4">
  <Button size="sm">Small</Button>
  <Button size="default">Default</Button>
  <Button size="lg">Large</Button>
  <Button size="icon">⚙️</Button>
</div>
```

| Size | Description | Height |
|------|-------------|--------|
| `sm` | Small button | 32px |
| `default` | Default button | 40px |
| `lg` | Large button | 48px |
| `icon` | Square button for icons | 40px |

## With Icons

```tsx
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { Plus, Download, Settings } from 'lucide-react'

export default function IconButtons() {
  return (
    <div className="space-x-2">
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Add Item
      </Button>
      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
      <Button size="icon" variant="ghost">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  )
}
```

## States

```tsx
<div className="space-y-4">
  <Button>Normal</Button>
  <Button disabled>Disabled</Button>
  <Button loading>Loading...</Button>
</div>
```

## As Child Component

```tsx
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import Link from 'next/link'

export default function ButtonAsLink() {
  return (
    <Button asChild>
      <Link href="/dashboard">
        Go to Dashboard
      </Link>
    </Button>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | Visual style variant |
| `size` | `'sm' \| 'default' \| 'lg' \| 'icon'` | `'default'` | Button size |
| `asChild` | `boolean` | `false` | Render as child component |
| `loading` | `boolean` | `false` | Show loading state |
| `disabled` | `boolean` | `false` | Disable the button |
| `className` | `string` | - | Additional CSS classes |
| `onClick` | `(event: MouseEvent) => void` | - | Click handler |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |

## Styling

The Button component uses CSS variables for theming:

```css
:root {
  --mbc-color-primary: #your-primary-color;
  --mbc-color-primary-foreground: #your-primary-text-color;
  --mbc-color-destructive: #your-destructive-color;
  --mbc-color-destructive-foreground: #your-destructive-text-color;
  --mbc-radius-md: 8px;
  --mbc-spacing-2: 8px;
  --mbc-spacing-4: 16px;
}
```

## Accessibility

- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ ARIA attributes
- ✅ Screen reader friendly
- ✅ High contrast support

## Examples

### Form Actions

```tsx
<form className="space-y-4">
  <div>
    <label htmlFor="email">Email</label>
    <input id="email" type="email" />
  </div>
  <div className="flex space-x-2">
    <Button type="submit">Save</Button>
    <Button type="button" variant="outline">Cancel</Button>
  </div>
</form>
```

### Loading State

```tsx
import { useState } from 'react'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'

export default function LoadingButton() {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
  }

  return (
    <Button loading={loading} onClick={handleClick}>
      {loading ? 'Saving...' : 'Save Changes'}
    </Button>
  )
}
```

### Button Group

```tsx
<div className="flex space-x-2">
  <Button variant="outline">Previous</Button>
  <Button>Next</Button>
  <Button variant="ghost">Skip</Button>
</div>
```
