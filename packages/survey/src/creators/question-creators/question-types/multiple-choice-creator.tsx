'use client'
import { Button } from '../../../ui/button'
import { Input } from '../../../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select'
import { X } from 'lucide-react'
import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import type { MultipleChoiceQuestionType } from '../../../types/schema'
import { OptionsCreator } from '../options-creator'

interface MultipleChoiceCreatorProps {
  itemIndex: number
  itemPath: string
  showOptions: boolean
  showValidation: boolean
  onCloseValidation: () => void
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

const MultipleChoiceValidationBuilder: React.FC<{
  itemPath: string
  onClose: () => void
}> = ({ itemPath, onClose }) => {
  const { control, register } = useFormContext()
  const validationPath = `${itemPath}.validation.custom`

  return (
    <div className="mt-4 p-3">
      <div className="flex w-full flex-grow gap-2 sm:w-auto sm:flex-grow-0">
        <Controller
          control={control}
          name={`${validationPath}.rule`}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-[180px] border-0" size="xs">
                <SelectValue
                  className="text-xs placeholder:text-xs"
                  placeholder="ルールを選択..." // "Select a rule..."
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="text-xs" value="min">
                  {/* Select at least */}
                  最低でも
                </SelectItem>
                <SelectItem className="text-xs" value="max">
                  {/* Select at most */}
                  最大でも
                </SelectItem>
                <SelectItem className="text-xs" value="exact">
                  {/* Select exactly */}
                  正確に
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {/* Number */}
        <Input
          type="number"
          placeholder="数値" // "Number"
          className="flex-grow rounded-none border-0 border-b px-1 text-xs shadow-none placeholder:text-xs focus-visible:ring-0"
          {...register(`${validationPath}.value`, { valueAsNumber: true })}
        />
        <Input
          placeholder="カスタムエラーテキスト" // "Custom error text"
          className="flex-grow rounded-none border-0 border-b px-1 text-xs shadow-none placeholder:text-xs focus-visible:ring-0"
          {...register(`${validationPath}.customError`)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export const MultipleChoiceCreator: React.FC<MultipleChoiceCreatorProps> = ({
  itemIndex,
  itemPath,
  showOptions,
  showValidation,
  onCloseValidation,
}) => {
  return (
    <>
      {showOptions && (
        <OptionsCreator
          itemIndex={itemIndex}
          questionType="multiple-choice"
          showBranching={false}
        />
      )}

      {showValidation && (
        <MultipleChoiceValidationBuilder
          itemPath={itemPath}
          onClose={onCloseValidation}
        />
      )}
    </>
  )
}

interface MultipleChoicePreviewProps {
  questionData: MultipleChoiceQuestionType
}

export const MultipleChoicePreview: React.FC<MultipleChoicePreviewProps> = ({
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
          <div className="border-muted-foreground h-4 w-4 rounded-sm border" />
          <p className="text-muted-foreground">{option.label}</p>
        </div>
      ))}
      {remainingCount > 0 && (
        <p className="text-muted-foreground text-sm">
          {/* more options  */}+{remainingCount} 個の追加オプション
          {/* shuffled */}
          {(questionData as any).validation?.shuffleOptions && ' (シャッフル)'}
        </p>
      )}
      {otherOption && (
        <div className="flex items-center space-x-3">
          <div className="border-muted-foreground h-4 w-4 rounded-sm border" />
          <p className="text-muted-foreground">{otherOption.label}</p>
        </div>
      )}
    </div>
  )
}
