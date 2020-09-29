import { act, renderHook } from '@testing-library/react-hooks'

import { useAsyncMemo } from './use-async-memo'
import { latency } from '../../common'
import { SnapshotState } from './use-snapshot'

describe('useAsyncMemo', () => {
  it('returns resolved value', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAsyncMemo(
      async () => {
        await latency(10)
        return 1
      },
      []
    ))

    expect(result.current).toEqual([null, SnapshotState.WAITING, null])

    await waitForNextUpdate()
    expect(result.current).toEqual([1, SnapshotState.COMPLETED, null])
  })

  it('reports error', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAsyncMemo(
      async () => {
        await latency(10)
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw 'failed'
      },
      []
    ))

    expect(result.current).toEqual([null, SnapshotState.WAITING, null])

    await waitForNextUpdate()
    expect(result.current).toEqual([null, SnapshotState.FAILED, 'failed'])
  })

  it('recomputes value when deps change', async () => {
    const props = {
      dependency: 1
    }

    const { result, waitForNextUpdate, rerender } = renderHook(() => {
      const { dependency } = props
      return useAsyncMemo(
        async () => {
          await latency(10)
          return dependency * 10
        },
        [dependency]
      )
    })

    expect(result.current).toEqual([null, SnapshotState.WAITING, null])

    await waitForNextUpdate()
    expect(result.current).toEqual([10, SnapshotState.COMPLETED, null])

    props.dependency = 2
    rerender()
    expect(result.current).toEqual([null, SnapshotState.WAITING, null])

    await waitForNextUpdate()
    expect(result.current).toEqual([20, SnapshotState.COMPLETED, null])
  })

  it('ignores unresolved result when deps change', async () => {
    const props = {
      dependency: 1
    }

    const { result, waitForNextUpdate, rerender } = renderHook(() => {
      const { dependency } = props
      return useAsyncMemo(
        async () => {
          await latency(10)
          return dependency * 10
        },
        [dependency]
      )
    })

    await latency(5)
    act(() => {
      // without `act` jest reports warning,
      // probably due to the ignored promise resolve
      props.dependency = 2
    })
    rerender()

    expect(result.current).toEqual([null, SnapshotState.WAITING, null])

    await waitForNextUpdate()
    expect(result.current).toEqual([20, SnapshotState.COMPLETED, null])
  })
})
