import { describe, expect, test } from "bun:test"
import type { Maybe } from "../src/types/maybe.js"
import { None } from "../src/core/none.js"
import { Some } from "../src/core/some.js"
import { UnwrapError } from "../src/core/UnwrapError.js"

const someStringValue = "Here's Johnny"
const someNumberValue = 24

describe("Some", function () {
  const someString: Maybe<string> = Some<string>(someStringValue)
  const someNumber: Maybe<number> = Some<number>(someNumberValue)

  test("Some's present function returns true", function () {
    expect(someString.present()).toBe(true)
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
    expect(value.present()).toBe(true)
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

    expect(filteredShorterThan10.present()).toBe(false)
    expect(filteredLongerThan10.present()).toBe(true)
    expect(filteredLongerThan10.unwrap()).toBe(someStringValue)
    expect(filteredOdd.present()).toBe(false)
    expect(filteredEven.present()).toBe(true)
    expect(filteredEven.unwrap()).toBe(someNumberValue)
  })

  test("Some's and function returns the other Value if both are Some; or a None otherwise", function () {
    const someAndNone = someNumber.and<number>(None<number>())
    const someAndSome = someNumber.and<number>(Some<number>(48))
    expect(someAndNone.present()).toBe(false)
    expect(someAndSome.present()).toBe(true)
    expect(someAndSome.unwrap()).toBe(48)
  })

  test("Some's andThen function returns the result of the function", function () {
    const someLength = someString.andThen<number>((v) => Some(v.length))
    const someDoubled = someNumber.andThen<number>((v) => Some(v * 2))
    const expectedValue = someNumberValue * 2
    expect(someLength.present()).toBe(true)
    expect(someLength.unwrap()).toBe(13)
    expect(someDoubled.present()).toBe(true)
    expect(someDoubled.unwrap()).toBe(expectedValue)
  })

  test("Some's or function returns the contained value", function () {
    const someOrSome = someNumber.or(Some<number>(48))
    const someOrNone = someNumber.or(None<number>())
    expect(someOrSome.present()).toBe(true)
    expect(someOrSome.unwrap()).toBe(someNumberValue)
    expect(someOrNone.present()).toBe(true)
    expect(someOrNone.unwrap()).toBe(someNumberValue)
  })

  test("Some's zip function returns the contained value zipped with the contained value of the supplied Maybe if Some; or a None otherwise", function () {
    const someZipNone = someNumber.zip(None<number>())
    const someZipSome = someNumber.zip(Some<number>(48))
    expect(someZipNone.present()).toBe(false)
    expect(someZipSome.present()).toBe(true)
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
    expect(someZipWithNone.present()).toBe(false)
    expect(someZipWithSome.present()).toBe(true)
    expect(someZipWithSome.unwrap()).toEqual({ value1: 24, value2: 48 })
  })
})
