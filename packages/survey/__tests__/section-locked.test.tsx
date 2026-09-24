import { render, screen, fireEvent } from '@testing-library/react'
import { useForm, FormProvider } from 'react-hook-form'
import { SectionHeaderCreator } from '../src/creators/section-creators/section-header-creator'
import { SurveyCreator } from '../src/creators/survey-creator'
import { SectionHeaderSchema, type SurveySchemaType } from '../src/types/schema'

// Radix UI in an active question needs ResizeObserver, which jsdom lacks.
global.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const schema: SurveySchemaType = {
  title: 'Survey',
  items: [
    { id: 'sec_1', type: 'section-header', title: 'Locked', locked: true },
    { id: 'q_a', type: 'short-text', label: 'Inside locked' },
    { id: 'sec_2', type: 'section-header', title: 'Open' },
    { id: 'q_b', type: 'short-text', label: 'Inside open' },
  ],
}

function Harness({ itemIndex, itemId }: { itemIndex: number; itemId: string }) {
  const methods = useForm<SurveySchemaType>({ defaultValues: schema })

  return (
    <FormProvider {...methods}>
      <SectionHeaderCreator
        itemIndex={itemIndex}
        itemId={itemId}
        removeItem={jest.fn()}
        insertItem={jest.fn()}
        activeElementId={itemId}
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

function menuItem(name: RegExp) {
  return screen.getByRole('menuitem', { name })
}

describe('locked section', () => {
  it('keeps the locked flag through schema parsing', () => {
    const parsed = SectionHeaderSchema.parse(schema.items[0])
    expect(parsed).toMatchObject({ locked: true })
  })

  it('stays read-only with delete and merge disabled when selected', () => {
    render(<Harness itemIndex={0} itemId="sec_1" />)

    expect(screen.getByLabelText('ロックされたセクション')).toBeTruthy()
    expect(screen.queryByPlaceholderText('未タイトルセクション')).toBeNull()

    openSectionMenu()
    expect(
      menuItem(/セクションを削除/).getAttribute('data-disabled')
    ).not.toBeNull()
    expect(menuItem(/マージ/).getAttribute('data-disabled')).not.toBeNull()
  })

  it('cannot be merged into from the section below', () => {
    render(<Harness itemIndex={2} itemId="sec_2" />)
    openSectionMenu()

    expect(menuItem(/マージ/).getAttribute('data-disabled')).not.toBeNull()
  })
})

describe('floating action bar with a locked section', () => {
  it('shows for an open section', () => {
    render(<SurveyCreator initialSchema={schema} onSubmit={jest.fn()} />)
    fireEvent.click(screen.getByText('Open'))

    expect(screen.queryByTitle('質問を追加')).not.toBeNull()
  })

  it('hides when the locked section header is selected', () => {
    render(<SurveyCreator initialSchema={schema} onSubmit={jest.fn()} />)
    fireEvent.click(screen.getByText('Locked'))

    expect(screen.queryByTitle('質問を追加')).toBeNull()
  })

  it('hides when a question inside the locked section is selected', () => {
    render(<SurveyCreator initialSchema={schema} onSubmit={jest.fn()} />)
    fireEvent.click(screen.getByText('Inside locked'))

    expect(screen.queryByTitle('質問を追加')).toBeNull()
  })
})
