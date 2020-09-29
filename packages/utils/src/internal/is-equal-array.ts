/**
 * Checks whether the arrays are shallowly equal.
 *
 * @stable
 */
export function isEqualArray<T extends any[]> (arrayA: T | Readonly<T> | null | undefined, arrayB: T | Readonly<T> | null | undefined) {
  return arrayA === arrayB ||
    (
      !!arrayA && !!arrayB &&
      arrayA.length === arrayB.length &&
      arrayA.every((value, index) => Object.is(value, arrayB[index]))
    )
}
