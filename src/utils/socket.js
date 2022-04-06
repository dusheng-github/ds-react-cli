import io from 'socket.io-client'

// socket如果连接不上， 可能是mock数据导致
class SocketHelper {
  constructor(listeners) {
    this.reducers = {}
    this.socket = io('http://w-sas-1000-web-alpha-00.sanzhi56.cn:6001')
    if (listeners && listeners.length) {
      listeners.forEach(this.addListener)
    }
  }

  send = (channel, msg) => {
    this.socket.emit(channel, msg)
  }

  on = (type, handel) => {
    if (!this.reducers[type]) {
      this.reducers[type] = []
      this.socket.on(type, (data) => {
        if (this.reducers[type] && this.reducers[type].length) {
          this.reducers[type].forEach((item) => item(data))
        }
      })
    }
    const index = this.reducers[type].findIndex((item) => item === handel)
    if (index === -1) {
      this.reducers[type].push(handel)
    }
    return () => this.removeListener(type, handel)
  }

  off = (type, handel) => {
    if (this.reducers[type] && this.reducers[type].length) {
      const index = this.reducers[type].findIndex((item) => item === handel)
      if (index !== -1) {
        this.reducers[type].splice(index, 1)
      }
    }
  }
}

export default function socketConnect() {
  const socket = new SocketHelper()
  socket.on('connect', () => {
    socket.send('login', window.user_id || 10986)
    console.info('socket connect success')
  })
  return socket
}
