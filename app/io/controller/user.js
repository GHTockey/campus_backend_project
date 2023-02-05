'use strict';
const Controller = require('egg').Controller;
const { sendOnlineUser } = require('../../utils')

module.exports = class User extends Controller {
    // 更新用户 sid 在线状态
    async updUserSid() {
        const { ctx } = this;
        try {
            let { username, uid, sid, name } = ctx.args[0]; // 客户端发过来的数据
            await ctx.app.mysql.update('users', { socket_id: sid, is_online: 1 }, { where: { id: uid, username } });
            // 提示用户上线
            ctx.socket.broadcast.emit('public', { message: '用户上线', name });
            sendOnlineUser(ctx);
        } catch (error) {
            await ctx.socket.emit('err', { code: 400, message: "捕获到 socket 错误：" + error })
        };
    };
    // 发送消息
    async sendMsg() {
        const { ctx } = this;
        try {
            let data = ctx.args[0]; // 客户端发过来的数据
            let timestamp = new Date(); // 发送时间
            console.log(data);
            let {sender_id,receiver_id,message} = data;
            // 将聊天记录存储到数据库
            ctx.app.mysql.insert('user_msg_record', { sender_id, receiver_id, message, timestamp });

            ctx.socket.to(data.sid).emit('message', data.message);
        } catch (error) {
            await ctx.socket.emit('err', { code: 400, message: "捕获到 socket.io 错误：" + error })
        };
    };
};