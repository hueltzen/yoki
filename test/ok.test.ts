import { describe, expect, test } from "bun:test"
import { Err } from "../src/core/err.js"
import { UnwrapError } from "../src/core/UnwrapError.js"
import { Ok } from "../src/core/ok.js"

const okValue = 42
const errorMessageCapitalized = "LET'S TEST SOME ERRORS"

describe("Ok", function () {
  const ok = Ok<number, string>(okValue)

  test("Ok's isOk function returns true", function () {
    expect(ok.isOk()).toBeTruthy()
  })

  test("Ok's isErr function returns false", function () {
    expect(ok.isErr()).toBeFalsy()
  })

  test("Ok's isOkAnd function returns the result of the supplied function", function () {
    expect(ok.isOkAnd(() => true)).toBeTruthy()
    expect(ok.isOkAnd(() => false)).toBeFalsy()
    expect(ok.isOkAnd((v: number) => v === okValue)).toBeTruthy()
    expect(ok.isOkAnd((v: number) => v === -1)).toBeFalsy()
  })

  test("Ok's isErrAnd function returns false", function () {
    expect(ok.isErrAnd(() => false)).toBeFalsy()
    expect(ok.isErrAnd(() => true)).toBeFalsy()
  })

  test("Err's expect function throws an error with a custom message", function () {
    expect(ok.expect("this should work")).toBe(42)
  })

  test("Ok's unwrap function returns the contained value", function () {
    expect(ok.unwrap()).toBe(okValue)
  })

  test("Ok's unwrapOr function returns the contained value", function () {
    expect(ok.unwrapOr(-1)).toBe(okValue)
  })

  test("Ok's unwrapOr function returns the contained value", function () {
    expect(ok.unwrapOrElse(() => -1)).toBe(okValue)
  })

  test("Ok's map function returns mapped self", function () {
    const value = ok.map((v: number) => v * 2)
    const expectedValue = okValue * 2
    expect(value.isOk()).toBeTruthy()
    expect(value.ok().unwrap()).toBe(expectedValue)
  })

  test("Ok's mapErr function returns self", function () {
    const value = ok.mapErr((err: string) => err.toUpperCase())
    expect(value.isOk()).toBeTruthy()
    expect(value.ok().unwrap()).toBe(42)
  })

  test("Ok's mapOr function returns the result of the supplied map function", function () {
    const value = ok.mapOr(-1, (v: number) => v * 2)
    const expectedValue = okValue * 2
    expect(value).toBe(expectedValue)
  })

  test("Ok's mapOrElse function returns the result of the supplied mapping function", function () {
    const value = ok.mapOrElse(
      () => -1,
      (v: number) => v * 2,
    )
    const expectedValue = okValue * 2
    expect(value).toBe(expectedValue)
  })

  test("Ok's andThen function returns the result of the supplied function", function () {
    const value = ok.andThen((v: number) => Ok(v * 2))
    const expectedValue = okValue * 2
    expect(value.isOk()).toBeTruthy()
    expect(value.ok().unwrap()).toBe(expectedValue)
  })

  test("Ok's orElse function returns a Some with the internal value", function () {
    const value = ok.orElse((err: string) => Ok(-1))
    expect(value.isOk()).toBeTruthy()
    expect(value.unwrap()).toBe(42)
  })

  test("Ok's ok function returns a Some with the internal value", function () {
    expect(ok.ok().present()).toBeTruthy()
    expect(ok.ok().unwrap()).toBe(okValue)
  })

  test("Ok's err function returns a None", function () {
    const expectedError = new UnwrapError(
      "called `Maybe::unwrap()` on a `None` value",
    )
    expect(ok.err().present()).toBeFalsy()
    expect(() => ok.err().unwrap()).toThrow(UnwrapError)
    expect(() => ok.err().unwrap()).toThrow(expectedError)
  })
})
