import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import axios from 'axios'
import { userInfo } from '@/apis/user.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userName: localStorage.getItem('userName') || '',//有就显示，没有就空
    //声明一个菜单数组,开始从本地存储中读取，使用JSON.parse是因为存的时候转成JSON，如果没有给你个空数组
    menuList: JSON.parse(localStorage.getItem('menuList')) || []
  },
  getters: {
  },
  mutations: {
    NAMEUPDATE(state, userName) {
      state.userName = userName
      localStorage.setItem('userName', userName)
    },
    //用于改变菜单数组的值，顺便持久化存储
    GETMENULIST(state, menuList) {
      state.menuList = menuList
      //转成JSON对象
      localStorage.setItem('menuList', JSON.stringify(menuList))
    }
  },
  actions: {
    //关于数据的用户鉴权
    async getMenuList({ commit }) {
      //使用这个请求方法，获取用户角色，需要请求头中有token
      let res = await userInfo()
      //如果返回不等于20000代表token失效了
      if (res.data.code !== 20000) return
      let role = res.data.data.roles[0].name
      //请求菜单列表
      let res2 = await axios.get('/menus.json')
      console.log('res2(menus.json的返回数据类型是' + res2)
      //用list保存菜单列表
      let list = res2.data
      let menuList = []
      let routes = []
      //用户判断
      if (role === "administrator") {
        //如果是管理员则获得所有权限
        routes = list
      } else if (role === "input") {
        //如果是销售人员则获得销售权限
        routes = list.filter(item =>
          item.meta && item.meta.roles && item.meta.roles.indexOf(role) != -1 || item.meta.title === '首页'
        )
      } else if (role === "approve") {
        //如果是审核人员则获得审批管理的初审权限
        routes = list.filter(item =>
          item.meta && item.meta.roles && item.meta.roles.indexOf(role) != -1 || item.meta.title === '首页'
        )
        //过滤掉审批管理的终审
        routes = routes.map(item => {
          if (item.children) {
            item.children.forEach((it, index) => {
              if (it.meta.title === '终审') {
                delete item.children[index]
              }
            })
          }
          return item
        })
      }
      //接收格式化的菜单
      menuList = routes.map(item => {
        //如果菜单有childeren
        if (item.children) {
          item.children.map(it => {
            let path = it.path1
            it.component = () => import(`@/views${path}View.vue`)
          })
        }
        //如果菜单没有childeren
        let url = item.component
        item.component = () => import(`@/layout/${url}.vue`)
        //把路由添加到路由器中
        router.addRoute(item)

        //格式化菜单，把path和meta拿出来
        let { path, meta } = item
        if (item.children) {
          //如果有children把他也格式化
          item.children = item.children.map(it => {
            let { meta, path } = it
            return { path, title: meta.title }
          })
          return { path, title: meta.title, children: item.children }
        }
        //没有children就直接格式化
        return { path, title: meta.title }
      })
      //调用mutations的方法
      commit("GETMENULIST", menuList)
    }

  },
  modules: {
  }
})
