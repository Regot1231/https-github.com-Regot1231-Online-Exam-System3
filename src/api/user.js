import request from '@/utils/requests'

// 注册接口
export const userRegisterService = ({ username, password, repassword, role }) => request.post('/api/reg', { username, password, repassword, role })
// 登录接口
export const userLoginService = ({ username, password, role }) => request.post('/api/login', { username, password, role })
// 获取用户信息
export const userGetInfoService = (role) => request.get('/my/userinfo', { headers: { 'X-User-Role': role }})
// 更新个人信息
export const userUpdateInfoService = ({ username, name, gender, mobilephone, jobnumber, academy, subject }) => request.put('/my/userinfo', { username, name, gender, mobilephone, jobnumber, academy, subject })
// 更新密码信息
export const userUpdatePassService = ({ old_pwd, new_pwd, re_pwd }) => request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })