import { DependencyList, EffectCallback, useEffect, useRef } from 'react'

import { isEqualArray } from '../../common'

type TearDownLogic = () => void | undefined

export function useImmediateEffect (effect: EffectCallback, deps: DependencyList) {
  const lastDepsRef = useRef<DependencyList>()
  const lastTearDownRef = useRef<TearDownLogic | void>()

  if (!lastDepsRef.current || !isEqualArray(lastDepsRef.current, deps)) {
    lastDepsRef.current = deps
    if (lastTearDownRef.current) {
      lastTearDownRef.current()
    }
    lastTearDownRef.current = effect()
  }

  useEffect(
    () => () => {
      if (lastTearDownRef.current) {
        lastTearDownRef.current()
      }
    },
    []
  )
}
