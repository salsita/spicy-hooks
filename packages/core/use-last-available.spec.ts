import { renderHook } from '@testing-library/react-hooks'

import { useLastAvailable } from './use-last-available'

describe('useLastAvailable', () => {
  it('returns previous value when null', () => {
    const props: { value: number | null } = {
      value: 1
    }

    const { result, rerender } = renderHook(() => useLastAvailable(props.value))
    expect(result.current).toBe(1)

    props.value = null

    rerender()
    expect(result.current).toBe(1)
  })

  it('returns previous value when undefined', () => {
    const props: { value: number | undefined } = {
      value: 1
    }

    const { result, rerender } = renderHook(() => useLastAvailable(props.value))
    expect(result.current).toBe(1)

    props.value = undefined

    rerender()
    expect(result.current).toBe(1)
  })

  it('returns new value when non-nullish', () => {
    const props: { value: number | undefined } = {
      value: 1
    }

    const { result, rerender } = renderHook(() => useLastAvailable(props.value))
    expect(result.current).toBe(1)

    props.value = 2

    rerender()
    expect(result.current).toBe(2)
  })

  it('resumes returning new value when stops being nullish', () => {
    const props: { value: number | null } = {
      value: 1
    }

    const { result, rerender } = renderHook(() => useLastAvailable(props.value))
    expect(result.current).toBe(1)

    props.value = null

    rerender()
    expect(result.current).toBe(1)

    props.value = 2

    rerender()
    expect(result.current).toBe(2)
  })

  it('allows manual override of availability', () => {
    const props = {
      value: 'significant',
      available: true
    }

    const { result, rerender } = renderHook(() => useLastAvailable(props.value, props.available))
    expect(result.current).toBe('significant')

    props.value = 'insignificant'
    props.available = false
    rerender()
    expect(result.current).toBe('significant')

    props.value = 'significant again'
    props.available = true
    rerender()
    expect(result.current).toBe('significant again')
  })
})
