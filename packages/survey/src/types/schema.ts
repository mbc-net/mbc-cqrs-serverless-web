// lib/survey-schema.ts

import { z } from 'zod'

// ============================================================================
// BASE & REUSABLE SCHEMAS
// ============================================================================

/**
 * Defines a single option for choice-based questions.
 * `nextSectionId` now points to the ID of a 'section-header' item.
 */
const QuestionOptionSchema = z
  .object({
    value: z.string().min(1, "Option 'value' cannot be empty."),
    label: z.string().min(1, "Option 'label' cannot be empty."),
    nextSectionId: z.string().optional(),
  })
  .strict()

/**
 * Base validation rules common to all questions.
 */
const BaseValidationRulesSchema = z.object({
  required: z.boolean().optional(),
})

/**
 * --- ADDED: A comprehensive, discriminated union for custom validation rules on short-text questions ---
 */
const CustomValidationRuleSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('number'),
    rule: z.enum([
      'gt',
      'gte',
      'lt',
      'lte',
      'eq',
      'neq',
      'between',
      'not_between',
      'is_number',
      'is_whole',
    ]),
    value: z
      .number()
      .nullish()
      .transform((val) =>
        val === null || (typeof val === 'number' && Number.isNaN(val))
          ? undefined
          : val
      )
      .optional(),
    value2: z
      .number()
      .nullish()
      .transform((val) =>
        val === null || (typeof val === 'number' && Number.isNaN(val))
          ? undefined
          : val
      )
      .optional(),
    customError: z.string().optional(),
  }),
  z.object({
    type: z.literal('text'),
    rule: z.enum(['contains', 'not_contains', 'is_email', 'is_url']),
    value: z.string().optional(),
    customError: z.string().optional(),
  }),
  z.object({
    type: z.literal('length'),
    rule: z.enum(['min', 'max']),
    value: z.number().int().min(0),
    customError: z.string().optional(),
  }),
  z.object({
    type: z.literal('regex'),
    rule: z.enum(['contains', 'not_contains', 'matches', 'not_matches']),
    value: z.string(),
    customError: z.string().optional(),
  }),
])

/**
 * --- UPDATED: A specific validation schema for short-text questions ---
 */
const ShortTextValidationSchema = BaseValidationRulesSchema.extend({
  custom: CustomValidationRuleSchema.optional(),
})

/**
 * --- ADDED: A specific validation schema for long-text (paragraph) questions ---
 * Only supports length and regex validation rules
 */
const LongTextValidationRuleSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('length'),
    rule: z.enum(['min', 'max']),
    value: z.number().int().min(0),
    customError: z.string().optional(),
  }),
  z.object({
    type: z.literal('regex'),
    rule: z.enum(['contains', 'not_contains', 'matches', 'not_matches']),
    value: z.string(),
    customError: z.string().optional(),
  }),
])

const LongTextValidationSchema = BaseValidationRulesSchema.extend({
  custom: LongTextValidationRuleSchema.optional(),
})

/**
 * --- ADDED: A specific validation schema for linear-scale questions ---
 * Only supports basic required validation
 */
const LinearScaleValidationSchema = BaseValidationRulesSchema

// --- ADDED: A specific validation schema for multiple-choice questions ---
const MultipleChoiceValidationRuleSchema = z.object({
  rule: z.enum(['min', 'max', 'exact']),
  value: z.number().int().min(1, 'Value must be at least 1.'),
  customError: z.string().optional(),
})

const SingleChoiceValidationSchema = BaseValidationRulesSchema.extend({
  shuffleOptions: z.boolean().optional(),
})

// --- ADDED: A validation schema for dropdown questions ---
const DropdownValidationSchema = BaseValidationRulesSchema.extend({
  shuffleOptions: z.boolean().optional(),
})

const MultipleChoiceValidationSchema = BaseValidationRulesSchema.extend({
  custom: MultipleChoiceValidationRuleSchema.optional(),
  shuffleOptions: z.boolean().optional(),
})

// --- ADDED: A validation schema for rating questions ---
const RatingValidationSchema = BaseValidationRulesSchema
const DateValidationSchema = BaseValidationRulesSchema
const TimeValidationSchema = BaseValidationRulesSchema

const BaseQuestionSchema = z.object({
  id: z.string().min(1, "Question 'id' cannot be empty."),
  label: z.string(),
  description: z.string().optional(),
  validation: BaseValidationRulesSchema.optional(),
})

// ============================================================================
// INDIVIDUAL ITEM SCHEMAS
// ============================================================================

/**
 * Schema for a 'section-header' item. Acts as a bookmark or page break.
 */
export const SectionHeaderSchema = z
  .object({
    id: z.string().min(1),
    type: z.literal('section-header'),
    title: z.string().min(1),
    description: z.string().optional(),
    action: z
      .discriminatedUnion('type', [
        z.object({ type: z.literal('submit') }).strict(),
        z
          .object({
            type: z.literal('jump'),
            targetSectionId: z.string().min(1),
          })
          .strict(),
      ])
      .optional(),
  })
  .strip()

