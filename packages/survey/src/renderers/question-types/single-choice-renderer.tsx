'use client'
import { Label } from '../../ui/label'
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group'
import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import type { SingleChoiceQuestionType } from '../../types/schema'
import { QuestionWrapper } from '../question-wrapper'

/**
 * Renders a single-choice question as a radio group.
 */
export const SingleChoiceQuestionComponent: React.FC<{
  question: SingleChoiceQuestionType
}> = ({ question }) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={question.id}
      control={control}
      rules={{
        required: question.validation?.required
          ? 'Please select an option'
          : false,
      }}
      render={({ field }) => (
        <QuestionWrapper
          questionId={question.id}
          label={question.label}
          description={question.description}
          isRequired={question.validation?.required}
        >
          <RadioGroup
            onValueChange={field.onChange}
            value={field.value}
            className="flex flex-col space-y-1"
          >
            {question.options.map((option) => (
              <div
                key={option.value}
                className="hover:bg-muted flex items-center space-x-2 rounded-md p-2 transition-colors"
              >
                <RadioGroupItem
                  value={option.value}
                  id={`${question.id}-${option.value}`}
                />
                <Label
                  className="w-full cursor-pointer font-normal"
                  htmlFor={`${question.id}-${option.value}`}
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </QuestionWrapper>
      )}
    />
  )
}
