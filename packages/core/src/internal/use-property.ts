import { Dispatch, SetStateAction, useCallback } from 'react'
import { isFunction } from '@spicy-hooks/utils'

/**
 * Treats a property of an object as a stand-alone state.
 *
 * This hook can be used to access a property of a complex state in a transparent way.
 * The returned value and setter can be treated in the same way as the ones
 * returned by `useState` directly.
 *
 * **Usage example:**
 *
 * ```jsx
 * const [object, setObject] = useState({ a: 'a', b: 1 })
 * const [b, setB] = useProperty(object, setObject, 'b')
 * ...
 * return (
 *   <div>
 *     Current value of B: {b}
 *     <button onClick={() => setB(prevB => prevB + 1)}>Increment</button>
 *   </div>
 * )
 * ```
 * Note that the above shows very simple case in which it would probably be better to allocate two different states,
 * there are situations though when you either cannot influence this (the object comes from above)
 * or it is beneficial to use the whole object as an atomic unit.
 *
 * @param object complex state value
 * @param updateObject function that updates the complex state by passing the current state into the callback and expecting a modified state back (just like `setState(prev => prev + 1)`
 * @param property name of the property of the `object` that is to be managed
 * @typeParam O type of the complex state
 * @typeParam P the actual managed property of `O`
 * @returns the same output as ˙useState˙, but scoping everything to the provided property
 * @category Hook
 */
export function useProperty<O, P extends keyof O> (
  object: O,
  updateObject: Dispatch<(prevState: O) => O>,
  property: P
): [O[P], Dispatch<SetStateAction<O[P]>>] {
  const setState = useCallback(
    (value: SetStateAction<O[P]>) =>
      updateObject(prevCompositeState => {
        const previousValue = prevCompositeState[property]
        const newValue = isFunction(value)
          ? value(previousValue)
          : value
        if (newValue === previousValue) {
          return prevCompositeState
        }
        return {
          ...prevCompositeState,
          [property]: newValue
        }
      }),
    [updateObject, property]
  )
  return [object[property], setState]
}
