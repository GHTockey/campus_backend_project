'use strict';

const Controller = require('egg').Controller;

module.exports = class DefaultController extends Controller {
    async ping() {
        const { ctx, app } = this;
        const message = ctx.args[0];
        await ctx.socket.emit('res', `你好！我收到你的消息: ${message}`);
    }
}

// module.exports = app => {
//     return function* () {
//         const self = this
//         const message = this.args[0]
//         console.log('chat 控制器打印', message)
//         this.socket.emit('res', `你好！我收到你的消息: ${message}`)
//     }
// }