// components/survey-creator/floating-action-bar.tsx
'use client'

import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Separator } from '../ui/separator'
import { Plus, Tally4, Text, Type } from 'lucide-react'

interface FloatingActionBarProps {
  context: { top: number; index: number } | null
  onAddQuestion: (index: number) => void
  onAddSection: (index: number) => void
  /** Inside a locked section: questions cannot be added into it. */
  disableAddQuestion?: boolean
}

export const FloatingActionBar: React.FC<FloatingActionBarProps> = ({
  context,
  onAddQuestion,
  onAddSection,
  disableAddQuestion = false,
}) => {
  if (!context) {
    return null
  }

  return (
    <Card
      className="absolute right-[-80px] flex flex-col items-center gap-2 p-2 transition-all duration-150"
      style={{
        top: `${context.top}px`,
        transform: 'translateY(10%)', // Minor offset
      }}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={disableAddQuestion}
        onClick={() => onAddQuestion(context.index)}
        title={
          disableAddQuestion
            ? 'ロックされたセクションには質問を追加できません' // Cannot add questions into a locked section
            : '質問を追加' // Add Question
        }
      >
        <Plus className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled
        title="質問をインポート (将来実装予定)" // Import Questions (coming soon)
      >
        <Text className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled
        title="タイトルと説明を追加 (将来実装予定)" // Add Title & Description (coming soon)
      >
        <Type className="h-5 w-5" />
      </Button>
      <Separator />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onAddSection(context.index)}
        title={
          disableAddQuestion
            ? 'ロックされたセクションの後にセクションを追加' // Add section after locked section
            : 'セクションを追加' // Add Section
        }
      >
        <Tally4 className="h-5 w-5" />
      </Button>
    </Card>
  )
}
