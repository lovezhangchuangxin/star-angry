/**
 * 验证器
 */
export class Validator {
  /**
   * 验证邮箱
   */
  public static isEmail(email: string) {
    return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)
  }

  /**
   * 验证用户名
   */
  public static isUsername(username: string) {
    return /^[\u4e00-\u9fa5_a-zA-Z0-9-]{2,16}$/.test(username)
  }

  /**
   * 验证密码
   */
  public static isPassword(password: string) {
    return /^[a-zA-Z0-9_-]{6,18}$/.test(password)
  }
}

export type ValidatorCallBack = (error?: string | Error) => void

export const validateUsername = (
  _: unknown,
  value: string,
  callback: ValidatorCallBack,
) => {
  if (!value) {
    return callback('用户名不能为空')
  }

  if (!Validator.isUsername(value)) {
    return callback('仅支持中文、字母和数字，且长度为2到16')
  }

  callback()
}

export const validateEmail = (
  _: unknown,
  value: string,
  callback: ValidatorCallBack,
) => {
  if (!value) {
    return callback('邮箱不能为空')
  }

  if (!Validator.isEmail(value)) {
    return callback('邮箱格式错误')
  }

  callback()
}

export const validateUsernameOrEmail = (
  _: unknown,
  value: string,
  callback: ValidatorCallBack,
) => {
  if (!value) {
    return callback('用户名不能为空')
  }

  if (!Validator.isUsername(value) && !Validator.isEmail(value)) {
    return callback('用户名或邮箱错误')
  }

  callback()
}

export const validatePassword = (
  _: unknown,
  value: string,
  callback: ValidatorCallBack,
) => {
  if (!value) {
    return callback('密码不能为空')
  }

  if (!Validator.isPassword(value)) {
    return callback('仅支持字母、数字，且长度为6到16')
  }

  callback()
}

export const validateVerification = (
  _: unknown,
  value: string,
  callback: ValidatorCallBack,
) => {
  if (!value) {
    return callback('验证码不能为空')
  }

  callback()
}
