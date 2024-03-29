import { DependencyList } from 'react'
import { BehaviorSubject, Observable } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { EqualityFunction, useGuaranteedMemo } from '@spicy-hooks/core'

import { Snapshot, useSnapshot } from './use-snapshot'

/**
 * Simple unary function that is meant to select sub-part of a state.
 *
 * @typeParam S original shape
 * @typeParam P extracted partial shape
 */
export type SelectorFunction<S, P> = (state: S) => P

/**
 * A simple helper that takes a snapshot of a part of the `observable` defined by the `selector`.
 * The snapshot is recomputed when the `deps` change so that an updated selector can be applied.
 *
 * *Note:* An `Object.is` equality check is applied to the selected sub-part in order to avoid unnecessary re-renders.
 * In other words the snapshot will be updated only in case the new emission's identity differs from the previous one's.
 *
 * @param observable source observable to subscribe to
 * @param selector function used to select sub-part of the observable state
 * @param deps dependencies for the selector function
 * @type T type of the source emissions
 * @type P type of the partial state
 * @category Hook
 */
export function usePartialSnapshot<T, P> (observable: BehaviorSubject<T>, selector: SelectorFunction<T, P>, deps: DependencyList): Snapshot<P>
export function usePartialSnapshot<T, P> (observable: Observable<T>, selector: SelectorFunction<T, P>, deps: DependencyList): Snapshot<P | null>
export function usePartialSnapshot<T, P> (observable: BehaviorSubject<T> | undefined | null, selector: SelectorFunction<T, P>, deps: DependencyList): Snapshot<P | null, null>
export function usePartialSnapshot<T, P> (observable: Observable<T> | undefined | null, selector: SelectorFunction<T, P>, deps: DependencyList): Snapshot<P | null, null>

/**
 * A simple hel per that takes a snapshot of a part of the `observable` defined by the `selector`.
 * The snapshot is recomputed when the `deps` change so that an updated selector can be applied.
 *
 * The `equalityFunc` is applied to the selected sub-part in order to avoid unnecessary re-renders.
 * In other words the snapshot will be updated only in case the new emission differs from the previous one in the sense of `equalityFunc`.
 *
 * @param observable source observable to subscribe to
 * @param selector function used to select sub-part of the observable state
 * @param equalityFunc equality function to check whether the selected sub-part actually changed from the previous one
 * @param deps dependencies for the selector function
 * @type T type of the source emissions
 * @type P type of the partial state
 * @category Hook
 */
export function usePartialSnapshot<T, P> (observable: BehaviorSubject<T>, selector: SelectorFunction<T, P>, equalityFunc: EqualityFunction<P>, deps: DependencyList): Snapshot<P>
export function usePartialSnapshot<T, P> (observable: Observable<T>, selector: SelectorFunction<T, P>, equalityFunc: EqualityFunction<P>, deps: DependencyList): Snapshot<P | null>
export function usePartialSnapshot<T, P> (observable: BehaviorSubject<T> | undefined | null, selector: SelectorFunction<T, P>, equalityFunc: EqualityFunction<P>, deps: DependencyList): Snapshot<P | null, null>
export function usePartialSnapshot<T, P> (observable: Observable<T> | undefined | null, selector: SelectorFunction<T, P>, equalityFunc: EqualityFunction<P>, deps: DependencyList): Snapshot<P | null, null>

export function usePartialSnapshot<T, P> (observable: Observable<T> | undefined | null, selector: SelectorFunction<T, P>, equalityFuncOrDeps: EqualityFunction<P> | DependencyList, possibleDeps?: DependencyList): Snapshot<P | null, null> {
  const deps = arguments.length > 3 ? possibleDeps! : equalityFuncOrDeps as DependencyList
  const equalityFunc = arguments.length > 3 ? equalityFuncOrDeps as EqualityFunction<P> : Object.is
  const partial$ = useGuaranteedMemo(
    () => observable?.pipe(map(selector), distinctUntilChanged(equalityFunc)),
    [observable, ...deps]
  )
  return useSnapshot(partial$)
}
