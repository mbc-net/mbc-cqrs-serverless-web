import {
  SurveySchema,
  SectionHeaderSchema,
  ShortTextQuestionSchema,
  LongTextQuestionSchema,
  LinearScaleQuestionSchema,
  SingleChoiceQuestionSchema,
  MultipleChoiceQuestionSchema,
  DropdownQuestionSchema,
  RatingQuestionSchema,
  DateQuestionSchema,
  TimeQuestionSchema,
  validateSurveyJson,
} from '../src/types/schema'

describe('SectionHeaderSchema', () => {
  it('should accept a valid section header', () => {
    const result = SectionHeaderSchema.safeParse({
      id: 'section-1',
      type: 'section-header',
      title: 'Section 1',
    })
    expect(result.success).toBe(true)
  })

  it('should accept a section header with description and action', () => {
    const result = SectionHeaderSchema.safeParse({
      id: 'section-1',
      type: 'section-header',
      title: 'Section 1',
      description: 'Some description',
      action: { type: 'submit' },
    })
    expect(result.success).toBe(true)
  })

  it('should accept a section header with jump action', () => {
    const result = SectionHeaderSchema.safeParse({
      id: 'section-1',
      type: 'section-header',
      title: 'Section 1',
      action: { type: 'jump', targetSectionId: 'section-2' },
    })
    expect(result.success).toBe(true)
  })

  it('should reject a section header with empty id', () => {
    const result = SectionHeaderSchema.safeParse({
      id: '',
      type: 'section-header',
      title: 'Section 1',
    })
    expect(result.success).toBe(false)
  })

  it('should reject a section header with empty title', () => {
    const result = SectionHeaderSchema.safeParse({
      id: 'section-1',
      type: 'section-header',
      title: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('ShortTextQuestionSchema', () => {
  it('should accept a minimal short-text question', () => {
    const result = ShortTextQuestionSchema.safeParse({
      id: 'q1',
      type: 'short-text',
      label: 'Your name',
    })
    expect(result.success).toBe(true)
  })

  it('should accept short-text with number validation', () => {
    const result = ShortTextQuestionSchema.safeParse({
      id: 'q1',
      type: 'short-text',
      label: 'Age',
      validation: {
        required: true,
        custom: { type: 'number', rule: 'gte', value: 0 },
      },
    })
    expect(result.success).toBe(true)
  })

  it('should accept short-text with text validation', () => {
    const result = ShortTextQuestionSchema.safeParse({
      id: 'q1',
      type: 'short-text',
      label: 'Email',
      validation: {
        custom: { type: 'text', rule: 'is_email' },
      },
    })
    expect(result.success).toBe(true)
  })

  it('should accept short-text with length validation', () => {
    const result = ShortTextQuestionSchema.safeParse({
      id: 'q1',
      type: 'short-text',
      label: 'Code',
      validation: {
        custom: { type: 'length', rule: 'max', value: 10 },
      },
    })
    expect(result.success).toBe(true)
  })

  it('should accept short-text with regex validation', () => {
    const result = ShortTextQuestionSchema.safeParse({
      id: 'q1',
      type: 'short-text',
      label: 'Pattern',
      validation: {
        custom: {
          type: 'regex',
          rule: 'matches',
          value: '^[A-Z]+$',
          customError: 'Must be uppercase letters only',
        },
      },
    })
    expect(result.success).toBe(true)
  })

  it('should reject short-text with empty id', () => {
    const result = ShortTextQuestionSchema.safeParse({
      id: '',
      type: 'short-text',
      label: 'Name',
    })
    expect(result.success).toBe(false)
  })
})

describe('LongTextQuestionSchema', () => {
  it('should accept a minimal long-text question', () => {
    const result = LongTextQuestionSchema.safeParse({
      id: 'q1',
      type: 'long-text',
      label: 'Comments',
    })
    expect(result.success).toBe(true)
  })

  it('should accept long-text with length validation', () => {
    const result = LongTextQuestionSchema.safeParse({
      id: 'q1',
      type: 'long-text',
      label: 'Essay',
      validation: {
        required: true,
        custom: { type: 'length', rule: 'min', value: 100 },
      },
    })
    expect(result.success).toBe(true)
  })

  it('should reject long-text with number validation (not supported)', () => {
    const result = LongTextQuestionSchema.safeParse({
      id: 'q1',
      type: 'long-text',
      label: 'Essay',
      validation: {
        custom: { type: 'number', rule: 'gte', value: 0 },
      },
    })
    expect(result.success).toBe(false)
  })
})

describe('LinearScaleQuestionSchema', () => {
  it('should accept a minimal linear-scale question with defaults', () => {
    const result = LinearScaleQuestionSchema.safeParse({
      id: 'q1',
      type: 'linear-scale',
      label: 'Rate your experience',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.min).toBe(0)
      expect(result.data.max).toBe(10)
    }
  })

  it('should accept linear-scale with custom min/max and labels', () => {
    const result = LinearScaleQuestionSchema.safeParse({
      id: 'q1',
      type: 'linear-scale',
      label: 'Satisfaction',
      min: 1,
      max: 5,
      minLabel: 'Very Bad',
      maxLabel: 'Excellent',
    })
    expect(result.success).toBe(true)
  })
})

describe('SingleChoiceQuestionSchema', () => {
  it('should accept a valid single-choice question', () => {
    const result = SingleChoiceQuestionSchema.safeParse({
      id: 'q1',
      type: 'single-choice',
      label: 'Favorite color',
      options: [
        { value: 'red', label: 'Red' },
        { value: 'blue', label: 'Blue' },
      ],
    })
    expect(result.success).toBe(true)
  })

  it('should accept single-choice with nextSectionId on options', () => {
    const result = SingleChoiceQuestionSchema.safeParse({
      id: 'q1',
      type: 'single-choice',
      label: 'Continue?',
      options: [
        { value: 'yes', label: 'Yes', nextSectionId: 'section-2' },
        { value: 'no', label: 'No', nextSectionId: 'section-3' },
      ],
    })
    expect(result.success).toBe(true)
  })

  it('should reject single-choice with no options', () => {
    const result = SingleChoiceQuestionSchema.safeParse({
      id: 'q1',
      type: 'single-choice',
      label: 'Favorite color',
      options: [],
    })
    expect(result.success).toBe(false)
  })

  it('should reject options with empty value', () => {
    const result = SingleChoiceQuestionSchema.safeParse({
      id: 'q1',
      type: 'single-choice',
      label: 'Favorite color',
      options: [{ value: '', label: 'Red' }],
    })
    expect(result.success).toBe(false)
  })
})

describe('MultipleChoiceQuestionSchema', () => {
  it('should accept a valid multiple-choice question', () => {
    const result = MultipleChoiceQuestionSchema.safeParse({
      id: 'q1',
      type: 'multiple-choice',
      label: 'Select all that apply',
      options: [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ],
    })
    expect(result.success).toBe(true)
  })

  it('should accept multiple-choice with custom validation', () => {
    const result = MultipleChoiceQuestionSchema.safeParse({
      id: 'q1',
      type: 'multiple-choice',
      label: 'Select',
      options: [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
        { value: 'c', label: 'C' },
      ],
      validation: {
        custom: { rule: 'min', value: 2 },
      },
    })
    expect(result.success).toBe(true)
  })

  it('should reject multiple-choice with no options', () => {
    const result = MultipleChoiceQuestionSchema.safeParse({
      id: 'q1',
      type: 'multiple-choice',
      label: 'Select',
      options: [],
    })
    expect(result.success).toBe(false)
  })
})

describe('DropdownQuestionSchema', () => {
  it('should accept a valid dropdown question', () => {
    const result = DropdownQuestionSchema.safeParse({
      id: 'q1',
      type: 'dropdown',
      label: 'Country',
      options: [
        { value: 'jp', label: 'Japan' },
        { value: 'us', label: 'USA' },
      ],
    })
    expect(result.success).toBe(true)
  })
})

describe('RatingQuestionSchema', () => {
  it('should accept a minimal rating question with defaults', () => {
    const result = RatingQuestionSchema.safeParse({
      id: 'q1',
      type: 'rating',
      label: 'Rate us',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.levels).toBe(5)
      expect(result.data.symbol).toBe('star')
    }
  })

  it('should accept rating with custom levels and symbol', () => {
    const result = RatingQuestionSchema.safeParse({
      id: 'q1',
      type: 'rating',
      label: 'How much do you like it?',
      levels: 10,
      symbol: 'heart',
    })
    expect(result.success).toBe(true)
  })

  it('should reject rating with levels out of range', () => {
    const result = RatingQuestionSchema.safeParse({
      id: 'q1',
      type: 'rating',
      label: 'Rate',
      levels: 1,
    })
    expect(result.success).toBe(false)
  })
})

describe('DateQuestionSchema', () => {
  it('should accept a minimal date question', () => {
    const result = DateQuestionSchema.safeParse({
      id: 'q1',
      type: 'date',
      label: 'Birthday',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.includeTime).toBe(false)
      expect(result.data.includeYear).toBe(true)
    }
  })
})

describe('TimeQuestionSchema', () => {
  it('should accept a minimal time question', () => {
    const result = TimeQuestionSchema.safeParse({
      id: 'q1',
      type: 'time',
      label: 'Preferred time',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.answerType).toBe('time')
    }
  })

  it('should accept time question with duration type', () => {
    const result = TimeQuestionSchema.safeParse({
      id: 'q1',
      type: 'time',
      label: 'Duration',
      answerType: 'duration',
    })
    expect(result.success).toBe(true)
  })
})

describe('SurveySchema', () => {
  it('should accept a valid complete survey', () => {
    const result = SurveySchema.safeParse({
      title: 'Customer Feedback',
      description: 'Please share your experience',
      items: [
        {
          id: 'section-1',
          type: 'section-header',
          title: 'Section 1',
        },
        {
          id: 'q1',
          type: 'short-text',
          label: 'Name',
          validation: { required: true },
        },
        {
          id: 'q2',
          type: 'single-choice',
          label: 'Satisfaction',
          options: [
            { value: 'good', label: 'Good' },
            { value: 'bad', label: 'Bad' },
          ],
        },
      ],
    })
    expect(result.success).toBe(true)
  })

  it('should accept a survey with empty items', () => {
    const result = SurveySchema.safeParse({
      title: 'Empty Survey',
      items: [],
    })
    expect(result.success).toBe(true)
  })

  it('should reject a survey with empty title', () => {
    const result = SurveySchema.safeParse({
      title: '',
      items: [],
    })
    expect(result.success).toBe(false)
  })

  it('should reject a survey with missing title', () => {
    const result = SurveySchema.safeParse({
      items: [],
    })
    expect(result.success).toBe(false)
  })

  it('should reject a survey with invalid item type', () => {
    const result = SurveySchema.safeParse({
      title: 'Test',
      items: [{ id: 'q1', type: 'unknown-type', label: 'Test' }],
    })
    expect(result.success).toBe(false)
  })

  it('should strip unknown properties', () => {
    const result = SurveySchema.safeParse({
      title: 'Test',
      items: [],
      unknownProp: 'should be stripped',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(
        (result.data as Record<string, unknown>).unknownProp
      ).toBeUndefined()
    }
  })
})

describe('validateSurveyJson', () => {
  it('should return success for valid survey data', () => {
    const result = validateSurveyJson({
      title: 'Test Survey',
      items: [],
    })
    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
  })

  it('should return error for invalid survey data', () => {
    const result = validateSurveyJson({})
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('should return error for non-object input', () => {
    const result = validateSurveyJson('not an object')
    expect(result.success).toBe(false)
  })

  it('should return error for null input', () => {
    const result = validateSurveyJson(null)
    expect(result.success).toBe(false)
  })
})
