import {
  scrollToError,
  scrollToName,
  scrollToRef,
  getError,
} from '../validation'

describe('getError', () => {
  it('retrieves deeply nested error by dot-separated name', () => {
    const errors = {
      user: {
        profile: {
          name: { message: '名前は必須です', type: 'required' },
        },
      },
    } as any
    expect(getError(errors, 'user.profile.name')).toEqual({
      message: '名前は必須です',
      type: 'required',
    })
  })

  it('retrieves top-level error', () => {
    const errors = {
      email: { message: 'メールは必須です', type: 'required' },
    } as any
    expect(getError(errors, 'email')).toEqual({
      message: 'メールは必須です',
      type: 'required',
    })
  })

  it('null errors → null', () => {
    expect(getError(null as any, 'field')).toBeNull()
  })

  it('non-existent path returns undefined', () => {
    const errors = { name: { message: 'error' } } as any
    expect(getError(errors, 'nonexistent')).toBeUndefined()
  })

  it('returns null when intermediate path is null', () => {
    const errors = { user: null } as any
    expect(getError(errors, 'user.profile.name')).toBeNull()
  })
})

describe('scrollToError', () => {
  it('calls scrollIntoView when error element exists', () => {
    const element = document.createElement('input')
    element.setAttribute('name', 'email')
    document.body.appendChild(element)

    const errors = { email: { message: 'error', type: 'required' } } as any
    scrollToError(errors)

    expect(element.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center',
    })

    document.body.removeChild(element)
  })

  it('does not throw when error element does not exist', () => {
    const errors = {
      nonexistent: { message: 'error', type: 'required' },
    } as any
    expect(() => scrollToError(errors)).not.toThrow()
  })
})

describe('scrollToName', () => {
  it('finds element by name and calls scrollIntoView', () => {
    const element = document.createElement('input')
    element.setAttribute('name', 'username')
    document.body.appendChild(element)

    scrollToName('username')

    expect(element.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center',
    })

    document.body.removeChild(element)
  })

  it('does not throw when element does not exist', () => {
    expect(() => scrollToName('nonexistent')).not.toThrow()
  })
})

describe('scrollToRef', () => {
  it('calls scrollIntoView when ref.current exists', () => {
    const mockElement = { scrollIntoView: jest.fn() }
    const ref = { current: mockElement } as any

    scrollToRef(ref)

    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center',
    })
  })

  it('does not throw when ref.current is null', () => {
    const ref = { current: null } as any
    expect(() => scrollToRef(ref)).not.toThrow()
  })

  it('does not throw when ref is null', () => {
    expect(() => scrollToRef(null as any)).not.toThrow()
  })
})
