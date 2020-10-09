/**
 * A safer variant for defining a type for a sub-set of object keys.
 *
 * Given a following interface:
 * ```typescript
 * interface Person {
 *   name: string;
 *   age: number;
 *   title: string;
 * }
 * ```
 * a type for any key of that interface would be:
 * ```typescript
 * type PersonKey = keyof Person;
 * ```
 *
 * For a subset of keys you would do this:
 * ```typescript
 * type ModifiableKey = 'name' | 'title';
 * ```
 * However that doesn't provide any immediate validation that `name` and `title` are in fact keys of the `Person` interface.
 *
 * The `KeyOf` helper resolves this:
 * ```typescript
 * type ModifiableKey1 = KeyOf<Person, 'name' | 'title'>; // all OK
 * type ModifiableKey2 = KeyOf<Person, 'name' | 'title' | 'citizenship'>; // TS2344: Type '"name" | "title" | "citizenship"' does not satisfy...
 * ```
 *
 * @typeParam R record containing the properties
 * @typeParam T selected key(s) of `R`
 */
export type KeyOf<R extends Record<any, any>, T extends keyof R = keyof R> = T
