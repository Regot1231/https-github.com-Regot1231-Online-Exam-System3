<script setup>
import { userRegisterService, userLoginService } from '@/api/user.js'
import { User, Lock, Avatar } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
const isRegister = ref(false)
const router = useRouter()
const userStore = useUserStore()
const formModel = ref({
  username: '',
  password: '',
  repassword: '',
  role: ''
})
const form = ref()
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },//非空
    { min: 5, max: 10, message: '用户名必须是5-10位的字符', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请输入角色类型', trigger: 'blur' },//非空
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },//非空
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'blur' }
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },//非空
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (formModel.value.password !== value) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
const register = async () => {
  await form.value.validate()
  await userRegisterService(formModel.value)
  ElMessage.success('注册成功')
  // 切换到登录
  isRegister.value = false
}

// 点击不同的端口让字体变深色
const isActive = ref(true)
const toggleActive = () => {
  isActive.value = !isActive.value;
}
// 切换的时候重置
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: '',
    role: ''
  }
})
const login = async () => {
  await form.value.validate()
  const res = await userLoginService(formModel.value)
  console.log(res.data)
  userStore.setToken(res.data.token)
  userStore.setRole(formModel.value.role)
  ElMessage({ type: 'success', message: '登录成功' })
  if (formModel.value.role = "teacher") {
    router.push('/teacher')
  } else {
    router.push('/student')
  }
}
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <el-form :model="formModel" :rules="rules" class="right-form" ref="form" size="large" autocomplete="off"
        v-if="isRegister">
        <el-form-item>
          <h1 class="h1register">注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="formModel.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="role">
          <el-select clearable v-model="formModel.role" placeholder="请输入您的角色">
            <template #prefix>
              <el-icon><Avatar /></el-icon>
            </template>
            <el-option style="padding-left: 45%" label="老师" value="teacher" />
            <el-option style="padding-left: 45%" label="学生" value="student" />
          </el-select>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formModel.password" :prefix-icon="Lock" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input v-model="formModel.repassword" :prefix-icon="Lock" type="password" placeholder="请输入再次密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="register" class="button" type="primary" auto-insert-space>
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <el-form :model="formModel" :rules="rules" class="right-form" ref="form" size="large" autocomplete="off" v-else>
        <ul class="register-top clearfix">
          <li class="register-top-left leftfix" :class="{ active: !isActive }" @click="toggleActive">
            学生端
          </li>
          <li class="register-top-right rightfix" :class="{ active: isActive }" @click="toggleActive">
            教师端
          </li>
        </ul>
        <el-form-item prop="username">
          <el-input v-model="formModel.username" name="password" :prefix-icon="User" type="password"
            placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formModel.password" name="password" :prefix-icon="Lock" type="password"
            placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  background: url('@/assets/bg.png') no-repeat center / cover;
  ;
  height: 100vh;
  background-color: #fff;

  .bg {
    background: url('@/assets/left-bg.jpg') no-repeat center / cover;
    background-size: contain;
    /* 确保图片按比例缩放 */
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .register-top {
      border-bottom: 1px rgb(192, 205, 217) solid;
      margin-bottom: 20px;

      .register-top-left {
        height: 65px;
        line-height: 65px;
        font-size: 20px;
        color: #959da6;
        cursor: pointer;
        width: 50%;
        text-align: center;
      }

      .register-top-right {
        height: 65px;
        line-height: 65px;
        font-size: 20px;
        color: #959da6;
        cursor: pointer;
        width: 50%;
        text-align: center;
      }

      .register-top-left.active {
        color: black;
      }

      .register-top-right.active {
        color: black;
      }
    }

    .right-form {
      padding: 30px;
      border: 1px #27ba9b solid;
      background-color: white;
      border-radius: 5%;
    }

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}

/* 基础设置 reset*/
body,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
p,
blockquote,
dl,
dt,
dd,
ul,
ol,
li,
pre,
form,
fieldset,
legend,
button,
input,
textarea,
th,
td {
  margin: 0;
  padding: 0;
}

ul,
ol,
li {
  list-style: none;
}

img {
  /* 底部留白 */
  display: block;
  border: 0;
}

b,
strong {
  font-weight: 400;
}

h1,
h3,
h4,
h5,
h6 {
  /* 父元素字号的百分比 */
  font-size: 100%;
  font-weight: normal;
}

i,
em {
  /* 不倾斜 */
  font-style: normal;
}

u,
ins,
s,
del {
  /* 去掉中划线和下划线 */
  text-decoration: none;
}

table {
  border: 1px solid #999;
  /* 相当于是cellspacing */
  border-spacing: 0;
  /* 1px边框 */
  border-collapse: collapse;
}

td,
th {
  border: 1px solid #999;
}

input,
button {
  /* 去掉轮廓线 */
  outline: none;
  border: none;
}

/* 风格设置 */
body {
  font: 12px/1.5 "Microsoft YaHei", Tahoma, Helvetica, Arial, "\5b8b\4f53", sans-serif;
  color: #333;
}

a {
  text-decoration: none;
  color: #666;
}

a:hover {
  color: #DD302D;
  text-decoration: none;
}

.leftfix {
  float: left;
}

.rightfix {
  float: right;
}

.clearfix::after {
  content: "";
  display: block;
  clear: both;
}

.h1register {
  font-size: large;
}
</style>