/**
 * Schema for a 'short-text' question item.
 * --- UPDATED: Uses the new, more powerful validation schema ---
 */
export const ShortTextQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal('short-text'),
  validation: ShortTextValidationSchema.optional(),
}).strip()

/**
 * Schema for a 'long-text' (paragraph) question item.
 * --- ADDED: For paragraph/long text questions ---
 */
export const LongTextQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal('long-text'),
  validation: LongTextValidationSchema.optional(),
}).strip()

/**
 * Schema for a 'linear-scale' question item.
 * --- ADDED: For linear scale questions with min, max, step configuration ---
 */
export const LinearScaleQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal('linear-scale'),
  min: z.number().default(0),
  max: z.number().default(10),
  minLabel: z.string().optional(),
  maxLabel: z.string().optional(),
  validation: LinearScaleValidationSchema.optional(),
}).strip()

/**
 * Schema for a 'single-choice' question item.
 */
export const SingleChoiceQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal('single-choice'),
  options: z
    .array(QuestionOptionSchema)
    .min(1, 'Single-choice questions must have at least one option.'),
  validation: SingleChoiceValidationSchema.optional(),
}).strip()

/**
 * Schema for a 'multiple-choice' question item.
 */
export const MultipleChoiceQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal('multiple-choice'),
  options: z
    .array(QuestionOptionSchema.omit({ nextSectionId: true }))
    .min(1, 'Multiple-choice questions must have at least one option.'),
  validation: MultipleChoiceValidationSchema.optional(),
}).strip()

/**
 * Schema for a 'dropdown' question item.
 */
export const DropdownQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal('dropdown'),
  options: z
    .array(QuestionOptionSchema)
    .min(1, 'Dropdown questions must have at least one option.'),
  validation: DropdownValidationSchema.optional(),
}).strip()

/**
 * Schema for a 'rating' question item.
 */
export const RatingQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal('rating'),
  levels: z.number().min(2).max(10).default(5),
  symbol: z.enum(['star', 'heart', 'thumb']).default('star'),
  validation: RatingValidationSchema.optional(),
}).strip()

/**
 * Schema for a 'date' question item.
 */
export const DateQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal('date'),
  includeTime: z.boolean().optional().default(false),
  includeYear: z.boolean().optional().default(true),
  validation: DateValidationSchema.optional(),
}).strip()

/**
 * --- ADDED: Schema for a 'time' question item ---
 */
export const TimeQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal('time'),
  answerType: z.enum(['time', 'duration']).default('time'),
  validation: TimeValidationSchema.optional(),
}).strip()

// ============================================================================
// MASTER UNION AND ROOT SURVEY SCHEMA
// ============================================================================

/**
 * The master schema for any item in the survey's flat list.
 */
export const SurveyItemSchema = z.discriminatedUnion('type', [
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
])

/**
 * The root schema for the entire survey structure.
 */
export const SurveySchema = z
  .object({
    title: z.string().min(1),
    description: z.string().optional(),
    items: z.array(SurveyItemSchema),
  })
  .strip()

// ============================================================================
// INFERRED TYPESCRIPT TYPES
// ============================================================================

export type SurveySchemaType = z.infer<typeof SurveySchema>
export type SurveyItemType = z.infer<typeof SurveyItemSchema>
export type SectionHeaderType = z.infer<typeof SectionHeaderSchema>
export type QuestionOptionType = z.infer<typeof QuestionOptionSchema>
export type ValidationRulesType = z.infer<typeof BaseValidationRulesSchema>
export type CustomValidationRuleType = z.infer<
  typeof CustomValidationRuleSchema
>

export type SurveyQuestionItemType = Exclude<
  SurveyItemType,
  { type: 'section-header' }
>

export type ShortTextQuestionType = z.infer<typeof ShortTextQuestionSchema>
export type LongTextQuestionType = z.infer<typeof LongTextQuestionSchema>
export type LinearScaleQuestionType = z.infer<typeof LinearScaleQuestionSchema>
export type SingleChoiceQuestionType = z.infer<
  typeof SingleChoiceQuestionSchema
>
export type MultipleChoiceQuestionType = z.infer<
  typeof MultipleChoiceQuestionSchema
>
export type DropdownQuestionType = z.infer<typeof DropdownQuestionSchema>
export type RatingQuestionType = z.infer<typeof RatingQuestionSchema>
export type DateQuestionType = z.infer<typeof DateQuestionSchema>
export type TimeQuestionType = z.infer<typeof TimeQuestionSchema>

// ============================================================================
// VALIDATION UTILITY
// ============================================================================

export function validateSurveyJson(jsonData: unknown): {
  success: boolean
  data?: SurveySchemaType
  error?: z.ZodError
} {
  return SurveySchema.safeParse(jsonData)
}
