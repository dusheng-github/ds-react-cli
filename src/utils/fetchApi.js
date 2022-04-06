import axios from 'axios'
import { message } from 'antd'

// 对外提供获取图片的地址
const logoImgIp = process.env.NODE_ENV === 'development' ? '' : ''
// 登录路由
const LOGIN = '/Login/login'
const instance = axios.create({
  timeout: 10000, // 设置超时时间10s
})
// 文档中的统一设置post请求头。下面会说到post请求的几种'Content-Type'
instance.defaults.headers.post['Content-Type'] = 'application/json'

const httpCode = {
  400: '请求参数错误',
  401: '权限不足, 请重新登录',
  403: '服务器拒绝本次访问',
  404: '请求资源未找到',
  500: '内部服务器错误',
  501: '服务器不支持该请求中使用的方法',
  502: '网关错误',
  504: '网关超时',
}

/** 添加请求拦截器 * */
instance.interceptors.request.use((configTemp) => {
  const conf = configTemp
  /**
  * api: 后端请求(post) eg: post('/user/login')
  * mock: 数据模拟(get) eg: get('/mock/xx/xx)
  */
  conf.url = `${!conf.url.includes('mock') ? '/api' : ''}${conf.url}`
  // 在这里：可以根据业务需求可以在发送请求之前做些什么:例如我这个是导出文件的接口，因为返回的是二进制流，所以需要设置请求响应类型为blob，就可以在此处设置。
  if (conf.url.includes('pur/contract/export')) {
    conf.headers.responseType = 'blob'
  }
  // 我这里是文件上传，发送的是二进制流，所以需要设置请求头的'Content-Type'
  if (conf.url.includes('pur/contract/upload')) {
    conf.headers['Content-Type'] = 'multipart/form-data'
  }
  return conf
}, (error) => {
// 对请求错误做些什么
  Promise.reject(error)
})

/** 添加响应拦截器  * */
instance.interceptors.response.use((response) => {
  console.log(response)
  if (response.status === 200) { // 响应结果里的statusText: ok是我与后台的约定，大家可以根据实际情况去做对应的判断
    return Promise.resolve(response.data)
  }
  message.error('响应超时')
  return Promise.reject(response.data.message)
}, (error) => {
  console.log(error, '请求错误')
  if (error.response) {
    // 根据请求失败的http状态码去给用户相应的提示
    const tips = error.response.status in httpCode ? httpCode[error.response.status] : error.response.data.message
    message.error(tips)
    if (error.response.status === 401) { // token或者登陆失效情况下跳转到登录页面，根据实际情况，在这里可以根据不同的响应错误结果，做对应的事。这里我以401判断为例
      // 针对框架跳转到登陆页面
      this.props.history.push(LOGIN)
    }
    return Promise.reject(error)
  }
  message.error('请求超时, 请刷新重试')
  return Promise.reject('请求超时, 请刷新重试')
})

/* 统一封装get请求 */
export const get = (url, params, conf = {}) => new Promise((resolve, reject) => {
  instance({
    method: 'get',
    url,
    params,
    ...conf,
  }).then((response) => {
    resolve(response)
  }).catch((error) => {
    reject(error)
  })
})

/* 统一封装post请求  */
export function post(url, data, conf = {}) {
  return new Promise((resolve, reject) => {
    instance({
      method: 'post',
      url,
      data,
      ...conf,
    }).then((response) => {
      resolve(response)
    }).catch((error) => {
      reject(error)
    })
  })
}
// 获取所有cookies
export function getCookies() {
  const cookie = {}
  const all = document.cookie
  let eqIndex
  let k
  let v
  if (!all) return cookie
  const list = all.split(';')
  // eslint-disable-next-line no-cond-assign
  for (let i = 0, kv; kv = list[i++];) {
    eqIndex = kv.indexOf('=')
    k = decodeURIComponent(kv.slice(0, eqIndex)).replace(/^\s*/, '')
    v = decodeURIComponent(kv.slice(eqIndex + 1))
    if (cookie[k] && all) {
      v = [cookie[k], v].join(',')
    }
    cookie[k] = v
  }
  return cookie
}
// 获取指定cookie
export function getCookie(key, all) {
  const cookies = getCookies(all)
  return cookies[key] || null
}
// 设置指定cookie
export function setCookie(name, value, days, path, domain, secure) {
  const exp = new Date()
  exp.setTime(exp.getTime() + (days * 24 * 60 * 60 * 1000))
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
  if (days) { cookie += `; expires=${exp.toGMTString()}` }
  if (domain) { cookie += `; domain=${domain}` }
  if (path) { cookie += `; path=${path}` }
  if (secure) { cookie += `; secure${secure}` }
  document.cookie = cookie
}
// 清除全部cookie
// export function clear() {
//   const rs = document.cookie.match(/([^ ;][^;]*)(?=(=[^;]*)(;|$))/gi);
//   for (const i in rs) {
//     const date = new Date();
//     date.setTime(date.getTime() - 100000);
//     document.cookie = `${rs[i]}=;expires=${date.toGMTString()}; path=/`;
//   }
// }
