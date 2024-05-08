<template>
  <div>
    <el-container>
      <el-aside width="240px">

        <!-- 添加router，开启路由模式-->
        <el-menu router class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff"
          active-text-color="#ffd04b">
          <!-- for循环菜单组件，传入每一个菜单项-->
          <AsideMenu v-for="(menu, index) in menuList" :menu="menu" :key="index" />
        </el-menu>

      </el-aside>
      <el-container>
        <el-header>
          <!--//左侧面包屑-->
          <div class="left">
            <BreadCrumb />
          </div>
          <!--//右侧用户名-->
          <div class="right">
            <!--// //下拉菜单-->
            <el-dropdown @command="logout">
              <span class="el-dropdown-link"> {{ userName }} </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="login-exit">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <!-- //放置一个路由出口 -->
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import BreadCrumb from "@/components/BreadCrumb.vue";
import { logout } from '@/apis/user';
import AsideMenu from "@/components/AsideMenu.vue";
export default {
  components: {
    BreadCrumb, AsideMenu
  },
  methods: {
    async logout(command) {
      // console.log(command);
      if (command === "login-exit") {
        // 退出登录业务逻辑
        let res = await logout();
        //  清楚token
        if (res.data.code === 603)
          // localStorage.removeItem("token");
          localStorage.clear();
      }
    },
    async doCommand(e) {
      if (e === "logout") {
        let res = await logout()
        if (res.data.code === 20000) {
          //这里需要await阻塞一下，避免下面刷新先执行
          await this.$router.replace("/login")

          //退出成功时清掉所有的存储信息
          localStorage.clear()
          //跳转后刷新下页面，清除掉路由信息
          window.location.reload()
        }

      }
    }
  },
  computed: {
    userName() {
      return this.$store.state.userName;
    },
    menuList() {
      return this.$store.state.menuList
    }
  }

}
</script>

<style>
a:link {
  text-decoration: none;
  color: #fff;
}

/* 状态二: 已经访问过的链接 */
a:visited {
  text-decoration: none;
  color: #fff;
}

/* 状态三: 鼠标划过(停留)的链接(默认红色) */
a:hover {
  text-decoration: none;
  color: #fff;
}

/* 状态四: 被点击的链接 */
a:active {
  text-decoration: none;
  color: #fff;
}

.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #545c64;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
}

.el-container {
  height: 100%;
}

.el-menu-vertical-demo {
  border: none;
}

.router-link-active {
  color: rgb(255, 208, 75) !important;
}
</style>