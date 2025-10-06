# Component Documentation

This directory contains comprehensive documentation for all components in the `@mbc-cqrs-serverless-web/shared-ui` library.

## Core Components

### [Button](./button.md)
Interactive buttons with multiple variants, sizes, and states. Perfect for actions, forms, and navigation.

**Key Features:**
- 6 variants (default, destructive, outline, secondary, ghost, link)
- 4 sizes (sm, default, lg, icon)
- Loading and disabled states
- Icon support
- As child component support

### [Badge](./badge.md)
Status indicators and labels with multiple variants for different use cases.

**Key Features:**
- 9 variants including status indicators
- Selection states (selected/unselected)
- Icon support
- As child component support

### [Avatar](./avatar.md)
User profile images with fallback support and different sizes.

**Key Features:**
- Image and fallback support
- Multiple sizes
- Custom styling options

### [Skeleton](./skeleton.md)
Loading placeholders for better user experience during data fetching.

**Key Features:**
- Multiple shapes and sizes
- Customizable animation
- Responsive design

## Form Components

### [Input](./input.md)
Text input fields with validation states and accessibility features.

**Key Features:**
- Multiple input types
- Validation states
- Icon support
- Form integration

### [Textarea](./textarea.md)
Multi-line text input for longer content.

**Key Features:**
- Resizable textarea
- Character count
- Form validation

### [Label](./label.md)
Form labels with proper accessibility attributes.

**Key Features:**
- HTML for attribute support
- Required field indicators
- Custom styling

### [Checkbox](./checkbox.md)
Checkbox inputs with indeterminate state support.

**Key Features:**
- Checked, unchecked, and indeterminate states
- Form integration
- Custom styling

### [Radio Group](./radio-group.md)
Radio button groups for single selection.

**Key Features:**
- Grouped radio buttons
- Form integration
- Custom styling

### [Switch](./switch.md)
Toggle switches for boolean values.

**Key Features:**
- On/off states
- Form integration
- Custom styling

### [Select](./select.md)
Dropdown select component with keyboard navigation.

**Key Features:**
- Single and multiple selection
- Search functionality
- Grouped options
- Icon support

### [Multi Select](./multi-select.md)
Multiple selection component with search and filtering.

**Key Features:**
- Multiple selection
- Search and filter
- Custom display options

### [Calendar](./calendar.md)
Date picker component with multiple selection modes.

**Key Features:**
- Single, multiple, and range selection
- Date restrictions
- Custom day rendering
- Form integration

## Layout Components

### [Card](./card.md)
Content containers with header, content, and footer sections.

**Key Features:**
- Flexible structure
- Multiple variants
- Interactive states
- Image support

### [Separator](./separator.md)
Visual dividers for content separation.

**Key Features:**
- Horizontal and vertical orientation
- Custom styling
- Accessibility support

### [Container](./container.md)
Layout containers with responsive design.

**Key Features:**
- Responsive breakpoints
- Max width constraints
- Padding and margin options

### [Sheet](./sheet.md)
Slide-out panels for overlays and sidebars.

**Key Features:**
- Multiple positions
- Overlay support
- Custom content

## Data Display Components

### [Table](./table.md)
Data tables with sorting, selection, and responsive design.

**Key Features:**
- Sortable columns
- Row selection
- Responsive design
- Custom cell content

### [Pagination](./pagination.md)
Page navigation for large datasets.

**Key Features:**
- Page navigation
- Custom page sizes
- Jump to page
- Responsive design

### [Tooltip](./tooltip.md)
Hover information with positioning and styling options.

**Key Features:**
- Multiple positions
- Custom content
- Delay options
- Accessibility support

### [Popover](./popover.md)
Floating content containers with positioning.

**Key Features:**
- Flexible positioning
- Custom content
- Trigger options

## Overlay Components

### [Dialog](./dialog.md)
Modal dialogs for forms, confirmations, and content display.

**Key Features:**
- Modal and non-modal modes
- Form integration
- Custom content
- Accessibility support

### [Alert Dialog](./alert-dialog.md)
Confirmation dialogs for destructive actions.

**Key Features:**
- Confirmation actions
- Destructive variants
- Custom content

### [Dropdown Menu](./dropdown-menu.md)
Context menus with actions and navigation.

**Key Features:**
- Multiple menu items
- Separators and groups
- Icon support
- Keyboard navigation

### [Toast](./toast.md)
Notification messages with different variants and actions.

**Key Features:**
- Multiple variants
- Action buttons
- Custom duration
- Queue management

## Complex Components

### [Accordion](./accordion.md)
Collapsible content sections with single or multiple selection.

**Key Features:**
- Single and multiple selection
- Custom content
- Nested accordions
- Controlled state

### [Tabs](./tabs.md)
Tabbed interfaces for organizing content.

**Key Features:**
- Horizontal and vertical orientation
- Icon support
- Form integration
- Controlled state

### [Breadcrumb](./breadcrumb.md)
Navigation breadcrumbs for hierarchical content.

**Key Features:**
- Hierarchical navigation
- Custom separators
- Link support

### [Command](./command.md)
Command palette for search and actions.

**Key Features:**
- Search functionality
- Keyboard navigation
- Custom commands
- Grouping

### [Scroll Area](./scroll-area.md)
Custom scrollbars with styling options.

**Key Features:**
- Custom scrollbar styling
- Smooth scrolling
- Responsive design

## Usage Examples

### Basic Import
```tsx
import { Button, Input, Card } from '@mbc-cqrs-serverless-web/shared-ui'
```

### Server Components
```tsx
import { Badge, Card, Table } from '@mbc-cqrs-serverless-web/shared-ui/server'
```

### Form Integration
```tsx
import { 
  Input, 
  Label, 
  Button, 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@mbc-cqrs-serverless-web/shared-ui'

export default function ContactForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Select name="country" required>
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="ca">Canada</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

### Dashboard Layout
```tsx
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@mbc-cqrs-serverless-web/shared-ui'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">1,234</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

## Styling and Theming

All components use CSS variables for theming. Customize the appearance by overriding these variables:

```css
:root {
  --mbc-color-primary: #your-primary-color;
  --mbc-color-secondary: #your-secondary-color;
  --mbc-color-destructive: #your-destructive-color;
  --mbc-radius-md: 8px;
  --mbc-spacing-4: 16px;
}
```

## Accessibility

All components are built with accessibility in mind:

- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ ARIA attributes
- ✅ Focus management
- ✅ High contrast support

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import type { ButtonProps, InputProps } from '@mbc-cqrs-serverless-web/shared-ui'

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />
}
```

## Performance

- ✅ Tree shaking enabled
- ✅ Optimized bundle size
- ✅ Server-side rendering support
- ✅ Minimal runtime overhead

For more detailed information about each component, click on the component name above to view its full documentation.
