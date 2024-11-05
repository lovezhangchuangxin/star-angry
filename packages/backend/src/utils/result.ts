export class Result {
  constructor(
    public code: number,
    public msg: string,
    public data: any,
  ) {}

  static success(data: any) {
    return new Result(0, 'success', data)
  }

  static error(code: number, msg: string) {
    return new Result(code, msg, null)
  }
}
