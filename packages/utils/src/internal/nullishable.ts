/**
 * Helper type for extending a type with `| null | undefined`.
 *
 * @typeParam T the raw type to be extended
 */
export type Nullishable<T> = T | null | undefined
