import { describe, expect, test } from "bun:test"
import { Err } from "../src/core/err.js"
import { UnwrapError } from "../src/core/errors/UnwrapError.js"
import { Ok } from "../src/core/ok.js"
import { _ } from "../src/utils/utils.js"
import { MatchError } from "../src/core/errors/MatchError.js"

const okValue = 42
const errorMessageCapitalized = "LET'S TEST SOME ERRORS"

describe("Ok", function () {
  const okNumber = Ok<number, string>(okValue)

  test("Ok's isOk function returns true", function () {
    expect(okNumber.isOk()).toBeTruthy()
  })

  test("Ok's isErr function returns false", function () {
    expect(okNumber.isErr()).toBeFalsy()
  })

  test("Ok's isOkAnd function returns the result of the supplied function", function () {
    expect(okNumber.isOkAnd(() => true)).toBeTruthy()
    expect(okNumber.isOkAnd(() => false)).toBeFalsy()
    expect(okNumber.isOkAnd((v: number) => v === okValue)).toBeTruthy()
    expect(okNumber.isOkAnd((v: number) => v === -1)).toBeFalsy()
  })

  test("Ok's isErrAnd function returns false", function () {
    expect(okNumber.isErrAnd(() => false)).toBeFalsy()
    expect(okNumber.isErrAnd(() => true)).toBeFalsy()
  })

  test("Err's expect function throws an error with a custom message", function () {
    expect(okNumber.expect("this should work")).toBe(42)
  })

  test("Ok's unwrap function returns the contained value", function () {
    expect(okNumber.unwrap()).toBe(okValue)
  })

  test("Ok's unwrapOr function returns the contained value", function () {
    expect(okNumber.unwrapOr(-1)).toBe(okValue)
  })

  test("Ok's unwrapOr function returns the contained value", function () {
    expect(okNumber.unwrapOrElse(() => -1)).toBe(okValue)
  })

  test("Ok's map function returns mapped self", function () {
    const value = okNumber.map((v: number) => v * 2)
    const expectedValue = okValue * 2
    expect(value.isOk()).toBeTruthy()
    expect(value.ok().unwrap()).toBe(expectedValue)
  })

  test("Ok's mapErr function returns self", function () {
    const value = okNumber.mapErr((err: string) => err.toUpperCase())
    expect(value.isOk()).toBeTruthy()
    expect(value.ok().unwrap()).toBe(42)
  })

  test("Ok's mapOr function returns the result of the supplied map function", function () {
    const value = okNumber.mapOr(-1, (v: number) => v * 2)
    const expectedValue = okValue * 2
    expect(value).toBe(expectedValue)
  })

  test("Ok's mapOrElse function returns the result of the supplied mapping function", function () {
    const value = okNumber.mapOrElse(
      () => -1,
      (v: number) => v * 2,
    )
    const expectedValue = okValue * 2
    expect(value).toBe(expectedValue)
  })

  test("Ok's andThen function returns the result of the supplied function", function () {
    const value = okNumber.andThen((v: number) => Ok(v * 2))
    const expectedValue = okValue * 2
    expect(value.isOk()).toBeTruthy()
    expect(value.ok().unwrap()).toBe(expectedValue)
  })

  test("Ok's orElse function returns a Some with the internal value", function () {
    const value = okNumber.orElse((err: string) => Ok(-1))
    expect(value.isOk()).toBeTruthy()
    expect(value.unwrap()).toBe(42)
  })

  test("Ok's ok function returns a Some with the internal value", function () {
    expect(okNumber.ok().isSome()).toBeTruthy()
    expect(okNumber.ok().unwrap()).toBe(okValue)
  })

  test("Ok's err function returns a None", function () {
    const expectedError = new UnwrapError(
      "called `Maybe::unwrap()` on a `None` value",
    )
    expect(okNumber.err().isSome()).toBeFalsy()
    expect(() => okNumber.err().unwrap()).toThrow(UnwrapError)
    expect(() => okNumber.err().unwrap()).toThrow(expectedError)
  })

  test("Ok's match function returns the corresponding match result", function () {
    const matchedResult = okNumber.match([[Ok(42), 3]])
    expect(matchedResult).toBe(3)

    const matchedWildcardResult = okNumber.match([
      [Ok(-1), 3],
      [_, 5],
    ])
    expect(matchedWildcardResult).toBe(5)

    const matchedMultipleArmsResult = okNumber.match([
      [Ok(41), 1],
      [Ok(42), 2],
    ])
    expect(matchedMultipleArmsResult).toBe(2)

    const nonExhaustivePatternsError = new MatchError(
      "Uncaught MatchError: Non-exhaustive patterns",
    )
    expect(() => okNumber.match([[Ok(23), 3]])).toThrow(
      nonExhaustivePatternsError,
    )
    expect(() => okNumber.match([[Ok(23), 3]])).toThrow(MatchError)

    const noOkValueSuppliedError = new MatchError(
      "Uncaught MatchError: Non-exhaustive patterns",
    )
    expect(() => okNumber.match([[Err("Unused error"), 3]])).toThrow(
      nonExhaustivePatternsError,
    )
    expect(() => okNumber.match([[Err("Unused error"), 3]])).toThrow(MatchError)

    const noMatchArmsProvidedError = new MatchError(
      "Uncaught MatchError: No match arms provided",
    )
    expect(() => okNumber.match([])).toThrow(noMatchArmsProvidedError)
    expect(() => okNumber.match([])).toThrow(MatchError)
  })
})
