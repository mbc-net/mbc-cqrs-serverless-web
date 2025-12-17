// components/survey/renderers/question-types/long-text-renderer.tsx
'use client'
import { Textarea } from '../../ui/textarea'
import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import type { LongTextQuestionType } from '../../types/schema'
import { QuestionWrapper } from '../question-wrapper'

/**
 * Renders a long-text (paragraph) textarea field.
 * --- ADDED: With comprehensive custom validation logic ---
 */
export const LongTextQuestionComponent: React.FC<{
  question: LongTextQuestionType
}> = ({ question }) => {
  const { control } = useFormContext()
  return (
    <Controller
      name={question.id}
      control={control}
      rules={{
        required: question.validation?.required
          ? 'この質問は必須です' // This question is required
          : false,
        validate: (inputValue: string) => {
          const rule = question.validation?.custom
          if (!rule) return true // No rule
          if (!inputValue) return true // Empty field

          // Get default error message based on rule type
          let defaultError = 'この回答は要件を満たしていません。' // This response does not meet the criteria.
          if (rule.type === 'length') {
            defaultError = '文字数が規定の長さに合致していません' // Character count does not match the specified length
          } else if (rule.type === 'regex') {
            defaultError = 'パターンに一致させてください' // Please match the pattern
          }

          const error = rule.customError || defaultError

          switch (rule.type) {
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
          <Textarea
            {...field}
            id={question.id}
            placeholder="回答を入力..." // Enter your answer...
            className="min-h-[120px] resize-y"
            rows={5}
          />
        </QuestionWrapper>
      )}
    />
  )
}
