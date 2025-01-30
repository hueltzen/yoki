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

/**
 * Returns a function that accepts a number value and returns true if that value
 * is within the range of the supplied lowerLimit and upperLimit.
 *
 * @param lowerLimit - The lower limit of the range
 * @param upperLimit - The upper limit of the range
 * @param inclusive - An array taking two booleans; the first determines if the
 * lower limit should be inclusive (meaning mathing on <= instead of <; if set
 * to true), the first determines if the upper limit should be inclusive.
 *
 * @returns A function taking in a number value and returning true if that
 * value is in the supplied range
 */
export function range(
  lowerLimit: number,
  upperLimit: number,
  [lowerInclusive, upperInclusive] = [true, true],
): (value?: number) => boolean {
  return function (value?: number): boolean {
    if (value !== undefined) {
      const matchesLowerLimit = lowerInclusive
        ? lowerLimit <= value
        : lowerLimit < value
      const matchesUpperLimit = upperInclusive
        ? upperLimit >= value
        : upperLimit > value

      return matchesLowerLimit && matchesUpperLimit
    }

    return false
  }
}

/**
 * Returns a function that accepts a value of type T and returns true if that
 * value is included in the supplied values array.
 *
 * @param values - The accepted values
 *
 * @returns A function taking in a value of type T and returning true if that
 * value is in the supplied array
 */
export function any<T>(values: T[]): (value?: T) => boolean {
  return function (value?: T): boolean {
    if (value !== undefined) {
      return values.includes(value)
    }

    return false
  }
}
