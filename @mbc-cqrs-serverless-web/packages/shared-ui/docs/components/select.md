# Select

A dropdown select component built on Radix UI primitives with keyboard navigation and accessibility features.

## Import

```tsx
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@mbc-cqrs-serverless-web/shared-ui'
```

## Basic Usage

```tsx
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@mbc-cqrs-serverless-web/shared-ui'

export default function MyComponent() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

## Controlled Select

```tsx
import { useState } from 'react'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@mbc-cqrs-serverless-web/shared-ui'

export default function ControlledSelect() {
  const [value, setValue] = useState('')

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

## With Labels

```tsx
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Label } from '@mbc-cqrs-serverless-web/shared-ui'

export default function LabeledSelect() {
  return (
    <div className="space-y-2">
      <Label htmlFor="fruit-select">Choose a fruit</Label>
      <Select>
        <SelectTrigger id="fruit-select" className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
```

## Disabled State

```tsx
<div className="space-y-4">
  <Select disabled>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Disabled select" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
    </SelectContent>
  </Select>

  <Select>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Some items disabled" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana" disabled>Banana (Disabled)</SelectItem>
      <SelectItem value="orange">Orange</SelectItem>
    </SelectContent>
  </Select>
</div>
```

## With Icons

```tsx
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Globe, User, Settings } from 'lucide-react'

export default function SelectWithIcons() {
  return (
    <Select>
      <SelectTrigger className="w-[200px]">
        <div className="flex items-center">
          <Globe className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Select language" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">
          <div className="flex items-center">
            <Globe className="mr-2 h-4 w-4" />
            English
          </div>
        </SelectItem>
        <SelectItem value="es">
          <div className="flex items-center">
            <Globe className="mr-2 h-4 w-4" />
            Spanish
          </div>
        </SelectItem>
        <SelectItem value="fr">
          <div className="flex items-center">
            <Globe className="mr-2 h-4 w-4" />
            French
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
```

## Grouped Options

```tsx
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@mbc-cqrs-serverless-web/shared-ui'

export default function GroupedSelect() {
  return (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
          <SelectItem value="mx">Mexico</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="uk">United Kingdom</SelectItem>
          <SelectItem value="fr">France</SelectItem>
          <SelectItem value="de">Germany</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
```

## Form Integration

```tsx
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { Input } from '@mbc-cqrs-serverless-web/shared-ui'
import { Label } from '@mbc-cqrs-serverless-web/shared-ui'

export default function FormWithSelect() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select name="role" required>
          <SelectTrigger id="role">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrator</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="guest">Guest</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## Props

### Select Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled value |
| `defaultValue` | `string` | - | Uncontrolled default value |
| `onValueChange` | `(value: string) => void` | - | Value change handler |
| `disabled` | `boolean` | `false` | Disable the select |
| `required` | `boolean` | `false` | Mark as required |
| `name` | `string` | - | Form field name |

### SelectTrigger Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `asChild` | `boolean` | `false` | Render as child component |

### SelectValue Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | - | Placeholder text |
| `className` | `string` | - | Additional CSS classes |

### SelectContent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `position` | `'item-aligned' \| 'popper'` | `'popper'` | Positioning strategy |

### SelectItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Item value |
| `disabled` | `boolean` | `false` | Disable the item |
| `className` | `string` | - | Additional CSS classes |

### SelectGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### SelectLabel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

## Styling

The Select component uses CSS variables for theming:

```css
:root {
  --mbc-color-background: #your-background-color;
  --mbc-color-foreground: #your-text-color;
  --mbc-color-border: #your-border-color;
  --mbc-color-ring: #your-focus-ring-color;
  --mbc-color-accent: #your-accent-color;
  --mbc-color-accent-foreground: #your-accent-text;
  --mbc-radius-md: 8px;
  --mbc-spacing-2: 8px;
  --mbc-spacing-3: 12px;
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

### Country Selector

```tsx
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@mbc-cqrs-serverless-web/shared-ui'

export default function CountrySelector() {
  const countries = [
    { code: 'us', name: 'United States', flag: '🇺🇸' },
    { code: 'ca', name: 'Canada', flag: '🇨🇦' },
    { code: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'fr', name: 'France', flag: '🇫🇷' },
    { code: 'de', name: 'Germany', flag: '🇩🇪' },
  ]

  return (
    <Select>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select country" />
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            <div className="flex items-center">
              <span className="mr-2">{country.flag}</span>
              <span>{country.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

### Theme Selector

```tsx
import { useState } from 'react'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Sun, Moon, Monitor } from 'lucide-react'

export default function ThemeSelector() {
  const [theme, setTheme] = useState('system')

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Select theme" />
      </SelectTrigger>
      <SelectContent>
        {themes.map((themeOption) => (
          <SelectItem key={themeOption.value} value={themeOption.value}>
            <div className="flex items-center">
              <themeOption.icon className="mr-2 h-4 w-4" />
              <span>{themeOption.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

### Searchable Select

```tsx
import { useState, useMemo } from 'react'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Input } from '@mbc-cqrs-serverless-web/shared-ui'
import { Search } from 'lucide-react'

export default function SearchableSelect() {
  const [search, setSearch] = useState('')
  const [value, setValue] = useState('')

  const options = [
    'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 
    'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon'
  ]

  const filteredOptions = useMemo(() => {
    return options.filter(option =>
      option.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Search fruits..." />
      </SelectTrigger>
      <SelectContent>
        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        {filteredOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```
