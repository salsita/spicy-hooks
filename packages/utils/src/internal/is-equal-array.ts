/**
 * Checks whether the arrays are shallowly equal.
 *
 * @param arrayA first array to compare
 * @param arrayB second array to compare
 * @typeParam T type of both arrays
 * @category Comparison
 */
export function isEqualArray<T extends any[]> (arrayA: T | Readonly<T> | null | undefined, arrayB: T | Readonly<T> | null | undefined): boolean {
  return arrayA === arrayB ||
    (
      !!arrayA && !!arrayB &&
      arrayA.length === arrayB.length &&
      arrayA.every((value, index) => Object.is(value, arrayB[index]))
    )
}
