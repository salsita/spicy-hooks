import { act, renderHook } from '@testing-library/react-hooks'

import { useStateWithoutRerender } from './use-state-without-rerender'

describe('useStateWithoutRerender', () => {
  it('returns initial value on first render', () => {
    const { result } = renderHook(() => useStateWithoutRerender(1))
    expect(result.current[0]).toBe(1)
    expect(typeof result.current[1]).toBe('function')
    expect(typeof result.current[2]).toBe('function')
  })

  it('computes initial value on first render', () => {
    const { result } = renderHook(() => useStateWithoutRerender(() => 1))
    expect(result.current[0]).toBe(1)
  })

  it('re-renders when using the first callback', () => {
    const { result } = renderHook(() => useStateWithoutRerender(1))
    expect(result.current[0]).toBe(1)

    act(() => {
      result.current[1](2)
    })
    expect(result.current[0]).toBe(2)
  })

  it('does not re-render when using the second callback', () => {
    const { result, rerender } = renderHook(() => useStateWithoutRerender(1))
    expect(result.current[0]).toBe(1)

    act(() => {
      result.current[2](2)
    })
    expect(result.current[0]).toBe(1)

    rerender()
    expect(result.current[0]).toBe(2)
  })

  it('accepts update function with the first callback', () => {
    const { result } = renderHook(() => useStateWithoutRerender(1))

    act(() => {
      result.current[1](prev => prev + 1)
    })
    expect(result.current[0]).toBe(2)
  })

  it('accepts update function with the second callback', () => {
    const { result, rerender } = renderHook(() => useStateWithoutRerender(1))

    act(() => {
      result.current[2](prev => prev + 1)
    })
    rerender()
    expect(result.current[0]).toBe(2)
  })
})
