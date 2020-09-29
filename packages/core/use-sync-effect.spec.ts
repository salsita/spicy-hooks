import { renderHook } from '@testing-library/react-hooks'

import { useImmediateEffect } from './use-immediate-effect'

describe('useSyncEffect', () => {
  it('performs actions synchronously', () => {
    const log: string[] = []

    const props = {
      dependency: 1
    }

    const { rerender, unmount } = renderHook(() => {
      const dependency = props.dependency
      useImmediateEffect(
        () => {
          log.push(`EFFECT ${dependency}`)
          return () => {
            log.push(`TEARDOWN ${dependency}`)
          }
        },
        [dependency]
      )
      log.push(`AFTER EFFECT ${dependency}`)
    })

    expect(log).toEqual(['EFFECT 1', 'AFTER EFFECT 1'])

    rerender()
    expect(log).toEqual(['EFFECT 1', 'AFTER EFFECT 1', 'AFTER EFFECT 1'])

    props.dependency = 2
    rerender()
    expect(log).toEqual(['EFFECT 1', 'AFTER EFFECT 1', 'AFTER EFFECT 1', 'TEARDOWN 1', 'EFFECT 2', 'AFTER EFFECT 2'])

    unmount()
    expect(log).toEqual(['EFFECT 1', 'AFTER EFFECT 1', 'AFTER EFFECT 1', 'TEARDOWN 1', 'EFFECT 2', 'AFTER EFFECT 2', 'TEARDOWN 2'])
  })
})
