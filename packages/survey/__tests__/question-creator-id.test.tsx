import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useForm, FormProvider, type UseFormReturn } from 'react-hook-form'
import { QuestionCreator } from '../src/creators/question-creators/question-creator'
import type { SurveySchemaType } from '../src/types/schema'

/**
 * The regression being guarded: editing a question's label must not touch
 * its id. That coupling used to live in a useEffect inside
 * question-creator.tsx (removed in an earlier hardening task). Rendering the
 * real QuestionCreator - not a stand-in - is what lets this test catch
 * anyone re-adding that effect.
 */
function Harness({
  onReady,
}: {
  onReady: (methods: UseFormReturn<SurveySchemaType>) => void
}) {
  const methods = useForm<SurveySchemaType>({
    defaultValues: {
      title: 'Survey',
      items: [{ id: 'q_seed', type: 'short-text', label: '' }],
    },
  })
  onReady(methods)

  const [activeElementId, setActiveElementId] = useState<string | null>(null)

  return (
    <FormProvider {...methods}>
      <QuestionCreator
        itemIndex={0}
        questionId="q_seed"
        removeItem={jest.fn()}
        insertItem={jest.fn()}
        setPendingActiveDataId={jest.fn()}
        activeElementId={activeElementId}
        setActiveElementId={setActiveElementId}
      />
    </FormProvider>
  )
}

describe('question label editing', () => {
  it('leaves the question id untouched when the label changes', () => {
    let methods: UseFormReturn<SurveySchemaType> | undefined
    render(<Harness onReady={(m) => (methods = m)} />)

    // The question starts collapsed (view mode). Clicking it activates edit
    // mode, which is where question-creator.tsx renders the label input.
    fireEvent.click(screen.getByText('新しい質問'))

    const labelInput = screen.getByPlaceholderText('質問')
    fireEvent.change(labelInput, {
      target: { value: 'What is your name?' },
    })

    const state = methods?.getValues()
    expect(state?.items[0].id).toBe('q_seed')
    expect(state?.items[0]).toMatchObject({ label: 'What is your name?' })
  })
})
