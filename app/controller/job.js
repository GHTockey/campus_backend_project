'use strict';
const { Controller } = require('egg');

module.exports = class Job extends Controller {
    // 新增兼职
    async addJob() {
        const { ctx } = this;
        try {
            let { uid, price, describe, tag, phone, title } = ctx.request.body;
            // 检查 uid 是否存在
            let u = await ctx.app.mysql.select('users', { where: { id: uid } });
            if (!u.length) return ctx.body = { code: 400, message: '用户不存在' };
            await ctx.app.mysql.insert('jobs', { uid, price, describe, tag, phone, title });
            ctx.body = { code: 200, message: '添加成功' };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    async delJob() {
        const { ctx } = this;
        try {
            let { id } = ctx.params;
            let executeRes = await ctx.app.mysql.delete('jobs', { id });
            if (executeRes.affectedRows == 0) return ctx.body = { code: 400, message: '没有于此 id 相关的数据' };
            ctx.body = { code: 200, message: '删除成功' };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    async getJobList() {
        const { ctx } = this;
        try {
            let sql = `select jobs.*,users.name,users.avatar,users.socket_id,is_online
                    from jobs 
                    join users 
                    on jobs.uid = users.id`;
            ctx.body = { code: 200, message: '获取成功', data: await ctx.app.mysql.query(sql)};
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
};