/**
 * Checks whether the `valueOrFunction` is a function.
 *
 * @stable
 */
export function isFunction<F extends Function> (valueOrFunction: F | Exclude<any, Function>): valueOrFunction is F {
  return typeof valueOrFunction === 'function'
}

/**
 * An alternative to `Boolean` for usage in `[].filter()`. In addition to the actual filtering it also ensures
 * that the result of `.filter()` operation is typed properly - i.e. it skips `false | null | undefined | '' | 0` from the input type.
 *
 * @param value value that could eventually be falsy
 * @stable
 */
export function isTruthy<T> (value: T): value is Exclude<T, false | null | undefined | '' | 0> {
  return Boolean(value)
}
