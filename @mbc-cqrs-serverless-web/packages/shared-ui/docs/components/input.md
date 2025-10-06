# Input

A versatile input component with built-in validation states, icons, and accessibility features.

## Import

```tsx
import { Input } from '@mbc-cqrs-serverless-web/shared-ui'
// or for server components
import { Input } from '@mbc-cqrs-serverless-web/shared-ui/server'
```

## Basic Usage

```tsx
import { Input } from '@mbc-cqrs-serverless-web/shared-ui'

export default function MyComponent() {
  return (
    <div className="space-y-4">
      <Input placeholder="Enter your email" />
      <Input type="password" placeholder="Enter your password" />
      <Input type="email" placeholder="Enter your email" />
      <Input type="number" placeholder="Enter a number" />
    </div>
  )
}
```

## Input Types

```tsx
<div className="space-y-4">
  <Input type="text" placeholder="Text input" />
  <Input type="email" placeholder="Email input" />
  <Input type="password" placeholder="Password input" />
  <Input type="number" placeholder="Number input" />
  <Input type="tel" placeholder="Phone input" />
  <Input type="url" placeholder="URL input" />
  <Input type="search" placeholder="Search input" />
</div>
```

## With Labels

```tsx
import { Input } from '@mbc-cqrs-serverless-web/shared-ui'
import { Label } from '@mbc-cqrs-serverless-web/shared-ui'

export default function LabeledInput() {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email Address</Label>
      <Input id="email" type="email" placeholder="Enter your email" />
    </div>
  )
}
```

## Validation States

```tsx
<div className="space-y-4">
  <Input placeholder="Normal state" />
  <Input placeholder="Error state" className="border-red-500" />
  <Input placeholder="Success state" className="border-green-500" />
  <Input placeholder="Disabled state" disabled />
</div>
```

## With Icons

```tsx
import { Input } from '@mbc-cqrs-serverless-web/shared-ui'
import { Search, Mail, Lock, User } from 'lucide-react'

export default function InputWithIcons() {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input placeholder="Search..." className="pl-10" />
      </div>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input type="email" placeholder="Email" className="pl-10" />
      </div>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input type="password" placeholder="Password" className="pl-10" />
      </div>
    </div>
  )
}
```

## With Action Buttons

```tsx
import { Input } from '@mbc-cqrs-serverless-web/shared-ui'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Input 
        type={showPassword ? "text" : "password"} 
        placeholder="Enter password"
        className="pr-10"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  )
}
```

## Form Integration

```tsx
import { Input } from '@mbc-cqrs-serverless-web/shared-ui'
import { Label } from '@mbc-cqrs-serverless-web/shared-ui'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'

export default function ContactForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## Controlled Input

```tsx
import { Input } from '@mbc-cqrs-serverless-web/shared-ui'
import { useState } from 'react'

export default function ControlledInput() {
  const [value, setValue] = useState('')

  return (
    <div className="space-y-2">
      <Input 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type something..."
      />
      <p className="text-sm text-gray-500">You typed: {value}</p>
    </div>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| 'url' \| 'search'` | `'text'` | Input type |
| `placeholder` | `string` | - | Placeholder text |
| `value` | `string` | - | Controlled value |
| `defaultValue` | `string` | - | Uncontrolled default value |
| `disabled` | `boolean` | `false` | Disable the input |
| `required` | `boolean` | `false` | Mark as required |
| `readOnly` | `boolean` | `false` | Make read-only |
| `autoComplete` | `string` | - | Autocomplete attribute |
| `autoFocus` | `boolean` | `false` | Auto-focus on mount |
| `className` | `string` | - | Additional CSS classes |
| `onChange` | `(event: ChangeEvent<HTMLInputElement>) => void` | - | Change handler |
| `onFocus` | `(event: FocusEvent<HTMLInputElement>) => void` | - | Focus handler |
| `onBlur` | `(event: FocusEvent<HTMLInputElement>) => void` | - | Blur handler |

## Styling

The Input component uses CSS variables for theming:

```css
:root {
  --mbc-color-background: #your-background-color;
  --mbc-color-foreground: #your-text-color;
  --mbc-color-border: #your-border-color;
  --mbc-color-ring: #your-focus-ring-color;
  --mbc-color-destructive: #your-error-color;
  --mbc-radius-md: 8px;
  --mbc-spacing-2: 8px;
  --mbc-spacing-3: 12px;
  --mbc-spacing-4: 16px;
}
```

## Accessibility

- ✅ Proper labeling with `htmlFor` and `id`
- ✅ ARIA attributes for validation states
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ High contrast support
- ✅ Focus management

## Examples

### Search Input

```tsx
import { Input } from '@mbc-cqrs-serverless-web/shared-ui'
import { Search } from 'lucide-react'

export default function SearchInput({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input 
        placeholder="Search products..."
        className="pl-10"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
}
```

### Validation Input

```tsx
import { Input } from '@mbc-cqrs-serverless-web/shared-ui'
import { useState } from 'react'

export default function ValidationInput() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      setError('Please enter a valid email address')
    } else {
      setError('')
    }
  }

  return (
    <div className="space-y-2">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          validateEmail(e.target.value)
        }}
        className={error ? 'border-red-500' : ''}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
```

### File Upload Input

```tsx
import { Input } from '@mbc-cqrs-serverless-web/shared-ui'
import { Upload } from 'lucide-react'

export default function FileUploadInput() {
  return (
    <div className="space-y-2">
      <label className="flex cursor-pointer items-center space-x-2">
        <Upload className="h-4 w-4" />
        <span>Upload File</span>
        <Input 
          type="file" 
          className="hidden" 
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              console.log('Selected file:', file.name)
            }
          }}
        />
      </label>
    </div>
  )
}
```
