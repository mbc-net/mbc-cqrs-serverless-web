'use client'
import { Checkbox } from '../../ui/checkbox'
import { Label } from '../../ui/label'
import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import type { MultipleChoiceQuestionType } from '../../types/schema'
import { QuestionWrapper } from '../question-wrapper'

/**
 * Renders a multiple-choice question as checkboxes.
 */
export const MultipleChoiceQuestionComponent: React.FC<{
  question: MultipleChoiceQuestionType
}> = ({ question }) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={question.id}
      control={control}
      defaultValue={[]}
      rules={{
        required: question.validation?.required
          ? 'Please select at least one option'
          : false,
      }}
      render={({ field }) => (
        <QuestionWrapper
          questionId={question.id}
          label={question.label}
          description={question.description}
          isRequired={question.validation?.required}
        >
          {question.options.map((option) => (
            <div
              key={option.value}
              className="hover:bg-muted flex items-center space-x-2 rounded-md p-2 transition-colors"
            >
              <Checkbox
                id={`${question.id}-${option.value}`}
                checked={field.value?.includes(option.value)}
                onCheckedChange={(checked) => {
                  const currentValues = field.value || []
                  if (checked) {
                    field.onChange([...currentValues, option.value])
                  } else {
                    field.onChange(
                      currentValues.filter(
                        (value: string) => value !== option.value
                      )
                    )
                  }
                }}
              />
              <Label
                className="w-full cursor-pointer font-normal"
                htmlFor={`${question.id}-${option.value}`}
              >
                {option.label}
              </Label>
            </div>
          ))}
        </QuestionWrapper>
      )}
    />
  )
}
