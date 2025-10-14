'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import type React from 'react'
import { useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import type { DropdownQuestionType } from '../../types/schema'
import { QuestionWrapper } from '../question-wrapper'

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Renders a dropdown question as a select menu.
 */
export const DropdownQuestionComponent: React.FC<{
  question: DropdownQuestionType
}> = ({ question }) => {
  const { control } = useFormContext()

  const shuffledOptions = useMemo(() => {
    return question.validation?.shuffleOptions
      ? shuffleArray(question.options)
      : question.options
  }, [question.options, question.validation?.shuffleOptions])

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
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an option..." />
            </SelectTrigger>
            <SelectContent>
              {shuffledOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </QuestionWrapper>
      )}
    />
  )
}
