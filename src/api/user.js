import request from '@/utils/requests'

// 注册接口
export const userRegisterService = ({ username, password, repassword, role }) => request.post('/api/reg', { username, password, repassword, role })
// 登录接口
export const userLoginService = ({ username, password, role }) => request.post('/api/login', { username, password, role })
// 获取用户信息
export const userGetInfoService = () => request.get('/my/userinfo')
// 更新个人信息
export const userUpdateInfoService = ({ username, name, gender, mobilephone, jobnumber, academy, subject }) => request.put('/my/userinfo', { username, name, gender, mobilephone, jobnumber, academy, subject })
// 封装上传接口
export const userUploadAvatarService = (avatar) => request.patch('/my/update/avatar', { avatar })
// 更新密码信息
export const userUpdatePassService = ({ old_pwd, new_pwd, re_pwd }) => request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })