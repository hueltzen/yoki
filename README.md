# yōki

A rust inspired maybe and result library.

[![Build Status](https://github.com/hueltzen/yoki/workflows/build/badge.svg)](https://github.com/hueltzen/yoki/actions?query=workflow%3Abuild)
[![npm version](https://badge.fury.io/js/@ueltzen%2Fyoki.svg)](https://badge.fury.io/js/@ueltzen%2Fyoki)

## Introduction

The `Maybe` type represents an
optional value that can either be `Some` when it contains a value or `None` if
it does not.

The `Result` type closely resembles the type of the same name from rust. It adds
a way to describe a possible error instead of the absence of a value.

Both are typed and generic so they can be used both safely and for different
use-cases.

## Documentation

Check out the [docs](https://github.com/hueltzen/yoki/blob/main/docs/index.md).

## Installation

To add yōki to your project simply install it like any other npm package for
example by running (for npm):

```
npm i @ueltzen/yoki
```

## Basic usage

### Maybe

You can create a `Maybe` by using one of the two functions supplied by yōki;
`Some` and `None`:

```typescript
function divide(a: number, b: number): Maybe<number> {
  if (Number.isNaN(a) || Number.isNaN(b) || b === 0) {
    return None()
  }

  return Some(a / b)
}
```

You can then use it as follows:

```typescript
const result = divide(parseInt(first), parseInt(second)).mapOr(
  "Invalid Input",
  (v) => `The result is: ${v}`,
)
```

### Result

Similarly you can create a `Result` by using `Ok` and `Err`. This way you can
provide more context to your code for more granular error handling:

```typescript
function divide(a: number, b: number): Result<number, string> {
  if (Number.isNaN(a) || Number.isNaN(b)) {
    return Err("One of the supplied values is not a number.")
  }
  if (b === 0) {
    return Err("Can't divide by zero.")
  }

  return Ok(a / b)
}
```

You can then use the provided error messages later in your code execution:

```typescript
const result = divide(parseInt(first), parseInt(second)).mapOrElse(
  (err) => err,
  (v) => `The result is: ${v}`,
)
```

## Contributing

Feel free to create pull requests. If you find a bug or want a feature
implemented or a major change, please open an issue first to discuss what you
would like to change.
