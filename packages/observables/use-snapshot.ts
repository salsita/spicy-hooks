import { Observable } from 'rxjs'

import { useUpdatedRef, useDependantState, useGuaranteedCallback } from '../react'
import { useSyncObservable } from './use-sync-observable'
import { useSubscription } from './use-subscription'
import { SynchronousObservable } from './types'

export enum SnapshotState {
  WAITING = 'WAITING',
  EMITTING = 'EMITTING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export type Snapshot<T, S extends never | null = never> = [T, SnapshotState | S, Error | any | null]

const WaitingSymbol = Symbol('waiting for observable to emit')

export function useSnapshot<T> (observable: SynchronousObservable<T>): Snapshot<T>
export function useSnapshot<T> (observable: Observable<T>): Snapshot<T | null>
export function useSnapshot<T> (observable: Observable<T>, defaultValue: T): Snapshot<T>
export function useSnapshot<T> (observable: SynchronousObservable<T> | undefined | null): Snapshot<T, null>
export function useSnapshot<T> (observable: Observable<T> | undefined | null): Snapshot<T | null, null>
export function useSnapshot<T> (observable: Observable<T> | undefined | null, defaultValue: T): Snapshot<T, null>

/**
 * Takes an observable and returns its snapshot. The snapshot consist of the latest value emitted by the observable,
 * it's state and an eventual error thrown by it.
 *
 * The snapshot is updated any time the observable emits and if the new snapshot differs from the previous one,
 * the component is re-rendered.
 *
 * @param observable source observable to subscribe to
 * @param defaultValue default value to be returned as part of the snapshot while waiting for the observable to emit, or when the observable is nullish
 */
export function useSnapshot<T> (observable: Observable<T> | undefined | null, defaultValue: T | null = null): Snapshot<T | null, null> {
  type ConcreteSnapshot = Snapshot<T | null, null>

  const subject = useSyncObservable<T | null | typeof WaitingSymbol>(observable, WaitingSymbol)
  const subjectRef = useUpdatedRef(subject)

  const [snapshot, setSnapshot] = useDependantState<ConcreteSnapshot>(
    () => {
      if (!subject) {
        return [defaultValue, null, null]
      }

      try {
        const subjectValue = subject.getValue()
        if (subjectValue === WaitingSymbol) {
          return [defaultValue, SnapshotState.WAITING, null]
        }
        return [subjectValue, SnapshotState.EMITTING, null]
      } catch (error) {
        return [defaultValue, SnapshotState.FAILED, error]
      }
    },
    [subject]
  )

  const handleNext = useGuaranteedCallback(
    (value: T | null) => setSnapshot(
      originalSnapshot => {
        const [originalValue, originalState, originalError] = originalSnapshot
        if (originalError === null && originalState === SnapshotState.EMITTING && originalValue === value) {
          return originalSnapshot
        }
        return [value, SnapshotState.EMITTING, null]
      }
    ),
    [setSnapshot]
  )

  const handleError = useGuaranteedCallback(
    (error: any) => setSnapshot(
      originalSnapshot => {
        const [originalValue, originalState, originalError] = originalSnapshot
        if (originalError === error && originalState === SnapshotState.FAILED) {
          return originalSnapshot
        }
        return [originalValue, SnapshotState.FAILED, error]
      }
    ),
    [setSnapshot]
  )

  const handleCompleted = useGuaranteedCallback(
    () => setSnapshot(
      originalSnapshot => {
        const [originalValue, originalState, originalError] = originalSnapshot
        if (originalState === SnapshotState.COMPLETED) {
          return originalSnapshot
        }
        return [originalValue, SnapshotState.COMPLETED, originalError]
      }
    ),
    [setSnapshot]
  )

  useSubscription(
    subject,
    {
      next (newValue) {
        if (subject === subjectRef.current && newValue !== WaitingSymbol) {
          handleNext(newValue)
        }
      },
      error (newError) {
        if (subject === subjectRef.current) {
          handleError(newError)
        }
      },
      complete () {
        if (subject === subjectRef.current) {
          handleCompleted()
        }
      }
    },
    [subjectRef, handleNext, handleError, handleCompleted]
  )

  return snapshot
}
