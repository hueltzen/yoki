/**
 * The Maybe type.
 *
 */
export type Maybe<T> = {
  /**
   * Returns true if the {@link Maybe} is a {@link Some} value.
   *
   * @return {boolean} Returns whether or not a value is present
   */
  present: () => boolean
  /**
   * Compares the supplied item to the contained value, returns `true` if they
   * match.
   *
   * @param {T} item - The item to compare the contained value with
   *
   * @return {boolean} Whether or not the contained value matches a supplies
   * item
   */
  contains: (item: T) => boolean

  /**
   * Returns the contained value. Throws an {@link UnwrapError} with a generic
   * message if called on a {@link None}.
   *
   * @return {T} The contained value
   */
  unwrap: () => T
  /**
   * Returns the contained value. Throws an {@link UnwrapError} with the
   * supplied custom `message` if called on a {@link None}.
   *
   * @param {string} message - A custom message to be used for the
   * `UnwrapError`
   *
   * @return {T} The contained value
   */
  expect: (message: string) => T

  /**
   * Returns the contained value if {@link Some}; otherwise returns the
   * supplied `defaultValue`
   *
   * @param {T} defaultValue - A default value to be returned in case of
   * {@link None}
   *
   * @return {T} The contained value or the supplied default value
   */
  unwrapOr: (defaultValue: T) => T

  /**
   * Returns the contained value if {@link Some}; otherwise returns the
   * result of the supplied `defaultFn`
   *
   * @param {() => T} defaultFn - A default function whose result is to be
   * returned in case of {@link None}
   *
   * @return {T} The contained value or the result of the supplied default
   * function
   */
  unwrapOrElse: (defaultFn: () => T) => T

  /**
   * Maps a Maybe<T> to Maybe<U> by applying the supplied function to a
   * contained value (if {@link Some}) or returns {@link None} (if
   * {@link None}).
   *
   * @param {(v: T) => U} fn - The function to be applied to the contained
   * value
   *
   * @return {Maybe<U>} A Some of the result of the applied function or None
   */
  map: <U>(fn: (v: T) => U) => Maybe<U>

  /**
   * Maps a Maybe<T> to U by applying the supplied function to a
   * contained value (if {@link Some}) or returns the supplied `defaultValue`
   * (if {@link None}).
   *
   * @param {U} defaultValue - The default value to be returned in case of
   * {@link None}
   * @param {(v: T) => U} fn - The function to be applied to the contained
   * value
   *
   * @return {U} The Result of the applied function or the default value
   */
  mapOr: <U>(defaultValue: U, fn: (v: T) => U) => U

  /**
   * Maps a Maybe<T> to U by applying the supplied function to a
   * contained value (if {@link Some}) or returns the result of the supplied
   * `defaultFn` (if {@link None}).
   *
   * @param {() => U} defaultFn - The default function whose result is to be
   * returned in case of {@link None}
   * @param {(v: T) => U} fn - The function to be applied to the contained
   * value
   *
   * @return {U} The Result of the applied function or the result of the
   * default function
   */
  mapOrElse: <U>(defaultFn: () => U, fn: (v: T) => U) => U

  /**
   * Returns {@link None} if the {@link Maybe} is {@link None}, otherwise
   * calls predicate with the contained value and returns:
   *  - Some(t) if predicate returns true (where t is the contained value), and
   *  - None if predicate returns false.
   *
   * @param {(v: T) => boolean} predicateFn - The predicate function to test
   * the contained value with
   *
   * @return {Maybe<T>} A Some<T> of the contained value; or a None
   */
  filter: (predicateFn: (v: T) => boolean) => Maybe<T>

  /**
   * Returns {@link None} if the {@link Maybe} is None, otherwise returns
   * `other`.
   *
   * @param {Maybe<U>} other - The Maybe<T> to be returned
   *
   * @return {Maybe<U>} The supplied Maybe<U> other; or None
   */
  and: <U>(other: Maybe<U>) => Maybe<U>

  /**
   * Returns {@link None} if the {@link Maybe} is None, otherwise calls the
   * supplied function fn with the contained value and returns the result.
   *
   * @param {(v: T) => Maybe<U>} fn - The function applied to be applied to the
   * contained value whose result is to be returned in case of {@link Some}
   *
   * @return {Maybe<U>} The result of the supplied function; or None
   */
  andThen: <U>(fn: (v: T) => Maybe<U>) => Maybe<U>

  /**
   * Returns the {@link Maybe} if it contains a value, otherwise returns the
   * supplied `other`.
   *
   * @param {Maybe<T>} other - The Maybe<T> to be returned in case of None
   *
   * @return {Maybe<T>} The Maybe<T> of self or the supplied `other`
   */
  or: (other: Maybe<T>) => Maybe<T>

  /**
   * Zips self with another {@link Maybe}.
   *
   * @param {Maybe<U>} other - The Maybe<U> to zip self with
   *
   * @return {Maybe<[T, U]>} The Maybe<[T, U]> of the zipped value
   */
  zip: <U>(other: Maybe<U>) => Maybe<[T, U]>

  /**
   * Zips self and another {@link Maybe} with the supplied function `fn`.
   *
   * @param {Maybe<U>} other - The Maybe<U> to zip self with
   * @param {(value1: T, value2: U) => R} fn - The function that is supplied
   * the values and zips them
   *
   * @return {Maybe<R>} The result of the supplied function
   */
  zipWith: <U, R>(other: Maybe<U>, fn: (value1: T, value2: U) => R) => Maybe<R>
}
