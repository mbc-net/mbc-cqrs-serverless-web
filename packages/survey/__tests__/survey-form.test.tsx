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
