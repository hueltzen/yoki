import type { Maybe } from "../types/maybe.js"
import type { Result } from "../types/result.js"
import { Some } from "./some.js"
import { None } from "./none.js"
import type { ResultMatchPredicate } from "../types/shared.js"
import {
  isMaybeMatchPredicateFn,
  isResultMatchPredicateFn,
} from "../utils/utils.js"
import { MatchError } from "./errors/MatchError.js"

export function Ok<T, E>(value: T): Result<T, E> {
  function isOk(): boolean {
    return true
  }
  function isErr(): boolean {
    return false
  }

  function isOkAnd(predicateFn: (v: T) => boolean): boolean {
    return predicateFn(value)
  }
  function isErrAnd(predicateFn: (err: E) => boolean): boolean {
    return false
  }

  function unwrap(): T {
    return value
  }
  function expect(message: string): T {
    return value
  }

  function unwrapOr(defaultValue: T): T {
    return value
  }
  function unwrapOrElse(defaultFn: (err: E) => T): T {
    return value
  }

  function map<U>(fn: (v: T) => U): Result<U, E> {
    return Ok<U, E>(fn(value))
  }
  function mapErr<F>(fn: (err: E) => F): Result<T, F> {
    return Ok<T, F>(value)
  }
  function mapOr<U>(defaultValue: U, fn: (v: T) => U): U {
    return fn(value)
  }
  function mapOrElse<U>(defaultFn: (err: E) => U, fn: (v: T) => U): U {
    return fn(value)
  }

  function andThen<U>(fn: (v: T) => Result<U, E>): Result<U, E> {
    return fn(value)
  }
  function orElse<F>(fn: (err: E) => Result<T, F>): Result<T, F> {
    return Ok(value)
  }

  function ok(): Maybe<T> {
    return Some<T>(value)
  }
  function err(): Maybe<E> {
    return None<E>()
  }

  function match<U>(args: [ResultMatchPredicate<T, U, E>, U][]): U {
    if (args !== undefined && args.length > 0) {
      const result: [ResultMatchPredicate<T, U, E>, U] | undefined = args.find(
        ([predicate, _]: [ResultMatchPredicate<T, U, E>, U]): boolean => {
          if (isResultMatchPredicateFn(predicate)) {
            return predicate(value)
          }

          if (predicate.isOk()) {
            return predicate.ok().contains(value)
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
