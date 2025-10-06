# Accordion

A collapsible content component that allows users to expand and collapse sections of content.

## Import

```tsx
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'
```

## Basic Usage

```tsx
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'

export default function MyComponent() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

## Multiple Selection

```tsx
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'

export default function MultipleAccordion() {
  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is React?</AccordionTrigger>
        <AccordionContent>
          React is a JavaScript library for building user interfaces.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>What is TypeScript?</AccordionTrigger>
        <AccordionContent>
          TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>What is Next.js?</AccordionTrigger>
        <AccordionContent>
          Next.js is a React framework for production with many built-in features.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

## Controlled Accordion

```tsx
import { useState } from 'react'
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'

export default function ControlledAccordion() {
  const [value, setValue] = useState<string>('item-1')

  return (
    <Accordion 
      type="single" 
      value={value} 
      onValueChange={setValue}
      className="w-full"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Section 1</AccordionTrigger>
        <AccordionContent>
          Content for section 1
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Section 2</AccordionTrigger>
        <AccordionContent>
          Content for section 2
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

## With Custom Content

```tsx
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Card, CardContent, CardHeader, CardTitle } from '@mbc-cqrs-serverless-web/shared-ui'
import { Badge } from '@mbc-cqrs-serverless-web/shared-ui'

export default function CustomContentAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-left">
          <div className="flex items-center justify-between w-full">
            <span>Project Alpha</span>
            <Badge variant="active">Active</Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This is a detailed description of Project Alpha.</p>
              <div className="mt-4 space-y-2">
                <p><strong>Status:</strong> In Progress</p>
                <p><strong>Team:</strong> 5 members</p>
                <p><strong>Deadline:</strong> March 15, 2024</p>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

## FAQ Accordion

```tsx
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'

export default function FAQAccordion() {
  const faqs = [
    {
      question: "How do I get started?",
      answer: "You can get started by creating an account and following our onboarding process."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers."
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Yes, you can cancel your subscription at any time from your account settings."
    },
    {
      question: "Do you offer customer support?",
      answer: "Yes, we provide 24/7 customer support via email, chat, and phone."
    }
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
```

## Nested Accordion

```tsx
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'

export default function NestedAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Frontend Development</AccordionTrigger>
        <AccordionContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="sub-item-1">
              <AccordionTrigger>React</AccordionTrigger>
              <AccordionContent>
                React is a JavaScript library for building user interfaces.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="sub-item-2">
              <AccordionTrigger>Vue.js</AccordionTrigger>
              <AccordionContent>
                Vue.js is a progressive JavaScript framework.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Backend Development</AccordionTrigger>
        <AccordionContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="sub-item-3">
              <AccordionTrigger>Node.js</AccordionTrigger>
              <AccordionContent>
                Node.js is a JavaScript runtime built on Chrome's V8 engine.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="sub-item-4">
              <AccordionTrigger>Python</AccordionTrigger>
              <AccordionContent>
                Python is a high-level programming language.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

## Props

### Accordion Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'single' \| 'multiple'` | `'single'` | Accordion type |
| `value` | `string \| string[]` | - | Controlled value(s) |
| `defaultValue` | `string \| string[]` | - | Default value(s) |
| `onValueChange` | `(value: string \| string[]) => void` | - | Value change handler |
| `collapsible` | `boolean` | `false` | Allow collapsing all items |
| `className` | `string` | - | Additional CSS classes |

### AccordionItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Unique value for the item |
| `className` | `string` | - | Additional CSS classes |

### AccordionTrigger Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `asChild` | `boolean` | `false` | Render as child component |

### AccordionContent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

## Styling

The Accordion component uses CSS variables for theming:

```css
:root {
  --mbc-color-background: #your-background-color;
  --mbc-color-foreground: #your-text-color;
  --mbc-color-border: #your-border-color;
  --mbc-color-muted: #your-muted-color;
  --mbc-color-muted-foreground: #your-muted-text-color;
  --mbc-radius-md: 8px;
  --mbc-spacing-4: 16px;
  --mbc-spacing-2: 8px;
}
```

## Accessibility

- ✅ Keyboard navigation (Arrow keys, Enter, Space)
- ✅ Screen reader support
- ✅ ARIA attributes
- ✅ Focus management
- ✅ High contrast support

## Examples

### Settings Accordion

```tsx
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { Switch } from '@mbc-cqrs-serverless-web/shared-ui'
import { Label } from '@mbc-cqrs-serverless-web/shared-ui'

export default function SettingsAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="notifications">
        <AccordionTrigger>Notifications</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <Switch id="email-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-gray-500">Receive push notifications</p>
              </div>
              <Switch id="push-notifications" />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="privacy">
        <AccordionTrigger>Privacy</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="profile-visibility">Profile Visibility</Label>
                <p className="text-sm text-gray-500">Make your profile public</p>
              </div>
              <Switch id="profile-visibility" />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

### Product Features Accordion

```tsx
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@mbc-cqrs-serverless-web/shared-ui'
import { CheckCircle, Star, Zap } from 'lucide-react'

export default function ProductFeaturesAccordion() {
  const features = [
    {
      title: "Performance",
      icon: Zap,
      description: "Lightning-fast performance with optimized rendering",
      benefits: [
        "Sub-100ms response times",
        "Optimized bundle size",
        "Lazy loading support"
      ]
    },
    {
      title: "Quality",
      icon: Star,
      description: "Built with attention to detail and best practices",
      benefits: [
        "TypeScript support",
        "Accessibility compliant",
        "Cross-browser compatible"
      ]
    },
    {
      title: "Reliability",
      icon: CheckCircle,
      description: "Tested and proven in production environments",
      benefits: [
        "99.9% uptime",
        "Comprehensive test coverage",
        "Regular security updates"
      ]
    }
  ]

  return (
    <Accordion type="single" collapsible className="w-full">
      {features.map((feature, index) => (
        <AccordionItem key={index} value={`feature-${index}`}>
          <AccordionTrigger className="text-left">
            <div className="flex items-center space-x-3">
              <feature.icon className="h-5 w-5" />
              <span>{feature.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <p className="text-gray-600">{feature.description}</p>
              <ul className="space-y-1">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
```
