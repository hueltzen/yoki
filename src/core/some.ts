import type { Maybe } from "../types/maybe.js"
import type { MaybeMatchPredicate } from "../types/shared.js"
import { isMaybeMatchPredicateFn } from "../utils/utils.js"
import { MatchError } from "./errors/MatchError.js"
import { None } from "./none.js"

export function Some<T>(value: T): Maybe<T> {
  function isSome(): boolean {
    return true
  }

  function contains(item: T): boolean {
    return item === value
  }

  function expect(message: string): T {
    return value
  }

  function unwrap(): T {
    return value
  }

  function unwrapOr(defaultValue: T): T {
    return value
  }

  function unwrapOrElse(defaultFn: () => T): T {
    return value
  }

  function map<U>(fn: (v: T) => U): Maybe<U> {
    return Some(fn(value))
  }

  function mapOr<U>(defaultValue: U, fn: (v: T) => U): U {
    return fn(value)
  }

  function mapOrElse<U>(defaultFn: () => U, fn: (v: T) => U): U {
    return fn(value)
  }

  function filter(predicateFn: (v: T) => boolean): Maybe<T> {
    if (predicateFn(value)) {
      return Some(value)
    }

    return None()
  }

  function and<U>(other: Maybe<U>): Maybe<U> {
    if (other.isSome()) {
      return other
    }

    return None()
  }

  function andThen<U>(fn: (v: T) => Maybe<U>): Maybe<U> {
    return fn(value)
  }

  function or(other: Maybe<T>): Maybe<T> {
    return Some(value)
  }

  function zip<U>(other: Maybe<U>): Maybe<[T, U]> {
    return other.map((otherValue) => [value, otherValue])
  }

  function zipWith<U, R>(
    other: Maybe<U>,
    fn: (value1: T, value2: U) => R,
  ): Maybe<R> {
    return zip(other).map(([value1, value2]) => fn(value1, value2))
  }

  function match<U>(args: [MaybeMatchPredicate<T, U>, U][]): U {
    if (args !== undefined && args.length > 0) {
      const result: [MaybeMatchPredicate<T, U>, U] | undefined = args.find(
        ([predicate, _]: [MaybeMatchPredicate<T, U>, U]): boolean => {
          if (isMaybeMatchPredicateFn(predicate)) {
            return predicate(value)
          }

          return predicate.contains(value)
        },
      )

      if (!result) {
        throw new MatchError("Uncaught MatchError: Non-exhaustive patterns")
      }

      return result[1]
    }

    throw new MatchError("Uncaught MatchError: No match arms provided")
  }

  return {
    isSome,
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

    match,
  }
}
