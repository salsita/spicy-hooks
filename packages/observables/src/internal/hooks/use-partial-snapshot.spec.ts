import { Subject } from 'rxjs'
import { act, renderHook } from '@testing-library/react-hooks'

import { usePartialSnapshot } from './use-partial-snapshot'

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

  it('ignores changes in other sub-set of a shallow state', () => {
    const renderCounter = jest.fn()

    const { result } = renderHook(() => {
      renderCounter()
      return usePartialSnapshot(subject, state => state.a, [])
    })

    act(() => {
      subject.next(sample)
    })
    expect(result.current[0]).toBe('A')
    expect(renderCounter).toBeCalledTimes(2)

    act(() => {
      subject.next({ ...sample, b: 2 })
    })
    expect(renderCounter).toBeCalledTimes(2)
    expect(result.current[0]).toBe('A')
  })
})

afterAll(() => {
  subject.complete()
})
