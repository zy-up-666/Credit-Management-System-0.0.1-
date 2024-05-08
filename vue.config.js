const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 打包配置
  configureWebpack: {
    // 开发服务器
    devServer: {
      // 设置代理服务器，解决跨域问题
      proxy: {
        '/api': {
          target: 'http://124.223.69.156:6300/',
          changeOrigin: true,
          //后端请求并没有api所以要去掉
          pathRewrite: { '^/api': '' }
        }
      }
    }
  }
})
