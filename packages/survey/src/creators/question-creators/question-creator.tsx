// components/survey-creator/question-creator.tsx
'use client'

import { Button } from '../../ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { Separator } from '../../ui/separator'
import { Switch } from '../../ui/switch'
import { cn } from '../../utils'
import type { useSortable } from '@dnd-kit/sortable'
import {
  AlignLeft,
  BarChartHorizontal,
  Calendar,
  CheckSquare,
  ChevronDownSquare,
  CircleDot,
  Clock,
  Copy,
  GripHorizontal,
  Minus,
  MoreVertical,
  Star,
  Trash2,
} from 'lucide-react'
import type React from 'react'
import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import type {
  DateQuestionType,
  SurveyQuestionItemType,
  TimeQuestionType,
} from '../../types/schema'
import {
  DateCreator,
  DatePreview,
  DropdownCreator,
  DropdownPreview,
  LinearScaleCreator,
  LinearScalePreview,
  LongTextCreator,
  LongTextPreview,
  MultipleChoiceCreator,
  MultipleChoicePreview,
  RatingCreator,
  RatingPreview,
  ShortTextCreator,
  ShortTextPreview,
  SingleChoiceCreator,
  SingleChoicePreview,
  TimeCreator,
  TimePreview,
} from './question-types'

interface QuestionCreatorProps {
  itemIndex: number
  removeItem: (index: number) => void
  insertItem: (index: number, item: any) => void
  setPendingActiveDataId: (id: string | null) => void
  activeElementId: string | null
  setActiveElementId: (id: string | null) => void
  questionId: string
  dndAttributes?: ReturnType<typeof useSortable>['attributes']
  dndListeners?: ReturnType<typeof useSortable>['listeners']
}

