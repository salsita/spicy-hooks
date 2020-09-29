import { renderHook } from '@testing-library/react-hooks'

import { useComputedRef } from './use-computed-ref'

describe('useComputedRef', () => {
  it('computes the value on first render', () => {
    let counter = 0

    const factory = jest.fn(() => ++counter)

    const { result } = renderHook(() => useComputedRef(factory))
    expect(result.current.current).toBe(1)
    expect(factory).toHaveBeenCalled()
  })

  it('doesn\'t compute the value on sub-sequent calls', () => {
    let counter = 0

    const factory = jest.fn(() => ++counter)

    const { result, rerender } = renderHook(() => useComputedRef(factory))
    expect(result.current.current).toBe(1)
    expect(factory).toHaveBeenCalledTimes(1)

    rerender()
    expect(result.current.current).toBe(1)
    expect(factory).toHaveBeenCalledTimes(1)
  })
})
