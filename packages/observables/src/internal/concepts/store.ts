import { BehaviorSubject } from 'rxjs'

import { SimpleSubscribable, Updatable } from '../utils'

/**
 * Subject-like object whose state can be updated.
 *
 * @stable
 */
export interface UpdatableSubscribable<T> extends Updatable<T>, SimpleSubscribable<T> {
}

/**
 * Base class for every RxJS store.
 *
 * @stable
 */
export class Store<T> extends BehaviorSubject<T> implements UpdatableSubscribable<T> {
  update (updater: (prev: T) => T): T {
    const originalValue = this.getValue()
    const newValue = updater(originalValue)
    if (newValue !== originalValue) {
      this.next(newValue)
    }

    return newValue
  }
}
