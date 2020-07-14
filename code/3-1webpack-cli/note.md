
##  如何使用 vue
需要安装的包
yarn add  vue-loader vue-template-compiler --dev 
还要使用 vue-loader 提供的插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  // ...
  plugins: [
    new VueLoaderPlugin()
  ]
}

<!-- html 模板如何 如何注入这个 -->
<link rel="icon" href="<%= BASE_URL %>favicon.ico"> 