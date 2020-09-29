import { renderHook } from '@testing-library/react-hooks'

import { useGuaranteedMemo } from './use-guaranteed-memo'

let counter = 0

describe('useGuaranteedMemo', () => {
  it('returns the original value as long as deps stay the same', () => {
    const props = {
      dependency: 10
    }

    const { result, rerender } = renderHook(() =>
      useGuaranteedMemo(
        () => (++counter) * props.dependency,
        [props.dependency]
      )
    )

    const previousResult = result.current

    rerender()
    expect(result.current).toBe(previousResult)
    rerender()
    expect(result.current).toBe(previousResult)
  })

  it('returns new value when deps change', () => {
    const props = {
      dependency: 10
    }

    const { result, rerender } = renderHook(() =>
      useGuaranteedMemo(
        () => (++counter) * props.dependency,
        [props.dependency]
      )
    )

    const previousResult = result.current

    rerender()
    expect(result.current).toBe(previousResult)

    props.dependency = 1
    rerender()
    expect(result.current).not.toBe(previousResult)
    expect(result.current).toBe(counter * props.dependency)
  })
})
