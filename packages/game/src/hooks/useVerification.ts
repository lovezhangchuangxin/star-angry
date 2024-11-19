import { ref } from 'vue'
import { UserApi } from '@star-angry/api'
import { Validator } from '@star-angry/shared'
import { message } from '@/utils/message'

export function useVerification(initTime = 60) {
  const isVerifyBtnDisabled = ref(false)
  const sleepTime = ref(initTime)
  const verifyBtnText = ref('获取验证码')

  const sendVerification = async (email: string) => {
    if (!email || !Validator.isEmail(email)) {
      message.error('邮箱错误')
      return
    }

    isVerifyBtnDisabled.value = true

    const timerId = setInterval(() => {
      if (sleepTime.value > 0) {
        sleepTime.value--
        verifyBtnText.value = `发送中 ${sleepTime.value}`
      } else {
        isVerifyBtnDisabled.value = false
        verifyBtnText.value = '获取验证码'
        sleepTime.value = 5
        clearInterval(timerId)
      }
    }, 1000)

    const res = await UserApi.sendVerification(email)

    if (res.code === 0) {
      if (res.data?.verification) alert(res.data?.verification)
      message.success('请求已发送')
    } else if (res.code === 1010) {
      message.success('验证码已发送')
    } else {
      message.error('请求发送失败')
    }
  }

  return {
    isVerifyBtnDisabled,
    verifyBtnText,
    sendVerification,
  }
}
