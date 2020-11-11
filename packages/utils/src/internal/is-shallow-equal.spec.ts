import { isShallowEqual } from './is-shallow-equal'

describe('isShallowEqual', () => {
  it('passes for identical objects', () => {
    const obj = { a: 1 }
    expect(isShallowEqual(obj, obj)).toBe(true)
  })

  it('passes for same (non identical) objects', () => {
    const objA = { a: 1, b: 'x' }
    const objB = { a: 1, b: 'x' }
    expect(isShallowEqual(objA, objB)).toBe(true)
  })

  it('passes for different property order', () => {
    const objA = { a: 1, b: 'x' }
    const objB = { b: 'x', a: 1 }
    expect(isShallowEqual(objA, objB)).toBe(true)
    expect(isShallowEqual(objB, objA)).toBe(true)
  })

  it('fails for same different property values', () => {
    const objA = { a: 1, b: 'x' }
    const objB = { a: 1, b: 'y' }
    expect(isShallowEqual(objA, objB)).toBe(false)
  })

  it('fails for extra property', () => {
    const objA = { a: 1, b: 'x' }
    const objB = { a: 1, b: 'x', c: false }
    expect(isShallowEqual(objA, objB)).toBe(false)
    expect(isShallowEqual(objB, objA)).toBe(false)
  })

  it('fails for deeply equal objects', () => {
    const objA = { a: 1, nested: { b: 'x' } }
    const objB = { a: 1, nested: { b: 'x' } }
    expect(isShallowEqual(objA, objB)).toBe(false)
  })

  it('passes for shallowly equal objects', () => {
    const nested = { b: 'x' }
    const objA = { a: 1, nested }
    const objB = { a: 1, nested }
    expect(isShallowEqual(objA, objB)).toBe(true)
  })

  it('passes for same (non identical) arrays', () => {
    const arrayA = ['a', 'b']
    const arrayB = ['a', 'b']
    expect(isShallowEqual(arrayA, arrayB)).toBe(true)
  })

  it('fails for different size arrays', () => {
    const arrayA = ['a', 'b']
    const arrayB = ['a', 'b', 'c']
    expect(isShallowEqual(arrayA, arrayB)).toBe(false)
    expect(isShallowEqual(arrayB, arrayA)).toBe(false)
  })

  it('fails for different order of items', () => {
    const arrayA = ['a', 'b']
    const arrayB = ['b', 'a']
    expect(isShallowEqual(arrayA, arrayB)).toBe(false)
    expect(isShallowEqual(arrayB, arrayA)).toBe(false)
  })

  it('fails for deeply equal arrays', () => {
    const arrayA = ['a', { prop: 1 }]
    const arrayB = ['a', { prop: 1 }]
    expect(isShallowEqual(arrayA, arrayB)).toBe(false)
  })

  it('passes for shallowly equal arrays', () => {
    const obj = { prop: 1 }
    const arrayA = ['a', obj]
    const arrayB = ['a', obj]
    expect(isShallowEqual(arrayA, arrayB)).toBe(true)
  })

  it('handles null gracefully', () => {
    expect(isShallowEqual(1, null)).toBe(false)
    expect(isShallowEqual('a', null)).toBe(false)
    expect(isShallowEqual(true, null)).toBe(false)
    expect(isShallowEqual(['a'], null)).toBe(false)
    expect(isShallowEqual({ prop: 1 }, null)).toBe(false)

    expect(isShallowEqual(null, 1)).toBe(false)
    expect(isShallowEqual(null, 'a')).toBe(false)
    expect(isShallowEqual(null, true)).toBe(false)
    expect(isShallowEqual(null, ['a'])).toBe(false)
    expect(isShallowEqual(null, { prop: 1 })).toBe(false)
  })

  it('handles undefined gracefully', () => {
    expect(isShallowEqual(1, undefined)).toBe(false)
    expect(isShallowEqual('a', undefined)).toBe(false)
    expect(isShallowEqual(true, undefined)).toBe(false)
    expect(isShallowEqual(['a'], undefined)).toBe(false)
    expect(isShallowEqual({ prop: 1 }, undefined)).toBe(false)

    expect(isShallowEqual(undefined, 1)).toBe(false)
    expect(isShallowEqual(undefined, 'a')).toBe(false)
    expect(isShallowEqual(undefined, true)).toBe(false)
    expect(isShallowEqual(undefined, ['a'])).toBe(false)
    expect(isShallowEqual(undefined, { prop: 1 })).toBe(false)
  })

  it('passes for equal primitives', () => {
    expect(isShallowEqual(1, 1)).toBe(true)
    expect(isShallowEqual(1, 1.0)).toBe(true)
    expect(isShallowEqual('a', 'a')).toBe(true)
    expect(isShallowEqual(false, false)).toBe(true)
    expect(isShallowEqual(null, null)).toBe(true)
    expect(isShallowEqual(undefined, undefined)).toBe(true)
  })

  it('fails for different primitives', () => {
    expect(isShallowEqual(1, 2)).toBe(false)
    expect(isShallowEqual(1, 1.1)).toBe(false)
    expect(isShallowEqual('a', 'b')).toBe(false)
    expect(isShallowEqual(false, true)).toBe(false)
  })

  it('fails for incompatible primitives', () => {
    expect(isShallowEqual<any>(0, false)).toBe(false)
    expect(isShallowEqual<any>(null, '')).toBe(false)
    expect(isShallowEqual<any>(null, undefined)).toBe(false)
  })
})
