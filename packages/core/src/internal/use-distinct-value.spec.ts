import { renderHook } from '@testing-library/react-hooks'
import { isShallowEqual } from '@spicy-hooks/utils'

import { useDistinctValue } from './use-distinct-value'

describe('useDistinctValue (shallow)', () => {
  it('returns current instance when object changes', () => {
    const originalValue = { a: 1, b: 2 }

    const props = {
      value: originalValue
    }

    const { result, rerender } = renderHook(() => useDistinctValue(props.value, isShallowEqual))
    expect(result.current).toBe(originalValue)

    const newValue = { a: 1, b: 3 }
    props.value = newValue
    rerender()

    expect(result.current).not.toBe(originalValue)
    expect(result.current).toBe(newValue)
  })

  it('returns previous instance when object doesn\'t change', () => {
    const originalValue = { a: 1, b: 2 }

    const props = {
      value: originalValue
    }

    const { result, rerender } = renderHook(() => useDistinctValue(props.value, isShallowEqual))
    expect(result.current).toBe(originalValue)

    const newValue = { a: 1, b: 2 }
    props.value = newValue
    rerender()

    expect(result.current).toBe(originalValue)
    expect(result.current).not.toBe(newValue)
  })
})
