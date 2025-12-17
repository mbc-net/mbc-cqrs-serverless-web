'use client'
import type React from 'react'
import type { SingleChoiceQuestionType } from '../../../types/schema'
import { OptionsCreator } from '../options-creator'

interface SingleChoiceCreatorProps {
  itemIndex: number
  itemPath: string
  questionData: SingleChoiceQuestionType
  showOptions: boolean
  showShuffleOptions: boolean
  showBranching: boolean
}

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

export const SingleChoiceCreator: React.FC<SingleChoiceCreatorProps> = ({
  itemIndex,
  showOptions,
  showBranching,
}) => {
  return (
    <>
      {showOptions && (
        <OptionsCreator
          itemIndex={itemIndex}
          questionType="single-choice"
          showBranching={showBranching}
        />
      )}
    </>
  )
}

interface SingleChoicePreviewProps {
  questionData: SingleChoiceQuestionType
}

export const SingleChoicePreview: React.FC<SingleChoicePreviewProps> = ({
  questionData,
}) => {
  // Separate "Other" option from regular options
  const regularOptions = (questionData.options || []).filter(
    (opt) => !opt.isOther
  )
  const otherOption = (questionData.options || []).find((opt) => opt.isOther)

  // Show shuffled options in preview if shuffle is enabled
  const optionsToShow = (questionData as any).validation?.shuffleOptions
    ? shuffleArray(regularOptions)
    : regularOptions

  const displayCount = Math.min(3, optionsToShow.length)
  const remainingCount = optionsToShow.length - displayCount

  return (
    <div className="space-y-2">
      {optionsToShow.slice(0, displayCount).map((option) => (
        <div key={option.value} className="flex items-center space-x-3">
          <div className="border-muted-foreground h-4 w-4 rounded-full border" />
          <p className="text-muted-foreground">{option.label}</p>
        </div>
      ))}
      {remainingCount > 0 && (
        <p className="text-muted-foreground text-sm">
          {/* more options */}+{remainingCount} 個の追加オプション
          {/* shuffled */}
          {(questionData as any).validation?.shuffleOptions && ' (シャッフル)'}
        </p>
      )}
      {otherOption && (
        <div className="flex items-center space-x-3">
          <div className="border-muted-foreground h-4 w-4 rounded-full border" />
          <p className="text-muted-foreground">{otherOption.label}</p>
        </div>
      )}
    </div>
  )
}
