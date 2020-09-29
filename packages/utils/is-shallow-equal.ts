import { isEqualArray } from './is-equal-array'

/**
 * Checks whether the values are shallowly equal. Supports primitives, arrays and objects.
 *
 * @stable
 */
export function isShallowEqual<T> (objectA: T, objectB: T): boolean {
  if (Object.is(objectA, objectB)) {
    return true
  }

  if (Array.isArray(objectA)) {
    return Array.isArray(objectB) && isEqualArray(objectA, objectB)
  }

  if (!(typeof objectA === 'object' && typeof objectB === 'object')) {
    return false
  }

  for (const key in objectA) {
    if (!(key in objectB) || !Object.is(objectA[key], objectB[key])) {
      return false
    }
  }

  for (const key in objectB) {
    if (!(key in objectA) || !Object.is(objectA[key], objectB[key])) {
      return false
    }
  }

  return true
}
