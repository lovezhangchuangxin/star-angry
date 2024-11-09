import { ErrorCode } from '../error/ErrorCode'

export class Result {
  constructor(
    public code: number,
    public msg: string,
    public data: any,
  ) {}

  static success(data: any) {
    return new Result(0, 'success', data)
  }

  static error(code: number, msg: string): Result
  static error(code: ErrorCode): Result
  static error(code: number | ErrorCode, msg?: string) {
    if (code instanceof ErrorCode) {
      return new Result(code.code, code.msg, null)
    }
    return new Result(code, msg!, null)
  }
}
