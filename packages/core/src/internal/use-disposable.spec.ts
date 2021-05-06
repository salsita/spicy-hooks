import { act, renderHook } from '@testing-library/react-hooks'

import { useDisposable } from './use-disposable'

describe('useDisposable', () => {
  it('allocates a value synchronously', () => {
    const syncMonitor = jest.fn()
    const { result } = renderHook(() => {
      const value = useDisposable(
        () => ['value', () => {}],
        []
      )
      syncMonitor(value)
      return value
    })
    expect(result.current).toBe('value')
    expect(syncMonitor).toHaveBeenCalledTimes(1)
    expect(syncMonitor).toHaveBeenCalledWith('value')
  })

  it('disposes when unmounted', () => {
    const dispose = jest.fn()
    const { unmount } = renderHook(() => useDisposable(
      () => ['value', dispose],
      []
    ))
    expect(dispose).not.toHaveBeenCalled()
    unmount()
    expect(dispose).toHaveBeenCalledTimes(1)
  })

  it('disposes when deps change', () => {
    const props = {
      dep: 10
    }
    let counter = 0
    const log: string[] = []

    const { rerender } = renderHook(() => {
      const value = useDisposable(
        () => {
          const currentValue = ++counter
          log.push(`allocate ${currentValue}`)
          return [currentValue, () => log.push(`dispose ${currentValue}`)]
        },
        [props.dep]
      )
      log.push(`use ${value}`)
      return value
    })

    expect(log).toEqual(['allocate 1', 'use 1'])
    act(() => {
      props.dep++
      rerender()
    })

    expect(log).toEqual(['allocate 1', 'use 1', 'dispose 1', 'allocate 2', 'use 2'])
  })
})
