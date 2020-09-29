import { act, renderHook } from '@testing-library/react-hooks'

import { useObservableState } from './use-observable-state'

describe('useObservableState', () => {
  it('emits initial value', () => {
    const next = jest.fn()

    const { result } = renderHook(() => useObservableState(1))
    result.current[0].subscribe({
      next
    })
    expect(next).toBeCalledWith(1)
  })

  it('emits new values', () => {
    const next = jest.fn()

    const { result } = renderHook(() => useObservableState(1))
    result.current[0].subscribe({
      next
    })

    act(() => {
      result.current[1](2)
    })
    expect(next).toBeCalledWith(2)
  })

  it('accepts update function', () => {
    const next = jest.fn()

    const { result } = renderHook(() => useObservableState(1))
    result.current[0].subscribe({
      next
    })

    act(() => {
      result.current[1](prev => prev + 1)
    })
    expect(next).toBeCalledWith(2)
  })

  it('doesn\'t rerender on change', () => {
    const render = jest.fn()

    const { result } = renderHook(() => {
      render()
      return useObservableState(1)
    })
    expect(render).toBeCalledTimes(1)

    act(() => {
      result.current[1](prev => prev + 1)
    })
    expect(render).toBeCalledTimes(1)
  })

  it('completes when unmounted', () => {
    const complete = jest.fn()

    const { result, unmount } = renderHook(() => useObservableState(1))
    result.current[0].subscribe({
      complete
    })

    unmount()
    expect(complete).toBeCalled()
  })
})
