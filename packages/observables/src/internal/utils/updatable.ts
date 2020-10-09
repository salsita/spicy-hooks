/**
 * An object whose internal state can be updated.
 *
 * @typeParam T type of the internal state
 */
export interface Updatable<T> {
  /**
   * Update the internal state using the provided callback.
   *
   * **Note**: If the callback returns the same instance of the state (i.e. returns the `prev` argument)
   * the implementations are safe to assume that no update happened and can act so (e.g. skip any notification or post-processing).
   *
   * @param updater callback that receives previous state and is supposed to return a new one
   * @returns the new state after the update is applied
   */
  update: (updater: (prev: T) => T) => T
}
