import type { Maybe } from "./maybe.js"

/**
 * The Result type.
 *
 */
export type Result<T, E> = {
  /**
   * Returns true if the {@link Result} is {@link Ok}.
   *
   * @return {boolean} Returns whether or not the Result is Ok
   */
  isOk: () => boolean

  /**
   * Returns true if the {@link Result} is {@link Err}.
   *
   * @return {boolean} Returns whether or not the Result is Err
   */
  isErr: () => boolean

  /**
   * Returns true if the {@link Result} is {@link Ok} and the value inside of it matches the predicate.
   *
   * @return {boolean} Returns whether or not the Result is Ok and the value matches the predicate
   */
  isOkAnd: (predicateFn: (v: T) => boolean) => boolean

  /**
   * Returns true if the {@link Result} is {@link Err} and the value inside of it matches the predicate.
   *
   * @return {boolean} Returns whether or not the Result is Err and the value matches the predicate
   */
  isErrAnd: (predicateFn: (err: E) => boolean) => boolean

  /**
   * Returns the contained value. Throws an {@link UnwrapError} with a generic
   * message if called on an {@link Err}.
   *
   * @return {T} The contained value
   */
  unwrap: () => T

  /**
   * Returns the contained value. Throws an {@link UnwrapError} with the
   * supplied custom `message` if called on an {@link Err}.
   *
   * @param {string} message - A custom message to be used for the
   * `UnwrapError`
   *
   * @return {T} The contained value
   */
  expect: (message: string) => T

  /**
   * Returns the contained value if {@link Ok}; otherwise returns the
   * supplied `defaultValue`
   *
   * @param {T} defaultValue - A default value to be returned in case of
   * {@link Err}
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
  unwrapOrElse: (defaultFn: (err: E) => T) => T

  /**
   * Maps a Result<T, E> to Result<U, E> by applying the supplied function to a
   * contained {@link Ok} value, leaving the {@link Err} value untouched.
   *
   * @param {(v: T) => U} fn - The function to be applied to the contained
   * Ok value
   *
   * @return {Result<U, E>} A Result of the Ok and Err values of the applied
   * function
   */
  map: <U>(fn: (v: T) => U) => Result<U, E>

  /**
   * Maps a Result<T, E> to Result<T, F> by applying the supplied function to a
   * contained {@link Err} value, leaving the {@link Ok} value untouched.
   *
   * @param {(err: E) => F} fn - The function to be applied to the contained
   * Err value
   *
   * @return {Result<T, F>} A Result of the Ok and Err values of the applied
   * function
   */
  mapErr: <F>(fn: (err: E) => F) => Result<T, F>

  /**
   * Returns the provided default (if Err), or applies a function to the
   * contained value (if Ok).
   *
   * @param {U} defaultValue - The default value to be returned in case of Err
   * @param {(v: T) => U} fn - The function to be applied to the contained Ok
   * value
   *
   * @returns {U} The mapped value or the supplied default value
   */
  mapOr: <U>(defaultValue: U, fn: (v: T) => U) => U

  /**
   * Maps a Result<T, E> to U by applying the supplied fallback function default
   * to a contained Err value, or the supplied function f to a contained Ok
   * value.
   *
   * @param {(err: E) => U} defauleFn - The function to be applied to the
   * contained error value if Err
   * @param {(v: T) => U} fn - The function to be applied to the contained value
   * if Ok
   *
   * @returns {U} The mapped value
   */
  mapOrElse: <U>(defauleFn: (err: E) => U, fn: (v: T) => U) => U

  /**
   * Calls the supplied function if Ok, otherwise returns the Err value of self.
   *
   * @param {(v: T) => Result<U, E>} fn - The function to be applied to the
   * contained value whose result is to be returned in case of {@link Ok}
   *
   * @returns {Result<U, E} The result of the supplied function; or Err
   */
  andThen: <U>(fn: (v: T) => Result<U, E>) => Result<U, E>

  /**
   * Calls the supplied function  if the result is Err, otherwise returns the
   * Ok value of self.
   *
   * @param {(err: E) => Result<T, F>} fn - The function to be applied to the
   * contained error value whose result is to be returned in case of {@link Err}
   *
   * @returns {Result<T, F>} The result of the supplied function; or self
   */
  orElse: <F>(fn: (err: E) => Result<T, F>) => Result<T, F>

  /**
   * Converts from Result<T, E> to Maybe<T>, by doing so it consumes itself and
   * discards the error if any
   *
   * @return {Maybe<T>} A Maybe of the Ok; or a None if Err
   */
  ok(): Maybe<T>

  /**
   * Converts from Result<T, E> to Maybe<E>, by doing so it consumes itself and
   * discards the value if any
   *
   * @return {Maybe<E>} A Maybe of the Err; or a None if Some
   */
  err(): Maybe<E>
}
