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
    expect(
      (screen.getByTitle('質問を追加') as HTMLButtonElement).disabled
    ).toBe(false)
  })

  it('shows add-section but disables add-question when the locked section header is selected', () => {
    render(<SurveyCreator initialSchema={schema} onSubmit={jest.fn()} />)
    fireEvent.click(screen.getByText('Locked'))

    expect(
      (
        screen.getByTitle(
          'ロックされたセクションには質問を追加できません'
        ) as HTMLButtonElement
      ).disabled
    ).toBe(true)
    expect(
      (
        screen.getByTitle(
          'ロックされたセクションの後にセクションを追加'
        ) as HTMLButtonElement
      ).disabled
    ).toBe(false)
  })

  it('shows add-section but disables add-question when a question inside the locked section is selected', () => {
    render(<SurveyCreator initialSchema={schema} onSubmit={jest.fn()} />)
    fireEvent.click(screen.getByText('Inside locked'))

    expect(
      (
        screen.getByTitle(
          'ロックされたセクションには質問を追加できません'
        ) as HTMLButtonElement
      ).disabled
    ).toBe(true)
    expect(
      (
        screen.getByTitle(
          'ロックされたセクションの後にセクションを追加'
        ) as HTMLButtonElement
      ).disabled
    ).toBe(false)
  })

  it('inserts a new section after the locked section, not inside it', () => {
    const onSchemaChange = jest.fn()
    render(
      <SurveyCreator
        initialSchema={schema}
        onSubmit={jest.fn()}
        onSchemaChange={onSchemaChange}
      />
    )
    fireEvent.click(screen.getByText('Inside locked'))
    fireEvent.click(
      screen.getByTitle('ロックされたセクションの後にセクションを追加')
    )

    // New section is activated for editing → title lives in an input.
    expect(screen.getByDisplayValue('セクション 3')).toBeTruthy()

    const latest = onSchemaChange.mock.calls.at(-1)?.[0] as SurveySchemaType
    expect(latest.items.map((item) => item.id)).toEqual([
      'sec_1',
      'q_a',
      expect.any(String), // new unlocked section
      'sec_2',
      'q_b',
    ])
    expect(latest.items[2]).toMatchObject({
      type: 'section-header',
      title: 'セクション 3',
    })
    expect(latest.items[2]).not.toHaveProperty('locked', true)
  })
})
