import { useUserStore } from '@/stores'
import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'

const baseURL = 'http://192.168.184.231:3299'//基地址

const instance = axios.create({
  baseURL,
  timeout: 100000 
})

instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    if ( res.data.code === 200 ) {
      return res
    }
    ElMessage({ message: res.data.message || '服务异常', type: 'error' })
    return Promise.reject(res.data)
  },
  (err) => {
    ElMessage({ message: err.response.data.message || '服务异常', type: 'error' })   //每一个错误示例都要显示出来！！！
    console.log(err)
    if (err.data.code === 401) {
      router.push('/login')
    }
    return Promise.reject(err)
  }
)

export default instance

