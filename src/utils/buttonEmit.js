/**
 * on 事件绑定
 * emit 事件触发
 */
export default class Emitter {
  constructor(nameSpace) {
    this.nameSpace = nameSpace
    window.emitCache = { [nameSpace]: {} }
  }

  on(target, event) {
    window.emitCache[this.nameSpace][target] = [...(window.emitCache[this.nameSpace][target] || []), event]
  }

  emit(target, ...para) {
    window.emitCache[this.nameSpace][target].forEach(func => {
      func.apply(this, para)
    })
  }
}