import { BehaviorSubject } from 'rxjs'
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react'

import { isFunction } from '../../common'
import { useSingleton } from '../react'

/**
 * Similar to `useState` but returns an observable of the current value rather than the value itself.
 */
export function useObservableState<S> (initialState: S | (() => S)): [BehaviorSubject<S>, Dispatch<SetStateAction<S>>] {
  const subject = useSingleton(() => {
    const initialValue = isFunction(initialState)
      ? initialState()
      : initialState
    return new BehaviorSubject<S>(initialValue)
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
