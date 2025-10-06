# @mbc-cqrs-serverless-web/shared-ui

A comprehensive React component library built with TypeScript, Tailwind CSS, and Radix UI primitives. Designed for Next.js 14/15 applications with full App Router support.

## Features

- 🎨 **MBC Design System** - Consistent styling with CSS variables
- ⚡ **Next.js 14/15 Ready** - Full App Router and Server Component support
- 📦 **Tree Shakeable** - Import only what you need
- 🎯 **TypeScript** - Full type safety and IntelliSense
- 🧪 **Tested** - Comprehensive test coverage with Vitest
- 📱 **Responsive** - Mobile-first design approach
- ♿ **Accessible** - Built on Radix UI primitives
- 🚀 **Optimized** - Small bundle size (12.5KB main, 2.9KB server)

## Installation

```bash
npm install @mbc-cqrs-serverless-web/shared-ui
```

## Quick Start

### Client Components (Interactive)

```tsx
'use client'
import { Button, Dialog, Calendar, Toast } from '@mbc-cqrs-serverless-web/shared-ui'

export default function MyPage() {
  return (
    <div>
      <Button variant="default">Click me</Button>
      <Calendar mode="single" />
    </div>
  )
}
```

### Server Components (SSR)

```tsx
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@mbc-cqrs-serverless-web/shared-ui/server'

export default function MyPage() {
  return (
    <div>
      <Badge variant="default">Server Rendered</Badge>
      <Card>
        <CardHeader>
          <CardTitle>Server Component</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This renders on the server!</p>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Styles

Import the CSS in your app:

```tsx
// In your app/globals.css or layout.tsx
import '@mbc-cqrs-serverless-web/shared-ui/styles'
```

## Component Categories

### 🎯 Core Components
- [Button](./docs/components/button.md) - Interactive buttons with variants
- [Badge](./docs/components/badge.md) - Status indicators and labels
- [Avatar](./docs/components/avatar.md) - User profile images
- [Skeleton](./docs/components/skeleton.md) - Loading placeholders

### 📝 Form Components
- [Input](./docs/components/input.md) - Text input fields
- [Textarea](./docs/components/textarea.md) - Multi-line text input
- [Label](./docs/components/label.md) - Form labels
- [Checkbox](./docs/components/checkbox.md) - Checkbox inputs
- [Radio Group](./docs/components/radio-group.md) - Radio button groups
- [Switch](./docs/components/switch.md) - Toggle switches
- [Select](./docs/components/select.md) - Dropdown selections
- [Multi Select](./docs/components/multi-select.md) - Multiple selection
- [Calendar](./docs/components/calendar.md) - Date picker

### 🏗️ Layout Components
- [Card](./docs/components/card.md) - Content containers
- [Separator](./docs/components/separator.md) - Visual dividers
- [Container](./docs/components/container.md) - Layout containers
- [Sheet](./docs/components/sheet.md) - Slide-out panels

### 📊 Data Display
- [Table](./docs/components/table.md) - Data tables
- [Pagination](./docs/components/pagination.md) - Page navigation
- [Tooltip](./docs/components/tooltip.md) - Hover information
- [Popover](./docs/components/popover.md) - Floating content

### 🎭 Overlay Components
- [Dialog](./docs/components/dialog.md) - Modal dialogs
- [Alert Dialog](./docs/components/alert-dialog.md) - Confirmation dialogs
- [Dropdown Menu](./docs/components/dropdown-menu.md) - Context menus
- [Toast](./docs/components/toast.md) - Notification messages

### 🧩 Complex Components
- [Accordion](./docs/components/accordion.md) - Collapsible content
- [Tabs](./docs/components/tabs.md) - Tabbed interfaces
- [Breadcrumb](./docs/components/breadcrumb.md) - Navigation breadcrumbs
- [Command](./docs/components/command.md) - Command palette
- [Scroll Area](./docs/components/scroll-area.md) - Custom scrollbars

## Theming

The library uses CSS variables for theming. Customize the theme by overriding CSS variables:

```css
:root {
  --mbc-color-primary: #your-primary-color;
  --mbc-color-secondary: #your-secondary-color;
  --mbc-radius-sm: 4px;
  --mbc-radius-md: 8px;
  --mbc-spacing-sm: 8px;
  --mbc-spacing-md: 16px;
}
```

## Bundle Size

- **Main Bundle**: 12.5KB gzipped (all components)
- **Server Bundle**: 2.9KB gzipped (server-compatible only)
- **CSS Bundle**: ~7KB gzipped

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import type { ButtonProps } from '@mbc-cqrs-serverless-web/shared-ui'

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />
}
```

## Testing

The library includes comprehensive tests:

```bash
npm run test
npm run test:coverage
```

## Performance

- ✅ Tree shaking enabled
- ✅ Optimized bundle splitting
- ✅ Server-side rendering support
- ✅ Minimal runtime overhead

## Browser Support

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Support

For questions and support, please open an issue on GitHub.

---

**Built with ❤️ for the MBC Design System**