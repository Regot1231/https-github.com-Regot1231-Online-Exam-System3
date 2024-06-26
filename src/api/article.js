import request from '@/utils/requests'
// 获取试卷分类信息
export const artGetChannelsService = () => request.get('/my/cate/list') 
// 分类: 添加文章分类
export const artAddChannelService = (data) => request.post('/my/cate/add', data)
// 分类: 编辑文章分类
export const artEditChannelService = (data) => request.put('/my/cate/info', data)
// 分类: 删除文章分类
export const artDelChannelService = id => request.delete('/my/cate/del', { params: { id }})

// 管理:获取文章列表
export const artGetListService = () => request.get('/my/article/list')
// 管理：筛选文章列表
export const artGetFilterListService = (params) => request.get('/my/article/filterlist', { params })
// 管理:添加文章列表
export const artPublishService = (data) => request.post('/my/article/add', data)
// 管理:获取文章详情数据
export const artGetDetailService = (id) => request.get('/my/article/info', { params: { id } })
// 管理:编辑文章列表
export const artEditService = (data) => request.put('/my/article/info', data)
// 管理:删除列表
export const artDelService = (id) => request.delete('/my/article/info', { params: { id } })

// 获取学生试卷
export const studentGetListService = (subject) => request.get('/my/student/paper', { params: { subject } })
// 提交学生试卷
export const studentPostPaperService = (data) => request.post('/my/student/submitpaper', data)
// 查找题库
export const getPaperService = (subject) => request.get('/my/article/papers', { params: { subject } })

 
