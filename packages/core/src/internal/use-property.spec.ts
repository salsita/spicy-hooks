import { act, renderHook } from '@testing-library/react-hooks'
import { useState } from 'react'

import { useProperty } from './use-property'

describe('useProperty', () => {
  it('selects property value', () => {
    const { result } = renderHook(() => {
      const [object, setObject] = useState({ a: 'a', b: 1 })
      return useProperty(object, setObject, 'b')
    })
    expect(result.current[0]).toBe(1)
  })

  it('reacts to external change in the property', () => {
    const { result } = renderHook(() => {
      const [object, setObject] = useState({ a: 'a', b: 1 })
      return [...useProperty(object, setObject, 'b'), setObject] as const
    })
    act(() => {
      result.current[2]({ a: 'a', b: 2 })
    })
    expect(result.current[0]).toBe(2)

    act(() => {
      result.current[2](prev => ({ ...prev, b: 3 }))
    })
    expect(result.current[0]).toBe(3)
  })

  it('reports proper value after external change in other the properties', () => {
    const { result } = renderHook(() => {
      const [object, setObject] = useState({ a: 'a', b: 1 })
      return [...useProperty(object, setObject, 'b'), setObject] as const
    })
    act(() => {
      result.current[2]({ a: 'b', b: 1 })
    })
    expect(result.current[0]).toBe(1)

    act(() => {
      result.current[2](prev => ({ ...prev, a: 'c' }))
    })
    expect(result.current[0]).toBe(1)
  })

  it('updates the property through the derived setter', () => {
    const { result } = renderHook(() => {
      const [object, setObject] = useState({ a: 'a', b: 1 })
      return useProperty(object, setObject, 'b')
    })
    act(() => {
      result.current[1](2)
    })
    expect(result.current[0]).toEqual(2)

    act(() => {
      result.current[1](prev => prev + 1)
    })
    expect(result.current[0]).toEqual(3)
  })

  it('updates the object through the derived setter', () => {
    const { result } = renderHook(() => {
      const [object, setObject] = useState({ a: 'a', b: 1 })
      return [...useProperty(object, setObject, 'b'), object] as const
    })
    act(() => {
      result.current[1](2)
    })
    expect(result.current[2]).toEqual({ a: 'a', b: 2 })

    act(() => {
      result.current[1](prev => prev + 1)
    })
    expect(result.current[2]).toEqual({ a: 'a', b: 3 })
  })

  it('does not choke on undefined (for plain value)', () => {
    const { result } = renderHook(() => {
      const [object, setObject] = useState<{ a: string, b: number | undefined }>({ a: 'a', b: 1 })
      return [...useProperty(object, setObject, 'b'), object] as const
    })
    act(() => {
      result.current[1](undefined)
    })
    expect(result.current[0]).toEqual(undefined)
    expect(result.current[2]).toEqual({ a: 'a', b: undefined })
  })

  it('does not choke on undefined (for updater)', () => {
    const { result } = renderHook(() => {
      const [object, setObject] = useState<{ a: string, b: number | undefined }>({ a: 'a', b: 1 })
      return [...useProperty(object, setObject, 'b'), object] as const
    })
    act(() => {
      result.current[1](() => undefined)
    })
    expect(result.current[0]).toEqual(undefined)
    expect(result.current[2]).toEqual({ a: 'a', b: undefined })
  })
})
