import { MutableRefObject, useRef } from 'react'

const EmptySymbol = Symbol('empty')

/**
 * Allocates a ref and initializes it with a computed value.
 * @param factory the factory is used during the initial render only to compute the ref's value
 */
export function useComputedRef<T> (factory: () => T): MutableRefObject<T> {
  const ref = useRef<T | typeof EmptySymbol>(EmptySymbol)
  if (ref.current === EmptySymbol) {
    ref.current = factory()
  }
  return ref as MutableRefObject<T>
}
