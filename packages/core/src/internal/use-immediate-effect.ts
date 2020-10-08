import { DependencyList, EffectCallback, useEffect, useRef } from 'react'
import { isEqualArray } from '@spicy-hooks/utils'

type TearDownLogic = () => void | undefined

/**
 * **Warning**: It is usually a bad practice to trigger side-effects directly during the render phase.
 * Make sure you really know what you are doing when using this hook!
 *
 * An alternative to `useEffect` where the callback is executed right within the render phase.
 * In other words the effect is performed immediately when the `useImmediateEffect` is called
 * and eventual side-effects can be observed right after the `useImmediateEffect` line.
 *
 * Note that just like `useEffect` the `useImmediateEffect` ensures that a teardown logic will be
 * executed before any subsequent effect is triggered. Furthermore it is also guaranteed that
 * the teardown logic will be run in case the component unmounts.
 *
 * **Example:**
 * ```ts
 *   let sideEffect = 0
 *
 *   useEffect(() => {
 *     sideEffect = 1
 *   },[])
 *
 *   console.log(sideEffect) // outputs 1
 * ```
 *
 * @param effect callback that performs the effect and optionally returns a tear-down logic
 * @param deps array of dependencies for the effect (if any of them changes, the effect is re-triggered)
 * @category Hook
 */
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
