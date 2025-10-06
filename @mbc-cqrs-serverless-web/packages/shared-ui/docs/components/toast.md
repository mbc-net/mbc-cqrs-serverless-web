# Toast

A notification component for displaying temporary messages with different variants and actions.

## Import

```tsx
import { 
  Toast, 
  ToastAction, 
  ToastClose, 
  ToastDescription, 
  ToastProvider, 
  ToastTitle, 
  ToastViewport 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { useToast } from '@mbc-cqrs-serverless-web/shared-ui'
```

## Basic Usage

```tsx
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { useToast } from '@mbc-cqrs-serverless-web/shared-ui'

export default function MyComponent() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: "Scheduled: Catch up",
          description: "Friday, February 10, 2023 at 5:57 PM",
        })
      }}
    >
      Show Toast
    </Button>
  )
}
```

## Toast Variants

```tsx
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { useToast } from '@mbc-cqrs-serverless-web/shared-ui'

export default function ToastVariants() {
  const { toast } = useToast()

  return (
    <div className="space-x-2">
      <Button
        onClick={() => {
          toast({
            title: "Default Toast",
            description: "This is a default toast message.",
          })
        }}
      >
        Default
      </Button>
      <Button
        onClick={() => {
          toast({
            title: "Destructive Toast",
            description: "This is a destructive toast message.",
            variant: "destructive",
          })
        }}
      >
        Destructive
      </Button>
    </div>
  )
}
```

## Toast with Actions

```tsx
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { useToast } from '@mbc-cqrs-serverless-web/shared-ui'

export default function ToastWithActions() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: "Message sent",
          description: "Your message has been sent successfully.",
          action: (
            <ToastAction altText="Undo">
              Undo
            </ToastAction>
          ),
        })
      }}
    >
      Send Message
    </Button>
  )
}
```

## Toast with Close Button

```tsx
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { useToast } from '@mbc-cqrs-serverless-web/shared-ui'

export default function ToastWithClose() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: "Notification",
          description: "This toast has a close button.",
          action: (
            <ToastClose>
              <X className="h-4 w-4" />
            </ToastClose>
          ),
        })
      }}
    >
      Show Toast
    </Button>
  )
}
```

## Custom Toast Duration

```tsx
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { useToast } from '@mbc-cqrs-serverless-web/shared-ui'

export default function CustomDuration() {
  const { toast } = useToast()

  return (
    <div className="space-x-2">
      <Button
        onClick={() => {
          toast({
            title: "Quick Toast",
            description: "This will disappear in 2 seconds.",
            duration: 2000,
          })
        }}
      >
        Quick Toast
      </Button>
      <Button
        onClick={() => {
          toast({
            title: "Long Toast",
            description: "This will stay for 10 seconds.",
            duration: 10000,
          })
        }}
      >
        Long Toast
      </Button>
    </div>
  )
}
```

## Toast Provider Setup

```tsx
import { ToastProvider, ToastViewport } from '@mbc-cqrs-serverless-web/shared-ui'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ToastProvider>
          {children}
          <ToastViewport />
        </ToastProvider>
      </body>
    </html>
  )
}
```

## Multiple Toasts

```tsx
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { useToast } from '@mbc-cqrs-serverless-web/shared-ui'

export default function MultipleToasts() {
  const { toast } = useToast()

  const showMultipleToasts = () => {
    toast({
      title: "First Toast",
      description: "This is the first toast.",
    })
    
    setTimeout(() => {
      toast({
        title: "Second Toast",
        description: "This is the second toast.",
      })
    }, 1000)
    
    setTimeout(() => {
      toast({
        title: "Third Toast",
        description: "This is the third toast.",
      })
    }, 2000)
  }

  return (
    <Button onClick={showMultipleToasts}>
      Show Multiple Toasts
    </Button>
  )
}
```

## Toast with Custom Styling

```tsx
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { useToast } from '@mbc-cqrs-serverless-web/shared-ui'

export default function CustomStyledToast() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: "Custom Toast",
          description: "This toast has custom styling.",
          className: "bg-blue-500 text-white border-blue-600",
        })
      }}
    >
      Custom Toast
    </Button>
  )
}
```

## Props

### useToast Hook

The `useToast` hook returns an object with the following methods:

