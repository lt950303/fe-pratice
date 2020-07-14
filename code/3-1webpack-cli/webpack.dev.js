/* 目标
基础构建
1. 语法支持  vue + ES6 + 浏览器目标输出 
2. 处理 静态资源 image/font/
3. css 支持, 支持 css-modules （用 vue 喜欢用 less 顺便支持 less）
开发便捷与自动化
4. clean-webapck
5. webpack-dev-serve  HMR(js css 静态资源)  代理支持
6. devtools
7. 不同环境配置 development---production
项目优化
8. code-split / 动态导入 / 提取公告模块
9. tree-shaking 支持
10. 文件哈希【缓存处理】： content-hash
11. 环境 env 变量注入

规范化
eslint

研究下 vue-cli 生成的 vue 项目有啥东西，看看补充进去
build将文件目录按照 vue-cli 的方式进行组织(自定义一个插件？)

问题：
1. HMR 速度慢
*/ 
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin")


module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'app[contenthash].js',
    path: path.resolve(__dirname, './dist')
  },
  mode: 'development',
  devtool: 'source-map',
  devServer: { 
    contentBase: [path.join(__dirname, 'public'), path.join(__dirname, 'dist')],
    hot: true
  },
  optimization: {
    splitChunks: {
      // 自动提取所有公共模块到单独 bundle
      chunks: 'all'
    },
    // 这样就得重新 压缩css
    minimizer: [new UglifyJsPlugin({
    })],
  },
  module: {
    rules: [
      // 处理js
      {
        test: /\.js$/,
        loader: ['babel-loader'],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          hotReload: true // disables Hot Reload
        }
      },
      // 处理 css 
      {
        test: /\.(css|less)$/g,
        use:['style-loader', 'css-loader', 'less-loader']
      },
      // 处理 静态资源
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'url-loader', // 后期用 url-loader 优化一下
        options: {
          limit: 10 * 1024, // 10Kb 以下的资源内联
          // 问题： https://stackoverflow.com/questions/59326397/solved-error-trying-to-get-local-images-in-vue-files-with-my-own-webpack-config
          // 解决： https://github.com/webpack-contrib/url-loader#esmodule
          esModule: false,
        }
      } 

    ]
  },
  
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
			title: "vue首页",
			meta:{
				viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
			},
			filename: "index.html", // 指定输出的名字
      template: "./public/index.html",// 模板名
      // minify: true // 压缩 HTML 正式环境下开启 
    }),
    new CopyPlugin({
			patterns: [
				// 官方用法
			  { from: 'public', to: '.' },
			],
		})
    
  ]
}