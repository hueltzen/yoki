import { describe, expect, test } from "bun:test"
import type { Maybe } from "../src/types/maybe.js"
import { None } from "../src/core/none.js"
import { Some } from "../src/core/some.js"
import { UnwrapError } from "../src/core/UnwrapError.js"

describe("None", function () {
  const noneString: Maybe<string> = None<string>()
  const noneNumber: Maybe<number> = None<number>()

  test("None's present function returns false", function () {
    expect(noneString.present()).toBe(false)
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
    expect(noneNumber.map<number>((v) => v * 2).present()).toBe(false)
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
    expect(value.present()).toBe(false)
  })

  test("None's and function returns a None", function () {
    const noneAndNone = noneNumber.and<number>(None<number>())
    const noneAndSome = noneNumber.and<number>(Some<number>(24))
    expect(noneAndNone.present()).toBe(false)
    expect(noneAndSome.present()).toBe(false)
  })
  test("None's andThen function returns a None", function () {
    const value = noneNumber.andThen<number>((v) => Some(v * 2))
    expect(value.present()).toBe(false)
  })
  test("None's or function returns the supplied other value", function () {
    const noneOrNone = noneNumber.or(None<number>())
    const noneOrSome = noneNumber.or(Some<number>(24))
    expect(noneOrNone.present()).toBe(false)
    expect(noneOrSome.unwrap()).toBe(24)
  })

  test("None's zip function returns a None", function () {
    const noneZipNone = noneNumber.zip(None<number>())
    const noneZipSome = noneNumber.zip(Some<number>(24))
    expect(noneZipNone.present()).toBe(false)
    expect(noneZipSome.present()).toBe(false)
  })

  test("None's zipWith function returns a None", function () {
    const value = noneNumber.zipWith(None<number>(), (value1, value2) => ({
      value1,
      value2,
    }))
    expect(value.present()).toBe(false)
  })
})
