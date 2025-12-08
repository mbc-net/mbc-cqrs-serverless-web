'use client'
import { Input } from '../../../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select'
import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import type { LinearScaleQuestionType } from '../../../types/schema'

interface LinearScaleCreatorProps {
  itemPath: string
  questionData: LinearScaleQuestionType
}

export const LinearScaleCreator: React.FC<LinearScaleCreatorProps> = ({
  itemPath,
}) => {
  const { control, watch } = useFormContext()

  const minValue = watch(`${itemPath}.min`, 1)
  const maxValue = watch(`${itemPath}.max`, 5)

  return (
    <div className="space-y-4 px-1 pt-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Controller
            control={control}
            name={`${itemPath}.min`}
            defaultValue={1}
            render={({ field }) => (
              <Select
                onValueChange={(val) => field.onChange(Number(val))}
                value={field.value?.toString()}
              >
                <SelectTrigger
                  size="xs"
                  className="w-[80px] border-0 placeholder:text-xs"
                >
                  <SelectValue className="text-xs placeholder:text-xs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="text-xs" value="0">
                    0
                  </SelectItem>
                  <SelectItem className="text-xs" value="1">
                    1
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <span className="text-muted-foreground text-sm">〜</span> {/* to */}
          <Controller
            control={control}
            name={`${itemPath}.max`}
            defaultValue={5}
            render={({ field }) => (
              <Select
                onValueChange={(val) => field.onChange(Number(val))}
                value={field.value?.toString()}
              >
                <SelectTrigger
                  size="xs"
                  className="w-[80px] border-0 placeholder:text-xs"
                >
                  <SelectValue className="text-xs placeholder:text-xs" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 9 }, (_, i) => i + 2).map((num) => (
                    <SelectItem
                      className="text-xs"
                      key={num}
                      value={num.toString()}
                    >
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground w-8 flex-shrink-0 text-center text-sm">
            {minValue}
          </span>
          <Input
            placeholder="ラベル（任意)" // "Label (optional)"
            className="max-w-[200px] rounded-none border-0 border-b text-xs shadow-none placeholder:text-xs focus-visible:ring-0"
            {...control.register(`${itemPath}.minLabel`)}
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground w-8 flex-shrink-0 text-center text-sm">
            {maxValue}
          </span>
          <Input
            placeholder="ラベル（任意)" // "Label (optional)"
            className="max-w-[200px] rounded-none border-0 border-b text-xs shadow-none placeholder:text-xs focus-visible:ring-0"
            {...control.register(`${itemPath}.maxLabel`)}
          />
        </div>
      </div>
    </div>
  )
}

interface LinearScalePreviewProps {
  questionData: LinearScaleQuestionType
}

export const LinearScalePreview: React.FC<LinearScalePreviewProps> = ({
  questionData,
}) => {
  const min = questionData.min ?? 1
  const max = questionData.max ?? 5
  const scaleOptions = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  return (
    <div className="pointer-events-none flex w-full items-center justify-between gap-4">
      <span className="text-muted-foreground w-1/12 flex-shrink-0 text-center text-sm">
        {questionData.minLabel}
      </span>
      <div className="flex flex-grow justify-around">
        {scaleOptions.map((num) => (
          <div key={num} className="flex flex-col items-center space-y-2">
            <span className="text-muted-foreground text-sm">{num}</span>
            <div className="border-muted-foreground h-4 w-4 rounded-full border" />
          </div>
        ))}
      </div>
      <span className="text-muted-foreground w-1/12 flex-shrink-0 text-center text-sm">
        {questionData.maxLabel}
      </span>
    </div>
  )
}
