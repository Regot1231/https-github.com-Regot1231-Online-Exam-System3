import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '@/api/user.js'

// 用户模块
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('') // 定义 token

    const setToken = (t) => (token.value = t) // 设置 token
    const removeToken = () => {
      token.value = ''
    }
    const role = ref('') // 定义 role
    const setRole = (t) => (role.value = t) // 设置 role
    const removeRole = () => {
      role.value = ''
    }

    const user = ref({})
    const getUser = async () => {
      const res = await userGetInfoService() // 请求获取数据
      user.value = res.data.data
    }
    const setUser = (obj) => (user.value = obj)
    return { token, setToken, getUser, user, setUser, removeToken, role, setRole, removeRole }
  },
  {
    persist: true // 持久化
  }
)