import type { Maybe } from "../types/maybe.js"
import { UnwrapError } from "./UnwrapError.js"

export function None<T>(): Maybe<T> {
  function present(): boolean {
    return false
  }

  function unwrap(): T {
    return expect("called `Maybe::unwrap()` on a `None` value")
  }

  function contains(item: T): boolean {
    return false
  }

  function expect(message: string): T {
    throw new UnwrapError(message)
  }

  function unwrapOr(defaultValue: T): T {
    return defaultValue
  }

  function unwrapOrElse(defaultFn: () => T): T {
    return defaultFn()
  }

  function map<U>(fn: (v: T) => U): Maybe<U> {
    return None<U>()
  }

  function mapOr<U>(defaultValue: U, fn: (v: T) => U): U {
    return defaultValue
  }

  function mapOrElse<U>(defaultFn: () => U, fn: (v: T) => U): U {
    return defaultFn()
  }

  function filter(predicateFn: (v: T) => boolean): Maybe<T> {
    return None<T>()
  }

  function and<U>(other: Maybe<U>): Maybe<U> {
    return None<U>()
  }

  function andThen<U>(fn: (v: T) => Maybe<U>): Maybe<U> {
    return None<U>()
  }

  function or(other: Maybe<T>): Maybe<T> {
    return other
  }

  function zip<U>(other: Maybe<U>): Maybe<[T, U]> {
    return None()
  }

  function zipWith<U, R>(
    other: Maybe<U>,
    fn: (value1: T, value2: U) => R,
  ): Maybe<R> {
    return None()
  }

  return {
    present,
    contains,

    expect,

    unwrap,
    unwrapOr,
    unwrapOrElse,

    map,
    mapOr,
    mapOrElse,

    filter,

    and,
    andThen,
    or,

    zip,
    zipWith,
  }
}
