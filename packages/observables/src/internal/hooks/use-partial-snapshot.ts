import { DependencyList } from 'react'
import { Observable } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { isShallowEqual } from '@spicy-hooks/utils'
import { EqualityFunction, useGuaranteedMemo } from '@spicy-hooks/core'

import { Snapshot, useSnapshot } from './use-snapshot'
import { SynchronousObservable } from '../utils'

export type SelectorFunction<S, P> = (state: S) => P

/**
 * A simple helper that takes a snapshot of a part of the `observable` defined by the `selector`.
 * The snapshot is recomputed when the `deps` so that an updated selector can be applied.
 *
 * *Note:* A shallow equality check is applied to the selected sub-part in order to avoid unnecessary re-renders.
 * In other words the snapshot will be updated only in case the new emission shallowly differs from the previous one.
 *
 * @param observable source observable to subscribe to
 * @param selector function used to select sub-part of the observable state
 * @param deps dependencies for the selector function
 */
export function usePartialSnapshot<T, P> (observable: SynchronousObservable<T>, selector: SelectorFunction<T, P>, deps: DependencyList): Snapshot<P>
export function usePartialSnapshot<T, P> (observable: Observable<T>, selector: SelectorFunction<T, P>, deps: DependencyList): Snapshot<P | null>
export function usePartialSnapshot<T, P> (observable: SynchronousObservable<T> | undefined | null, selector: SelectorFunction<T, P>, deps: DependencyList): Snapshot<P | null, null>
export function usePartialSnapshot<T, P> (observable: Observable<T> | undefined | null, selector: SelectorFunction<T, P>, deps: DependencyList): Snapshot<P | null, null>

/**
 * A simple hel per that takes a snapshot of a part of the `observable` defined by the `selector`.
 * The snapshot is recomputed when the `deps` so that an updated selector can be applied.
 *
 * The `equalityFunc` is applied to the selected sub-part in order to avoid unnecessary re-renders.
 * In other words the snapshot will be updated only in case the new emission differs from the previous one in the sense of `equalityFunc`.
 *
 * @param observable source observable to subscribe to
 * @param selector function used to select sub-part of the observable state
 * @param equalityFunc equality function to check whether the selected sub-part actually changed from the previous one
 * @param deps dependencies for the selector function
 */
export function usePartialSnapshot<T, P> (observable: SynchronousObservable<T>, selector: SelectorFunction<T, P>, equalityFunc: EqualityFunction<P>, deps: DependencyList): Snapshot<P>
export function usePartialSnapshot<T, P> (observable: Observable<T>, selector: SelectorFunction<T, P>, equalityFunc: EqualityFunction<P>, deps: DependencyList): Snapshot<P | null>
export function usePartialSnapshot<T, P> (observable: SynchronousObservable<T> | undefined | null, selector: SelectorFunction<T, P>, equalityFunc: EqualityFunction<P>, deps: DependencyList): Snapshot<P | null, null>
export function usePartialSnapshot<T, P> (observable: Observable<T> | undefined | null, selector: SelectorFunction<T, P>, equalityFunc: EqualityFunction<P>, deps: DependencyList): Snapshot<P | null, null>

export function usePartialSnapshot<T, P> (observable: Observable<T> | undefined | null, selector: SelectorFunction<T, P>, equalityFuncOrDeps: EqualityFunction<P> | DependencyList, possibleDeps?: DependencyList): Snapshot<P | null, null> {
  const deps = arguments.length > 3 ? possibleDeps! : equalityFuncOrDeps as DependencyList
  const equalityFunc = arguments.length > 3 ? equalityFuncOrDeps as EqualityFunction<P> : isShallowEqual
  const partial$ = useGuaranteedMemo(
    () => observable?.pipe(map(selector), distinctUntilChanged(equalityFunc)),
    [observable, ...deps]
  )
  return useSnapshot(partial$)
}