| Method | Type | Description |
|--------|------|-------------|
| `toast` | `(props: ToastProps) => void` | Show a toast notification |
| `dismiss` | `(toastId?: string) => void` | Dismiss a specific toast or all toasts |
| `toasts` | `Toast[]` | Array of current toasts |

### Toast Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Toast title |
| `description` | `string` | - | Toast description |
| `variant` | `'default' \| 'destructive'` | `'default'` | Toast variant |
| `action` | `React.ReactNode` | - | Action button or close button |
| `duration` | `number` | `5000` | Toast duration in milliseconds |
| `className` | `string` | - | Additional CSS classes |
| `onDismiss` | `() => void` | - | Dismiss callback |
| `onAutoClose` | `() => void` | - | Auto close callback |

### ToastAction Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `altText` | `string` | - | Alternative text for screen readers |
| `className` | `string` | - | Additional CSS classes |
| `onClick` | `() => void` | - | Click handler |

### ToastClose Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

## Styling

The Toast component uses CSS variables for theming:

```css
:root {
  --mbc-color-background: #your-background-color;
  --mbc-color-foreground: #your-text-color;
  --mbc-color-border: #your-border-color;
  --mbc-color-destructive: #your-destructive-color;
  --mbc-color-destructive-foreground: #your-destructive-text;
  --mbc-radius-lg: 12px;
  --mbc-spacing-4: 16px;
  --mbc-spacing-2: 8px;
}
```

## Accessibility

- ✅ Screen reader support
- ✅ Keyboard navigation
- ✅ ARIA attributes
- ✅ Focus management
- ✅ High contrast support

## Examples

### Success Toast

```tsx
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { useToast } from '@mbc-cqrs-serverless-web/shared-ui'
import { CheckCircle } from 'lucide-react'

export default function SuccessToast() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: "Success!",
          description: "Your changes have been saved.",
          action: (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>Success</span>
            </div>
          ),
        })
      }}
    >
      Save Changes
    </Button>
  )
}
```

### Error Toast with Retry

```tsx
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { useToast } from '@mbc-cqrs-serverless-web/shared-ui'
import { ToastAction } from '@mbc-cqrs-serverless-web/shared-ui'

export default function ErrorToast() {
  const { toast } = useToast()

  const handleRetry = () => {
    // Retry logic here
    toast({
      title: "Retrying...",
      description: "Attempting to save your changes.",
    })
  }

  return (
    <Button
      onClick={() => {
        toast({
          title: "Error",
          description: "Failed to save changes. Please try again.",
          variant: "destructive",
          action: (
            <ToastAction altText="Retry" onClick={handleRetry}>
              Retry
            </ToastAction>
          ),
        })
      }}
    >
      Save Changes
    </Button>
  )
}
```

### Loading Toast

```tsx
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { useToast } from '@mbc-cqrs-serverless-web/shared-ui'
import { Loader2 } from 'lucide-react'

export default function LoadingToast() {
  const { toast } = useToast()

  const handleAsyncAction = async () => {
    const toastId = toast({
      title: "Processing...",
      description: "Please wait while we process your request.",
      action: (
        <div className="flex items-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span>Loading</span>
        </div>
      ),
      duration: Infinity, // Don't auto-dismiss
    })

    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Update toast to success
      toast({
        id: toastId,
        title: "Success!",
        description: "Your request has been processed.",
        variant: "default",
        duration: 5000,
      })
    } catch (error) {
      // Update toast to error
      toast({
        id: toastId,
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  return (
    <Button onClick={handleAsyncAction}>
      Process Request
    </Button>
  )
}
```

### Toast with Custom Content

```tsx
import { Button } from '@mbc-cqrs-serverless-web/shared-ui'
import { useToast } from '@mbc-cqrs-serverless-web/shared-ui'
import { Card, CardContent, CardHeader, CardTitle } from '@mbc-cqrs-serverless-web/shared-ui'

export default function CustomContentToast() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: "New Message",
          description: "You have received a new message from John Doe.",
          action: (
            <Card className="w-80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Message Preview</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600">
                  "Hey! I wanted to follow up on our meeting yesterday..."
                </p>
              </CardContent>
            </Card>
          ),
        })
      }}
    >
      Show Message Toast
    </Button>
  )
}
```
