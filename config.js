/**
 * PORT: 开发环境端口
 * url: 指定连接的后端
 * mockApi: mock数据接口
 * 想用下列哪个配置就将SERVER指向谁
 */
const config = {
  VERSION: 'api',
  SERVER: 'DEFAULT',
  DEFAULT: {
    port: 9005,
    url: 'http://localhost:999',
  },
  xxx: {
    port: 9001,
    url: 'http://ds-web.xyz',
  },
}
module.exports = config