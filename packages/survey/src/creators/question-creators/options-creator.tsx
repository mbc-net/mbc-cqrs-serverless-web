// components/survey-creator/options-creator.tsx
'use client'

import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToParentElement } from '@dnd-kit/modifiers'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'
import type React from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import type { SurveyItemType } from '../../types/schema'
import { Checkbox } from '../../ui/checkbox'

const DEFAULT_SELECT_VALUE = '##__DEFAULT__##'

// A dedicated component for a single sortable option row
const SortableOption: React.FC<{
  field: Record<'id', string>
  index: number
  itemIndex: number
  questionType: 'single-choice' | 'multiple-choice' | 'dropdown'
  showBranching: boolean
  removeOption: (index: number) => void
  isOther?: boolean
}> = ({
  field,
  index,
  itemIndex,
  questionType,
  showBranching,
  removeOption,
  isOther = false,
}) => {
  const { control, register, watch, setValue } = useFormContext()

  const allItems: SurveyItemType[] = watch('items')
  const sectionHeaders = allItems.filter(
    (item) => item.type === 'section-header'
  )

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id, disabled: isOther })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      {!isOther && (
        <div
          className="cursor-grab touch-none p-1"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="text-muted-foreground h-5 w-5" />
        </div>
      )}
      {isOther && <div className="w-[29px]" />}
      <div className="flex-1">
        <Input
          placeholder={`オプション ${index + 1}`} // "Option ${index + 1}"
          disabled={isOther}
          {...register(`items.${itemIndex}.options.${index}.label`, {
            onChange: (e) => {
              if (!isOther) {
                setValue(
                  `items.${itemIndex}.options.${index}.value`,
                  e.target.value
                )
              }
            },
          })}
        />
      </div>

      {(questionType === 'single-choice' || questionType === 'dropdown') &&
        showBranching &&
        !isOther && (
          <div className="w-[180px]">
            <Controller
              control={control}
              name={`items.${itemIndex}.options.${index}.nextSectionId`}
              render={({ field: selectField }) => (
                <Select
                  value={selectField.value || ''}
                  onValueChange={(value) => {
                    selectField.onChange(
                      value === DEFAULT_SELECT_VALUE ? undefined : value
                    )
                  }}
                >
                  <SelectTrigger className="w-[180px] truncate text-xs">
                    <SelectValue
                      placeholder="セクションに移動..."
                      className="block min-w-0 truncate"
                    />
                    {/* Go to section... */}
                  </SelectTrigger>
                  <SelectContent className="max-w-[380px]">
                    <SelectItem value={DEFAULT_SELECT_VALUE}>
                      {/* Default (Next Section) */}
                      デフォルト (次のセクション)
                    </SelectItem>
                    {sectionHeaders.map((sec) => (
                      <SelectItem key={sec.id} value={sec.id}>
                        {/* Untitled Section */}
                        {sec.title || '未タイトルセクション'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        )}

      {!isOther && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hover:bg-destructive/10 hover:text-destructive shrink-0"
          onClick={() => removeOption(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      {isOther && <div className="w-[40px]" />}
    </div>
  )
}

interface OptionsCreatorProps {
  itemIndex: number
  questionType: 'single-choice' | 'multiple-choice' | 'dropdown'
  showBranching: boolean
}

export const OptionsCreator: React.FC<OptionsCreatorProps> = ({
  itemIndex,
  questionType,
  showBranching,
}) => {
  const { control, watch, setValue } = useFormContext()

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
    move: moveOption,
  } = useFieldArray({
    control,
    name: `items.${itemIndex}.options`,
  })

  // Watch options to find "Other" option
  const options = watch(`items.${itemIndex}.options`)
  const otherOptionIndex = options?.findIndex(
    (opt: any) => opt?.isOther === true
  )
  const hasOtherOption = otherOptionIndex !== -1

  // Filter out "Other" option from sortable list
  const sortableFields = optionFields.filter((field, index) => {
    const option = options?.[index]
    return !option?.isOther
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = sortableFields.findIndex(
        (field) => field.id === active.id
      )
      const newIndex = sortableFields.findIndex((field) => field.id === over.id)
      // Map sortable indices back to actual indices
      const actualOldIndex = optionFields.findIndex(
        (field) => field.id === active.id
      )
      const actualNewIndex = optionFields.findIndex(
        (field) => field.id === over.id
      )
      moveOption(actualOldIndex, actualNewIndex)
    }
  }

  const addOption = () => {
    const newLabel = `オプション ${sortableFields.length + 1}` // "Option ${sortableFields.length + 1}"
    appendOption({ label: newLabel, value: newLabel })
  }

  const toggleOtherOption = () => {
    if (hasOtherOption && otherOptionIndex !== undefined) {
      // Remove "Other" option
      removeOption(otherOptionIndex)
    } else {
      // Add "Other" option at the end
      appendOption({
        label: 'その他',
        value: 'other',
        isOther: true,
      })
    }
  }

  return (
    <div className="space-y-3 pt-2">
      <Label>オプション</Label> {/* Options */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
      >
        <SortableContext
          items={sortableFields.map((field) => field.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {optionFields.map((field, index) => {
              const option = options?.[index]
              const isOther = option?.isOther === true
              // Skip "Other" option in sortable list, it will be rendered separately
              if (isOther) return null
              return (
                <SortableOption
                  key={field.id}
                  field={field}
                  index={index}
                  itemIndex={itemIndex}
                  questionType={questionType}
                  showBranching={showBranching}
                  removeOption={removeOption}
                  isOther={false}
                />
              )
            })}
          </div>
        </SortableContext>
      </DndContext>
      {/* Render "Other" option separately at the end if it exists */}
      {hasOtherOption && otherOptionIndex !== undefined && (
        <div className="space-y-2">
          <SortableOption
            key={optionFields[otherOptionIndex]?.id}
            field={optionFields[otherOptionIndex]}
            index={otherOptionIndex}
            itemIndex={itemIndex}
            questionType={questionType}
            showBranching={showBranching}
            removeOption={removeOption}
            isOther={true}
          />
        </div>
      )}
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={addOption}>
          {/* Add Option */}
          オプションを追加
        </Button>
        {(questionType === 'single-choice' ||
          questionType === 'multiple-choice') && (
          <Button
            type="button"
            variant={hasOtherOption ? 'default' : 'outline'}
            size="sm"
            onClick={toggleOtherOption}
          >
            {/* Add Other */}
            {hasOtherOption ? 'その他を削除' : 'その他を追加'}
          </Button>
        )}
      </div>
    </div>
  )
}
