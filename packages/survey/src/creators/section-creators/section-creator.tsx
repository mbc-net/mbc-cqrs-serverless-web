// components/survey-creator/section-creator.tsx
'use client'

import { Button } from '../../ui/button'
import { CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { cn } from '../../utils'
import type { useSortable } from '@dnd-kit/sortable'
import { GripVertical, Trash2 } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'
import type { SectionHeaderType, SurveyItemType } from '../../types/schema'

interface SectionCreatorProps {
  itemIndex: number
  removeItem: (index: number) => void
  activeElementId: string | null
  setActiveElementId: (id: string | null) => void
  itemId: string
  dndAttributes?: ReturnType<typeof useSortable>['attributes']
  dndListeners?: ReturnType<typeof useSortable>['listeners']
}

export const SectionCreator: React.FC<SectionCreatorProps> = ({
  itemIndex,
  removeItem,
  activeElementId,
  setActiveElementId,
  itemId,
  dndAttributes,
  dndListeners,
}) => {
  const { register, control, watch, setValue } = useFormContext()

  const itemData = watch(`items.${itemIndex}`) as SectionHeaderType
  const actionType = itemData?.action?.type
  const allItems: SurveyItemType[] = watch('items')

  const isActive = activeElementId === itemId

  // Filter for items that are section headers to use as jump targets
  const sectionHeaders = allItems.filter(
    (item) => item.type === 'section-header'
  )

  return (
    <div
      id={itemId}
      onClick={() => setActiveElementId(itemId)}
      className={cn(
        'cursor-pointer rounded-lg border-l-8 transition-all',
        isActive
          ? 'border-primary bg-card shadow-lg'
          : 'border-primary/20 bg-muted/30'
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex items-center">
          <div className="cursor-grab" {...dndAttributes} {...dndListeners}>
            <GripVertical className="text-muted-foreground h-5 w-5" />
          </div>
          <CardTitle className="ml-2">
            {itemData?.title || 'セクション'} {/* Section */}
          </CardTitle>
        </div>
        {isActive && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              removeItem(itemIndex)
            }}
          >
            <Trash2 className="text-destructive h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      {isActive && (
        <CardContent
          className="cursor-default space-y-4 border-t p-4 md:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <Label>セクションタイトル</Label> {/* Section Title */}
            <Input {...register(`items.${itemIndex}.title`)} />
          </div>
          <div>
            <Label>セクション説明 (任意)</Label>{' '}
            {/* Section Description (Optional) */}
            <Input {...register(`items.${itemIndex}.description`)} />
          </div>
          <div className="space-y-2 pt-4">
            <h3 className="text-md font-semibold">セクションアクション</h3>{' '}
            {/* Section Action */}
            <div className="bg-background grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2">
              <div>
                <Label>このセクションが完了したとき...</Label>{' '}
                {/* When this section is complete... */}
                <Controller
                  control={control}
                  name={`items.${itemIndex}.action.type`}
                  render={({ field }) => (
                    <Select
                      value={field.value || 'default'}
                      onValueChange={(value) => {
                        const actionPath = `items.${itemIndex}.action`
                        if (value === 'default') {
                          setValue(actionPath, undefined)
                          field.onChange(undefined)
                        } else {
                          field.onChange(value)
                          if (value === 'submit')
                            setValue(actionPath, { type: 'submit' })
                          else if (value === 'jump')
                            setValue(actionPath, {
                              type: 'jump',
                              targetSectionId: '',
                            })
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="アクションを選択" />{' '}
                        {/* Select an action */}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">
                          {/* Default (Go to next section) */}
                          デフォルト (次のセクションに移動)
                        </SelectItem>
                        <SelectItem value="submit">
                          {/* Submit the survey */}
                          調査を送信
                        </SelectItem>
                        <SelectItem value="jump">
                          {/* Jump to a specific section */}
                          特定のセクションに移動
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {actionType === 'jump' && (
                <div>
                  <Label>移動先セクション</Label> {/* Jump Target */}
                  <Controller
                    control={control}
                    name={`items.${itemIndex}.action.targetSectionId`}
                    rules={{ required: '移動先セクションは必須です' }} // A target section is required
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder="移動先セクションを選択..." // Select target...
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {sectionHeaders
                            .filter((s) => s.id !== itemData.id)
                            .map((s, i) => (
                              <SelectItem key={s.id} value={s.id}>
                                {i + 1}: {s.title || '未タイトルセクション'}{' '}
                                {/* Untitled Section */}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </div>
  )
}
