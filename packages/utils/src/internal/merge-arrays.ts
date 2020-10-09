/**
 * Merges each index of an array separately, while keeping the original value if the new one is `undefined`.
 *
 * Note that extra elements in the `sparseArray` are ignored.
 *
 * **Example:**
 * ```js
 * const mergedArray = mergeArrays([1,2,3], [9,undefined,10])
 * // mergedArray === [9,2,10]
 * ```
 *
 * @param originalArray original tuple
 * @param sparseArray new sparse array with `undefined` values as placeholders
 */
export function mergeArrays<T extends any[]> (originalArray: T, sparseArray: Partial<T>) {
  return originalArray.map(
    (originalValue, index) => sparseArray[index] === undefined ? originalValue : sparseArray[index]
  ) as T
}
