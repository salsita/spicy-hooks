import { BehaviorSubject, Observable } from 'rxjs'

import { useGuaranteedMemo, useImmediateEffect } from '../react'
import { isBehaviorSubject } from './guards'

export function useSyncObservable<T> (observable: Observable<T>): BehaviorSubject<T | null>
export function useSyncObservable<T> (observable: BehaviorSubject<T>): BehaviorSubject<T>
export function useSyncObservable<T> (observable: Observable<T>, defaultValue: T): BehaviorSubject<T>

export function useSyncObservable<T> (observable: Observable<T> | null | undefined): BehaviorSubject<T | null> | null
export function useSyncObservable<T> (observable: BehaviorSubject<T> | null | undefined): BehaviorSubject<T> | null
export function useSyncObservable<T> (observable: Observable<T> | null | undefined, defaultValue: T): BehaviorSubject<T> | null

/**
 * Converts the provided observable into a `BehaviorSubject`.
 * If the source observable is synchronous, its next emission will be immediately available through `getValue()` method of the returned `BehaviorSubject`.
 * @param observable source observable
 * @param defaultValue default value to be provided through `getValue()` until the source observable emits
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
