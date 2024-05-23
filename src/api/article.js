import request from '@/utils/requests'

export const artGetChannelsService = () => request.get('/my/cate/list') 
// 分类: 添加文章分类
export const artAddChannelService = (data) => request.post('/my/cate/add', data)
// 分类: 编辑文章分类
export const artEditChannelService = (data) => request.put('/my/cate/info', data)
// 分类: 删除文章分类
export const artDelChannelService = id => request.delete('/my/cate/del', { params: { id }})



// 管理:获取文章列表
export const artGetListService = (params) => request.get('/my/article/list', { params })
// 管理:添加文章列表
export const artPublishService = (data) => request.post('/my/article/add', data)
// 管理:获取文章详情数据
export const artGetDetailService = (id) => request.get('/my/article/info', { params: { id } })
// 管理:编辑文章列表
export const artEditService = (data) => request.put('/my/article/info', data)
// 管理:删除列表
export const artDelService = (id) => request.delete('/my/article/info', { params: { id } })

// 获取学生试卷
export const studentGetListService = (params) => request.get('/my/student/paper', { params })
// 提交学生试卷
export const studentPostPaperService = (data) => request.get('/my/student/submitpaper', data)
// 获取题库
export const getPaperService = (params) => request.get('/my/article/papers', { params })

 
