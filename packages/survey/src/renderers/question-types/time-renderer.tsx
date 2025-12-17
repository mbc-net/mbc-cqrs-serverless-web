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
import type { TimeQuestionType } from '../../types/schema'
import { QuestionWrapper } from '../question-wrapper'

/**
 * Renders a time or duration input field with a custom UI.
 */
export const TimeQuestionComponent: React.FC<{
  question: TimeQuestionType
}> = ({ question }) => {
  const { control } = useFormContext()

  // Generate options for hours, minutes, and seconds
  const hourOptions = useMemo(
    () => Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')),
    []
  )
  const minuteOptions = useMemo(
    () => Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')),
    []
  )
  const secondOptions = useMemo(
    () => Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')),
    []
  )

  return (
    <Controller
      name={question.id}
      control={control}
      defaultValue={
        question.answerType === 'duration'
          ? { hours: '', minutes: '', seconds: '' }
          : { hour: '', minute: '' }
      }
      rules={{
        validate: (value) => {
          if (!question.validation?.required) return true
          if (!value) return 'この質問は必須です' // This question is required

          if (question.answerType === 'duration') {
            return (value.hours || value.minutes || value.seconds) &&
              !Number.isNaN(Number.parseInt(value.hours, 10)) &&
              !Number.isNaN(Number.parseInt(value.minutes, 10)) &&
              !Number.isNaN(Number.parseInt(value.seconds, 10))
              ? true
              : 'この質問は必須です' // This question is required
          }
          // 'time' answer type
          return value.hour && value.minute ? true : 'この質問は必須です' // This question is required
        },
      }}
      render={({ field }) => (
        <QuestionWrapper
          questionId={question.id}
          label={question.label}
          description={question.description}
          isRequired={question.validation?.required}
        >
          {question.answerType === 'duration' ? (
            <div className="flex max-w-sm items-center gap-2">
              <div className="flex-1">
                <Select
                  value={field.value?.hours || ''}
                  onValueChange={(value) =>
                    field.onChange({ ...field.value, hours: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="時間" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {hourOptions.map((hour) => (
                      <SelectItem key={hour} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <span className="text-muted-foreground">:</span>
              <div className="flex-1">
                <Select
                  value={field.value?.minutes || ''}
                  onValueChange={(value) =>
                    field.onChange({ ...field.value, minutes: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="分" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {minuteOptions.map((minute) => (
                      <SelectItem key={minute} value={minute}>
                        {minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <span className="text-muted-foreground">:</span>
              <div className="flex-1">
                <Select
                  value={field.value?.seconds || ''}
                  onValueChange={(value) =>
                    field.onChange({ ...field.value, seconds: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="秒" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {secondOptions.map((second) => (
                      <SelectItem key={second} value={second}>
                        {second}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="flex max-w-sm items-center gap-2">
              <div>
                <Select
                  value={field.value?.hour || ''}
                  onValueChange={(value) =>
                    field.onChange({ ...field.value, hour: value })
                  }
                >
                  <SelectTrigger className="w-full max-w-[120px] justify-between bg-white">
                    <SelectValue placeholder="時" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {hourOptions.map((hour) => (
                      <SelectItem key={hour} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <span className="mr-8 font-normal text-gray-500">時</span>
              <div>
                <Select
                  value={field.value?.minute || ''}
                  onValueChange={(value) =>
                    field.onChange({ ...field.value, minute: value })
                  }
                >
                  <SelectTrigger className="w-full max-w-[120px] justify-between bg-white">
                    <SelectValue placeholder="分" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {minuteOptions.map((minute) => (
                      <SelectItem key={minute} value={minute}>
                        {minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <span className="font-normal text-gray-500">分</span>
            </div>
          )}
        </QuestionWrapper>
      )}
    />
  )
}
