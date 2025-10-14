'use client'
import DatePickerWithYearControl from '../../components/DatePickerWithYearControl'
import DateTimePickerWithYearControl from '../../components/DateTimePickerWithYearControl'
import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import type { DateQuestionType } from '../../types/schema'
import { QuestionWrapper } from '../question-wrapper'

/**
 * Renders a date or datetime picker component with year and time control.
 */
export const DateQuestionComponent: React.FC<{
  question: DateQuestionType
}> = ({ question }) => {
  const { control } = useFormContext()

  // Determine if year should be included (defaults to true)
  const includeYear = question.includeYear !== false

  return (
    <Controller
      name={question.id}
      control={control}
      rules={{
        required: question.validation?.required
          ? 'This field is required'
          : false,
      }}
      render={({ field }) => (
        <QuestionWrapper
          questionId={question.id}
          label={question.label}
          description={question.description}
          isRequired={question.validation?.required}
        >
          {question.includeTime ? (
            <DateTimePickerWithYearControl
              value={field.value}
              onChange={field.onChange}
              disabled={false}
              includeYear={includeYear}
            />
          ) : (
            <DatePickerWithYearControl
              value={field.value}
              onChange={field.onChange}
              disabled={false}
              includeYear={includeYear}
            />
          )}
        </QuestionWrapper>
      )}
    />
  )
}
