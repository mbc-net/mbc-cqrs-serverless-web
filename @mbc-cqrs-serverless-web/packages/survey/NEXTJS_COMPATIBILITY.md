# Next.js 14/15 Compatibility Guide

This document outlines the Next.js 14/15 compatibility features and requirements for the `@mbc-cqrs-serverless-web/survey` library.

## ✅ Compatibility Features

### 1. Client Components
All survey components are properly configured as Client Components with the `'use client'` directive:

- **Survey Forms**: `SurveyForm` component
- **Question Renderers**: All 9 question type renderers
- **Question Creators**: All 9 question type creators
- **Survey Creators**: Main survey creator and all sub-components
- **Layout Components**: Sortable items and other layout components

### 2. App Router Support
The library is fully compatible with Next.js 14/15 App Router:

- All components use the `'use client'` directive
- No Server Component restrictions
- Compatible with both App Router and Pages Router

### 3. SSR/SSG Compatibility
The library supports both Server-Side Rendering (SSR) and Static Site Generation (SSG):

- Components can be rendered on the server
- Client-side hydration works correctly
- No hydration mismatches

### 4. React Version Support
The library supports both React 18 and React 19:

```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
```

## 📦 Installation

### For Next.js 14/15 Projects

```bash
npm install @mbc-cqrs-serverless-web/survey @mbc-cqrs-serverless-web/shared-ui
```

### Required Dependencies

```bash
npm install react-hook-form zod @dnd-kit/core @dnd-kit/sortable @hookform/resolvers
```

## 🚀 Usage Examples

### Basic Survey Form

```tsx
'use client'

import { SurveyForm } from '@mbc-cqrs-serverless-web/survey'
import { SURVEY_TEMPLATES } from '@mbc-cqrs-serverless-web/survey'

export default function SurveyPage() {
  const surveyData = SURVEY_TEMPLATES.BASIC

  return (
    <div className="container mx-auto p-4">
      <SurveyForm
        schema={surveyData}
        onSubmit={(data) => console.log('Survey submitted:', data)}
      />
    </div>
  )
}
```

### Survey Creator

```tsx
'use client'

import { SurveyCreator } from '@mbc-cqrs-serverless-web/survey'

export default function CreateSurveyPage() {
  return (
    <div className="container mx-auto p-4">
      <SurveyCreator
        onSave={(survey) => console.log('Survey saved:', survey)}
        onPublish={(survey) => console.log('Survey published:', survey)}
      />
    </div>
  )
}
```

### App Router Integration

```tsx
// app/surveys/page.tsx
'use client'

import { SurveyForm } from '@mbc-cqrs-serverless-web/survey'
import { SURVEY_TEMPLATES } from '@mbc-cqrs-serverless-web/survey'

export default function SurveysPage() {
  return (
    <div>
      <h1>Customer Satisfaction Survey</h1>
      <SurveyForm
        schema={SURVEY_TEMPLATES.CUSTOMER_SATISFACTION}
        onSubmit={async (data) => {
          // Handle form submission
          await fetch('/api/surveys/submit', {
            method: 'POST',
            body: JSON.stringify(data),
          })
        }}
      />
    </div>
  )
}
```

## 🔧 Configuration

### Next.js Configuration

No special Next.js configuration is required. The library works out of the box with:

- Next.js 14/15
- App Router
- Pages Router
- SSR/SSG
- Client-side rendering

### TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ]
  }
}
```

## 🎨 Styling

The survey library uses the shared-ui package for consistent styling:

```tsx
// Import shared-ui styles in your app
import '@mbc-cqrs-serverless-web/shared-ui/styles'
import '@mbc-cqrs-serverless-web/survey/styles'
```

## 🚨 Important Notes

### 1. Client Components Only
All survey components are Client Components and must be used in client-side contexts:

- ✅ Use in `'use client'` components
- ✅ Use in client-side event handlers
- ❌ Cannot be used in Server Components directly

### 2. Form Handling
The library uses React Hook Form for form management:

- Forms are fully controlled
- Validation is handled by Zod schemas
- Form state is managed client-side

### 3. Drag and Drop
The survey creator uses `@dnd-kit` for drag and drop functionality:

- Requires client-side JavaScript
- Works in all modern browsers
- Touch-friendly for mobile devices

## 🔍 Troubleshooting

### Common Issues

1. **Hydration Mismatch**: Ensure all components are properly marked as `'use client'`
2. **Import Errors**: Make sure all peer dependencies are installed
3. **Styling Issues**: Import shared-ui styles before survey styles

### Debug Mode

Enable debug mode for development:

```tsx
<SurveyForm
  schema={surveyData}
  onSubmit={handleSubmit}
  debug={process.env.NODE_ENV === 'development'}
/>
```

## 📚 Additional Resources

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [DnD Kit Documentation](https://dndkit.com/)

## 🆘 Support

For issues related to Next.js compatibility:

1. Check this compatibility guide
2. Review the component documentation
3. Check the GitHub issues
4. Contact the MBC team

---

**Last Updated**: December 19, 2024  
**Next.js Versions**: 14.x, 15.x  
**React Versions**: 18.x, 19.x
