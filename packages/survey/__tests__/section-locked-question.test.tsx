import { render, screen, fireEvent } from '@testing-library/react'
import { useForm, FormProvider, type UseFormReturn } from 'react-hook-form'
import { SectionHeaderCreator } from '../src/creators/section-creators/section-header-creator'
import type { SurveySchemaType } from '../src/types/schema'

function Harness({
  onReady,
}: {
  onReady?: (methods: UseFormReturn<SurveySchemaType>) => void
}) {
  const methods = useForm<SurveySchemaType>({
    defaultValues: {
      title: 'Survey',
      items: [
        { id: 'sec_1', type: 'section-header', title: 'First' },
        { id: 'q_email', type: 'short-text', label: 'Email', locked: true },
        { id: 'sec_2', type: 'section-header', title: 'Second' },
      ],
    },
  })
  onReady?.(methods)

  return (
    <FormProvider {...methods}>
      <SectionHeaderCreator
        itemIndex={0}
        itemId="sec_1"
        removeItem={jest.fn()}
        insertItem={jest.fn()}
        activeElementId="sec_1"
        setActiveElementId={jest.fn()}
        onOpenReorderModal={jest.fn()}
      />
    </FormProvider>
  )
}

function openSectionMenu() {
  const trigger = screen.getAllByRole('button').at(-1)!
  fireEvent.keyDown(trigger, { key: 'Enter' })
}

describe('section containing a locked question', () => {
  it('cannot be deleted', () => {
    render(<Harness />)
    openSectionMenu()

    const deleteItem = screen.getByRole('menuitem', {
      name: /セクションを削除/,
    })
    expect(deleteItem.getAttribute('data-disabled')).not.toBeNull()
  })

  it('duplicates the locked question as an unlocked copy', () => {
    let methods: UseFormReturn<SurveySchemaType> | undefined
    render(<Harness onReady={(m) => (methods = m)} />)
    openSectionMenu()

    fireEvent.click(screen.getByRole('menuitem', { name: /セクションを複製/ }))

    const items = methods!.getValues('items')
    expect(items).toHaveLength(5)
    expect(items[1]).toMatchObject({ id: 'q_email', locked: true })
    expect(items[3]).toMatchObject({ label: 'Email' })
    expect(items[3]).not.toHaveProperty('locked')
  })
})
