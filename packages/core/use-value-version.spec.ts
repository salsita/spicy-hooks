import { renderHook } from '@testing-library/react-hooks'

import { useValueVersion } from './use-value-version'
import { isShallowEqual } from '../../common/utils/is-shallow-equal'

describe('useValueVersion (shallow)', () => {
  it('increments when object changes', () => {
    const props = {
      value: { a: 1, b: 2 }
    }

    const { result, rerender } = renderHook(() => useValueVersion(props.value, isShallowEqual))
    expect(result.current).toBe(1)

    props.value = { a: 1, b: 3 }
    rerender()

    expect(result.current).toBe(2)
  })

  it('doesn\'t increment when object doesn\'t change', () => {
    const props = {
      value: { a: 1, b: 2 }
    }

    const { result, rerender } = renderHook(() => useValueVersion(props.value, isShallowEqual))
    expect(result.current).toBe(1)

    props.value = { a: 1, b: 2 }
    rerender()

    expect(result.current).toBe(1)
  })
})
