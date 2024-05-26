import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login'},
    { path: '/login', name: "login", component: () => import('@/views/Login/index.vue') },
    { path: '/student', 
      component: () => import('@/views/layout/StudentLayout.vue'),
      redirect: '/student/paper',
      children: [
        { path: '/student/paper', name: "student-paper", component: () => import('@/views/paper/index.vue') },
        { path:'/student/profile', name: "student-profile", component: () => import('@/views/user/StudentProfile.vue')},
        { path:'/student/password', name: "student-password", component: () => import('@/views/user/StudentPassword.vue')},
      ]
  },
    { 
      path: '/teacher', 
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        { path:'/article/manage', name: "article-manage", component: () => import('@/views/article/ArticleManage.vue')},
        { path:'/article/channel', name: "article-channel", component: () => import('@/views/article/ArticleChannel.vue')},
        { path:'/user/profile', name: "teacher-profile", component: () => import('@/views/user/UserProfile.vue')},
        { path:'/user/password', name: "teacher-password", component: () => import('@/views/user/UserPassword.vue')},
      ] 
    }
  ]
})


// 登录拦截   测试时先不打开
// router.beforeEach((to) => {
//   const useStore = useUserStore()
//   if (!useStore.token && to.path !== '/login')  return '/login'
// })
export default router
