'use strict';
const await = require('await-stream-ready/lib/await');
const { Controller } = require('egg');
const { strToArr } = require('../utils');
module.exports = class HobbyController extends Controller {
    // 轮播图
    async addHobbySwiper() {
        const { ctx } = this;
        try {
            let { id, title, image, cid } = ctx.request.body;

            let check = await ctx.app.mysql.select('swipers', { where: { id } });
            if (check.length) {
                ctx.body = {
                    code: 400,
                    message: "ID 重复, 请尝试修改传递的 ID 或者取消传递"
                }
            } else {

                await ctx.app.mysql.insert("swipers", { id: id ? id : '0', title, image, cid, type: 'hobby' });
                ctx.body = {
                    code: 200,
                    message: "添加成功"
                }
            }

        } catch (error) {
            ctx.body = {
                code: 400,
                message: "捕获到错误：" + error
            }
        };
    };
    async delHobbySwiper() {
        const { ctx } = this;
        try {
            let { id } = ctx.params;
            if (!!id) { // 判断有无 ID
                let check = await ctx.app.mysql.query(`SELECT * FROM swipers WHERE id=${id}`);
                if (check.length) { // 表中有这个 ID 可以删除
                    await ctx.app.mysql.delete('swipers', { id })
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
    async updHobbySwiper() {
        const { ctx } = this;
        try {
            let { id } = ctx.params;
            let { title, image, cid } = ctx.request.body;
            if (!!id) { // 判断有无 ID
                let check = await ctx.app.mysql.query(`SELECT * FROM swipers WHERE id=${id}`);
                if (check.length) { // 表中有这个 ID 可以修改
                    await ctx.app.mysql.update('swipers', ctx.request.body, { where: { id } });
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
                    message: "参数缺失: id"
                }
            }
        } catch (error) {
            ctx.body = {
                code: 400,
                message: "捕获到错误：" + error
            }
        };
    };
    async getHobbySwiper() {
        const { ctx } = this;
        try {
            let { id } = ctx.params;
            if (!id) return ctx.body = { code: 400, message: "参数缺失, 请检查是否传递参数: id" };

            let res = await ctx.app.mysql.query(`SELECT * FROM swipers WHERE id=${id}`);
            if (!res.length) return ctx.body = { code: 400, message: "没有与此 id 相关的数据" };

            ctx.body = {
                code: 200,
                message: "获取成功",
                data: res
            }
        } catch (error) {
            ctx.body = {
                code: 400,
                message: "捕获到错误：" + error
            }
        };
    };
    async getHobbySwiperList() {
        const { ctx } = this;
        try {
            let res = await ctx.app.mysql.select("swipers", { where: { type: 'hobby' } });
            if (!res.length) return ctx.body = { code: 400, message: "没有数据" };

            ctx.body = {
                code: 200,
                message: "获取成功",
                data: res
            }
        } catch (error) {
            ctx.body = {
                code: 400,
                message: "捕获到错误：" + error
            }
        };
    };
    // 文章
    async addHobbyArticle() {
        const { ctx } = this;
        try {
            await ctx.app.mysql.insert('articles', { ...ctx.request.body, type: 'hobby' });
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
    async delHobbyArticle() {
        const { ctx } = this;
        try {
            let { id } = ctx.params;
            if (!id) return ctx.body = { code: 400, message: "参数缺失, 请检查是否传递参数: id" };

            let check = await ctx.app.mysql.select('articles', { where: { id, type: 'hobby' } });
            if (!check.length) return ctx.body = { code: 400, message: "没有与此 id 相关的数据" };
            await ctx.app.mysql.delete('articles', { id, type: 'hobby' })
            ctx.body = { code: 200, message: "删除成功" };
        } catch (error) {
            ctx.body = {
                code: 400,
                message: "捕获到错误：" + error
            }
        };
    };
    async updHobbyArticle() {
        const { ctx } = this;
        try {
            let { id } = ctx.params;
            if (!id) return ctx.body = { code: 400, message: "参数缺失, 请检查是否传递参数: id" };

            let check = await ctx.app.mysql.select('articles', { where: { id, type: 'hobby' } });
            if (!check.length) return ctx.body = { code: 400, message: "没有与此 id 相关的数据" };

            await ctx.app.mysql.update('articles', ctx.request.body, { where: { id, type: 'hobby' } });
            ctx.body = { code: 200, message: "修改成功" };

        } catch (error) {
            ctx.body = {
                code: 400,
                message: "捕获到错误：" + error
            }
        };
    };
    async getHobbyArticle() {
        const { ctx } = this;
        try {
            // 判断有无 ID
            let { id } = ctx.params;
            if (!id) return ctx.body = { code: 400, message: "参数缺失, 请检查是否传递参数: id" };

            // 校验有无数据
            // let res = await ctx.app.mysql.select('articles', { where: { id, type: 'hobby' } });
            let sql = "SELECT articles.*,users.is_admin,users.is_realname FROM articles JOIN users ON articles.id = ? AND users.id = articles.userID";
            let res = await ctx.app.mysql.query(sql,[id]);
            strToArr(res); // 字符串'[]'转数组
            if (!res.length) return ctx.body = { code: 400, message: "没有与此 id 相关的数据" };
            ctx.body = { code: 200, message: "获取成功", data: res };
        } catch (error) {
            ctx.body = {
                code: 400,
                message: "捕获到错误：" + error
            }
        };
    };
    async getHobbyArticleList() {
        const { ctx } = this;
        try {
            // let res = await ctx.app.mysql.select("articles", { where: { type: 'hobby' } });
            let sql = "SELECT articles.*,users.is_admin,users.is_realname FROM articles JOIN users WHERE articles.type=? AND users.id=articles.userID";
            let res = await ctx.app.mysql.query(sql,['hobby']);
            strToArr(res); // 字符串'[]'转数组
            if (!res.length) return ctx.body = { code: 400, message: "没有数据" };
            ctx.body = {
                code: 200,
                message: "获取成功",
                data: res
            };

        } catch (error) {
            console.log(error);
            ctx.body = {
                code: 400,
                message: "捕获到错误：" + error
            }
        };
    };
    // 分类
    async addClassify() {
        const { ctx } = this;
        try {
            // 校验重名
            let { title } = ctx.request.body;
            let item = await ctx.app.mysql.select('classify', { where: { title } });
            if (item.length) return ctx.body = { code: 400, message: '已有相同名称的项目' };

            await ctx.app.mysql.insert('classify', ctx.request.body);
            ctx.body = { code: 200, message: '添加成功' };

        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    async getClassifyList() {
        const { ctx } = this;
        try {
            ctx.body = { code: 200, message: '获取成功', data: await ctx.app.mysql.select('classify') };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    async updClassify() {
        const { ctx } = this;
        try {
            // 校验 ID
            let { id } = ctx.params;
            if (!id) return ctx.body = { code: 400, message: '参数缺失: id' };

            // 校验分类是否存在
            let item = await ctx.app.mysql.select('classify', { where: { id } });
            if (!item.length) return ctx.body = { code: 400, message: '没有与此 id 相关的数据' };

            await ctx.app.mysql.update('classify', ctx.request.body, { where: { id } });
            ctx.body = { code: 200, message: '修改成功' };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    async delClassify() {
        const { ctx } = this;
        try {
            let { id } = ctx.params;
            if (!id) return ctx.body = { code: 400, message: "参数缺失" };

            let item = await ctx.app.mysql.select('classify', { where: { id } });
            if (!item.length) return ctx.body = { code: 400, message: "没有与此 id 相关的数据" };

            await ctx.app.mysql.delete('classify', { id });
            ctx.body = { code: 200, message: "删除成功" };
        } catch (error) {
            ctx.body = {
                code: 400,
                message: "捕获到错误：" + error
            }
        };
    };
    async getClassify() {
        const { ctx } = this;
        try {
            let { id } = ctx.params;
            if (!id) return ctx.body = { code: 400, message: "参数缺失" };

            let res = await ctx.app.mysql.select('classify', { where: { id } });
            if (!res.length) return ctx.body = { code: 400, message: "没有与此 id 相关的数据" };

            ctx.body = {
                code: 200,
                message: "获取成功",
                data: res
            }
        } catch (error) {
            ctx.body = {
                code: 400,
                message: "捕获到错误：" + error
            }
        };
    }
};



