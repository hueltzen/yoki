import type { Maybe } from "./maybe.js"
import type { Result } from "./result.js"

export type MaybeMatchPredicateFn<T> = (value?: T) => boolean

export type MaybeMatchPredicateVal<T> = Maybe<T>

export type MaybeMatchPredicate<T, U> =
  | MaybeMatchPredicateFn<T>
  | MaybeMatchPredicateVal<T>

export type ResultMatchPredicateFn<T, E> = (value: T | E) => boolean

export type ResultMatchPredicateVal<T, E> = Result<T, E>

export type ResultMatchPredicate<T, U, E> =
  | ResultMatchPredicateFn<T, E>
  | ResultMatchPredicateVal<T, E>
