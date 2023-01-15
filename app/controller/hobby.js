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

            let check = await ctx.app.mysql.select('hobbySwiper', { where: { id } });
            if (check.length) {
                ctx.body = {
                    code: 400,
                    message: "ID 重复, 请尝试修改传递的 ID 或者取消传递"
                }
            } else {
                if (!!title && !!image && !!cid) {
                    await ctx.app.mysql.insert("hobbySwiper", { id: id ? id : '0', title, image, cid });
                    ctx.body = {
                        code: 200,
                        message: "添加成功"
                    }
                } else {
                    ctx.body = {
                        code: 400,
                        message: "参数缺失, 请检查是否传递参数: title/image/cid"
                    }
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
                let check = await ctx.app.mysql.query(`SELECT * FROM hobbySwiper WHERE id=${id}`);
                if (check.length) { // 表中有这个 ID 可以删除
                    await ctx.app.mysql.delete('hobbySwiper', { id })
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
            if (!!id && !!title && !!image) { // 判断有无 ID
                let check = await ctx.app.mysql.query(`SELECT * FROM hobbySwiper WHERE id=${id}`);
                if (check.length) { // 表中有这个 ID 可以修改
                    await ctx.app.mysql.query(`update hobbySwiper set title="${title}", image="${image}", cid="${cid}" where id="${id}"`)
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
                    message: "参数缺失, 请检查是否传递参数: id/title/image"
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

            let res = await ctx.app.mysql.query(`SELECT * FROM hobbySwiper WHERE id=${id}`);
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
            let res = await ctx.app.mysql.select("hobbySwiper");
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
            let res = await ctx.app.mysql.select('articles', { where: { id, type: 'hobby' } });
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
            let res = await ctx.app.mysql.select("articles", { where: { type: 'hobby' } });
            strToArr(res); // 字符串'[]'转数组
            if (!res.length) return ctx.body = { code: 400, message: "没有数据" };
            ctx.body = {
                code: 200,
                message: "获取成功",
                data: res
            };

        } catch (error) {
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
            // 校验参数
            let { title, icon, url, color } = ctx.request.body;
            if (!(title && icon && url && color)) return ctx.body = { code: 400, message: '参数缺失' };

            // 校验重名
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
            if (!id) return ctx.body = { code: 400, message: '参数缺失' };

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