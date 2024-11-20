<template>
  <div>
    <!-- 登录注册框 -->
    <el-card class="loginbox">
      <!-- 标题 -->
      <div class="title">
        <el-row>
          <el-text class="mx-1" type="primary" size="large"> 星怒 </el-text>
        </el-row>
      </div>

      <template v-if="formType == 'login'">
        <!-- 登录表单 -->
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          label-position="top"
          status-icon
        >
          <el-form-item label="用户名" prop="username">
            <!-- 暂时不支持邮箱 -->
            <el-input
              v-model="loginForm.usernameOrEmail"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="loginForm.password"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit(loginFormRef)"
              class="submit-btn"
              >登录</el-button
            >
          </el-form-item>
          <el-link type="primary" href @click="dialogVisible = true"
            >忘记密码</el-link
          >
          <el-dialog v-model="dialogVisible" title="重置密码" width="500">
            <p style="margin-bottom: 16px">
              我们将给你的邮箱发送重置后的密码，获取密码后
              <b>请立即登录修改密码</b>
            </p>
            <el-input v-model="myEmail" placeholder="请输入邮箱" />

            <template #footer>
              <div class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="resetPassword"
                  >确认</el-button
                >
              </div>
            </template>
          </el-dialog>
        </el-form>
      </template>
      <template v-else>
        <!-- 注册表单 -->
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          label-position="left"
          label-width="70px"
          status-icon
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="请输入用户名"
              autofocus
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="registerForm.password"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="password2">
            <el-input
              type="password"
              v-model="registerForm.password2"
              placeholder="请再次输入密码"
              show-password
            />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              type="email"
              v-model="registerForm.email"
              placeholder="请输入邮箱"
            />
          </el-form-item>
          <el-form-item label="验证码" prop="verification" class="verification">
            <el-input
              v-model="registerForm.verification"
              placeholder="请输入邮箱验证码"
            />
            <el-button
              type="primary"
              @click="sendVerification(registerForm.email)"
              :disabled="isVerifyBtnDisabled"
              >{{ verifyBtnText }}</el-button
            >
          </el-form-item>
          <el-button
            type="primary"
            @click="onSubmit(registerFormRef)"
            class="submit-btn"
            >注册</el-button
          >
        </el-form>
      </template>

      <div class="bottom">
        <el-space :size="2"
          ><el-text class="mx-1">{{
            formType == 'login' ? '没有账号？' : '已有账号？'
          }}</el-text
          ><el-link type="primary" @click="changeFormType">{{
            formType == 'login' ? '注册' : '登录'
          }}</el-link></el-space
        >
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { type FormInstance, type FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { message } from '@/utils/message'
import { useState } from '@/hooks/useState'
import { useVerification } from '@/hooks/useVerification'
import { UserApi } from '@star-angry/api'
import {
  Validator,
  ValidatorCallBack,
  validateEmail,
  validatePassword,
  validateUsername,
  validateUsernameOrEmail,
  validateVerification,
} from '@star-angry/shared'
import { useUserStore } from '@/store'
import { useRouter } from 'vue-router'

const dialogVisible = ref(false)
const myEmail = ref('')

const [formType, setFormType] = useState<'login' | 'register'>('login')
const changeFormType = () => {
  setFormType(formType.value === 'login' ? 'register' : 'login')
}

const loginFormRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()

const { isVerifyBtnDisabled, verifyBtnText, sendVerification } =
  useVerification()

const loginForm = reactive({
  usernameOrEmail: '',
  password: '',
})

const registerForm = reactive({
  username: '',
  password: '',
  password2: '',
  email: '',
  verification: '888888',
})

const validatePassword2 = (
  _: unknown,
  value: string,
  callback: ValidatorCallBack,
) => {
  if (!value) {
    return callback('密码不能为空')
  }

  if (registerForm.password && value !== registerForm.password) {
    return callback('两次输入密码不一致')
  }

  callback()
}

const loginRules = reactive<FormRules<typeof loginForm>>({
  usernameOrEmail: [{ validator: validateUsernameOrEmail, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
})

const registerRules = reactive<FormRules<typeof registerForm>>({
  username: [{ validator: validateUsername, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  password2: [{ validator: validatePassword2, trigger: 'blur' }],
  email: [{ validator: validateEmail, trigger: 'blur' }],
  verification: [{ validator: validateVerification, trigger: 'blur' }],
})

const userStore = useUserStore()
const router = useRouter()

const onSubmit = (formEle?: FormInstance) => {
  if (!formEle) return

  formEle.validate(async (valid) => {
    if (valid) {
      if (formType.value === 'login') {
        const params = {
          username: loginForm.usernameOrEmail,
          password: loginForm.password,
        }
        const res = await UserApi.login(params)

        if (res.code === 0) {
          message.success(res.msg)
          const { token, user } = res.data
          localStorage.setItem('token', token)
          userStore.setUserInfo(user)
          router.push('/')
        } else {
          message.error(res.msg)
          return
        }
      } else {
        const res = await UserApi.register(
          registerForm,
          registerForm.verification,
        )
        if (res.code === 0) {
          message.success(res.msg)
          setFormType('login')
        } else {
          message.error(res.msg)
          return
        }
      }
    } else {
      message.error('格式错误')
      return
    }
  })
}

const cancel = () => {
  dialogVisible.value = false
}

const resetPassword = async () => {
  const email = myEmail.value
  if (!email) {
    message.error('请输入邮箱')
    return
  }

  if (!Validator.isEmail(email)) {
    message.error('邮箱格式错误')
    return
  }

  // const res = await UserApi.resetPassword(email)
  // if (res.code === 0) {
  //   message.success('已发送重置密码邮件，请查收')
  //   dialogVisible.value = false
  // } else {
  //   message.error(res.msg)
  // }
}
</script>

<style scoped lang="less">
.loginbox {
  margin-top: -100px;
  padding: 20px 0;
  width: 380px;
  border-radius: 20px;

  .title {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 10px 30px 30px;

    .hust-logo {
      display: block;
      width: 80%;
    }
  }

  .el-form {
    padding: 0 30px;

    button.submit-btn {
      margin-top: 10px;
      width: 100%;
    }

    .verification {
      :deep(.el-form-item__content) {
        flex-wrap: nowrap;
        justify-content: space-between;
        gap: 6px;
      }
    }
  }

  .bottom {
    padding: 10px;
    margin: 0;
    text-align: center;
  }
}
</style>
