'use strict';
const { Controller } = require('egg');
const { strToArr } = require('../utils');
module.exports = class SocializeController extends Controller {
    async addSocializeArticle() {
        const { ctx } = this;
        try {
            let data = ctx.request.body;
            await ctx.app.mysql.insert('articles', { ...data, type: 'socialize' });
            ctx.body = {
                code: 200,
                message: "添加成功"
            }
        } catch (error) {
            ctx.body = {
                code: 400,
                message: "捕获到错误：" + error
            }
        };
    };
    async delSocializeArticle() {
        const { ctx } = this;
        try {
            let { id } = ctx.params;
            if (!!id) { // 判断有无 ID
                let check = await ctx.app.mysql.select('articles', { where: { id, type: 'socialize' } });
                if (check.length) { // 表中有这个 ID 可以删除   
                    await ctx.app.mysql.delete('articles', { id, type: 'socialize' })
                    ctx.body = {
                        code: 200,
                        message: "删除成功"
                    }
                } else {
                    ctx.body = {
                        code: 400,
                        message: "没有与此 id 相关的数据"
                    }
                };
            } else {
                ctx.body = {
                    code: 400,
                    message: "参数缺失, 请检查是否传递参数: id"
                }
            }
        } catch (error) {
            ctx.body = {
                code: 400,
                message: "捕获到错误：" + error
            }
        };
    };
    async updSocializeArticle() {
        const { ctx } = this;
        try {
            let { id } = ctx.params;
            if (!!id) {
                let check = await ctx.app.mysql.select('articles', { where: { id, type: 'socialize' } });
                if (check.length) {
                    await ctx.app.mysql.update('articles', ctx.request.body, { where: { id, type: 'socialize' } });
                    ctx.body = {
                        code: 200,
                        message: "修改成功"
                    }
                } else {
                    ctx.body = {
                        code: 400,
                        message: "没有与此 id 相关的数据"
                    }
                };
            } else {
                ctx.body = {
                    code: 400,
                    message: "参数缺失, 请检查是否传递参数: id"
                }
            }
        } catch (error) {
            ctx.body = {
                code: 400,
                message: "捕获到错误：" + error
            }
        };
    };
    async getSocializeArticle() {
        const { ctx } = this;
        try {
            let { id } = ctx.params;
            if (!!id) { // 判断有无 ID
                // let res = await ctx.app.mysql.select('articles', { where: { id, type: 'socialize' } });
                let sql = "SELECT articles.*,users.is_admin,users.is_realname FROM articles JOIN users ON articles.id = ? AND users.id = articles.userID";
                let res = await ctx.app.mysql.query(sql,[id]);
                strToArr(res); // 字符串'[]'转数组
                if (res.length) {
                    ctx.body = {
                        code: 200,
                        message: "获取成功",
                        data: res
                    }
                } else {
                    ctx.body = {
                        code: 400,
                        message: "没有与此 id 相关的数据"
                    }
                };
            } else {
                ctx.body = {
                    code: 400,
                    message: "参数缺失, 请检查是否传递参数: id"
                }
            }
        } catch (error) {
            ctx.body = {
                code: 400,
                message: "捕获到错误：" + error
            }
        };
    };
    async getSocializeArticleList() {
        const { ctx } = this;
        try {
            // let res = await ctx.app.mysql.select("articles", { where: { type: 'socialize' } });
            let sql = `SELECT
                        articles.*, 
                        users.avatar, 
                        users.name, 
                        users.is_admin, 
                        users.is_realname
                    FROM
                        articles
                        INNER JOIN
                        users
                        ON 
                        articles.userID = users.id
                        WHERE
                        articles.type=?
                    `;
            let res = await ctx.app.mysql.query(sql,['socialize']);
            strToArr(res); // 字符串'[]'转数组
            if (res.length) {
                ctx.body = {
                    code: 200,
                    message: "获取成功",
                    data: res
                };
            } else {
                ctx.body = {
                    code: 400,
                    message: "没有数据"
                }
            };
        } catch (error) {
            ctx.body = {
                code: 400,
                message: "捕获到错误：" + error
            }
        };
    };
};