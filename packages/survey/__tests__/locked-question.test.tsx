import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useForm, FormProvider } from 'react-hook-form'
import { QuestionCreator } from '../src/creators/question-creators/question-creator'
import {
  ShortTextQuestionSchema,
  type SurveySchemaType,
} from '../src/types/schema'

function Harness() {
  const methods = useForm<SurveySchemaType>({
    defaultValues: {
      title: 'Survey',
      items: [
        { id: 'q_email', type: 'short-text', label: 'Email', locked: true },
      ],
    },
  })
  const [activeElementId, setActiveElementId] = useState<string | null>(null)

  return (
    <FormProvider {...methods}>
      <QuestionCreator
        itemIndex={0}
        questionId="q_email"
        removeItem={jest.fn()}
        insertItem={jest.fn()}
        setPendingActiveDataId={jest.fn()}
        activeElementId={activeElementId}
        setActiveElementId={setActiveElementId}
      />
    </FormProvider>
  )
}

describe('locked question', () => {
  it('stays read-only with no delete, duplicate or drag handle when selected', () => {
    const { container } = render(<Harness />)

    fireEvent.click(screen.getByText('Email'))

    expect(screen.getByLabelText('ロックされた質問')).toBeTruthy()
    expect(screen.queryByPlaceholderText('質問')).toBeNull()
    expect(screen.queryByTitle('削除')).toBeNull()
    expect(screen.queryByTitle('複製')).toBeNull()
    expect(container.querySelector('.lucide-grip-horizontal')).toBeNull()
  })

  it('keeps the locked flag through schema parsing', () => {
    const parsed = ShortTextQuestionSchema.parse({
      id: 'q_email',
      type: 'short-text',
      label: 'Email',
      locked: true,
    })
    expect(parsed.locked).toBe(true)
  })
})
