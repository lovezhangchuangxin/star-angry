export class ErrorCode {
  constructor(
    public code: number,
    public msg: string,
  ) {}

  getCode() {
    return this.code
  }

  getMsg() {
    return this.msg
  }

  static PARAM_ERROR = new ErrorCode(400, '参数错误')

  static USER_EXIST = new ErrorCode(1001, '用户已存在')
  static USER_NOT_EXIST = new ErrorCode(1002, '用户不存在')
  static USERNAME_OR_PASSWORD_ERROR = new ErrorCode(1003, '用户名或密码错误')
  static TOKEN_INVALID = new ErrorCode(1004, 'token 无效 或 过期')
  static VERIFICATION_ERROR = new ErrorCode(1005, '验证码错误')
  static SEND_MAIL_ERROR = new ErrorCode(1006, '发送邮件失败')
}
