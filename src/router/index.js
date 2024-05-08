import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import store from '@/store'

if (localStorage.getItem('token')) {
  store.dispatch('getMenuList')
}




Vue.use(VueRouter)

const routes = [
  // 配置重定向
  {
    path: '/',
    redirect: '/login',
    component: LoginView
  },
  // 懒加载配置login，缩短页面加载时间
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/',
    redirect: '/home',
    //下面这两个页面按照层级自行创建
    component: () => import('@/layout/layout.vue'),
    children: [
      {
        meta: {
          title: '首页'
        },
        path: '/home',
        name: 'home',
        component: () => import('@/views/HomeView.vue')
      }
    ]
  },
  {
    path: '/loan',
    redirect: '/loan-input/index',
    component: () => import('@/layout/layout.vue'),
    children: [
      {
        meta: {
          title: '贷款申请'
        },
        path: '/loan-input/index',
        name: '/loan-input',
        component: () => import('@/views/loan/IndexView.vue')
      }
    ]
  },
  {
    path: '/application-manage',
    redirect: '/application-manage/index',
    meta: {
      title: '申请管理'
    },
    component: () => import('@/layout/layout.vue'),
    //二级路由
    children: [
      {
        path: '/application-manage/index',
        name: 'application-manage',
        meta: {
          title: '申请列表'
        },
        component: () => import('@/views/application-manage/IndexView.vue')
      },
    ]
  },
  {
    path: '/loan-approve',
    redirect: '/loan-approve/first',
    meta: {
      title: '贷款审批'
    },
    component: () => import('@/layout/layout.vue'),
    children: [
      {
        path: '/loan-approve/first',
        name: 'loan-approve-first',
        meta: {
          title: '初审'
        },
        component: () => import('@/views/loan-approve/FirstView.vue')
      },
      {
        path: '/loan-approve/end',
        name: 'loan-approve-end',
        meta: {
          title: '终审'
        },
        component: () => import('@/views/loan-approve/EndView.vue')
      },
    ]
  },
  {
    path: '/contract-manage',
    redirect: '/contract-manage/index',
    meta: {
      title: '合同管理'
    },
    component: () => import('@/layout/layout.vue'),

    children: [
      {
        path: '/contract-manage/index',
        name: 'contract-manage',
        meta: {
          title: '合同列表'
        },
        component: () => import('@/views/contract-manage/IndexView.vue')
      },
    ]
  },
  {
    path: '/promission',
    redirect: '/promission/index',
    meta: {
      title: '权限管理'
    },
    component: () => import('@/layout/layout.vue'),
    children: [
      {
        path: '/promission/create',
        name: 'promission-create',
        meta: {
          title: '创建管理员'
        },
        component: () => import('@/views/promission/CreateView.vue')
      },
      {
        path: '/promission/index',
        name: 'promission-index',
        meta: {
          title: '列表展示'
        },
        component: () => import('@/views/promission/IndexView.vue')
      },
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
