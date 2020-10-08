import { createContext, Provider, useContext } from 'react'

/**
 * A hook that retrieves a value of a certain context when called.
 * In addition to that it carries a `Provider` component that can be used to override the context's value.
 *
 * @typeParam T type of the value kept in the context
 * @see [[createUseContext]]
 */
export type UseContext<T> = (() => T) & {
  /**
   * The internal `MyContext.Provider` component published through the hook itself so that these two form an inseparable couple.
   */
  Provider: Provider<T>
}

/**
 * Creates a `useContext` hook for a newly allocated context with the specified name.
 *
 * **Example:**
 * ```jsx
 * const useMyContext = createUseContext({contextName: 'MyContext'})
 *
 * const MyComponent = () => {
 *   const myValue = useMyContext()
 * }
 *
 * const MyApp = () => (
 *   <useMyContext.Provider value={...}>
 *     ...
 *   </useMyContext.Provider
 * )
 * ```
 *
 * @param contextName name of the new context
 * @typeParam T type of the value kept in the context
 * @category Hook Factory
 */
export function createUseContext<T> ({ contextName }: { contextName: string }): UseContext<T | undefined>
/**
 * Creates a `useContext` hook for a newly allocated context with the specified name and a given default value.
 *
 * **Example:**
 * ```jsx
 * const useMyContext = createUseContext({contextName: 'MyContext', defaultValue: ... })
 *
 * const MyComponent = () => {
 *   const myValue = useMyContext()
 * }
 *
 * const MyApp = () => (
 *   <useMyContext.Provider value={...}>
 *     ...
 *   </useMyContext.Provider
 * )
 * ```
 *
 * @param contextName name of the new context
 * @param defaultValue default value for the context to be used when no `Provider` is mounted
 * @typeParam T type of the value kept in the context
 * @category Hook Factory
 */
export function createUseContext<T> ({ contextName, defaultValue }: { contextName: string, defaultValue: T }): UseContext<T>
/**
 * Creates a `useContext` hook for a newly allocated context with the specified name.
 *
 * Invocation of the hook will fail if there is no value provided through the `Provider` component.
 *
 * **Example:**
 * ```jsx
 * const useMyContext = createUseContext({contextName: 'MyContext', nonNull: true, nullMessage: 'Value not available, did you use <useMyContext.Provider> ?' })
 *
 * const MyComponent = () => {
 *   const myValue = useMyContext()
 * }
 *
 * const MyApp = () => (
 *   <useMyContext.Provider value={...}>
 *     ...
 *   </useMyContext.Provider
 * )
 * ```
 *
 *
 * @param contextName name of the new context
 * @param nonNull always `true`
 * @param nullMessage a custom error message to be displayed when there is no value provided
 * @typeParam T type of the value kept in the context
 * @category Hook Factory
 */
export function createUseContext<T> ({ contextName, nonNull, nullMessage }: { contextName: string, nonNull: true, nullMessage?: string }): UseContext<T>
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
