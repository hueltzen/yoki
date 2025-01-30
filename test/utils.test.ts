import { describe, expect, test } from "bun:test"
import { Maybe } from "../src/types/maybe"
import { Some } from "../src/core/some"
import {
  _,
  any,
  isMaybeMatchPredicateFn,
  isResultMatchPredicateFn,
  range,
} from "../src/utils/utils"
import { None } from "../src/core/none"
import { MatchError } from "../src/core/errors/MatchError"
import { Err } from "../src/core/err"
import { Ok } from "../src/core/ok"

const someStringValue = "Here's Johnny"
const someNumberValue = 24
const okValue = 42
const errorMessage = "Let's test some errors"

describe("utils", function () {
  test("isMaybeMatchPredicateFn returns true if passed a MaybeMatchPredicateFn; false otherwise", function () {
    expect(isMaybeMatchPredicateFn(Some(24))).toBeFalsy()
    expect(isMaybeMatchPredicateFn(None())).toBeFalsy()
    expect(
      isMaybeMatchPredicateFn<number, number>((value) => true),
    ).toBeTruthy()
    expect(
      isMaybeMatchPredicateFn<number, number>((value) => false),
    ).toBeTruthy()
  })

  test("isResultMatchPredicateFn returns true if passed a ResultMatchPredicateFn; false otherwise", function () {
    expect(isResultMatchPredicateFn(Ok(24))).toBeFalsy()
    expect(
      isResultMatchPredicateFn<number, number, string>((value) => true),
    ).toBeTruthy()
    expect(
      isResultMatchPredicateFn<number, number, string>((value) => false),
    ).toBeTruthy()
  })

  test("Wildcard function (_) always returns true", function () {
    expect(_()).toBeTruthy()
  })

  test("range function returns true if supplied value is within a certain range", function () {
    const rangeFnInclusive = range(0, 10)
    const rangeFnExclusive = range(0, 10, [false, false])
    const rangeFnLowerExclusive = range(0, 10, [false, true])
    const rangeFnUpperExclusive = range(0, 10, [true, false])

    expect(rangeFnInclusive(5)).toBeTrue()
    expect(rangeFnInclusive(0)).toBeTrue()
    expect(rangeFnInclusive(10)).toBeTrue()

    expect(rangeFnExclusive(5)).toBeTrue()
    expect(rangeFnExclusive(0)).toBeFalse()
    expect(rangeFnExclusive(10)).toBeFalse()
    expect(rangeFnInclusive(1)).toBeTrue()
    expect(rangeFnInclusive(9)).toBeTrue()

    expect(rangeFnLowerExclusive(5)).toBeTrue()
    expect(rangeFnLowerExclusive(0)).toBeFalse()
    expect(rangeFnLowerExclusive(10)).toBeTrue()
    expect(rangeFnLowerExclusive(1)).toBeTrue()

    expect(rangeFnUpperExclusive(5)).toBeTrue()
    expect(rangeFnUpperExclusive(0)).toBeTrue()
    expect(rangeFnUpperExclusive(10)).toBeFalse()
    expect(rangeFnUpperExclusive(9)).toBeTrue()

    expect(rangeFnInclusive()).toBeFalse()
  })

  test("any function returns true if supplied value is matches any of the values", function () {
    const anyFn = any(["turing", "curry", "berners-lee"])

    expect(anyFn("turing")).toBeTrue()
    expect(anyFn("curry")).toBeTrue()
    expect(anyFn("berners-lee")).toBeTrue()

    expect(anyFn("torvalds")).toBeFalse()
    expect(anyFn("")).toBeFalse()
    expect(anyFn()).toBeFalse()
  })
})
