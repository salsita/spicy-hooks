import { act, renderHook } from '@testing-library/react-hooks'

import { useDependantState } from './use-dependant-state'

describe('useDependantState', () => {
  it('resets state on dependency change', () => {
    const props = {
      dependency: 1
    }
    const { result, rerender } = renderHook(() => useDependantState<number | null>(null, [props.dependency]))
    expect(result.current[0]).toBe(null)

    act(() => {
      result.current[1](1)
    })
    expect(result.current[0]).toBe(1)

    props.dependency = 2
    rerender()
    expect(result.current[0]).toBe(null)
  })

  it('recalculates state on dependency change', () => {
    const props = {
      dependency: 1
    }
    const { result, rerender } = renderHook(() => useDependantState<number>(() => 10 * props.dependency, [props.dependency]))
    expect(result.current[0]).toBe(10)

    act(() => {
      result.current[1](1)
    })
    expect(result.current[0]).toBe(1)

    props.dependency = 2
    rerender()
    expect(result.current[0]).toBe(20)
  })
})
