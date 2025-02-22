import type { Maybe } from "../types/maybe.js"
import type { Result } from "../types/result.ts"
import type { ResultMatchPredicate } from "../types/shared.js"
import { isResultMatchPredicateFn } from "../utils/utils.js"
import { MatchError } from "./errors/MatchError.js"
import { UnwrapError } from "./errors/UnwrapError.js"
import { None } from "./none.js"
import { Some } from "./some.js"

export function Err<T, E>(value: E): Result<T, E> {
  function isOk(): boolean {
    return false
  }
  function isErr(): boolean {
    return true
  }

  function isOkAnd(predicateFn: (v: T) => boolean): boolean {
    return false
  }
  function isErrAnd(predicateFn: (err: E) => boolean): boolean {
    return predicateFn(value)
  }

  function unwrap(): T {
    return expect("called `Result::unwrap()` on a `Err` value")
  }
  function expect(message: string): T {
    throw new UnwrapError(message)
  }

  function unwrapOr(defaultValue: T): T {
    return defaultValue
  }
  function unwrapOrElse(defaultFn: (err: E) => T): T {
    return defaultFn(value)
  }

  function map<U>(fn: (v: T) => U): Result<U, E> {
    return Err<U, E>(value)
  }
  function mapErr<F>(fn: (err: E) => F): Result<T, F> {
    return Err(fn(value))
  }
  function mapOr<U>(defaultValue: U, fn: (v: T) => U): U {
    return defaultValue
  }
  function mapOrElse<U>(defaultFn: (err: E) => U, fn: (v: T) => U): U {
    return defaultFn(value)
  }

  function andThen<U>(fn: (v: T) => Result<U, E>): Result<U, E> {
    return Err<U, E>(value)
  }
  function orElse<F>(fn: (err: E) => Result<T, F>): Result<T, F> {
    return fn(value)
  }

  function ok(): Maybe<T> {
    return None<T>()
  }

  function err(): Maybe<E> {
    return Some<E>(value)
  }

  function match<U>(args: [ResultMatchPredicate<T, U, E>, U][]): U {
    if (args !== undefined && args.length > 0) {
      const result: [ResultMatchPredicate<T, U, E>, U] | undefined = args.find(
        ([predicate, _]: [ResultMatchPredicate<T, U, E>, U]): boolean => {
          if (isResultMatchPredicateFn(predicate)) {
            return predicate(value)
          }

          if (predicate.isErr()) {
            return predicate.err().contains(value)
          }

          return false
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
    isOk,
    isErr,

    isOkAnd,
    isErrAnd,

    unwrap,
    expect,

    unwrapOr,
    unwrapOrElse,

    map,
    mapErr,
    mapOr,
    mapOrElse,

    andThen,
    orElse,

    ok,
    err,

    match,
  }
}
