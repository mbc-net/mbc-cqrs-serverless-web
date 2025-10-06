# Tabs

A tabbed interface component for organizing content into multiple panels with keyboard navigation and accessibility features.

## Import

```tsx
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'
```

## Basic Usage

```tsx
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'

export default function MyComponent() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-sm text-gray-500">
          Make changes to your account here. Click save when you're done.
        </p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-sm text-gray-500">
          Change your password here. After saving, you'll be logged out.
        </p>
      </TabsContent>
    </Tabs>
  )
}
```

## Multiple Tabs

```tsx
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'

export default function MultipleTabs() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Overview</h3>
          <p>This is the overview tab content.</p>
        </div>
      </TabsContent>
      <TabsContent value="analytics" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Analytics</h3>
          <p>This is the analytics tab content.</p>
        </div>
      </TabsContent>
      <TabsContent value="reports" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Reports</h3>
          <p>This is the reports tab content.</p>
        </div>
      </TabsContent>
      <TabsContent value="notifications" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <p>This is the notifications tab content.</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
```

## Controlled Tabs

```tsx
import { useState } from 'react'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'

export default function ControlledTabs() {
  const [activeTab, setActiveTab] = useState('tab1')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className="mt-6">
        <p>Content for Tab 1. Active tab: {activeTab}</p>
      </TabsContent>
      <TabsContent value="tab2" className="mt-6">
        <p>Content for Tab 2. Active tab: {activeTab}</p>
      </TabsContent>
      <TabsContent value="tab3" className="mt-6">
        <p>Content for Tab 3. Active tab: {activeTab}</p>
      </TabsContent>
    </Tabs>
  )
}
```

## Tabs with Icons

```tsx
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Home, Settings, User, Mail } from 'lucide-react'

export default function TabsWithIcons() {
  return (
    <Tabs defaultValue="home" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="home" className="flex items-center space-x-2">
          <Home className="h-4 w-4" />
          <span>Home</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </TabsTrigger>
        <TabsTrigger value="profile" className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>Profile</span>
        </TabsTrigger>
        <TabsTrigger value="messages" className="flex items-center space-x-2">
          <Mail className="h-4 w-4" />
          <span>Messages</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="home" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Home</h3>
          <p>Welcome to your dashboard!</p>
        </div>
      </TabsContent>
      <TabsContent value="settings" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Settings</h3>
          <p>Configure your preferences here.</p>
        </div>
      </TabsContent>
      <TabsContent value="profile" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Profile</h3>
          <p>Manage your profile information.</p>
        </div>
      </TabsContent>
      <TabsContent value="messages" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Messages</h3>
          <p>View your messages and notifications.</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
```

## Vertical Tabs

```tsx
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'

export default function VerticalTabs() {
  return (
    <Tabs defaultValue="general" orientation="vertical" className="w-full">
      <div className="flex space-x-4">
        <TabsList className="flex-col h-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <div className="flex-1">
          <TabsContent value="general" className="mt-0">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">General Settings</h3>
              <p>Configure your general application settings.</p>
            </div>
          </TabsContent>
          <TabsContent value="security" className="mt-0">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Security Settings</h3>
              <p>Manage your security preferences and authentication.</p>
            </div>
          </TabsContent>
          <TabsContent value="privacy" className="mt-0">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Privacy Settings</h3>
              <p>Control your privacy and data sharing preferences.</p>
            </div>
          </TabsContent>
          <TabsContent value="notifications" className="mt-0">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notification Settings</h3>
              <p>Customize how you receive notifications.</p>
            </div>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  )
}
```

## Tabs with Forms

```tsx
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { Input } from '@mbc-cqrs-serverless-web/shared-ui'
import { Label } from '@mbc-cqrs-serverless-web/shared-ui'

export default function TabsWithForms() {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList>
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>
      <TabsContent value="personal" className="mt-6">
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="Enter your first name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Enter your last name" />
          </div>
          <Button type="submit">Save Personal Info</Button>
        </form>
      </TabsContent>
      <TabsContent value="contact" className="mt-6">
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" placeholder="Enter your phone number" />
          </div>
          <Button type="submit">Save Contact Info</Button>
        </form>
      </TabsContent>
      <TabsContent value="preferences" className="mt-6">
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Input id="language" placeholder="Select your language" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input id="timezone" placeholder="Select your timezone" />
          </div>
          <Button type="submit">Save Preferences</Button>
        </form>
      </TabsContent>
    </Tabs>
  )
}
```

## Props

### Tabs Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled active tab |
| `defaultValue` | `string` | - | Default active tab |
| `onValueChange` | `(value: string) => void` | - | Tab change handler |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Tab orientation |
| `className` | `string` | - | Additional CSS classes |

### TabsList Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### TabsTrigger Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Unique value for the trigger |
| `disabled` | `boolean` | `false` | Disable the trigger |
| `className` | `string` | - | Additional CSS classes |
| `asChild` | `boolean` | `false` | Render as child component |

### TabsContent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Value that matches the trigger |
| `className` | `string` | - | Additional CSS classes |

## Styling

The Tabs component uses CSS variables for theming:

```css
:root {
  --mbc-color-background: #your-background-color;
  --mbc-color-foreground: #your-text-color;
  --mbc-color-border: #your-border-color;
  --mbc-color-muted: #your-muted-color;
  --mbc-color-muted-foreground: #your-muted-text-color;
  --mbc-color-accent: #your-accent-color;
  --mbc-color-accent-foreground: #your-accent-text;
  --mbc-radius-md: 8px;
  --mbc-spacing-2: 8px;
  --mbc-spacing-4: 16px;
}
```

## Accessibility

- ✅ Keyboard navigation (Arrow keys, Tab, Enter)
- ✅ Screen reader support
- ✅ ARIA attributes
- ✅ Focus management
- ✅ High contrast support

## Examples

### Dashboard Tabs

```tsx
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Card, CardContent, CardHeader, CardTitle } from '@mbc-cqrs-serverless-web/shared-ui'

export default function DashboardTabs() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1,234</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$12,345</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">567</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="analytics" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Analytics content goes here.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="reports" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Reports content goes here.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
```

### Product Tabs

```tsx
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Badge } from '@mbc-cqrs-serverless-web/shared-ui'

export default function ProductTabs({ product }: { product: any }) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList>
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specifications">Specifications</TabsTrigger>
        <TabsTrigger value="reviews">
          Reviews
          <Badge variant="secondary" className="ml-2">12</Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="description" className="mt-6">
        <div className="prose">
          <p>{product.description}</p>
        </div>
      </TabsContent>
      <TabsContent value="specifications" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Specifications</h3>
          <dl className="grid grid-cols-2 gap-4">
            <dt className="font-medium">Weight</dt>
            <dd>{product.weight}</dd>
            <dt className="font-medium">Dimensions</dt>
            <dd>{product.dimensions}</dd>
            <dt className="font-medium">Material</dt>
            <dd>{product.material}</dd>
          </dl>
        </div>
      </TabsContent>
      <TabsContent value="reviews" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Customer Reviews</h3>
          <div className="space-y-4">
            {product.reviews?.map((review: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium">{review.author}</span>
                  <Badge variant="outline">{review.rating}/5</Badge>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
```
