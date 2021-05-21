import { DependencyList, useEffect, useRef } from 'react'

type TeardownLogic = () => void | undefined

export function useArrayEffect<T> (array: T[], effect: (element: T) => void | TeardownLogic, deps: DependencyList) {
  const activeEffectsRef = useRef<Map<T, void | TeardownLogic>>(new Map())
  useEffect(() => () => {
    activeEffectsRef.current.forEach(teardown => {
      if (teardown) {
        teardown()
      }
    })
    activeEffectsRef.current = new Map()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(
    () => {
      const previousActiveEffects = new Map(activeEffectsRef.current)

      const toTearDown = new Map(previousActiveEffects)
      array.forEach(element => toTearDown.delete(element))
      toTearDown.forEach(teardown => {
        if (teardown) {
          teardown()
        }
      })

      const newActiveEffects = new Map<T, void | TeardownLogic>()
      array.forEach(element => {
        if (previousActiveEffects.has(element)) {
          newActiveEffects.set(element, previousActiveEffects.get(element))
          return
        }
        const teardownLogic = effect(element)
        newActiveEffects.set(element, teardownLogic)
      })

      activeEffectsRef.current = newActiveEffects
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [array, activeEffectsRef, ...deps]
  )
}
