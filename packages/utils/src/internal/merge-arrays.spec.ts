import { mergeArrays } from './merge-arrays'

describe('mergeArrays', () => {
  it('replaces original when the new one is not sparse', () => {
    const originalArray = ['a', 5, false]
    const newArray = ['c', 4, true]

    expect(mergeArrays(originalArray, newArray)).toEqual(['c', 4, true])
  })

  it('keeps original values for `undefined` placeholders', () => {
    const originalArray = ['a', 5, false]
    const newArray = [undefined, 4, true]

    expect(mergeArrays(originalArray, newArray)).toEqual(['a', 4, true])
  })

  it('treats shorter array as padded with `undefined`', () => {
    const originalArray = ['a', 5, false]
    const newArray = [undefined, 4]

    expect(mergeArrays(originalArray, newArray)).toEqual(['a', 4, false])
  })

  it('ignores longer exceeding array elements', () => {
    const originalArray = ['a', 5, false]
    const newArray = [undefined, 4, true, 'x', 'y']

    expect(mergeArrays(originalArray, newArray)).toEqual(['a', 4, true])
  })
})
