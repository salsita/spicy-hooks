import { BehaviorSubject, Observable } from 'rxjs'
import { useUpdatedRef, useDependantState, useGuaranteedCallback } from '@spicy-hooks/core'

import { useSyncObservable } from './use-sync-observable'
import { useSubscription } from './use-subscription'

/**
 * State of an observable in the given moment.
 */
export enum SnapshotState {
  /**
   * Waiting for the first emission
   */
  WAITING = 'WAITING',
  /**
   * Observable has already emitted
   */
  EMITTING = 'EMITTING',
  /**
   * Observable has successfully completed emitting (there will be no more emissions)
   */
  COMPLETED = 'COMPLETED',
  /**
   * Observable threw an error
   */
  FAILED = 'FAILED'
}

/**
 * A tuple of latest emission, state of an observable and eventual error thrown by the observable.
 *
 * * value - latest emission of the observable or `null` if it hasn't started emitting yet and no default value was provided
 * * state - determines whether the observable already started emitting, whether it completed or failed (see [[SnapshotState]])
 * * error - eventual error thrown by the observable
 *
 * @typeParam T type of the emitted value
 * @typeParam S `null` determines that state is nullable, the only only other acceptable type is `never`
 */
export type Snapshot<T, S extends never | null = never> = [T, SnapshotState | S, Error | any | null]

const WaitingSymbol = Symbol('waiting for observable to emit')

export function useSnapshot<T> (observable: BehaviorSubject<T>): Snapshot<T>
export function useSnapshot<T> (observable: Observable<T>): Snapshot<T | null>
export function useSnapshot<T> (observable: Observable<T>, defaultValue: T): Snapshot<T>
export function useSnapshot<T> (observable: BehaviorSubject<T> | undefined | null): Snapshot<T, null>
export function useSnapshot<T> (observable: Observable<T> | undefined | null): Snapshot<T | null, null>
export function useSnapshot<T> (observable: Observable<T> | undefined | null, defaultValue: T): Snapshot<T, null>

/**
 * Takes an observable and returns its current snapshot. The snapshot consist of the latest value emitted by the observable,
 * its state and an eventual error thrown by it.
 *
 * The snapshot is updated any time the observable emits and if the new snapshot differs from the previous one,
 * the component is re-rendered.
 *
 * @param observable source observable to subscribe to
 * @param defaultValue default value to be returned as part of the snapshot while waiting for the observable to emit, or when the observable is nullish
 * @typeParam T type of the emitted value of the source observable
 * @category Hook
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
