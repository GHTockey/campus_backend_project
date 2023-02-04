'use strict'
const { sendOnlineUser } = require('../../utils')

// socket 的连接和断开都在这个中间件
module.exports = (app) => {
  return async (ctx, next) => {
    // 客户端连接
    // let user = await ctx.app.mysql.select('users', { where: { socket_id: ctx.socket.id } })
    // console.log(user);
    // ctx.socket.emit('popup', ctx.socket.id);

    await next();




    // 断开连接时会主动执行下方代码
    // 将断开的用户改为离线状态并清除 sid
    let offlineUser = await ctx.app.mysql.query(`SELECT name from users where socket_id=?`, ctx.socket.id);
    await ctx.app.mysql.update('users', { socket_id: null, is_online: 0 }, { where: { socket_id: ctx.socket.id } });
    console.log(ctx.socket.id, '已断开');
    if (offlineUser.length) {
      // 提示在线用户 XXX 已离线
      ctx.socket.broadcast.emit('public', { message: '用户离线', ...offlineUser[0] });
      sendOnlineUser(ctx);
    };
  };
};