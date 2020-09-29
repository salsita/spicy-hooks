import { isEqualArray } from './is-equal-array'

describe('isEqualArray', () => {
  it('passes for identical arrays', () => {
    const array = ['a', 'b']
    expect(isEqualArray(array, array)).toBe(true)
  })

  it('passes for same (non identical) arrays', () => {
    const arrayA = ['a', 'b']
    const arrayB = ['a', 'b']
    expect(isEqualArray(arrayA, arrayB)).toBe(true)
  })

  it('fails for different size arrays', () => {
    const arrayA = ['a', 'b']
    const arrayB = ['a', 'b', 'c']
    expect(isEqualArray(arrayA, arrayB)).toBe(false)
    expect(isEqualArray(arrayB, arrayA)).toBe(false)
  })

  it('fails for different order of items', () => {
    const arrayA = ['a', 'b']
    const arrayB = ['b', 'a']
    expect(isEqualArray(arrayA, arrayB)).toBe(false)
    expect(isEqualArray(arrayB, arrayA)).toBe(false)
  })

  it('fails for deeply equal arrays', () => {
    const arrayA = ['a', { prop: 1 }]
    const arrayB = ['a', { prop: 1 }]
    expect(isEqualArray(arrayA, arrayB)).toBe(false)
  })

  it('passes for shallowly equal arrays', () => {
    const obj = { prop: 1 }
    const arrayA = ['a', obj]
    const arrayB = ['a', obj]
    expect(isEqualArray(arrayA, arrayB)).toBe(true)
  })
})
