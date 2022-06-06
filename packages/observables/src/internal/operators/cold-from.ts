import { Observable, ObservableInput, OperatorFunction, from } from 'rxjs'
import { map } from 'rxjs/operators'

/**
 * Makes a cold observable from any emitted parameterless function that returns `ObservableInput`.
 * This operator is especially handy for turning asynchronous functions into cold observables.
 *
 * @category Operator
 */
export function coldFrom<T> (): OperatorFunction<() => ObservableInput<T>, Observable<T>> {
  return map(factory =>
    new Observable<T>(subscriber => {
      const subscription = from(factory()).subscribe(subscriber)
      return () => {
        subscription.unsubscribe()
      }
    })
  )
}
