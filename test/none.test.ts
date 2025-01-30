import { describe, expect, test } from "bun:test"
import type { Maybe } from "../src/types/maybe.js"
import { None } from "../src/core/none.js"
import { Some } from "../src/core/some.js"
import { UnwrapError } from "../src/core/errors/UnwrapError.js"
import { _ } from "../src/utils/utils.js"
import { MatchError } from "../src/core/errors/MatchError.js"

describe("None", function () {
  const noneString: Maybe<string> = None<string>()
  const noneNumber: Maybe<number> = None<number>()

  test("None's present function returns false", function () {
    expect(noneString.isSome()).toBe(false)
  })
  test("None's contains function returns false", function () {
    expect(noneString.contains("not matching")).toBe(false)
  })

  test("None's expect function throws an error with a custom message", function () {
    const errorMessage = "this should fail"
    const expectedError = new UnwrapError(errorMessage)
    expect(() => noneString.expect(errorMessage)).toThrow(expectedError)
    expect(() => noneString.expect(errorMessage)).toThrow(UnwrapError)
  })

  test("None's unwrap function throws an error with a generic message", function () {
    const expectedError = new UnwrapError(
      "called `Maybe::unwrap()` on a `None` value",
    )
    expect(() => noneString.unwrap()).toThrow(expectedError)
    expect(() => noneString.unwrap()).toThrow(UnwrapError)
  })
  test("None's unwrapOr function returns the supplied default value", function () {
    const expectedValue = "this is the default"
    expect(noneString.unwrapOr(expectedValue)).toEqual(expectedValue)
  })
  test("None's unwrapOrElse function returns the result of the supplied default function", function () {
    const expectedValue = "this is the default function result"
    expect(noneString.unwrapOrElse(() => expectedValue)).toEqual(expectedValue)
  })

  test("None's map function returns a None", function () {
    expect(noneNumber.map<number>((v) => v * 2).isSome()).toBe(false)
  })
  test("None's mapOr function returns the supplied default value", function () {
    expect(noneNumber.mapOr<number>(24, (v) => v * 2)).toBe(24)
  })
  test("None's mapOrElse function returns the result of the supplied default function", function () {
    const value = noneNumber.mapOrElse<number>(
      () => 24,
      (v) => v * 2,
    )
    expect(value).toBe(24)
  })

  test("None's filter function returns a None", function () {
    const value = noneNumber.filter((v) => v % 2 > 0)
    expect(value.isSome()).toBe(false)
  })

  test("None's and function returns a None", function () {
    const noneAndNone = noneNumber.and<number>(None<number>())
    const noneAndSome = noneNumber.and<number>(Some<number>(24))
    expect(noneAndNone.isSome()).toBe(false)
    expect(noneAndSome.isSome()).toBe(false)
  })
  test("None's andThen function returns a None", function () {
    const value = noneNumber.andThen<number>((v) => Some(v * 2))
    expect(value.isSome()).toBe(false)
  })
  test("None's or function returns the supplied other value", function () {
    const noneOrNone = noneNumber.or(None<number>())
    const noneOrSome = noneNumber.or(Some<number>(24))
    expect(noneOrNone.isSome()).toBe(false)
    expect(noneOrSome.unwrap()).toBe(24)
  })

  test("None's zip function returns a None", function () {
    const noneZipNone = noneNumber.zip(None<number>())
    const noneZipSome = noneNumber.zip(Some<number>(24))
    expect(noneZipNone.isSome()).toBe(false)
    expect(noneZipSome.isSome()).toBe(false)
  })

  test("None's zipWith function returns a None", function () {
    const value = noneNumber.zipWith(None<number>(), (value1, value2) => ({
      value1,
      value2,
    }))
    expect(value.isSome()).toBe(false)
  })

  test("None's match function returns the corresponding match result", function () {
    const matchedResult = noneNumber.match([[None(), 3]])
    expect(matchedResult).toBe(3)

    const matchedWildcardResult = noneNumber.match([
      [Some(-1), 3],
      [_, 5],
    ])
    expect(matchedWildcardResult).toBe(5)

    const matchedMultipleArmsResult = noneNumber.match([
      [Some(23), 1],
      [None(), 2],
    ])
    expect(matchedMultipleArmsResult).toBe(2)

    const nonExhaustivePatternsError = new MatchError(
      "Uncaught MatchError: Non-exhaustive patterns",
    )
    expect(() => noneNumber.match([[Some(23), 3]])).toThrow(
      nonExhaustivePatternsError,
    )
    expect(() => noneNumber.match([[Some(23), 3]])).toThrow(MatchError)

    const noMatchArmsProvidedError = new MatchError(
      "Uncaught MatchError: No match arms provided",
    )
    expect(() => noneNumber.match([])).toThrow(noMatchArmsProvidedError)
    expect(() => noneNumber.match([])).toThrow(MatchError)
  })
})
