import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { useOutsideClick } from '../useOutsideClick'

describe('useOutsideClick', () => {
  it('calls handler when clicking outside ref element', () => {
    const handler = jest.fn()
    const { result } = renderHook(() => useOutsideClick({ handler }))

    const div = document.createElement('div')
    document.body.appendChild(div)
    Object.defineProperty(result.current, 'current', {
      value: div,
      writable: true,
    })

    const outsideElement = document.createElement('span')
    document.body.appendChild(outsideElement)
    fireEvent.click(outsideElement)

    expect(handler).toHaveBeenCalledTimes(1)

    document.body.removeChild(div)
    document.body.removeChild(outsideElement)
  })

  it('does not call handler when clicking inside ref element', () => {
    const handler = jest.fn()
    const { result } = renderHook(() => useOutsideClick({ handler }))

    const div = document.createElement('div')
    const child = document.createElement('span')
    div.appendChild(child)
    document.body.appendChild(div)
    Object.defineProperty(result.current, 'current', {
      value: div,
      writable: true,
    })

    fireEvent.click(child)

    expect(handler).not.toHaveBeenCalled()

    document.body.removeChild(div)
  })

  it('does not call handler when clicking an anchor tag', () => {
    const handler = jest.fn()
    renderHook(() => useOutsideClick({ handler }))

    const link = document.createElement('a')
    link.href = '#'
    document.body.appendChild(link)

    fireEvent.click(link)

    expect(handler).not.toHaveBeenCalled()

    document.body.removeChild(link)
  })

  it('works with listenCapturing=false', () => {
    const handler = jest.fn()
    const { result } = renderHook(() =>
      useOutsideClick({ handler, listenCapturing: false })
    )

    const div = document.createElement('div')
    document.body.appendChild(div)
    Object.defineProperty(result.current, 'current', {
      value: div,
      writable: true,
    })

    const outsideElement = document.createElement('span')
    document.body.appendChild(outsideElement)
    fireEvent.click(outsideElement)

    expect(handler).toHaveBeenCalledTimes(1)

    document.body.removeChild(div)
    document.body.removeChild(outsideElement)
  })
})
