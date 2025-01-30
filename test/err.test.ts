import { describe, expect, test } from "bun:test"
import { Err } from "../src/core/err.js"
import { UnwrapError } from "../src/core/errors/UnwrapError.js"
import { Ok } from "../src/core/ok.js"
import { _ } from "../src/utils/utils.js"
import { MatchError } from "../src/core/errors/MatchError.js"

const errorMessage = "Let's test some errors"
const errorMessageCapitalized = "LET'S TEST SOME ERRORS"

describe("Err", function () {
  const errString = Err<string, string>(errorMessage)

  test("Err's isOk function returns false", function () {
    expect(errString.isOk()).toBeFalsy()
  })

  test("Err's isErr function returns true", function () {
    expect(errString.isErr()).toBeTruthy()
  })

  test("Err's isOkAnd function returns false", function () {
    expect(errString.isOkAnd(() => true)).toBeFalsy()
    expect(errString.isOkAnd(() => false)).toBeFalsy()
  })

  test("Err's isErrAnd function returns result of supplied function", function () {
    const workingFn = (err: string) => err === errorMessage
    const notWorkingFn = (err: string) => err === "Let's test some OKs"
    expect(errString.isErrAnd(workingFn)).toBeTruthy()
    expect(errString.isErrAnd(notWorkingFn)).toBeFalsy()
  })

  test("Err's expect function throws an error with a custom message", function () {
    const expectedMessage = "this should fail"
    const expectedError = new UnwrapError(expectedMessage)
    expect(() => errString.expect(expectedMessage)).toThrow(expectedError)
    expect(() => errString.expect("this should fail")).toThrow(UnwrapError)
  })

  test("Err's unwrap function throws an error with a generic message", function () {
    const expectedError = new UnwrapError(
      "called `Result::unwrap()` on a `Err` value",
    )
    expect(() => errString.unwrap()).toThrow(expectedError)
    expect(() => errString.unwrap()).toThrow(UnwrapError)
  })

  test("Err's unwrapOr function returns the supplied defaultValue", function () {
    const defaultValue = "I reject your reality and substitute my own"
    expect(errString.unwrapOr(defaultValue)).toBe(defaultValue)
  })

  test("Err's unwrapOr function returns the result of the supplied defaultFunction", function () {
    const defaultMessage = "functions can be fun"
    expect(errString.unwrapOrElse(() => defaultMessage)).toBe(defaultMessage)
  })

  test("Err's map function returns self", function () {
    const value = errString.map((v: string) => v.toUpperCase())
    expect(value.isErr()).toBeTruthy()
    expect(() => value.unwrap()).toThrow(UnwrapError)
    expect(value.err().unwrap()).toBe(errorMessage)
  })

  test("Err's mapErr function returns mapped self", function () {
    const value = errString.mapErr((err: string) => err.toUpperCase())
    expect(value.isErr()).toBeTruthy()
    expect(() => value.unwrap()).toThrow(UnwrapError)
    expect(value.err().unwrap()).toBe(errorMessageCapitalized)
  })

  test("Err's mapOr function returns the default value", function () {
    const value = errString.mapOr(
      "All default values and no Oks makes jack a dull boy",
      () => "This won't get run",
    )
    expect(value).toBe("All default values and no Oks makes jack a dull boy")
  })

  test("Err's mapOrElse function returns the result of the default function", function () {
    const value = errString.mapOrElse(
      (err: string) => err.toUpperCase(),
      () => "No luck here either",
    )
    expect(value).toBe(errorMessageCapitalized)
  })

  test("Err's andThen function returns a self", function () {
    const value = errString.andThen((v: string) => Ok(v))
    expect(value.isErr()).toBeTruthy()
    expect(() => value.unwrap()).toThrow(UnwrapError)
    expect(value.err().unwrap()).toBe(errorMessage)
  })

  test("Err's orElse function returns result of the supplied function", function () {
    const value = errString.orElse((err: string) => Ok(err.toUpperCase()))
    expect(value.isOk()).toBeTruthy()
    expect(value.unwrap()).toBe(errorMessageCapitalized)
  })

  test("Err's ok function returns a None", function () {
    const expectedError = new UnwrapError(
      "called `Maybe::unwrap()` on a `None` value",
    )
    expect(errString.ok().isSome()).toBeFalsy()
    expect(() => errString.ok().unwrap()).toThrow(UnwrapError)
    expect(() => errString.ok().unwrap()).toThrow(expectedError)
  })

  test("Err's err function returns a Some with the internal value", function () {
    expect(errString.err().isSome()).toBeTruthy()
    expect(errString.err().unwrap()).toBe(errorMessage)
  })

  test("Ok's match function returns the corresponding match result", function () {
    const matchedResult = errString.match([[Err("Let's test some errors"), 3]])
    expect(matchedResult).toBe(3)

    const matchedWildcardResult = errString.match([
      [Ok("No error here"), 3],
      [_, 5],
    ])
    expect(matchedWildcardResult).toBe(5)

    const matchedMultipleArmsResult = errString.match([
      [Ok("No error here"), 1],
      [Err("Let's test some errors"), 2],
    ])
    expect(matchedMultipleArmsResult).toBe(2)

    const nonExhaustivePatternsError = new MatchError(
      "Uncaught MatchError: Non-exhaustive patterns",
    )
    expect(() => errString.match([[Ok("No error here"), 3]])).toThrow(
      nonExhaustivePatternsError,
    )
    expect(() => errString.match([[Ok("No error here"), 3]])).toThrow(
      MatchError,
    )

    const noOkValueSuppliedError = new MatchError(
      "Uncaught MatchError: Non-exhaustive patterns",
    )
    expect(() => errString.match([[Err("Unused error"), 3]])).toThrow(
      nonExhaustivePatternsError,
    )
    expect(() => errString.match([[Err("Unused error"), 3]])).toThrow(
      MatchError,
    )

    const noMatchArmsProvidedError = new MatchError(
      "Uncaught MatchError: No match arms provided",
    )
    expect(() => errString.match([])).toThrow(noMatchArmsProvidedError)
    expect(() => errString.match([])).toThrow(MatchError)
  })
})
