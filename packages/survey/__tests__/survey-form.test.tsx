import { render, screen, fireEvent } from '@testing-library/react'
import { SurveyForm } from '../src/forms/survey-form'
import type { SurveySchemaType } from '../src/types/schema'

const schema: SurveySchemaType = {
  title: 'Feedback',
  items: [
    { id: 'q_name', type: 'short-text', label: 'What is your name?' },
    { id: 'q_note', type: 'long-text', label: 'Anything else?' },
  ],
}

describe('SurveyForm submit payload', () => {
  it('keys answers by question id, not by question text', async () => {
    const onSubmit = jest.fn()
    render(<SurveyForm schema={schema} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/What is your name\?/), {
      target: { value: 'Alice' },
    })
    fireEvent.click(screen.getByRole('button', { name: /アンケートを送信/ }))

    await screen.findByRole('button', { name: /アンケートを送信/ })
    expect(onSubmit).toHaveBeenCalled()

    const [answers] = onSubmit.mock.calls[0]
    expect(answers).toHaveProperty('q_name', 'Alice')
    expect(answers).not.toHaveProperty('What is your name?')
  })

  it('passes question label and type as a second meta argument', async () => {
    const onSubmit = jest.fn()
    render(<SurveyForm schema={schema} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/What is your name\?/), {
      target: { value: 'Alice' },
    })
    fireEvent.click(screen.getByRole('button', { name: /アンケートを送信/ }))

    await screen.findByRole('button', { name: /アンケートを送信/ })
    const [, meta] = onSubmit.mock.calls[0]

    expect(meta).toEqual([
      {
        id: 'q_name',
        label: 'What is your name?',
        type: 'short-text',
        value: 'Alice',
      },
      {
        id: 'q_note',
        label: 'Anything else?',
        type: 'long-text',
        value: undefined,
      },
    ])
  })
})

describe('SurveyForm editing an existing answer', () => {
  // Radix Checkbox measures itself; jsdom has no ResizeObserver.
  beforeAll(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  })

  const editSchema: SurveySchemaType = {
    title: 'Feedback',
    items: [
      { id: 'q_name', type: 'short-text', label: 'What is your name?' },
      {
        id: 'q_fruit',
        type: 'multiple-choice',
        label: 'Fruits?',
        options: [
          { label: 'Apple', value: 'apple' },
          { label: 'Banana', value: 'banana' },
        ],
      },
    ],
  }

  it('pre-fills fields from defaultValues and submits them back', async () => {
    const onSubmit = jest.fn()
    render(
      <SurveyForm
        schema={editSchema}
        onSubmit={onSubmit}
        defaultValues={{ q_name: 'Alice', q_fruit: ['banana'] }}
      />
    )

    expect(
      (screen.getByLabelText(/What is your name\?/) as HTMLInputElement).value
    ).toBe('Alice')
    expect(screen.getByLabelText('Banana').getAttribute('aria-checked')).toBe(
      'true'
    )
    expect(screen.getByLabelText('Apple').getAttribute('aria-checked')).toBe(
      'false'
    )

    fireEvent.click(screen.getByRole('button', { name: /アンケートを送信/ }))
    await screen.findByRole('button', { name: /アンケートを送信/ })

    const [answers] = onSubmit.mock.calls[0]
    expect(answers).toEqual({ q_name: 'Alice', q_fruit: ['banana'] })
  })

  it('drops answers to questions no longer in the schema', async () => {
    const onSubmit = jest.fn()
    render(
      <SurveyForm
        schema={editSchema}
        onSubmit={onSubmit}
        defaultValues={{ q_name: 'Alice', q_deleted: 'stale' }}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /アンケートを送信/ }))
    await screen.findByRole('button', { name: /アンケートを送信/ })

    const [answers] = onSubmit.mock.calls[0]
    expect(answers).not.toHaveProperty('q_deleted')
    expect(answers).toHaveProperty('q_name', 'Alice')
  })

  it('uses submitLabel for the submit button', () => {
    render(
      <SurveyForm
        schema={editSchema}
        onSubmit={jest.fn()}
        submitLabel="回答を更新"
      />
    )

    expect(screen.getByRole('button', { name: '回答を更新' })).toBeTruthy()
  })
})
