'use client'
import { Checkbox } from '../../ui/checkbox'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
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

  // Separate "Other" option from regular options
  const regularOptions = question.options.filter((opt) => !opt.isOther)
  const otherOption = question.options.find((opt) => opt.isOther === true)
  const hasOtherOption = !!otherOption

  // Helper to check if "Other" is selected (either "other" or "other:...")
  const isOtherSelected = (values: string[] | undefined) => {
    if (!values) return false
    return values.some((v) => v === 'other' || v.startsWith('other:'))
  }

  // Get custom text from "Other" value
  const getOtherText = (values: string[] | undefined) => {
    if (!values) return ''
    const otherValue = values.find((v) => v.startsWith('other:'))
    if (otherValue) {
      return otherValue.substring(6)
    }
    return ''
  }

  return (
    <Controller
      name={question.id}
      control={control}
      defaultValue={[]}
      rules={{
        required: question.validation?.required
          ? '最低でも1つオプションを選択してください' // Please select at least one option
          : false,
        validate: (values) => {
          if (!question.validation?.required) return true
          if (!values || values.length === 0) {
            return '最低でも1つオプションを選択してください'
          }
          // If "Other" is selected, require text
          if (isOtherSelected(values)) {
            const otherText = getOtherText(values)
            if (!otherText.trim()) {
              return 'その他の回答を入力してください' // Please enter your other answer
            }
          }
          return true
        },
      }}
      render={({ field }) => {
        const currentValues = field.value || []
        const otherSelected = isOtherSelected(currentValues)
        const otherText = getOtherText(currentValues)

        const handleOptionChange = (optionValue: string, checked: boolean) => {
          const isOther = optionValue === 'other'
          let newValues: string[]

          if (checked) {
            if (isOther) {
              // Add "other" to array
              newValues = [...currentValues, 'other']
            } else {
              // Remove any "other" values when selecting regular option
              newValues = [
                ...currentValues.filter(
                  (v: string) => v !== 'other' && !v.startsWith('other:')
                ),
                optionValue,
              ]
            }
          } else {
            if (isOther) {
              // Remove all "other" values
              newValues = currentValues.filter(
                (v: string) => v !== 'other' && !v.startsWith('other:')
              )
            } else {
              newValues = currentValues.filter(
                (value: string) => value !== optionValue
              )
            }
          }
          field.onChange(newValues)
        }

        const handleOtherTextChange = (text: string) => {
          // Remove existing "other" values
          const withoutOther = currentValues.filter(
            (v: string) => v !== 'other' && !v.startsWith('other:')
          )

          if (text.trim()) {
            // Add "other:text" to array
            field.onChange([...withoutOther, `other:${text}`])
          } else {
            // Add just "other" to array
            field.onChange([...withoutOther, 'other'])
          }
        }

        return (
          <QuestionWrapper
            questionId={question.id}
            label={question.label}
            description={question.description}
            isRequired={question.validation?.required}
          >
            {/* Render regular options first */}
            {regularOptions.map((option) => {
              const isChecked = currentValues.includes(option.value)

              return (
                <div key={option.value}>
                  <div className="hover:bg-muted flex items-center space-x-2 rounded-md p-2 transition-colors">
                    <Checkbox
                      id={`${question.id}-${option.value}`}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleOptionChange(option.value, checked === true)
                      }
                    />
                    <Label
                      className="w-full cursor-pointer font-normal"
                      htmlFor={`${question.id}-${option.value}`}
                    >
                      {option.label}
                    </Label>
                  </div>
                </div>
              )
            })}
            {/* Render "Other" option at the end if it exists */}
            {otherOption && (
              <div key={otherOption.value}>
                <div className="hover:bg-muted flex min-w-0 items-center space-x-2 rounded-md p-2 transition-colors">
                  <Checkbox
                    id={`${question.id}-${otherOption.value}`}
                    checked={otherSelected}
                    onCheckedChange={(checked) =>
                      handleOptionChange('other', checked === true)
                    }
                  />
                  <Label
                    className="shrink-0 cursor-pointer whitespace-nowrap font-normal"
                    htmlFor={`${question.id}-${otherOption.value}`}
                  >
                    {otherOption.label}
                  </Label>
                  {otherSelected && (
                    <Input
                      placeholder="その他の回答を入力..." // Enter your other answer...
                      value={otherText}
                      onChange={(e) => handleOtherTextChange(e.target.value)}
                      className="ml-2 min-w-0 flex-1"
                    />
                  )}
                </div>
              </div>
            )}
          </QuestionWrapper>
        )
      }}
    />
  )
}
