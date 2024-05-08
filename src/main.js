import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入公共样式（控制背景图的样式等）
import '@/assets/normalize.css'
// 引入elementui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
