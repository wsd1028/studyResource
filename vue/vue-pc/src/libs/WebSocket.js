/* *
 * WebSocket封装
 * */
import EventEmitter from 'events'

export default (url, protocol) => {
  return new WS(url, protocol)
}

class WS {
  // 构造函数
  constructor(url, protocol) {
    // 公共下发监听池
    this._eventBus = new EventEmitter()

    // WebSocket实例
    this._webSocket = new WebSocket(url, protocol)

    // 添加链接成功处理
    this._webSocket.onopen = e => this._eventBus.emit('open', e)

    // 添加通信发生错误处理
    this._webSocket.onerror = e => this._eventBus.emit('error', e)

    // 添加通信关闭处理
    this._webSocket.onclose = e => this._eventBus.emit('close', e)

    // 接收数据时处理
    this._webSocket.onmessage = e => this._eventBus.emit('message', e)

    return this
  }

  // 绑定监听事件 event:事件名 callback:回调函数
  on(event, callback) {
    this._eventBus.on(event, callback)
    return this
  }

  // 关闭方法
  close() {
    this._webSocket.close()
    return this
  }

  // 接收消息
  then(callback) {
    this._eventBus.on('message', e => {
      let data = null
      try {
        data = JSON.parse(e.data)
      } catch (err) {
        if (err) data = e.data
      }
      callback && callback.call(this, data)
    })
    return this
  }

  // 发送消息
  send(data) {
    this._webSocket.send(data)
    return this
  }

  // 错误捕获
  catch(callback) {
    this._eventBus.on('error', err => {
      callback && callback.call(this, err)
    })
    return this
  }
}
