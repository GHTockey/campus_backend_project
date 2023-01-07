'use strict';
const { Controller } = require('egg');
module.exports = class HobbyController extends Controller {
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
            if (!!id) { // 判断有无 ID
                let res = await ctx.app.mysql.query(`SELECT * FROM hobbySwiper WHERE id=${id}`);
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
    async getHobbySwiperList() {
        const { ctx } = this;
        try {
            let res = await ctx.app.mysql.select("hobbySwiper");
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
    // article
    async addHobbyArticle() {
        const { ctx } = this;
        try {
            let data = ctx.request.body;
            await ctx.app.mysql.insert('hobbyArticle', data);
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
            if (!!id) { // 判断有无 ID
                let check = await ctx.app.mysql.select('hobbyArticle', { where: { id } });
                if (check.length) { // 表中有这个 ID 可以删除   
                    await ctx.app.mysql.delete('hobbyArticle', { id })
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
    async updHobbyArticle() {
        const { ctx } = this;
        try {
            let { id } = ctx.params;
            if (!!id) {
                let check = await ctx.app.mysql.select('hobbyArticle', { where: { id } });
                if (check.length) {
                    await ctx.app.mysql.update('hobbyArticle', ctx.request.body, { where: { id } });
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
    async getHobbyArticle() {
        const { ctx } = this;
        try {
            let { id } = ctx.params;
            if (!!id) { // 判断有无 ID
                let res = await ctx.app.mysql.select('hobbyArticle', { where: { id } });
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
    async getHobbyArticleList() {
        const { ctx } = this;
        try {
            let res = await ctx.app.mysql.select("hobbyArticle");
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