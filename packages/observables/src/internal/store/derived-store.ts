import {
  Observable
} from 'rxjs'
import { map } from 'rxjs/operators'

import { StoreLike } from './store'
import { shareReplayReset } from '../operators'

/**
 * Similarly to regular [[Store]] the `DerivedStore` allows you to observe and modify a state.
 * Unlike with the [[Store]], the state is not stored within a `DerivedStore`, but it is derived
 * from a source store.
 *
 * The way how the state is derived is defined by the `selector` parameter of the constructor.
 *
 * Every `update` instruction is translated to an update instruction on the source store - meaning
 * that changes on the derived state are propagated to the source state. This merging of source
 * state and a new derived state is handled through the `merger` parameter of the constructor.
 *
 * *Example:*
 * ```js
 * const postStore = new Store({user: {name: 'Peter', surname: 'Gabriel'}, text: 'I love singing!'})
 *
 * const userStore = new DerivedStore(
 *   postStore, // the source store
 *   post => post.user, // selects the derived state
 *   (post,user) => ({...post, user}) // merges updated derived state with the source state
 * )
 *
 * postStore.subscribe({next: console.log}) // prints "{user: {name: 'Peter', surname: 'Gabriel'}, text: 'I love singing!'}"
 * userStore.subscribe({next: console.log}) // prints "{name: 'Peter', surname: 'Gabriel'}"
 *
 * userStore.update(user => ({...user, name: 'Carl'}))
 * // console prints "{user: {name: 'Carl', surname: 'Gabriel'}, text: 'I love singing!'}" - as the `postStore` emits
 * // and "{name: 'Carl', surname: 'Gabriel'}" - as the `userStore` emits
 * ```
 *
 * The usage is not limited to a property access. You can use it to access array elements or deep path within an object.
 *
 * Furthermore the `DerivedStore` can be sub-classed and enhanced with selectors (`this.pipe()`) and update methods.
 */
export class DerivedStore<S, D> extends Observable<D> implements StoreLike<D> {
  private sharedDerivedState$: Observable<D> | null = null

  constructor (
    private readonly sourceStore: StoreLike<S>,
    private readonly selector: (state: S) => D,
    private readonly merger: (parentState: S, childState: D) => S
  ) {
    super(subscriber => {
      if (!this.sharedDerivedState$) {
        this.sharedDerivedState$ = sourceStore.pipe(
          map(selector),
          shareReplayReset()
        )
      }
      const subscription = this.sharedDerivedState$.subscribe(subscriber)
      return () => subscription.unsubscribe()
    })
  }

  update (updater: (prev: D) => D): D {
    const newSourceState = this.sourceStore.update(prevSourceState => {
      const prevDerivedState = this.selector(prevSourceState)
      const newDerivedState = updater(prevDerivedState)
      if (newDerivedState === prevDerivedState) {
        return prevSourceState
      }
      return this.merger(prevSourceState, newDerivedState)
    })
    return this.selector(newSourceState)
  }

  next (value: D): void {
    this.update(() => value)
  }
}
