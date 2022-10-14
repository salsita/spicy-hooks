import React, { createContext, FunctionComponent, ReactNode, useContext, useMemo } from 'react'
import { isFunction, isShallowEqual } from '@spicy-hooks/utils'

import { useDistinctValue } from './use-distinct-value'

/**
 * A `Provider` like component through which you can override selected dependencies.
 *
 * @see [[createUseDependencies]]
 */
export type OverrideComponent<T extends Record<string, any>> = FunctionComponent<{ values: Partial<T>, children?: ReactNode }>

/**
 * A hook that fetches dependencies from a dependency injection layer.
 * In addition to that it carries a `Override` component that can be used to override selected dependencies.
 *
 * @typeParam T shape of dependency object
 * @see [[createUseDependencies]]
 */
export type UseDependencies<T extends Record<string, any>> = (() => T) & {
  /**
   * When mounted, this component overrides selected dependencies for usages of the hook within any child component.
   */
  Override: OverrideComponent<T>
}

interface ValuesHolder<T> {
  values?: T
  factory?: () => T
}

function materializeValues<T> (holder: ValuesHolder<T>): T {
  if (holder.factory) {
    holder.values = holder.factory()
    delete holder.factory
  }
  return holder.values!
}

/**
 * This function sets up a very simple context based dependency injection layer.
 * It creates a `useDependencies` hook that can be used to fetch the dependencies from any component.
 *
 * **Example:**
 * ```jsx
 * const useMyDependencies = createUseContext({foo: 'X', bar: 1})
 *
 * const MyComponent = () => {
 *   const {foo} = useMyDependencies()
 *   ...
 * }
 *
 * const MyApp = () => (
 *   <useMyDependencies.Override value={{bar: 2}}>
 *     ...
 *   </useMyDependencies.Override
 * )
 * ```
 *
 * @param defaultsOrFactory default dependencies or a factory that helps overcome issues with circular dependencies
 * @typeParam T shape of the dependency object
 * @category Hook Factory
 */
export function createUseDependencies<T extends Record<string, any>> (defaultsOrFactory: T | (() => T)): UseDependencies<T> {
  const holder: ValuesHolder<T> = isFunction(defaultsOrFactory)
    ? { factory: defaultsOrFactory }
    : { values: defaultsOrFactory }

  const context = createContext(holder)
  const useDependencies = (() => {
    const holder = useContext(context)
    return materializeValues(holder)
  }) as UseDependencies<T>

  // noinspection UnnecessaryLocalVariableJS
  const Override: OverrideComponent<T> = ({ values, children }) => {
    const parentHolder = useContext(context)
    const parentValues = materializeValues(parentHolder)
    const mergedValues = { ...parentValues, ...values }
    const distinctValues = useDistinctValue(mergedValues, isShallowEqual)
    const newHolder = useMemo(() => ({ values: distinctValues }), [distinctValues])
    return <context.Provider value={newHolder}>{children}</context.Provider>
  }

  useDependencies.Override = Override
  Override.displayName = 'OverrideDependencies'

  return useDependencies
}
