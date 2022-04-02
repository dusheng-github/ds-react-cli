import { post } from 'utils'
/**
 * 请求函数a
 * @param {string} para1 默认参数
 * @returns {Promise}
 */
export async function a(para1) {
  const res = await post()
  return res
}

/**
 * 请求函数b
 * @param {string} para2 默认参数
 * @returns {Promise}
 */
export async function b(para2) {
  const res = await post()
  return res
}