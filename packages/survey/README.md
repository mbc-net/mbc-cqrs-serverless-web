# @mbc-cqrs-serverless/survey-web

A comprehensive React component library for building dynamic surveys and forms, built for Next.js applications.

## Features

- 🎨 **Modern UI Components** - Built with Radix UI and Tailwind CSS
- 📝 **Dynamic Survey Builder** - Create surveys with drag-and-drop interface
- 🔧 **Multiple Question Types** - Short text, long text, single/multiple choice, linear scale, rating, date, time
- ✅ **Advanced Validation** - Custom validation rules with Zod schema validation
- 🔄 **Real-time Updates** - AWS AppSync integration for live data synchronization
- 📱 **Responsive Design** - Mobile-first approach with responsive layouts
- 🎯 **TypeScript Support** - Full TypeScript support with comprehensive type definitions

## Installation

```bash
npm install @mbc-cqrs-serverless/survey-web
```

## Environment Variables Setup

### Required Environment Variables

Create a `.env.local` file in your Next.js project root with the following variables:

```bash
# AWS AppSync Configuration
NEXT_PUBLIC_AWS_APPSYNC_GRAPHQLENDPOINT=https://your-appsync-endpoint.amazonaws.com/graphql
NEXT_PUBLIC_AWS_APPSYNC_APIKEY=your-appsync-api-key
NEXT_PUBLIC_AWS_APPSYNC_REGION=us-east-1

# API Configuration
NEXT_PUBLIC_API_URL=https://your-api-endpoint.com
NEXT_PUBLIC_TENANT_CODE=your-tenant-code

# AWS Amplify Configuration (if using Cognito authentication)
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_USER_POOL_ID=your-user-pool-id
NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID=your-client-id
```

### Environment Variables Explained

| Variable                                  | Description                                     | Required |
| ----------------------------------------- | ----------------------------------------------- | -------- |
| `NEXT_PUBLIC_AWS_APPSYNC_GRAPHQLENDPOINT` | Your AWS AppSync GraphQL endpoint URL           | ✅       |
| `NEXT_PUBLIC_AWS_APPSYNC_APIKEY`          | Your AWS AppSync API key for authentication     | ✅       |
| `NEXT_PUBLIC_AWS_APPSYNC_REGION`          | AWS region where your AppSync API is deployed   | ✅       |
| `NEXT_PUBLIC_API_URL`                     | Base URL for your REST API endpoints            | ✅       |
| `NEXT_PUBLIC_TENANT_CODE`                 | Tenant identifier for multi-tenant applications | ✅       |
| `NEXT_PUBLIC_AWS_REGION`                  | AWS region for Amplify configuration            | Optional |
| `NEXT_PUBLIC_AWS_USER_POOL_ID`            | Cognito User Pool ID for authentication         | Optional |
| `NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID` | Cognito User Pool Web Client ID                 | Optional |

## Usage

### 1. Basic Setup

First, import the CSS styles in your Next.js application:

```tsx
// pages/_app.tsx or app/layout.tsx
import '@mbc-cqrs-serverless/survey-web/styles.css'
```

### 2. Survey Template Management

```tsx
import { SurveyTemplatePage } from '@mbc-cqrs-serverless/survey-web/SurveyTemplatePage'

export default function SurveyTemplates() {
  return <SurveyTemplatePage />
}
```

### 3. Edit Survey Template

```tsx
import { EditSurveyTemplatePage } from '@mbc-cqrs-serverless/survey-web/EditSurveyTemplatePage'

export default function EditSurvey({ params }: { params: { id: string } }) {
  return <EditSurveyTemplatePage id={params.id} />
}
```

### 4. Survey Form (Public-facing)

```tsx
import { SurveyForm } from '@mbc-cqrs-serverless/survey-web/SurveyForm'

export default function Survey({ params }: { params: { id: string } }) {
  return <SurveyForm surveyId={params.id} />
}
```

## Question Types

The library supports various question types:

### Text Questions

- **Short Text** - Single line text input with validation
- **Long Text** - Multi-line text input (paragraph)

### Choice Questions

- **Single Choice** - Radio buttons with conditional logic
- **Multiple Choice** - Checkboxes with min/max selection
- **Dropdown** - Select dropdown with options

### Scale Questions

- **Linear Scale** - Numeric scale with custom min/max
- **Rating** - Star/heart/thumb rating system

### Date/Time Questions

- **Date** - Date picker with optional time
- **Time** - Time picker for time or duration

## Validation Rules

### Text Validation

```typescript
{
  validation: {
    required: true,
    custom: {
      type: "length",
      rule: "min",
      value: 5,
      customError: "Minimum 5 characters required"
    }
  }
}
```

### Number Validation

```typescript
{
  validation: {
    custom: {
      type: "number",
      rule: "between",
      value: 18,
      value2: 65,
      customError: "Age must be between 18 and 65"
    }
  }
}
```

### Email Validation

```typescript
{
  validation: {
    custom: {
      type: "text",
      rule: "is_email",
      customError: "Please enter a valid email address"
    }
  }
}
```

## API Integration

The library automatically handles:

- **Authentication** - AWS Amplify session tokens
- **GraphQL Queries** - AppSync integration for real-time data
- **REST API Calls** - Axios-based HTTP client with interceptors
- **Error Handling** - Comprehensive error management

## Development

### Building the Package

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Type Checking

```bash
npm run type-check
```

## Peer Dependencies

Make sure you have these peer dependencies installed:

```bash
npm install next@^14.0.0 react@^18.0.0 react-dom@^18.0.0
```

## Documentation

For detailed documentation, guides, and API reference, visit the official documentation site:

- [Survey Web Documentation](https://mbc-cqrs-serverless.mbc-net.com/docs/survey-web)

## License

MIT © Murakami Business Consulting, Inc.

## Support

For issues and questions, please visit our [GitHub repository](https://github.com/mbc-net/mbc-cqrs-serverless-web).
