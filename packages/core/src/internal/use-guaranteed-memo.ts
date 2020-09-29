import { DependencyList, useRef } from 'react'
import { isEqualArray } from '@spicy-hooks/utils'

/**
 * Equivalent to `useMemo` but doesn't suffer from the following
 * (quoting https://reactjs.org/docs/hooks-faq.html#how-to-memoize-calculations):
 * > **You may rely on useMemo as a performance optimization, not as a semantic guarantee.**
 * > In the future, React may choose to “forget” some previously memoized values and recalculate
 * > them on next render, e.g. to free memory for offscreen components. Write your code so that
 * > it still works without useMemo — and then add it to optimize performance.
 *
 * **Note:** You should not blindly replace all usages of `useMemo` with this hook.
 * The `useGuaranteedMemo` should be used only in scenarios where re-calculating the memoized
 * value would cause issues.
 */
export function useGuaranteedMemo<T> (factory: () => T, deps: DependencyList): T {
  const lastDepsRef = useRef<DependencyList>()
  const lastValueRef = useRef<T>()
  if (!lastDepsRef.current || !isEqualArray(lastDepsRef.current, deps)) {
    lastValueRef.current = factory()
  }
  lastDepsRef.current = deps
  return lastValueRef.current!
}
