import { Subject } from 'rxjs'
import { act, renderHook } from '@testing-library/react-hooks'
import { isShallowEqual } from '@spicy-hooks/utils'

import { usePartialSnapshot } from './use-partial-snapshot'
import { Snapshot } from './use-snapshot'

interface Shape {
  a: string
  b: number
  c: { x: boolean, y: string }
}

const sample: Shape = {
  a: 'A',
  b: 1,
  c: {
    x: true,
    y: 'z'
  }
}

let subject: Subject<Shape>
beforeAll(() => {
  subject = new Subject<Shape>()
})

describe('usePartialSnapshot', () => {
  it('selects sub-set of state', () => {
    const renderCounter = jest.fn()

    const { result } = renderHook(() => {
      renderCounter()
      return usePartialSnapshot(subject, state => state.a, [])
    })
    act(() => {
      subject.next(sample)
    })
    expect(renderCounter).toBeCalledTimes(2)
    expect(result.current[0]).toBe('A')

    act(() => {
      subject.next({ ...sample, a: 'B' })
    })
    expect(renderCounter).toBeCalledTimes(3)
    expect(result.current[0]).toBe('B')
  })

  const reRendersWhenUpdated = (renderHookCallback: () => Snapshot<any>, updatedState: Shape) => {
    const renderCounter = jest.fn()

    renderHook(() => {
      renderCounter()
      return renderHookCallback()
    })

    act(() => {
      subject.next(sample)
    })

    const previousCallCount = renderCounter.mock.calls.length
    expect(previousCallCount).toBe(2)

    act(() => {
      subject.next(updatedState)
    })

    const newCalls = renderCounter.mock.calls.length - previousCallCount
    expect(newCalls).toBeGreaterThanOrEqual(0)
    expect(newCalls).toBeLessThanOrEqual(1)

    return newCalls > 0
  }

  it('ignores changes in other sub-set of the state', () => {
    expect(reRendersWhenUpdated(
      () => usePartialSnapshot(subject, state => state.a, []),
      { ...sample, b: 2 }
    )).toBe(false)
  })

  it('triggers rerender for deep equal yet not identical objects', () => {
    expect(reRendersWhenUpdated(
      () => usePartialSnapshot(subject, state => state.c, []),
      {
        ...sample,
        c: {
          x: true,
          y: 'z'
        }
      })).toBe(true)
  })

  it('respects provided equality function when deciding about re-rendering', () => {
    expect(reRendersWhenUpdated(
      () => usePartialSnapshot(subject, state => state.c, isShallowEqual, []),
      {
        ...sample,
        c: {
          x: true,
          y: 'z'
        }
      })).toBe(false)
  })
})

afterAll(() => {
  subject.complete()
})
