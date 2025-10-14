'use client'
import { cn } from '../../utils'
import { Heart, Star, ThumbsUp } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import type { RatingQuestionType } from '../../types/schema'
import { QuestionWrapper } from '../question-wrapper'

/**
 * Renders an interactive rating question (e.g., stars).
 */
export const RatingQuestionComponent: React.FC<{
  question: RatingQuestionType
}> = ({ question }) => {
  const { control } = useFormContext()
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const levels = question.levels || 5
  const ratingOptions = Array.from({ length: levels }, (_, i) => i + 1)

  const getIconStyle = (symbol: RatingQuestionType['symbol']) => {
    switch (symbol) {
      case 'heart':
        return {
          Icon: Heart,
          filledClasses: 'text-red-600 fill-red-500',
        }
      case 'thumb':
        return {
          Icon: ThumbsUp,
          filledClasses: 'text-blue-600 fill-blue-500',
        }
      default:
        return {
          Icon: Star,
          filledClasses: 'text-yellow-500 fill-yellow-400',
        }
    }
  }

  const { Icon, filledClasses } = getIconStyle(question.symbol)

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
          <div
            className="flex flex-grow justify-around"
            onMouseLeave={() => setHoverValue(null)}
          >
            {ratingOptions.map((num) => {
              const isFilled = (hoverValue ?? field.value ?? 0) >= num
              return (
                <div
                  key={num}
                  className="flex flex-col items-center space-y-2"
                  onMouseEnter={() => setHoverValue(num)}
                  onClick={() => field.onChange(num)}
                >
                  <span className="text-muted-foreground text-sm">{num}</span>
                  <Icon
                    className={cn(
                      'h-7 w-7 transition-colors sm:h-8 sm:w-8',
                      isFilled ? filledClasses : 'text-muted-foreground'
                    )}
                  />
                </div>
              )
            })}
          </div>
        </QuestionWrapper>
      )}
    />
  )
}
