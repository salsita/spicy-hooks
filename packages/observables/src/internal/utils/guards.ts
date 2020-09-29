import { BehaviorSubject, Observable } from 'rxjs'

/**
 * Check whether the provided `Observable` is an instance of `BehaviorSubject`.
 */
export function isBehaviorSubject<T> (observable: Observable<T>): observable is BehaviorSubject<T> {
  return typeof (observable as any).getValue === 'function'
}
