'use client'
import { Input } from '../../ui/input'
import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import type { ShortTextQuestionType } from '../../types/schema'
import { QuestionWrapper } from '../question-wrapper'

/**
 * Renders a short-text input field.
 */
export const ShortTextQuestionComponent: React.FC<{
  question: ShortTextQuestionType
}> = ({ question }) => {
  const { control } = useFormContext()
  return (
    <Controller
      name={question.id}
      control={control}
      rules={{
        required: question.validation?.required
          ? 'This field is required'
          : false,
        validate: (inputValue: string) => {
          const rule = question.validation?.custom
          if (!rule) return true // No rule
          if (!inputValue) return true // Empty field

          const error =
            rule.customError || 'This response does not meet the criteria.'

          switch (rule.type) {
            case 'number': {
              const num = Number.parseFloat(inputValue)
              if (Number.isNaN(num)) return 'Please enter a valid number.'

              switch (rule.rule) {
                case 'gt':
                  if (rule.value !== undefined && num <= rule.value)
                    return error
                  break
                case 'gte':
                  if (rule.value !== undefined && num < rule.value) return error
                  break
                case 'lt':
                  if (rule.value !== undefined && num >= rule.value)
                    return error
                  break
                case 'lte':
                  if (rule.value !== undefined && num > rule.value) return error
                  break
                case 'eq':
                  if (rule.value !== undefined && num !== rule.value)
                    return error
                  break
                case 'neq':
                  if (rule.value !== undefined && num === rule.value)
                    return error
                  break
                case 'between':
                  if (
                    rule.value !== undefined &&
                    rule.value2 !== undefined &&
                    (num < rule.value || num > rule.value2)
                  )
                    return error
                  break
                case 'not_between':
                  if (
                    rule.value !== undefined &&
                    rule.value2 !== undefined &&
                    num >= rule.value &&
                    num <= rule.value2
                  )
                    return error
                  break
                case 'is_number':
                  if (Number.isNaN(num)) return error
                  break
                case 'is_whole':
                  if (!Number.isInteger(num)) return error
                  break
              }
              break
            }
            case 'text': {
              switch (rule.rule) {
                case 'contains':
                  if (
                    rule.value !== undefined &&
                    !inputValue.includes(rule.value)
                  )
                    return error
                  break
                case 'not_contains':
                  if (
                    rule.value !== undefined &&
                    inputValue.includes(rule.value)
                  )
                    return error
                  break
                case 'is_email': {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                  if (!emailRegex.test(inputValue)) return error
                  break
                }
                case 'is_url': {
                  try {
                    new URL(inputValue)
                  } catch {
                    return error
                  }
                  break
                }
              }
              break
            }
            case 'length': {
              if (rule.rule === 'max' && inputValue.length > rule.value)
                return error
              if (rule.rule === 'min' && inputValue.length < rule.value)
                return error
              break
            }
            case 'regex': {
              try {
                const regex = new RegExp(rule.value)
                if (rule.rule === 'matches' && !regex.test(inputValue))
                  return error
                if (rule.rule === 'not_matches' && regex.test(inputValue))
                  return error
                // contains and not_contains for regex can be interpreted as test
                if (rule.rule === 'contains' && !regex.test(inputValue))
                  return error
                if (rule.rule === 'not_contains' && regex.test(inputValue))
                  return error
              } catch {
                console.error('Invalid regex in survey schema:', rule.value)
                return true // Don't block user for bad schema
              }
              break
            }
          }
          return true // Passed validation
        },
      }}
      render={({ field }) => (
        <QuestionWrapper
          questionId={question.id}
          label={question.label}
          description={question.description}
          isRequired={question.validation?.required}
        >
          <Input
            {...field}
            id={question.id}
            placeholder="Type your answer here..."
          />
        </QuestionWrapper>
      )}
    />
  )
}
