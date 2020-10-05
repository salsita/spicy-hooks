/**
 * Object implementing the `Intent` interface is considered to be an intention of a future deferred action.
 * Along with various domain specific data it is supposed to provide [[performIntent]] function
 * for actually performing the deferred action.
 *
 * @param I the actual type of the intention function
 * @stable
 */
export interface Intent<I extends Function | undefined = (() => void) | undefined> {
  /**
   * Function to be called when the intended action should actually be performed.
   *
   * The signature of the function is up the implementation as well as optionality - i.e. the implementation may
   * or may not use `undefined` for [[performIntent]] to indicate that there currently isn't any performable action.
   */
  performIntent: I
}
