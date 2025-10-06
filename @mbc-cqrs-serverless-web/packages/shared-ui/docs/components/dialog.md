# Dialog

A modal dialog component built on Radix UI primitives, perfect for overlays, forms, and confirmations.

## Import

```tsx
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'
```

## Basic Usage

```tsx
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'

export default function MyComponent() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a dialog description.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Dialog content goes here.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

## Controlled Dialog

```tsx
import { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'

export default function ControlledDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Controlled Dialog</DialogTitle>
          <DialogDescription>
            This dialog is controlled by state.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Dialog content</p>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

## Dialog with Form

```tsx
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { Input } from '@mbc-cqrs-serverless-web/shared-ui'
import { Label } from '@mbc-cqrs-serverless-web/shared-ui'

export default function FormDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Enter the user details below.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter email" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit">Add User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

## Confirmation Dialog

```tsx
import { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'

export default function ConfirmationDialog({ 
  onConfirm, 
  itemName 
}: { 
  onConfirm: () => void
  itemName: string 
}) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    onConfirm()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete {itemName}
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete {itemName}.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

## Dialog Sizes

```tsx
<div className="space-y-4">
  <Dialog>
    <DialogTrigger asChild>
      <Button>Small Dialog</Button>
    </DialogTrigger>
    <DialogContent className="max-w-sm">
      <DialogHeader>
        <DialogTitle>Small Dialog</DialogTitle>
      </DialogHeader>
      <p>This is a small dialog.</p>
    </DialogContent>
  </Dialog>

  <Dialog>
    <DialogTrigger asChild>
      <Button>Large Dialog</Button>
    </DialogTrigger>
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Large Dialog</DialogTitle>
      </DialogHeader>
      <p>This is a large dialog with more content.</p>
    </DialogContent>
  </Dialog>
</div>
```

## Dialog with Custom Content

```tsx
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { Card, CardContent, CardHeader, CardTitle } from '@mbc-cqrs-serverless-web/shared-ui'

export default function CustomContentDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>
            Complete information about the selected product
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Product specifications go here.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Customer reviews go here.</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

## Props

### Dialog Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Open state change handler |
| `defaultOpen` | `boolean` | `false` | Default open state |

### DialogTrigger Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Render as child component |

### DialogContent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | - | Escape key handler |
| `onPointerDownOutside` | `(event: PointerEvent) => void` | - | Outside click handler |

### DialogHeader Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### DialogTitle Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### DialogDescription Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### DialogFooter Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

## Styling

The Dialog component uses CSS variables for theming:

```css
:root {
  --mbc-color-background: #your-background-color;
  --mbc-color-foreground: #your-text-color;
  --mbc-color-border: #your-border-color;
  --mbc-color-ring: #your-focus-ring-color;
  --mbc-radius-lg: 12px;
  --mbc-spacing-6: 24px;
  --mbc-spacing-4: 16px;
  --mbc-spacing-2: 8px;
}
```

## Accessibility

- ✅ Focus management and trapping
- ✅ Keyboard navigation (Escape to close)
- ✅ Screen reader support
- ✅ ARIA attributes
- ✅ High contrast support
- ✅ Click outside to close

## Examples

### Image Gallery Dialog

```tsx
import { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'

export default function ImageGalleryDialog({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <img 
          src={images[0]} 
          alt="Gallery thumbnail"
          className="cursor-pointer rounded-lg"
        />
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <div className="space-y-4">
          <img 
            src={images[selectedImage]} 
            alt={`Gallery image ${selectedImage + 1}`}
            className="w-full rounded-lg"
          />
          <div className="flex space-x-2">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`w-16 h-16 rounded cursor-pointer ${
                  index === selectedImage ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### Settings Dialog

```tsx
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { Switch } from '@mbc-cqrs-serverless-web/shared-ui'
import { Label } from '@mbc-cqrs-serverless-web/shared-ui'

export default function SettingsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Settings</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your application settings
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications">Notifications</Label>
              <p className="text-sm text-gray-500">
                Receive email notifications
              </p>
            </div>
            <Switch id="notifications" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-gray-500">
                Switch to dark theme
              </p>
            </div>
            <Switch id="dark-mode" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```
