'use strict';
const { Controller } = require('egg');
module.exports = class OtherController extends Controller {
    async searchArticle() {
        const { ctx } = this;
        let { value } = ctx.request.body;
        if (!value) return ctx.body = { code: 400, message: '请传入关键词' };

        let res = await ctx.app.mysql.query(`
                SELECT * FROM articles 
                WHERE name LIKE "%${value}%" 
                OR title LIKE "%${value}%";`
        );
        ctx.body = {
            code: 200,
            message: '搜索完成',
            data: res
        };
    };
};