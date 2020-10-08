import { NextObserver, Unsubscribable } from 'rxjs'

/**
 * Observable-like that can be subscribed to.
 *
 * @typeParam T type of the value one can subscribe for
 */
export interface SimpleSubscribable<T> {
  /**
   * Subscribe to the observable-like.
   *
   * @see [[Observable.subscribe]]
   */
  subscribe: (observer?: NextObserver<T>) => Unsubscribable
}
