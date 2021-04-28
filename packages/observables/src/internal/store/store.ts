import { BehaviorSubject, Observable } from 'rxjs'

import { SimpleSubscribable, Updatable } from '../utils'

/**
 * Subject-like object whose state can be updated.
 *
 * @typeParam T type of the state
 */
export interface UpdatableSubscribable<T> extends Updatable<T>, SimpleSubscribable<T> {
}

export type StoreLike<T> = Observable<T> & Updatable<T>

/**
 * Base class for every RxJS store.
 *
 * @typeParam T type of the store's state
 */
export class Store<T> extends BehaviorSubject<T> implements UpdatableSubscribable<T>, StoreLike<T> {
  /**
   * @inheritDoc
   */
  update (updater: (prev: T) => T): T {
    const originalValue = this.getValue()
    const newValue = updater(originalValue)
    if (newValue !== originalValue) {
      this.next(newValue)
    }

    return newValue
  }
}
