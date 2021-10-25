const { resolve } = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const PostcssPresetEnv = require('postcss-preset-env')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

const cssLoaders = [
  process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
  'css-loader',
  {
    loader: 'postcss-loader',
    options: { postcssOptions: { plugins: [PostcssPresetEnv()] } },
  },
]

module.exports = {
  entry: [resolve(__dirname, './src/main.ts'), resolve(__dirname, './public/index.html')],
  output: {
    filename: './static/js/[name][contenthash].js',
    path: resolve(__dirname, 'outputs'),
  },
  module: {
    rules: [
      { test: /\.vue$/, loader: 'vue-loader' },
      /* 
      {
        test: /\.pug$/,
        oneOf: [
          // 这适用于Vue组件中的' <template lang="pug"> '
          {
            resourceQuery: /^\?vue/,
            use: ['pug-plain-loader']
          },
          // 这适用于在JavaScript内部导入pug
          {
            use: ['raw-loader', 'pug-plain-loader']
          }
        ]
      }
      */
      { test: /\.pug$/, loader: 'pug-html-loader' },
      {
        oneOf: [
          // {
          //   test: /\.js$/,
          //   exclude: /node_modules/,
          //   use: [
          //     // { loader: 'thread-loader', options: { workers: 2 } }, // 多进程打包
          //     {
          //       loader: 'babel-loader',
          //       options: {
          //         presets: [['@babel/preset-env', { useBuiltIns: 'usage', corejs: { version: 3 }, targets: { chrome: '60', firefox: '60', ie: '9', safari: '10', edge: '17' } }]], // 按需兼容js
          //         plugins: [],
          //         cacheDirectory: true, // babel缓存
          //       },
          //     },
          //   ],
          // },
          // {
          //   test: /\.ts$/,
          //   loader: 'ts-loader',
          //   options: {
          //     // 指定特定的ts编译配置，为了区分脚本的ts配置
          //     configFile: resolve(__dirname, './tsconfig.json'),
          //     appendTsSuffixTo: [/\.vue$/],
          //   },
          // },

          /* 
          将babel的配置放在 babel.config.js中，
          同时，ts文件的解析也放在babel中，不在单独使用ts-loader
          */
          {
            test: /\.(js|ts)$/,
            exclude: /node_modules/,
            use: [
              // { loader: 'thread-loader', options: { workers: 2 } }, // 多进程打包
              'babel-loader',
            ],
          },
          { test: /\.css$/, use: cssLoaders },
          { test: /\.(scss|sass)$/, use: [...cssLoaders, 'sass-loader'] },
          { test: /\.html$/, loader: 'html-loader' },
          { test: /\.(png|gif|jpe?g)$/, type: 'asset', parser: { dataUrlCondition: { maxSize: 8 * 1024 } }, generator: { filename: './static/assets/images/[name][contenthash:6][ext]' } },
          { test: /\.(svg|ttf|woff|woff2)$/, type: 'asset/inline' },
        ],
      },
    ],
  },
  plugins: [
    //
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({ template: './public/index.html', minify: { collapseWhitespace: true, collapseComments: true } }),
    new MiniCssExtractPlugin({ filename: './static/assets/styles/built.css' }),
    new OptimizeCssAssetsWebpackPlugin(),
    // elementui-plus 按需加载
    Components({resolvers: [ElementPlusResolver()]}),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // '@/components': 'src/components'
    },
    extensions: ['.ts', '.js', '.json'],
  },
  optimization: {
    splitChunks: { chunks: 'all' },
  },
  devtool: 'eval-source-map',
  devServer: {
    port: '8090',
    compress: true,
    open: true,
    hot: true,
    proxy:{
      '/':{
        target: 'http://localhost:3001',
        changeOrigin: true,
        ws: false, // WebSocket connection to 'ws://localhost:8090/ws
        pathRewrite:{
          '/':'/'
        }
      },
      // '/ws':{
      //   target: 'ws://localhost:3002',
      //   changeOrigin: true,
      //   ws: true, // WebSocket connection to 'ws://localhost:8090/ws
      //   pathRewrite:{
      //     '/ws':'/'
      //   }
      // }
    }
  },
  mode: process.env.NODE_ENV,
}
