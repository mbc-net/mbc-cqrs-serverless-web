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
import type { LongTextQuestionType } from '../../../types/schema'

interface LongTextCreatorProps {
  itemPath: string
  questionData: LongTextQuestionType
  showValidation: boolean
  onCloseValidation: () => void
}

const LongTextValidationBuilder: React.FC<{
  itemPath: string
  onClose: () => void
}> = ({ itemPath, onClose }) => {
  const { control, watch, setValue, register } = useFormContext()
  const validationPath = `${itemPath}.validation.custom`
  const validationRule = watch(validationPath)

  const handleTypeChange = (newType: string) => {
    let defaultRule: string
    switch (newType) {
      case 'length':
        defaultRule = 'min'
        break
      case 'regex':
        defaultRule = 'matches'
        break
      default:
        defaultRule = 'min'
        break
    }
    // Update the rule and clear other values that depend on it
    setValue(`${validationPath}.rule`, defaultRule)
    setValue(`${validationPath}.value`, undefined)
  }

  const needsValue = !!validationRule?.rule

  return (
    <div className="mt-4 p-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* --- Group 1: Type and Rule Selects --- */}
        <div className="flex w-full flex-grow gap-2 sm:w-auto sm:flex-grow-0">
          <Controller
            control={control}
            name={`${validationPath}.type`}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(v) => {
                  field.onChange(v)
                  handleTypeChange(v)
                }}
              >
                <SelectTrigger className="w-[120px] border-0" size="xs">
                  <SelectValue
                    className="text-xs placeholder:text-xs"
                    placeholder="タイプ..." // "Type..."
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="text-xs" value="length">
                    {/* length  */}
                    文字数
                  </SelectItem>
                  <SelectItem className="text-xs" value="regex">
                    {/* regex  */}
                    正規表現
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            control={control}
            name={`${validationPath}.rule`}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={!validationRule?.type}
              >
                <SelectTrigger className="w-[180px] border-0" size="xs">
                  <SelectValue
                    className="text-xs placeholder:text-xs"
                    placeholder="ルール..." // "Rule..."
                  />
                </SelectTrigger>
                <SelectContent>
                  {validationRule?.type === 'length' && (
                    <>
                      <SelectItem className="text-xs" value="max">
                        {/* max character count */}
                        最大文字数
                      </SelectItem>
                      <SelectItem className="text-xs" value="min">
                        {/* Min character count */}
                        最小文字数
                      </SelectItem>
                    </>
                  )}
                  {validationRule?.type === 'regex' && (
                    <>
                      <SelectItem className="text-xs" value="contains">
                        {/* Contains */}
                        含む
                      </SelectItem>
                      <SelectItem className="text-xs" value="not_contains">
                        {/* Doesn't contain */}
                        含まない
                      </SelectItem>
                      <SelectItem value="matches">
                        {/* Matches */}
                        一致する
                      </SelectItem>
                      <SelectItem value="not_matches">
                        {/* Doesn't match */}
                        一致しない
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* --- Group 2: Value Inputs --- */}
        {needsValue && (
          <div className="flex flex-grow gap-2">
            <Input
              type={validationRule?.type === 'length' ? 'number' : 'text'}
              placeholder="値" // "Value"
              className="min-w-[80px] flex-grow rounded-none border-0 border-b px-1 text-xs shadow-none placeholder:text-xs focus-visible:ring-0"
              {...register(`${validationPath}.value`, {
                setValueAs: (value) => {
                  if (validationRule?.type === 'length') {
                    if (value === '' || value === null) return undefined
                    const num = Number(value)
                    return Number.isNaN(num) ? undefined : num
                  }
                  return value
                },
              })}
            />
          </div>
        )}

        {/* --- Group 3: Custom Error and Close Button --- */}
        <div className="flex w-full flex-grow gap-2 sm:w-auto">
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
    </div>
  )
}

export const LongTextCreator: React.FC<LongTextCreatorProps> = ({
  itemPath,
  showValidation,
  onCloseValidation,
}) => {
  return (
    <>
      <div className="px-1 pt-4">
        <div className="text-muted-foreground pointer-events-none min-h-[80px] w-full rounded border border-dashed p-3 text-sm">
          {/* Long answer text (paragraph) */}
          長文回答 (段落)
        </div>
      </div>

      {showValidation && (
        <LongTextValidationBuilder
          itemPath={itemPath}
          onClose={onCloseValidation}
        />
      )}
    </>
  )
}

export const LongTextPreview: React.FC = () => {
  return (
    <div className="text-muted-foreground pointer-events-none min-h-[80px] w-full rounded border border-dashed p-3 text-sm">
      {/* Long answer text (paragraph) */}
      長文回答 (段落)
    </div>
  )
}
