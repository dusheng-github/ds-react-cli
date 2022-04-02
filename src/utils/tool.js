// 下划线转小驼峰
export function formatCamelCase(str = '', format = '_') {
  const re = new RegExp(`${format}(\\w)`, 'g')
  return str.charAt(0).toLowerCase() + str.substr(1).replace(re, (a, b) => b.toUpperCase())
}

// 字符串首字母大写
export function firstToUpper(str) {
  return str.trim().replace(str[0], str[0].toUpperCase())
}

/**
 * 类型判断
 * @param object 需要检查的类型
 * @param checkType 目标类型 不传则返回目标类型
 * @returns {boolean} 是否是目标类型
 * 测试空行
 */
export function typeIs(object, checkType = false) {
  const type = Object.prototype.toString.call(object).slice(8, -1).toLowerCase()
  if (!checkType) {
    return type
  }
  return type === checkType.toLowerCase()
}
