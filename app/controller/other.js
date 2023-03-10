'use strict';
const { Controller } = require('egg');
const fs = require('fs');
const path = require('path');
// 用于异步操作文件流
const awaitWriteStream = require("await-stream-ready").write;
// 用于关闭管道流
const sendToWormhole = require("stream-wormhole");
// 腾讯云cos
// const COS = require('cos-nodejs-sdk-v5');
// const cos = new COS({
//     SecretId: 'AKID4zg8LK4jASXNzMdfS1LdgV5Um04va4KL',
//     SecretKey: 'ta9XnpcBZnpfLtHSRDoDPRGrHXZMuEJA'
// });
const { strToArr } = require('../utils');

module.exports = class OtherController extends Controller {
    // 模糊搜索文章
    async searchArticle() {
        const { ctx } = this;
        let { value } = ctx.request.body;
        if (!value) return ctx.body = { code: 400, message: '请输入关键词' };
        let sql = `SELECT users.name, articles.id, articles.type, articles.title, articles.date
                    FROM users
                    JOIN articles
                    ON users.id = articles.userID
                    WHERE users.name LIKE '%${value}%' OR articles.title LIKE '%${value}%';`
        let res = await ctx.app.mysql.query(sql);
        strToArr(res); // 字符串'[]'转数组
        ctx.body = {
            code: 200,
            message: '搜索完成',
            data: res
        };
    };
    // 文件上传（本地）
    async fileUpload() {
        const { ctx } = this;
        let fileStream;
        try {
            try {
                fileStream = await this.ctx.getFileStream();
            } catch (err) {
                return ctx.body = { code: 400, message: '没有传入文件或者不支持的文件格式' };

            };
            let { type } = fileStream.fields;
            type = type ? type : 'other';

            // 判断文件夹不存在 
            if (!fs.existsSync(`app/public/imgs/${type}`)) {
                // 创建文件夹
                fs.mkdirSync(`app/public/imgs/${type}`)
            };
            // 生成随机数
            let randomNum = String(+new Date) + String(Math.random()).slice(-5);
            // 创建可写流
            let ws = fs.createWriteStream(`app/public/imgs/${type}/${randomNum + fileStream.filename}`);
            // 写入数据
            try {
                await awaitWriteStream(fileStream.pipe(ws));
            } catch (error) {
                // 如果出现错误则关闭管道流
                await sendToWormhole(fileStream);
                throw error;
            };
            let { size } = fs.statSync(`app/public/imgs/${type}/${randomNum + fileStream.filename}`);
            this.ctx.body = {
                message: '上传完成',
                code: 200,
                data: {
                    filename: fileStream.filename,
                    url: `https://api.tockey.cn/public/imgs/${type}/${randomNum + fileStream.filename}`,
                    size: `${Math.floor(size / 1024 / 1024 * 100) / 100}MB`
                }
            }
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error };
        };
    };
    // 文件上传 (腾讯云cos)
    async fileUpdCos() {
        const { ctx } = this;
        let fileStream;
        try {
            try {
                fileStream = await ctx.getFileStream();
                // console.log(fileStream);
            } catch (err) {
                return ctx.body = { code: 400, message: '没有传入文件或者不支持的文件格式' };

            };
            let { type } = fileStream.fields;
            type = type ? type : 'other';

            let updRes = await ctx.app.tencentCloudCos.putObject({
                Key: `${type}/${fileStream.filename}`,
                Body: fileStream,
                // ContentLength: 1517769,
                // onProgress: function (progressData) {
                //     console.log(JSON.stringify(progressData));
                // }
            });
            if (updRes.statusCode === 200) {
                // console.log(updRes);
                ctx.body = {
                    message: '上传完成',
                    code: 200,
                    data: {
                        filename: fileStream.filename,
                        url: `https://${updRes.Location}`,
                        // size: `${Math.floor(fileStream._readableState.length / 1024 / 1024 * 100) / 100}MB`
                        // size: fileStream._readableState.length
                    }
                }
            } else {
                ctx.body = { code: 400, message: '上传到 cos 中发生错误', info: updRes }
            }
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error };
        };
    };

    // 获取置顶文章
    async getToppingArticle() {
        const { ctx } = this;
        try {
            // 校验参数
            let { type } = ctx.query;
            if (!type) return ctx.body = { code: 400, message: '参数缺失: type' };

            // 校验置顶文章数
            // let articles = await ctx.app.mysql.select('articles', { where: { type, is_topping: 1 } });
            let sql = `SELECT 
                        articles.*,users.is_admin,users.is_realname,users.avatar,users.name
                       FROM 
                        articles 
                       JOIN 
                        users 
                       WHERE 
                        articles.type=? 
                       AND 
                        articles.is_topping=1 
                       AND 
                        users.id=articles.userID`;
            let articles = await ctx.app.mysql.query(sql, [type]);
            if (!articles.length) return ctx.body = { code: 400, message: `分类：${type} 下没有置顶文章` };
            strToArr(articles);
            ctx.body = {
                code: 200,
                message: '获取成功',
                data: articles
            };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };

    // 添加评论
    async addComment() {
        const { ctx } = this;
        try {
            // 检查要评论的文章是否存在
            let checkArticle = await ctx.app.mysql.select('articles', { where: { id: ctx.request.body.aid } });
            if (!checkArticle.length) return ctx.body = { code: 400, message: `文章不存在(aid:${ctx.request.body.aid})` };
            ctx.request.body.date = ctx.request.body.date ? ctx.request.body.date : new Date();
            await ctx.app.mysql.insert('comments', ctx.request.body);
            ctx.body = { code: 200, message: '添加成功' };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    // 删除评论
    async delComment() {
        const { ctx } = this;
        try {
            let { id } = ctx.params;
            if (!id) return ctx.body = { code: 400, message: '参数缺失: id' };
            // // 从请求头获取 token
            // let token = ctx.get('Authorization').replace('Bearer ', '');
            // // 从 token 中获取用户名
            // let checkRes = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
            // let { username } = checkRes;
            // console.log(username);

            let delRes = await ctx.app.mysql.delete('comments', { id });
            if (delRes.affectedRows) return ctx.body = { code: 200, message: '删除成功' };
            ctx.body = { code: 400, message: '删除失败, 评论不存在' }
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    // 获取文章评论
    async getArticleComments() {
        const { ctx } = this;
        try {
            let { id } = ctx.params;
            if (!id) return ctx.body = { code: 400, message: '参数缺失: id' };
            // 检查文章是否存在
            let checkArticle = await ctx.app.mysql.select('articles', { where: { id } });
            if (!checkArticle.length) return ctx.body = { code: 400, message: `文章不存在(id:${id})` };
            let comments = await ctx.app.mysql.select('comments', { where: { aid: id } });
            if (!comments.length) return ctx.body = { code: 200, message: '该文章没有评论数据', comments: [] }
            ctx.body = { code: 200, message: '获取成功', comments };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    // 获取所有评论
    async getAllComments() {
        const { ctx } = this;
        try {
            let comments = await ctx.app.mysql.select('comments');
            if (!comments.length) return ctx.body = { code: 400, message: '该文章没有评论数据', comments: [] }
            ctx.body = { code: 200, message: '获取成功', comments };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };

    // 获取聊天数据(客户端进入聊天页时主动获取历史聊天数据)
    async getChatList() {
        const { ctx } = this;
        try {
            let { sender_id, receiver_id } = ctx.request.body;
            // console.log(ctx.request.body);
            // let chatList = await ctx.app.mysql.select('user_msg_record', { where: { sender_id, receiver_id } });
            let chatList = await ctx.app.mysql.query(`SELECT * FROM user_msg_record WHERE (sender_id=? and receiver_id=?) OR (sender_id=? AND receiver_id=?)`, [sender_id, receiver_id, receiver_id, sender_id]);
            ctx.body = { code: 200, message: '获取成功', chatList };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
};