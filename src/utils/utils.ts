import { MatchError } from "../core/errors/MatchError.js"
import type { Maybe } from "../types/maybe.js"
import type { Result } from "../types/result.js"
import type {
  MaybeMatchPredicate,
  MaybeMatchPredicateFn,
  MaybeMatchPredicateVal,
  ResultMatchPredicate,
  ResultMatchPredicateFn,
} from "../types/shared.js"

/**
 * Returns true if the supplied argument is a {@link MaybeMatchPredicateFn<T>};
 * false otherwise.
 *
 * @param {MaybeMatchPredicate<T, U>} arg - The argument to be tested
 */
export function isMaybeMatchPredicateFn<T, U>(
  arg: MaybeMatchPredicate<T, U>,
): arg is MaybeMatchPredicateFn<T> {
  return (
    typeof arg === "function" &&
    !Object.hasOwn(arg, "isSome") &&
    !Object.hasOwn(arg, "isOk")
  )
}

/**
 * Returns true if the supplied argument is a {@link ResultMatchPredicateFn<T>};
 * false otherwise.
 *
 * @param {ResultMatchPredicate<T, U, E>} arg - The argument to be tested
 */
export function isResultMatchPredicateFn<T, U, E>(
  arg: ResultMatchPredicate<T, U, E>,
): arg is ResultMatchPredicateFn<T, E> {
  return (
    typeof arg === "function" &&
    !Object.hasOwn(arg, "isSome") &&
    !Object.hasOwn(arg, "isOk")
  )
}

/**
 * A wildcard function that always returns true.
 *
 * @returns true
 */
export const _: () => true = function (): true {
  return true
}
