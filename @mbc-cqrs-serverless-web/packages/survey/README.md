# @mbc-cqrs-serverless-web/survey

Survey components and creators for MBC applications.

## Installation

```bash
npm install @mbc-cqrs-serverless-web/survey
```

## Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install @mbc-cqrs-serverless-web/shared-ui react react-dom react-hook-form zod
```

## Usage

### Basic Survey Form

```tsx
import { SurveyForm } from '@mbc-cqrs-serverless-web/survey'
import '@mbc-cqrs-serverless-web/survey/styles'

function App() {
  const handleSubmit = (data) => {
    console.log('Survey data:', data)
  }

  return (
    <SurveyForm
      schema={surveySchema}
      onSubmit={handleSubmit}
    />
  )
}
```

### Survey Creator

```tsx
import { SurveyCreator } from '@mbc-cqrs-serverless-web/survey'

function App() {
  const handleSave = (schema) => {
    console.log('Survey schema:', schema)
  }

  return (
    <SurveyCreator
      initialSchema={initialSchema}
      onSubmit={handleSave}
    />
  )
}
```

## Components

### Forms
- `SurveyForm` - Main survey form component

### Question Renderers
- `ShortTextQuestionComponent`
- `LongTextQuestionComponent`
- `LinearScaleQuestionComponent`
- `SingleChoiceQuestionComponent`
- `MultipleChoiceQuestionComponent`
- `DropdownQuestionComponent`
- `RatingQuestionComponent`
- `DateQuestionComponent`
- `TimeQuestionComponent`

### Creators
- `SurveyCreator` - Main survey creator component
- Question creators for each question type
- Section creators for survey sections

## Styling

The package includes MBC theme integration. Import the styles:

```tsx
import '@mbc-cqrs-serverless-web/survey/styles'
```

## TypeScript

This package is built with TypeScript and includes comprehensive type definitions.

## License

MIT
