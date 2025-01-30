import { describe, expect, test } from "bun:test"
import { Maybe } from "../src/types/maybe"
import { Some } from "../src/core/some"
import {
  _,
  isMaybeMatchPredicateFn,
  isResultMatchPredicateFn,
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
})
