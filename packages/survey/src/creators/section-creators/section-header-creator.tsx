// components/survey-creator/section-header-creator.tsx
'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../ui/alert-dialog'
import { Button } from '../../ui/button'
import { Card, CardHeader } from '../../ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu'
import { Input } from '../../ui/input'
import { createId } from '../../utils'
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Combine,
  Copy,
  MoreVertical,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import type { SurveyItemType, SurveySchemaType } from '../../types/schema'

interface SectionHeaderCreatorProps {
  itemIndex: number
  removeItem: (index: number) => void
  insertItem: (index: number, item: any) => void
  activeElementId: string | null
  setActiveElementId: (id: string | null) => void
  itemId: string
  onOpenReorderModal: () => void
}

export const SectionHeaderCreator: React.FC<SectionHeaderCreatorProps> = ({
  itemIndex,
  removeItem,
  activeElementId,
  setActiveElementId,
  itemId,
  onOpenReorderModal,
}) => {
  const { register, watch, setValue, getValues } =
    useFormContext<SurveySchemaType>()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const allItems = watch('items')
  const isActive = activeElementId === itemId
  const itemData = watch(`items.${itemIndex}`) as Extract<
    SurveyItemType,
    { type: 'section-header' }
  >

  const sectionHeaders = allItems.filter(
    (item) => item.type === 'section-header'
  )
  const currentSectionNumber =
    sectionHeaders.findIndex((s) => s.id === itemData.id) + 1
  const totalSections = sectionHeaders.length

  const isLastRemainingSection = sectionHeaders.length <= 1

  let sectionEndIndex = allItems.findIndex(
    (item, index) => index > itemIndex && item.type === 'section-header'
  )
  if (sectionEndIndex === -1) sectionEndIndex = allItems.length
  const hasLockedQuestion = allItems
    .slice(itemIndex + 1, sectionEndIndex)
    .some((item) => item.type !== 'section-header' && item.locked)

  const handleDuplicate = () => {
    const allItems = getValues('items')
    let endIndex = allItems.findIndex(
      (item, index) => index > itemIndex && item.type === 'section-header'
    )
    if (endIndex === -1) endIndex = allItems.length

    const itemsToDuplicate = allItems.slice(itemIndex, endIndex)
    const duplicatedItems = itemsToDuplicate.map((item) => {
      const newId = createId(item.type === 'section-header' ? 'sec' : 'q')
      if (item.type === 'section-header') {
        return { ...item, id: newId, title: `${item.title} (Copy)` }
      }
      // Copies of locked questions are ordinary, editable questions.
      const { locked, ...rest } = item
      return { ...rest, id: newId }
    })

    const finalItems = [
      ...allItems.slice(0, endIndex),
      ...duplicatedItems,
      ...allItems.slice(endIndex),
    ]
    setValue('items', finalItems)
  }

  const handleMerge = () => {
    if (itemIndex > 0) removeItem(itemIndex)
  }

  const handleDeleteSection = () => {
    const allItems = getValues('items')
    let endIndex = allItems.findIndex(
      (item, index) => index > itemIndex && item.type === 'section-header'
    )
    if (endIndex === -1) endIndex = allItems.length
    const newItems = [
      ...allItems.slice(0, itemIndex),
      ...allItems.slice(endIndex),
    ]
    setValue('items', newItems)
    setIsDeleteDialogOpen(false)
  }

  const menu = (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onOpenReorderModal}>
            <ArrowUpDown className="mr-2 h-4 w-4" />
            <span>
              {/* Move section */}
              セクションを移動
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            <span>
              {/* Duplicate section */}
              セクションを複製
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleMerge}
            disabled={itemIndex === 0 || isLastRemainingSection}
          >
            <Combine className="mr-2 h-4 w-4" />
            <span>
              {/* Merge with above */}
              上のセクションとマージ
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-destructive"
              onSelect={(e) => e.preventDefault()}
              disabled={isLastRemainingSection || hasLockedQuestion}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>
                {/* Delete section */}
                セクションを削除
                {hasLockedQuestion && (
                  // (contains locked questions)
                  <span className="ml-1 text-xs">(ロックされた質問を含む)</span>
                )}
              </span>
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {/* Delete questions and section? */}
            質問とセクションを削除しますか？
          </AlertDialogTitle>
          <AlertDialogDescription>
            {/* Deleting a section also deletes all questions it contains. This action cannot be undone. */}
            セクションを削除すると、それに含まれるすべての質問も削除されます。この操作は元に戻すことができません。
            <br />
            <br />
            {/* To preserve the questions, choose "Merge with above" from the section options instead. */}
            質問を保持するには、セクションオプションから
            "上のセクションとマージ" を選択してください。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {/* Cancel */}
            キャンセル
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteSection}>
            {/* Delete */}
            削除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return (
    <div id={itemId} className="relative pt-5">
      {/* Section Number Tab */}
      <div className="bg-primary text-primary-foreground absolute -top-1 left-0 z-10 rounded-md rounded-b-none px-3 py-1 text-xs font-semibold">
        {/* Section {currentSectionNumber} of {totalSections} */}
        セクション {currentSectionNumber} / {totalSections}
      </div>

      {/* Main Content Card */}
      {isActive ? (
        // ============================================================================
        // ACTIVE MODE
        // ============================================================================
        <Card
          className="border-l-primary rounded-tl-none border-l-4 shadow-lg"
          onClick={() => setActiveElementId(itemId)}
        >
          <CardHeader className="flex flex-row items-start justify-between gap-4 p-6">
            <div className="w-full space-y-4">
              <Input
                placeholder="未タイトルセクション" // Untitled Section
                {...register(`items.${itemIndex}.title`)}
                className="h-auto rounded-none border-0 border-b p-1 text-xl font-semibold shadow-none focus-visible:ring-0"
              />
              <Input
                placeholder="説明 (任意)" // Description (optional)
                {...register(`items.${itemIndex}.description`)}
                className="h-auto rounded-none border-0 border-b p-1 text-sm shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveElementId(null)
                }}
              >
                <ChevronUp className="text-muted-foreground h-5 w-5" />
              </Button>
              {menu}
            </div>
          </CardHeader>
        </Card>
      ) : (
        // ============================================================================
        // VIEW MODE
        // ============================================================================
        <div
          className="bg-card cursor-pointer rounded-lg rounded-tl-none border p-6 shadow-sm"
          onClick={() => setActiveElementId(itemId)}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="font-semibold">
                {itemData?.title || '未タイトルセクション'}{' '}
                {/* Untitled Section */}
              </p>
              {itemData?.description && (
                <p className="text-muted-foreground text-sm">
                  {itemData.description} {/* Description */}
                </p>
              )}
            </div>
            <div className="flex items-center">
              {' '}
              {/* Move section */}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveElementId(itemId)
                }}
              >
                <ChevronDown className="text-muted-foreground h-5 w-5" />
              </Button>
              {menu}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
