import React, { createContext, FunctionComponent, useContext, useMemo } from 'react'

import { useInternedValue } from './use-interned-value'
import { isFunction, isShallowEqual } from '../../common'

type OverrideComponent<T extends Record<string, any>> = FunctionComponent<{ values: Partial<T> }>
type UseDependencies<T> = (() => T) & { Override: OverrideComponent<T> }

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
    const internedValues = useInternedValue(mergedValues, isShallowEqual)
    const newHolder = useMemo(() => ({ values: internedValues }), [internedValues])
    return <context.Provider value={newHolder}>{children}</context.Provider>
  }

  useDependencies.Override = Override
  Override.displayName = 'OverrideDependencies'

  return useDependencies
}
