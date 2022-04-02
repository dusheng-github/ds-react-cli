// webpack打包会从entry开始,
// 1. 每个entry都是一个独立的chunk(入口依赖的全部代码)
// 2. 默认一个chunk下, 包 = (所有相关import + 所有相关index.js)后去重
// 3.如果chunk之间不想重复打包可以进行splitChunks
// 4.import()可以产生async包, 等待触发时才会去下载
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const proxyConfig = require('./config.js')
const serverPath = process.env.SERVER_PATH
const server = proxyConfig[serverPath] || proxyConfig[proxyConfig.SERVER || 'DEFAULT']
const { port = 8080, url: target } = server
const src = path.resolve(__dirname, 'src')
const nodeEnv = process.env.NODE_ENV || 'development'
const isPro = nodeEnv === 'production'
const globals = {
  'process.env.NODE_ENV': JSON.stringify(nodeEnv),
}
const filename = isPro ? 'scripts/[name].[chunkhash:8].js' : 'scripts/[name].bundle.js'
module.exports = {
  entry: {
    app: 'index.js',
    vendor: ['lodash', 'react', 'react-dom', 'echarts', 'moment', 'prop-types', 'antd'],
    common: ['constants/index.js', 'utils/index.js', 'components/index.js', 'server/index.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename,
    chunkFilename: filename,
    publicPath: '/dist/',
    clean: true,
  },
  mode: nodeEnv,
  context: path.resolve(__dirname, './src'),
  ...(isPro ? {} : { devtool: 'eval-source-map' }),
  devServer: {
    static: {
      directory: path.resolve(__dirname, './'),
    },
    compress: true,
    allowedHosts: 'all',
    port,
    historyApiFallback: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    proxy: {
      '/api/*': {
        changeOrigin: true,
        target,
        // pathRewrite: {  // 路径重写，
        //   '^/api': ''  // fetchApi中封装了方法, 1, 所有的前端请求都加上api, 2, 请求接口存在api时需要跨域转发, 3, 发请求时取出api
        // },
        router: () => target,
        onProxyReq(proxyReq, req, res) {
          console.log(`${target}${req.path}`)
          proxyReq.setHeader('Referer', `${target}${req.path}`)
        },
      },
      '/': {
        target: `http://localhost:${port}`,
        pathRewrite: { '^/.*': '/dist/index.html' },
        bypass(req) {
          if (/.*\..*$/.test(req.path)) return req.path
        }
      },
    },
  },
  module: {
    noParse: /jquery/, // 这些包不依赖别的包, 所以不需要解析, 可以提高性能
    rules: [
      {
        test: /\.less/,
        include: src,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { modules: true, import: true }
          },
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                strictMath: true,
              },
            },
          },
        ]
      },
      {
        test: /\.js$/,
        use: [
          // "thread-loader", // 官方推荐多进程打包, 项目较大时开启
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true, // 默认缓存在node_modules/.cache/babel-loader
            }
          }],
        exclude: /node_modules/,
        include: src,
      }, {
        test: /\.css$/,
        use: ['style-loader', isPro ? {
          loader: 'css-loader',
          options: { minimize: true }
        } : 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8 * 1024,
            }
          },
        ],
        type: 'javascript/auto'
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      publicPath: '/dist/'
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }), // 去除locale中用不到的语言包
    new webpack.DefinePlugin(globals),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     // { from: 'index.html', to: 'index.html', toType: 'file' },
    //   ]
    // }),
    new ESLintPlugin(),
    new BundleAnalyzerPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            warnings: false,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log']
          }
        }
      }),
    ],

    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {
      chunks: 'initial',
      cacheGroups: {
        vendor: {
          chunks: 'initial', // 'all'打包所有; 'initial'打包同步; 'async'打包异步部分(import部分)
          name: 'vendor', // 打包后的名字, 没有则按照公共引用的包, 用'~'连接
          test: 'vendor', // 匹配第三方vendor chunk
          enforce: true, // 忽略默认配置
          priority: 2 // 优先级, 数字越大, 优先级越高, 默认为0
        },
        common: {
          chunks: 'initial',
          name: 'common',
          test: 'common', // 匹配公共common chunk
          enforce: true,
          priority: 1
        },
        // other: {
        //   chunks: 'initial',
        //   name: 'other',
        //   enforce: true,
        //   priority: -1,
        // },
        echarts: { // 对echarts单独打包
          chunks: 'initial',
          minSize: 3000 * 1024, // 满足压缩前大于3m
          minChunks: 1, // 满足最少引用一次
          test: /[\\/]node_modules[\\/]echarts[\\/]/, // 匹配 /node_modules/echarts/ 单独打包
          name: 'echarts',
          priority: 3
        },
      }
    },
  },
  resolve: {
    modules: ['./src', 'node_modules'], // 查找文件的文件范围
    extensions: ['.js', 'json'], // 省略文件后缀
    alias: { // 文件别名
      components: path.resolve(__dirname, 'src/components/'),
      constants: path.resolve(__dirname, 'src/constants/'),
      utils: path.resolve(__dirname, 'src/utils/'),
      server: path.resolve(__dirname, 'src/server/'),
      pages: path.resolve(__dirname, 'src/pages/'),
    }
  },
  externals: {
    jquery: 'jQuery', // cdn外链转成正常的npm包的使用方式
  }
}