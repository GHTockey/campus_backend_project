'use strict';
const Controller = require('egg').Controller;

module.exports = class Admin extends Controller {
    /** 中控端管理员上线 */
    async adminOnlineHandler() {
        const { ctx, app } = this;
        const { uname, uid, sid } = ctx.args[0];
        // console.log(ctx.args[0]);
        await app.mysql.update('users', { socket_id: sid, is_online: 1 },
            { where: { id: uid } });
    }
}