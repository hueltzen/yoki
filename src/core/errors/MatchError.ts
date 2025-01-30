export class MatchError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "MatchError"

    Error.captureStackTrace(this, MatchError)
  }
}
