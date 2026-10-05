import { render, screen, fireEvent } from '@testing-library/react'
import { useForm, FormProvider } from 'react-hook-form'
import { OptionsCreator } from '../src/creators/question-creators/options-creator'

let getValues: () => any

function Harness() {
  const methods = useForm({
    defaultValues: {
      items: [{ id: 'q1', type: 'single-choice', label: 'Q', options: [] }],
    },
  })
  getValues = methods.getValues
  return (
    <FormProvider {...methods}>
      <OptionsCreator
        itemIndex={0}
        questionType="single-choice"
        showBranching={false}
      />
    </FormProvider>
  )
}

const values = () =>
  getValues().items[0].options.map((o: { value: string }) => o.value)

describe('OptionsCreator', () => {
  it('numbers new option values from 1, continuing after the highest', () => {
    render(<Harness />)
    const add = screen.getByText('オプションを追加')

    fireEvent.click(add)
    fireEvent.click(add)
    fireEvent.click(add)
    expect(values()).toEqual(['1', '2', '3'])

    fireEvent.click(screen.getAllByTitle('削除')[1])
    fireEvent.click(add)
    expect(values()).toEqual(['1', '3', '4'])
  })

  it('keeps the value independent of the label', () => {
    render(<Harness />)
    fireEvent.click(screen.getByText('オプションを追加'))

    fireEvent.change(screen.getByPlaceholderText('オプション 1'), {
      target: { value: 'Yes' },
    })
    fireEvent.change(screen.getByLabelText('値'), {
      target: { value: 'Y' },
    })

    expect(getValues().items[0].options[0]).toMatchObject({
      label: 'Yes',
      value: 'Y',
    })
  })
})
