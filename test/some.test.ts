import { describe, expect, test } from "bun:test"
import type { Maybe } from "../src/types/maybe.js"
import { None } from "../src/core/none.js"
import { Some } from "../src/core/some.js"
import { UnwrapError } from "../src/core/errors/UnwrapError.js"
import { _, any, range } from "../src/utils/utils.js"
import { MatchError } from "../src/core/errors/MatchError.js"
import { Ok } from "../src/core/ok.js"

const someStringValue = "Here's Johnny"
const someNumberValue = 24

describe("Some", function () {
  const someString: Maybe<string> = Some<string>(someStringValue)
  const someNumber: Maybe<number> = Some<number>(someNumberValue)

  test("Some's isSome function returns true", function () {
    expect(someString.isSome()).toBe(true)
  })

  test("Some's contains function returns wheather or not it contains the supplied string", function () {
    expect(someString.contains("Here's Johnny")).toBe(true)
    expect(someString.contains("not matching")).toBe(false)
  })

  test("Some's expect function returns the contained value", function () {
    expect(someString.expect("this should be fine")).toBe(someStringValue)
    expect(someNumber.expect("this should be fine")).toBe(someNumberValue)
  })

  test("Some's unwrap function return the contained value", function () {
    expect(someString.unwrap()).toBe(someStringValue)
    expect(someNumber.unwrap()).toBe(someNumberValue)
  })

  test("Some's unwrapOr function returns the contained value", function () {
    expect(someString.unwrapOr("should not be necessary")).toBe(someStringValue)
    expect(someNumber.unwrapOr(12)).toBe(someNumberValue)
  })

  test("Some's unwrapOrElse function returns the contained value", function () {
    expect(someString.unwrapOrElse(() => "should not be necessary")).toBe(
      someStringValue,
    )
    expect(someNumber.unwrapOrElse(() => 12)).toBe(someNumberValue)
  })

  test("Some's map function returns the mapped value", function () {
    const value = someNumber.map<number>((v) => v * 2)
    const expectedValue = someNumberValue * 2
    expect(value.isSome()).toBe(true)
    expect(value.unwrap()).toBe(expectedValue)
  })

  test("Some's mapOr function returns the mapped value", function () {
    const stringLength = someString.mapOr<number>(-1, (v) => v.length)
    const numberValue = someNumber.mapOr<number>(0, (v) => v * 2)
    const expectedValue = someNumberValue * 2
    expect(stringLength).toBe(13)
    expect(numberValue).toBe(expectedValue)
  })

  test("Some's mapOrElse function returns the mapped value", function () {
    const stringIndex = someString.mapOrElse<number>(
      () => -1,
      (v) => v.indexOf("J"),
    )
    const numberValue = someNumber.mapOrElse<number>(
      () => 0,
      (v) => v * 3,
    )
    const expectedValue = someNumberValue * 3
    expect(stringIndex).toBe(7)
    expect(numberValue).toBe(expectedValue)
  })

  test("Some's filter function returns a Some with the contained value if the predicate function returns true; or a None otherwise", function () {
    const filteredShorterThan10 = someString.filter((v) => v.length < 10)
    const filteredLongerThan10 = someString.filter((v) => v.length > 10)

    const filteredOdd = someNumber.filter((v) => v % 2 > 0)
    const filteredEven = someNumber.filter((v) => v % 2 === 0)

    expect(filteredShorterThan10.isSome()).toBe(false)
    expect(filteredLongerThan10.isSome()).toBe(true)
    expect(filteredLongerThan10.unwrap()).toBe(someStringValue)
    expect(filteredOdd.isSome()).toBe(false)
    expect(filteredEven.isSome()).toBe(true)
    expect(filteredEven.unwrap()).toBe(someNumberValue)
  })

  test("Some's and function returns the other Value if both are Some; or a None otherwise", function () {
    const someAndNone = someNumber.and<number>(None<number>())
    const someAndSome = someNumber.and<number>(Some<number>(48))
    expect(someAndNone.isSome()).toBe(false)
    expect(someAndSome.isSome()).toBe(true)
    expect(someAndSome.unwrap()).toBe(48)
  })

  test("Some's andThen function returns the result of the function", function () {
    const someLength = someString.andThen<number>((v) => Some(v.length))
    const someDoubled = someNumber.andThen<number>((v) => Some(v * 2))
    const expectedValue = someNumberValue * 2
    expect(someLength.isSome()).toBe(true)
    expect(someLength.unwrap()).toBe(13)
    expect(someDoubled.isSome()).toBe(true)
    expect(someDoubled.unwrap()).toBe(expectedValue)
  })

  test("Some's or function returns the contained value", function () {
    const someOrSome = someNumber.or(Some<number>(48))
    const someOrNone = someNumber.or(None<number>())
    expect(someOrSome.isSome()).toBe(true)
    expect(someOrSome.unwrap()).toBe(someNumberValue)
    expect(someOrNone.isSome()).toBe(true)
    expect(someOrNone.unwrap()).toBe(someNumberValue)
  })

  test("Some's zip function returns the contained value zipped with the contained value of the supplied Maybe if Some; or a None otherwise", function () {
    const someZipNone = someNumber.zip(None<number>())
    const someZipSome = someNumber.zip(Some<number>(48))
    expect(someZipNone.isSome()).toBe(false)
    expect(someZipSome.isSome()).toBe(true)
    expect(someZipSome.unwrap()).toEqual([24, 48])
  })

  test("Some's zipWith function returns a Maybe with the result of the function if the supplied Maybe is a Some; or a None otherwise", function () {
    const someZipWithNone = someNumber.zipWith(
      None<number>(),
      (value1, value2) => ({ value1, value2 }),
    )
    const someZipWithSome = someNumber.zipWith(
      Some<number>(48),
      (value1, value2) => ({ value1, value2 }),
    )
    expect(someZipWithNone.isSome()).toBe(false)
    expect(someZipWithSome.isSome()).toBe(true)
    expect(someZipWithSome.unwrap()).toEqual({ value1: 24, value2: 48 })
  })

  test("Some's match function returns the corresponding match result", function () {
    const matchedResult = someNumber.match([[Some(24), 3]])
    expect(matchedResult).toBe(3)

    const matchedWildcardResult = someNumber.match([
      [Some(-1), 3],
      [_, 5],
    ])
    expect(matchedWildcardResult).toBe(5)

    const matchedMultipleArmsResult = someNumber.match([
      [Some(23), 1],
      [Some(24), 2],
    ])
    expect(matchedMultipleArmsResult).toBe(2)

    const matchedRangeResult = someNumber.match([[range(20, 25), 4]])
    expect(matchedRangeResult).toBe(4)

    const matchedAnyResult = someNumber.match([[any([20, 24, 25]), 7]])
    expect(matchedAnyResult).toBe(7)

    const nonExhaustivePatternsError = new MatchError(
      "Uncaught MatchError: Non-exhaustive patterns",
    )
    expect(() => someNumber.match([[Some(23), 3]])).toThrow(
      nonExhaustivePatternsError,
    )
    expect(() => someNumber.match([[Some(23), 3]])).toThrow(MatchError)

    const noMatchArmsProvidedError = new MatchError(
      "Uncaught MatchError: No match arms provided",
    )
    expect(() => someNumber.match([])).toThrow(noMatchArmsProvidedError)
    expect(() => someNumber.match([])).toThrow(MatchError)
  })
})
