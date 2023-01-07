'use strict';
const { Controller } = require('egg');
module.exports = class SocializeController extends Controller {
    async addSocializeArticle() {
        const { ctx } = this;
        try {
            let data = ctx.request.body;
            await ctx.app.mysql.insert('socializeArticle', data);
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
                let check = await ctx.app.mysql.select('socializeArticle', { where: { id } });
                if (check.length) { // 表中有这个 ID 可以删除   
                    await ctx.app.mysql.delete('socializeArticle', { id })
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
                let check = await ctx.app.mysql.select('socializeArticle', { where: { id } });
                if (check.length) {
                    await ctx.app.mysql.update('socializeArticle', ctx.request.body, { where: { id } });
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
                let res = await ctx.app.mysql.select('socializeArticle', { where: { id } });
                // console.log(res);
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
            let res = await ctx.app.mysql.select("socializeArticle");
            if (res.length) {
                ctx.body = {
                    code: 200,
                    message: "获取成功",
                    data: res
                }
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