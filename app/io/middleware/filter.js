'use strict'
// app/io/middleware/filter.js

// 这个中间件可以接收到所有客户端发送过来的数据
module.exports = app => {
  return async (ctx, next) => {
    // console.log('数据包：', ctx.packet)

    ctx.socket.emit('res', '服务器已收到数据');
    await next();
  }
}