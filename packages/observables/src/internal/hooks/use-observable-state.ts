import { BehaviorSubject } from 'rxjs'
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react'
import { isFunction } from '@spicy-hooks/utils'
import { useSingleton } from '@spicy-hooks/core'

/**
 * Similar to `useState` but returns an observable of the current value rather than the value itself.
 *
 * Both values of the returned tuple are identity stable.
 *
 * @param initialValue initial value for the returned `BehaviorSubject` or a factory that generates that value
 * @typeParam type of the state value
 * @returns a tuple of `BehaviorSubject` and a callback used to change the - or better to say to emit a new - state
 * @category Hook
 */
export function useObservableState<S> (initialValue: S | (() => S)): [BehaviorSubject<S>, Dispatch<SetStateAction<S>>] {
  const subject = useSingleton(() => {
    const generatedInitialValue = isFunction(initialValue)
      ? initialValue()
      : initialValue
    return new BehaviorSubject<S>(generatedInitialValue)
  })

  const setState = useCallback(
    (action: SetStateAction<S>) => {
      const newValue = isFunction(action)
        ? action(subject.getValue())
        : action
      subject.next(newValue)
    },
    [subject]
  )

  useEffect(
    () => () => subject.complete(),
    [subject]
  )

  return [subject, setState]
}
