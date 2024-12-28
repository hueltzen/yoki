export class UnwrapError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "UnwrapError"

    Error.captureStackTrace(this, UnwrapError)
  }
}
