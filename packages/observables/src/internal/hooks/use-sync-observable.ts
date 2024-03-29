import { BehaviorSubject, Observable } from 'rxjs'
import { useGuaranteedMemo, useImmediateEffect } from '@spicy-hooks/core'

import { isBehaviorSubject } from '../utils'

export function useSyncObservable<T> (observable: Observable<T>): BehaviorSubject<T | null>
export function useSyncObservable<T> (observable: BehaviorSubject<T>): BehaviorSubject<T>
export function useSyncObservable<T> (observable: Observable<T>, defaultValue: T): BehaviorSubject<T>

export function useSyncObservable<T> (observable: Observable<T> | null | undefined): BehaviorSubject<T | null> | null
export function useSyncObservable<T> (observable: BehaviorSubject<T> | null | undefined): BehaviorSubject<T> | null
export function useSyncObservable<T> (observable: Observable<T> | null | undefined, defaultValue: T): BehaviorSubject<T> | null

/**
 * TODO Needs more love: https://github.com/salsita/spicy-hooks/issues/13
 * Converts the provided observable into a `BehaviorSubject`.
 * If the source observable is synchronous, its next emission will be immediately available through `getValue()` method of the returned `BehaviorSubject`.
 * @param observable source observable
 * @param defaultValue default value to be provided through `getValue()` until the source observable emits
 * @typeParam T type of the value emitted by the source observable
 * @category Hook
 */
export function useSyncObservable<T> (observable: Observable<T> | null | undefined, defaultValue: T | null = null): BehaviorSubject<T | null> | null {
  const subject = useGuaranteedMemo(
    () => {
      if (!observable) {
        return null
      }
      return isBehaviorSubject<T | null>(observable)
        ? observable
        : new BehaviorSubject<T | null>(defaultValue)
    },
    [observable]
  )

  useImmediateEffect(
    () => {
      if (!observable || !subject || subject === observable) {
        return
      }

      const subscription = observable.subscribe(subject)
      return () => subscription.unsubscribe()
    },
    [subject, observable]
  )

  return subject
}
