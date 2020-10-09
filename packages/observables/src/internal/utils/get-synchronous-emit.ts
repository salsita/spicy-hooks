import { Observable } from 'rxjs'

const EmptySymbol = Symbol('empty')

/**
 * Retrieves next emit of an observable in a synchronous operation.
 * Fails if the observable throws an exception, if it completes before emitting
 * or if it is not synchronous.
 *
 * @param observable source observable to get a synchronous emit from
 * @typeParam T type of the observable value
 * @category Test Helper
 */
export function getSynchronousEmit<T> (observable: Observable<T>): T {
  let value: T | typeof EmptySymbol = EmptySymbol
  let error: any | typeof EmptySymbol = EmptySymbol
  observable.subscribe({
    next: newValue => {
      value = newValue
    },
    error: newError => {
      error = newError
    },
    complete: () => {
      if (value === EmptySymbol) {
        error = Error('observable completed before emitting')
      }
    }
  }).unsubscribe()

  if (error !== EmptySymbol) {
    throw error
  }

  if (value === EmptySymbol) {
    throw new Error('observable is not synchronous')
  }
  return value
}
