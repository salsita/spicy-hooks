import { Observable, ObservableInput, OperatorFunction } from 'rxjs'
import { subscribeTo } from 'rxjs/internal-compatibility'
import { map } from 'rxjs/operators'

/**
 * Makes a cold observable from any emitted parameterless function that returns `ObservableInput`.
 * This operator is especially handy for turning asynchronous functions into cold observables.
 */
export function coldFrom<T> (): OperatorFunction<() => ObservableInput<T>, Observable<T>> {
  return map(factory =>
    new Observable<T>(subscriber => {
      const subscription = subscribeTo(factory())(subscriber)
      return () => {
        if (subscription) {
          subscription.unsubscribe()
        }
      }
    })
  )
}
