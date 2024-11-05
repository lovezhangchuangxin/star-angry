import { ErrorCode } from './ErrorCode'

export class GameError extends Error {
  constructor(
    public errorCode: ErrorCode,
    message: string = errorCode.getMsg(),
  ) {
    super(message)
  }

  getCode() {
    return this.errorCode.getCode()
  }

  getMsg() {
    return this.message
  }
}
