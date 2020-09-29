/**
 * Merge each index of an array separately, while keeping the original value if the new one is `undefined`.
 *
 * @param originalArray original tuple
 * @param sparseArray new sparse array with `undefined` values as placeholders
 * @stable
 */
export function mergeArrays<T extends any[]> (originalArray: T, sparseArray: Partial<T>) {
  return originalArray.map(
    (originalValue, index) => sparseArray[index] === undefined ? originalValue : sparseArray[index]
  ) as T
}
