'use client'
import { Label } from '../../ui/label'
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group'
import { Input } from '../../ui/input'
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

  // Separate "Other" option from regular options
  const regularOptions = question.options.filter((opt) => !opt.isOther)
  const otherOption = question.options.find((opt) => opt.isOther === true)
  const hasOtherOption = !!otherOption

  // Parse value to extract "other" and custom text
  const parseValue = (value: string | undefined) => {
    if (!value) return { isOther: false, customText: '' }
    if (value.startsWith('other:')) {
      return { isOther: true, customText: value.substring(6) }
    }
    if (value === 'other') {
      return { isOther: true, customText: '' }
    }
    return { isOther: false, customText: '' }
  }

  return (
    <Controller
      name={question.id}
      control={control}
      rules={{
        required: question.validation?.required
          ? 'オプションを選択してください' // Please select an option
          : false,
        validate: (value) => {
          if (!question.validation?.required) return true
          if (!value) return 'オプションを選択してください'
          const parsed = parseValue(value)
          if (parsed.isOther && !parsed.customText.trim()) {
            return 'その他の回答を入力してください' // Please enter your other answer
          }
          return true
        },
      }}
      render={({ field }) => {
        const parsed = parseValue(field.value)
        const isOtherSelected = parsed.isOther

        const handleValueChange = (newValue: string) => {
          if (newValue === 'other') {
            field.onChange('other')
          } else if (newValue.startsWith('other:')) {
            field.onChange(newValue)
          } else {
            field.onChange(newValue)
          }
        }

        const handleOtherTextChange = (text: string) => {
          if (text.trim()) {
            field.onChange(`other:${text}`)
          } else {
            field.onChange('other')
          }
        }

        return (
          <QuestionWrapper
            questionId={question.id}
            label={question.label}
            description={question.description}
            isRequired={question.validation?.required}
          >
            <RadioGroup
              onValueChange={handleValueChange}
              value={isOtherSelected ? 'other' : field.value}
              className="flex flex-col space-y-1"
            >
              {/* Render regular options first */}
              {regularOptions.map((option) => (
                <div key={option.value}>
                  <div className="hover:bg-muted flex items-center space-x-2 rounded-md p-2 transition-colors">
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
                </div>
              ))}
              {/* Render "Other" option at the end if it exists */}
              {otherOption && (
                <div key={otherOption.value}>
                  <div className="hover:bg-muted flex min-w-0 items-center space-x-2 rounded-md p-2 transition-colors">
                    <RadioGroupItem
                      value="other"
                      id={`${question.id}-${otherOption.value}`}
                    />
                    <Label
                      className="shrink-0 cursor-pointer whitespace-nowrap font-normal"
                      htmlFor={`${question.id}-${otherOption.value}`}
                    >
                      {otherOption.label}
                    </Label>
                    {isOtherSelected && (
                      <Input
                        placeholder="その他の回答を入力..." // Enter your other answer...
                        value={parsed.customText}
                        onChange={(e) => handleOtherTextChange(e.target.value)}
                        className="ml-2 min-w-0 flex-1"
                      />
                    )}
                  </div>
                </div>
              )}
            </RadioGroup>
          </QuestionWrapper>
        )
      }}
    />
  )
}
