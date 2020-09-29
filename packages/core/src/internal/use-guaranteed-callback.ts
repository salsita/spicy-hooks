import { DependencyList } from 'react'

import { useGuaranteedMemo } from './use-guaranteed-memo'

/**
 * Equivalent to `useCallback` but doesn't suffer from the following
 * (quoting https://reactjs.org/docs/hooks-faq.html#how-to-memoize-calculations):
 * > **You may rely on useMemo as a performance optimization, not as a semantic guarantee.**
 * > In the future, React may choose to “forget” some previously memoized values and recalculate
 * > them on next render, e.g. to free memory for offscreen components. Write your code so that
 * > it still works without useMemo — and then add it to optimize performance.
 *
 * **Note:** You should not blindly replace all usages of `useCallback` with this hook.
 * The `useGuaranteedCallback` should be used only in scenarios where re-calculating the memoized
 * value would cause issues.
 */
export function useGuaranteedCallback<F extends Function> (callback: F, deps: DependencyList): F {
  return useGuaranteedMemo(() => callback, deps)
}
