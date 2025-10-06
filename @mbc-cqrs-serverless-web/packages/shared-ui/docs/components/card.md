# Card

A flexible card component for displaying content in a contained, elevated container.

## Import

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@mbc-cqrs-serverless-web/shared-ui'
// or for server components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@mbc-cqrs-serverless-web/shared-ui/server'
```

## Basic Usage

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@mbc-cqrs-serverless-web/shared-ui'

export default function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is the card content.</p>
      </CardContent>
    </Card>
  )
}
```

## Complete Card Structure

```tsx
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@mbc-cqrs-serverless-web/shared-ui'

export default function CompleteCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Optional description text</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Main card content goes here.</p>
      </CardContent>
      <CardFooter>
        <p>Footer content</p>
      </CardFooter>
    </Card>
  )
}
```

## Card Variants

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <Card>
    <CardHeader>
      <CardTitle>Default Card</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Standard card appearance</p>
    </CardContent>
  </Card>

  <Card className="border-2 border-dashed">
    <CardHeader>
      <CardTitle>Dashed Border</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Card with dashed border</p>
    </CardContent>
  </Card>

  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
    <CardHeader>
      <CardTitle>Gradient Background</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Card with gradient background</p>
    </CardContent>
  </Card>

  <Card className="shadow-lg">
    <CardHeader>
      <CardTitle>Elevated Shadow</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Card with enhanced shadow</p>
    </CardContent>
  </Card>
</div>
```

## Interactive Cards

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@mbc-cqrs-serverless-web/shared-ui'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'

export default function InteractiveCard() {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Hover over this card to see the shadow effect.</p>
        <Button className="mt-4">Action Button</Button>
      </CardContent>
    </Card>
  )
}
```

## Card with Images

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@mbc-cqrs-serverless-web/shared-ui'

export default function ImageCard() {
  return (
    <Card className="overflow-hidden">
      <img 
        src="/placeholder-image.jpg" 
        alt="Card image"
        className="w-full h-48 object-cover"
      />
      <CardHeader>
        <CardTitle>Image Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card with an image header.</p>
      </CardContent>
    </Card>
  )
}
```

## Card Grid Layout

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@mbc-cqrs-serverless-web/shared-ui'

export default function CardGrid() {
  const cards = [
    { title: 'Feature 1', content: 'Description of feature 1' },
    { title: 'Feature 2', content: 'Description of feature 2' },
    { title: 'Feature 3', content: 'Description of feature 3' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{card.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

## Card with Actions

```tsx
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'

export default function ActionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Name</CardTitle>
        <CardDescription>Product description and details</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">$99.99</p>
        <p className="text-sm text-gray-500">In stock</p>
      </CardContent>
      <CardFooter className="flex space-x-2">
        <Button className="flex-1">Add to Cart</Button>
        <Button variant="outline">View Details</Button>
      </CardFooter>
    </Card>
  )
}
```

## Card with Status

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@mbc-cqrs-serverless-web/shared-ui'
import { Badge } from '@mbc-cqrs-serverless-web/shared-ui'

export default function StatusCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Project Status</CardTitle>
        <Badge variant="active">Active</Badge>
      </CardHeader>
      <CardContent>
        <p>Project is currently in progress and on track.</p>
      </CardContent>
    </Card>
  )
}
```

## Props

### Card Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `onClick` | `(event: MouseEvent) => void` | - | Click handler |

### CardHeader Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### CardTitle Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### CardDescription Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### CardContent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### CardFooter Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

## Styling

The Card component uses CSS variables for theming:

```css
:root {
  --mbc-color-background: #your-background-color;
  --mbc-color-card: #your-card-background;
  --mbc-color-card-foreground: #your-card-text;
  --mbc-color-border: #your-border-color;
  --mbc-radius-lg: 12px;
  --mbc-spacing-6: 24px;
  --mbc-spacing-4: 16px;
  --mbc-spacing-2: 8px;
}
```

## Accessibility

- ✅ Semantic HTML structure
- ✅ Proper heading hierarchy
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ High contrast support

## Examples

### Dashboard Card

```tsx
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { TrendingUp, Users, DollarSign } from 'lucide-react'

export default function DashboardCard({ 
  title, 
  value, 
  change, 
  icon: Icon 
}: {
  title: string
  value: string
  change: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-green-600">{change}</span> from last month
        </p>
      </CardContent>
    </Card>
  )
}
```

### User Profile Card

```tsx
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Avatar } from '@mbc-cqrs-serverless-web/shared-ui'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'

export default function UserProfileCard({ user }: { user: any }) {
  return (
    <Card>
      <CardHeader className="text-center">
        <Avatar className="mx-auto mb-4">
          <img src={user.avatar} alt={user.name} />
        </Avatar>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Member since</p>
          <p className="font-medium">{user.joinDate}</p>
        </div>
        <Button className="w-full">Edit Profile</Button>
      </CardContent>
    </Card>
  )
}
```

### Settings Card

```tsx
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Switch } from '@mbc-cqrs-serverless-web/shared-ui'

export default function SettingsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Manage your notification preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Email Notifications</p>
            <p className="text-sm text-gray-500">Receive updates via email</p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Push Notifications</p>
            <p className="text-sm text-gray-500">Receive push notifications</p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  )
}
```
