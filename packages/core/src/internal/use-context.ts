import { createContext, Provider, useContext } from 'react'

export type UseContext<T> = (() => T) & { Provider: Provider<T> }

export function createUseContext<T> ({ contextName }: { contextName: string }): UseContext<T | undefined>
export function createUseContext<T> ({ defaultValue }: { contextName: string, defaultValue: T }): UseContext<T>
export function createUseContext<T> ({ nonNull, nullMessage }: { contextName: string, nonNull: true, nullMessage?: string }): UseContext<T>
export function createUseContext<T> ({ contextName, defaultValue, nonNull = false, nullMessage }: { contextName: string, defaultValue?: T, nonNull?: boolean, nullMessage?: string }) {
  const context = createContext<T | undefined>(defaultValue)
  context.displayName = contextName
  const useContextValue = (() => {
    const value = useContext(context)
    if (nonNull && value == null) {
      throw new Error(nullMessage ?? `value expected for context '${contextName}', got '${value}'`)
    }
    return value
  }) as UseContext<T | undefined>
  useContextValue.Provider = context.Provider
  return useContextValue
}
