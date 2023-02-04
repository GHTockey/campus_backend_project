'use strict';
const Controller = require('egg').Controller;
const {sendOnlineUser} = require('../../utils')

module.exports = class User extends Controller {
    // 更新用户 sid 在线状态
    async updUserSid() {
        const { ctx } = this;
        try {
            let { username, uid, sid, name } = ctx.args[0]; // 客户端发过来的数据
            await ctx.app.mysql.update('users', { socket_id: sid, is_online: 1 }, { where: { id: uid, username } });
            // 提示用户上线
            ctx.socket.broadcast.emit('public', { message: '用户上线', name });
            sendOnlineUser(ctx)
            console.log('用户上线');
        } catch (error) {
            await ctx.socket.emit('err', { code: 400, message: "捕获到 socket.io 错误：" + error })
        };
    };
};