import { OperatorFunction, UnaryFunction } from 'rxjs'
import { map } from 'rxjs/operators'

/**
 * Binds the provided unary function to an emitted value as its only argument.
 * Emits a parameter less function.
 *
 * @param func a function to bind the emitted value with
 */
export function bind<I, O> (func: UnaryFunction<I, O>): OperatorFunction<I, () => O> {
  return map(input => () => func(input))
}