export const QuestionCreator: React.FC<QuestionCreatorProps> = ({
  itemIndex,
  removeItem,
  insertItem,
  setPendingActiveDataId,
  activeElementId,
  setActiveElementId,
  questionId,
  dndAttributes,
  dndListeners,
}) => {
  const { register, control, watch, getValues, setValue, unregister } =
    useFormContext()

  const itemPath = `items.${itemIndex}`
  const questionData = watch(itemPath) as SurveyQuestionItemType

  const questionLabelValue =
    questionData && 'label' in questionData ? questionData.label : undefined
  const questionLabel = questionLabelValue || '新しい質問' // 'New Question'
  const questionType = questionData?.type
  const showOptions = ['single-choice', 'multiple-choice', 'dropdown'].includes(
    questionType
  )

  const [showDescription, setShowDescription] = useState(
    () => !!questionData.description
  )
  const [showValidation, setShowValidation] = useState(() => {
    if (questionType === 'short-text') {
      return !!questionData.validation?.custom
    }
    if (questionType === 'long-text') {
      return !!questionData.validation?.custom
    }
    if (questionType === 'multiple-choice') {
      return !!questionData.validation?.custom
    }
    return false
  })
  const [showShuffleOptions, setShowShuffleOptions] = useState(() => {
    if (
      questionType === 'multiple-choice' ||
      questionType === 'single-choice' ||
      questionType === 'dropdown'
    ) {
      return !!questionData.validation?.shuffleOptions
    }
    return false
  })
  const [showBranching, setShowBranching] = useState(() => {
    if (
      questionData.type === 'single-choice' ||
      questionData.type === 'dropdown'
    ) {
      return !!questionData.options?.some((opt) => opt.nextSectionId)
    }
    return false
  })

  const isActive = activeElementId === questionId

  // Sync question ID with question label
  useEffect(() => {
    if (questionLabelValue) {
      setValue(`${itemPath}.id`, questionLabelValue)
    }
  }, [questionLabelValue, itemPath, setValue])

  const handleDuplicate = () => {
    const currentItemData = getValues(`items.${itemIndex}`)
    const duplicatedItem = {
      ...JSON.parse(JSON.stringify(currentItemData)),
      id: `q_${Date.now()}`,
    }
    insertItem(itemIndex + 1, duplicatedItem)
    setPendingActiveDataId(duplicatedItem.id)
  }

  const handleCloseValidation = () => {
    setShowValidation(false)
    setValue(`${itemPath}.validation.custom`, undefined)
  }

  const renderQuestionPreview = () => {
    switch (questionType) {
      case 'short-text':
        return <ShortTextPreview />
      case 'long-text':
        return <LongTextPreview />
      case 'linear-scale':
        return <LinearScalePreview questionData={questionData} />
      case 'single-choice':
        return <SingleChoicePreview questionData={questionData} />
      case 'multiple-choice':
        return <MultipleChoicePreview questionData={questionData} />
      case 'dropdown':
        return <DropdownPreview questionData={questionData} />
      case 'rating':
        return <RatingPreview questionData={questionData} />
      case 'date':
        return <DatePreview questionData={questionData} />
      case 'time':
        return <TimePreview questionData={questionData} />
      default:
        return null
    }
  }

  // Remove previous type-specific fields to avoid unrecognized keys
  const clearTypeSpecificFields = (
    prevType: SurveyQuestionItemType['type'] | undefined
  ) => {
    if (!prevType) return

    const clearFields = (fields: string[]) => {
      fields.forEach((field) => {
        unregister(`${itemPath}.${field}` as any)
        setValue(`${itemPath}.${field}`, undefined)
      })
    }

    // Always clear custom validation when changing type to avoid schema mismatch
    setValue(`${itemPath}.validation.custom`, undefined)

    switch (prevType) {
      case 'rating':
        clearFields(['levels', 'symbol'])
        break
      case 'linear-scale':
        clearFields(['min', 'max', 'minLabel', 'maxLabel', 'levels', 'symbol'])
        break
      case 'single-choice':
        clearFields(['options'])
        setValue(`${itemPath}.validation.shuffleOptions`, undefined)
        break
      case 'multiple-choice':
        clearFields(['options'])
        setValue(`${itemPath}.validation.shuffleOptions`, undefined)
        break
      case 'dropdown':
        clearFields(['options'])
        setValue(`${itemPath}.validation.shuffleOptions`, undefined)
        break
      case 'date':
        clearFields(['includeTime', 'includeYear'])
        break
      case 'time':
        clearFields(['answerType'])
        break
      default:
        break
    }
  }

  return (
    <div
      id={questionId}
      onClick={(e) => {
        e.stopPropagation()
        setActiveElementId(questionId)
      }}
      className={cn(
        'rounded-lg border transition-all',
        isActive
          ? 'border-primary bg-card shadow-lg'
          : 'hover:bg-muted/50 border-transparent bg-white'
      )}
    >
      {isActive ? (
        // ============================================================================
        // EDIT MODE
        // ============================================================================
        <div className="p-6">
          <div
            className="flex cursor-grab justify-center pb-4"
            {...dndAttributes}
            {...dndListeners}
          >
            <GripHorizontal className="text-muted-foreground h-5 w-5" />
          </div>

          <div className="flex items-center gap-4">
            <Input
              placeholder="質問" // "Question"
              className="h-12 flex-grow rounded-none border-0 border-b px-1 text-lg font-semibold shadow-none focus-visible:ring-0"
              {...register(`${itemPath}.label`)}
            />
            <Controller
              control={control}
              name={`${itemPath}.type`}
              render={({ field }) => (
                <Select
                  onValueChange={(newType) => {
                    const prevType = field.value
                    // First, update the type
                    field.onChange(newType)

                    // Clear fields that belong to the previous type
                    if (prevType && prevType !== newType) {
                      clearTypeSpecificFields(prevType)
                    }

                    // When switching to a new type, set its default properties
                    switch (newType) {
                      case 'date':
                        setValue(`${itemPath}.includeTime`, false)
                        setValue(`${itemPath}.includeYear`, true)
                        break
                      case 'time':
                        setValue(`${itemPath}.answerType`, 'time')
                        break
                      case 'rating':
                        setValue(`${itemPath}.levels`, 5)
                        setValue(`${itemPath}.symbol`, 'star')
                        break
                      case 'linear-scale':
                        setValue(`${itemPath}.min`, 1)
                        setValue(`${itemPath}.max`, 5)
                        setValue(`${itemPath}.minLabel`, undefined)
                        setValue(`${itemPath}.maxLabel`, undefined)
                        break
                      default:
                        break
                    }
                  }}
                  value={field.value}
                >
                  <SelectTrigger className="w-[220px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="short-text">
                        <div className="flex items-center gap-2">
                          {/* Short answer */}
                          <Minus className="h-4 w-4" /> 短文回答
                        </div>
                      </SelectItem>
                      <SelectItem value="long-text">
                        <div className="flex items-center gap-2">
                          {/* Paragraph */}
                          <AlignLeft className="h-4 w-4" /> 段落
                        </div>
                      </SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectItem value="single-choice">
                        <div className="flex items-center gap-2">
                          {/* Multiple choice */}
                          <CircleDot className="h-4 w-4" /> ラジオボタン
                        </div>
                      </SelectItem>
                      <SelectItem value="multiple-choice">
                        <div className="flex items-center gap-2">
                          {/* Checkboxes */}
                          <CheckSquare className="h-4 w-4" /> チェックボックス
                        </div>
                      </SelectItem>
                      <SelectItem value="dropdown">
                        <div className="flex items-center gap-2">
                          {/* Dropdown */}
                          <ChevronDownSquare className="h-4 w-4" /> プルダウン
                        </div>
                      </SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectItem value="linear-scale">
                        <div className="flex items-center gap-2">
                          {/* Linear scale */}
                          <BarChartHorizontal className="h-4 w-4" /> 均等目盛
                        </div>
                      </SelectItem>
                      <SelectItem value="rating">
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center gap-2">
                            {/* Rating */}
                            <Star className="h-4 w-4" /> 評価
                          </div>
                        </div>
                      </SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectItem value="date">
                        <div className="flex items-center gap-2">
                          {/* Date */}
                          <Calendar className="h-4 w-4" /> 日付
                        </div>
                      </SelectItem>
                      <SelectItem value="time">
                        <div className="flex items-center gap-2">
                          {/* Time */}
                          <Clock className="h-4 w-4" /> 時刻
                        </div>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="mt-4 space-y-2">
            {showDescription && (
              <Input
                placeholder="説明" // "Description"
                className="rounded-none border-0 px-1 text-sm shadow-none focus-visible:ring-0"
                {...register(`${itemPath}.description`)}
              />
            )}

            {questionType === 'short-text' && (
              <ShortTextCreator
                itemPath={itemPath}
                questionData={questionData}
                showValidation={showValidation}
                onCloseValidation={handleCloseValidation}
              />
            )}

            {questionType === 'long-text' && (
              <LongTextCreator
                itemPath={itemPath}
                questionData={questionData}
                showValidation={showValidation}
                onCloseValidation={handleCloseValidation}
              />
            )}

            {questionType === 'linear-scale' && (
              <LinearScaleCreator
                itemPath={itemPath}
                questionData={questionData}
              />
            )}

            {questionType === 'single-choice' && (
              <SingleChoiceCreator
                itemIndex={itemIndex}
                itemPath={itemPath}
                questionData={questionData}
                showOptions={showOptions}
                showShuffleOptions={showShuffleOptions}
                showBranching={showBranching}
              />
            )}

            {questionType === 'multiple-choice' && (
              <MultipleChoiceCreator
                itemIndex={itemIndex}
                itemPath={itemPath}
                showOptions={showOptions}
                showValidation={showValidation}
                onCloseValidation={handleCloseValidation}
              />
            )}

            {questionType === 'dropdown' && (
              <DropdownCreator
                itemIndex={itemIndex}
                itemPath={itemPath}
                questionData={questionData}
                showOptions={showOptions}
                showShuffleOptions={showShuffleOptions}
                showBranching={showBranching}
              />
            )}

            {questionType === 'rating' && <RatingCreator itemPath={itemPath} />}

            {questionType === 'date' && <DateCreator itemPath={itemPath} />}

            {questionType === 'time' && <TimeCreator itemPath={itemPath} />}
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleDuplicate}
              title="複製" // "Duplicate"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hover:bg-destructive/10 hover:text-destructive"
              onClick={() => removeItem(itemIndex)}
              title="削除" // "Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center space-x-2">
              <Label
                htmlFor={`${itemPath}.validation.required`}
                className="cursor-pointer text-sm font-medium"
              >
                {/* Required */}
                必須
              </Label>
              <Controller
                control={control}
                name={`${itemPath}.validation.required`}
                render={({ field }) => (
                  <Switch
                    id={`${itemPath}.validation.required`}
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* Show */}
                <DropdownMenuLabel>表示</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={showDescription}
                  onCheckedChange={(checked) => {
                    setShowDescription(!!checked)
                    if (!checked) {
                      setValue(`${itemPath}.description`, '')
                    }
                  }}
                >
                  {/* Description */}
                  説明
                </DropdownMenuCheckboxItem>
                {(questionType === 'short-text' ||
                  questionType === 'long-text' ||
                  questionType === 'multiple-choice') && (
                  <DropdownMenuCheckboxItem
                    checked={showValidation}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setShowValidation(true)
                        // Set a default validation rule based on question type
                        if (questionType === 'short-text') {
                          setValue(`${itemPath}.validation.custom`, {
                            type: 'number',
                            rule: 'eq',
                          })
                        } else if (questionType === 'long-text') {
                          setValue(`${itemPath}.validation.custom`, {
                            type: 'length',
                            rule: 'min',
                          })
                        } else if (questionType === 'multiple-choice') {
                          setValue(`${itemPath}.validation.custom`, {
                            rule: 'min',
                            value: 1,
                          })
                        }
                      } else {
                        handleCloseValidation()
                      }
                    }}
                  >
                    {/* Response validation */}
                    回答の検証
                  </DropdownMenuCheckboxItem>
                )}
                {(questionType === 'single-choice' ||
                  questionType === 'dropdown') && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={!!showShuffleOptions}
                      onCheckedChange={(checked) => {
                        setShowShuffleOptions(!!checked)
                        setValue(
                          `${itemPath}.validation.shuffleOptions`,
                          !!checked
                        )
                      }}
                    >
                      {/* Shuffle option order */}
                      オプションをシャッフル
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={!!showBranching}
                      onCheckedChange={setShowBranching}
                    >
                      {/* Go to section based on answer */}
                      回答に基づいてセクションに移動
                    </DropdownMenuCheckboxItem>
                  </>
                )}
                {questionType === 'multiple-choice' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={!!showShuffleOptions}
                      onCheckedChange={(checked) => {
                        setShowShuffleOptions(!!checked)
                        setValue(
                          `${itemPath}.validation.shuffleOptions`,
                          !!checked
                        )
                      }}
                    >
                      {/* Shuffle option order */}
                      オプションをシャッフル
                    </DropdownMenuCheckboxItem>
                  </>
                )}
                {questionType === 'date' && (
                  <>
                    <DropdownMenuCheckboxItem
                      checked={(questionData as DateQuestionType).includeTime}
                      onCheckedChange={(checked) => {
                        setValue(`${itemPath}.includeTime`, !!checked)
                      }}
                    >
                      {/* Include time */}
                      時間を含む
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={
                        (questionData as DateQuestionType).includeYear !== false
                      }
                      onCheckedChange={(checked) => {
                        setValue(`${itemPath}.includeYear`, !!checked)
                      }}
                    >
                      {/* Include year */}
                      年を含む
                    </DropdownMenuCheckboxItem>
                  </>
                )}
                {questionType === 'time' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>回答の種類</DropdownMenuLabel>{' '}
                    {/* Answer type */}
                    <DropdownMenuRadioGroup
                      value={
                        (questionData as TimeQuestionType).answerType || 'time'
                      }
                      onValueChange={(value) => {
                        setValue(`${itemPath}.answerType`, value)
                      }}
                    >
                      <DropdownMenuRadioItem value="time">
                        {/* Time */}
                        時刻
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="duration">
                        {/* Duration */}
                        期間
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ) : (
        // ============================================================================
        // VIEW MODE
        // ============================================================================
        <div className="group relative cursor-pointer p-6">
          <div
            className="absolute left-1/2 top-3 flex -translate-x-1/2 cursor-grab justify-center opacity-0 transition-opacity group-hover:opacity-100"
            {...dndAttributes}
            {...dndListeners}
          >
            <GripHorizontal className="text-muted-foreground h-5 w-5" />
          </div>
          <div className="space-y-2">
            <p className="font-semibold">
              {questionLabel || '未タイトルの質問'} {/* Untitled Question */}
            </p>
            {questionData.description && (
              <p className="text-muted-foreground text-sm">
                {questionData.description}
              </p>
            )}
            <div className="pt-2">{renderQuestionPreview()}</div>
          </div>
        </div>
      )}
    </div>
  )
}
