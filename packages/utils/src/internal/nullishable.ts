/**
 * Helper type for extending a type with `| null | undefined`.
 *
 * @paramtype T the raw type to be extended
 * @stable
 */
export type Nullishable<T> = T | null | undefined
