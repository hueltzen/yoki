import { describe, expect, test } from "bun:test"
import { Err } from "../src/core/err.js"
import { UnwrapError } from "../src/core/UnwrapError.js"
import { Ok } from "../src/core/ok.js"

const errorMessage = "Let's test some errors"
const errorMessageCapitalized = "LET'S TEST SOME ERRORS"

describe("Err", function () {
  const error = Err<string, string>(errorMessage)

  test("Err's isOk function returns false", function () {
    expect(error.isOk()).toBeFalsy()
  })

  test("Err's isErr function returns true", function () {
    expect(error.isErr()).toBeTruthy()
  })

  test("Err's isOkAnd function returns false", function () {
    expect(error.isOkAnd(() => true)).toBeFalsy()
    expect(error.isOkAnd(() => false)).toBeFalsy()
  })

  test("Err's isErrAnd function returns result of supplied function", function () {
    const workingFn = (err: string) => err === errorMessage
    const notWorkingFn = (err: string) => err === "Let's test some OKs"
    expect(error.isErrAnd(workingFn)).toBeTruthy()
    expect(error.isErrAnd(notWorkingFn)).toBeFalsy()
  })

  test("Err's expect function throws an error with a custom message", function () {
    const expectedMessage = "this should fail"
    const expectedError = new UnwrapError(expectedMessage)
    expect(() => error.expect(expectedMessage)).toThrow(expectedError)
    expect(() => error.expect("this should fail")).toThrow(UnwrapError)
  })

  test("Err's unwrap function throws an error with a generic message", function () {
    const expectedError = new UnwrapError(
      "called `Result::unwrap()` on a `Err` value",
    )
    expect(() => error.unwrap()).toThrow(expectedError)
    expect(() => error.unwrap()).toThrow(UnwrapError)
  })

  test("Err's unwrapOr function returns the supplied defaultValue", function () {
    const defaultValue = "I reject your reality and substitute my own"
    expect(error.unwrapOr(defaultValue)).toBe(defaultValue)
  })

  test("Err's unwrapOr function returns the result of the supplied defaultFunction", function () {
    const defaultMessage = "functions can be fun"
    expect(error.unwrapOrElse(() => defaultMessage)).toBe(defaultMessage)
  })

  test("Err's map function returns self", function () {
    const value = error.map((v: string) => v.toUpperCase())
    expect(value.isErr()).toBeTruthy()
    expect(() => value.unwrap()).toThrow(UnwrapError)
    expect(value.err().unwrap()).toBe(errorMessage)
  })

  test("Err's mapErr function returns mapped self", function () {
    const value = error.mapErr((err: string) => err.toUpperCase())
    expect(value.isErr()).toBeTruthy()
    expect(() => value.unwrap()).toThrow(UnwrapError)
    expect(value.err().unwrap()).toBe(errorMessageCapitalized)
  })

  test("Err's mapOr function returns the default value", function () {
    const value = error.mapOr(
      "All default values and no Oks makes jack a dull boy",
      () => "This won't get run",
    )
    expect(value).toBe("All default values and no Oks makes jack a dull boy")
  })

  test("Err's mapOrElse function returns the result of the default function", function () {
    const value = error.mapOrElse(
      (err: string) => err.toUpperCase(),
      () => "No luck here either",
    )
    expect(value).toBe(errorMessageCapitalized)
  })

  test("Err's andThen function returns a self", function () {
    const value = error.andThen((v: string) => Ok(v))
    expect(value.isErr()).toBeTruthy()
    expect(() => value.unwrap()).toThrow(UnwrapError)
    expect(value.err().unwrap()).toBe(errorMessage)
  })

  test("Err's orElse function returns result of the supplied function", function () {
    const value = error.orElse((err: string) => Ok(err.toUpperCase()))
    expect(value.isOk()).toBeTruthy()
    expect(value.unwrap()).toBe(errorMessageCapitalized)
  })

  test("Err's ok function returns a None", function () {
    const expectedError = new UnwrapError(
      "called `Maybe::unwrap()` on a `None` value",
    )
    expect(error.ok().present()).toBeFalsy()
    expect(() => error.ok().unwrap()).toThrow(UnwrapError)
    expect(() => error.ok().unwrap()).toThrow(expectedError)
  })

  test("Err's err function returns a Some with the internal value", function () {
    expect(error.err().present()).toBeTruthy()
    expect(error.err().unwrap()).toBe(errorMessage)
  })
})
