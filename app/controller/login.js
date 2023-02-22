'use strict';
const { Controller } = require('egg');
// 实用工具集合包(MD5/SHA1/SHA256/HMAC/解码编码:base64/escape等..)
const utils = require('utility');
const { strToArr } = require('../utils');
module.exports = class LoginController extends Controller {
    // 用户登录注册
    async userLogin() {
        const { ctx } = this;
        try {
            // 校验参数
            let { username, password } = ctx.request.body;
            if (!Boolean(username && password)) return ctx.body = { code: 400, message: '参数缺失' };

            // 检测账号是否已注册
            let userInfo = await ctx.app.mysql.select('users', { where: { username } });
            if (userInfo.length) { // 已注册
                // 校验密码
                let checkPwd = await ctx.app.mysql.select('users', { where: { username, password: utils.md5(password) } });
                if (!checkPwd.length) return ctx.body = { code: 400, message: '用户名或密码错误' };
                strToArr(userInfo);
                ctx.body = {
                    code: 200,
                    message: '登录成功',
                    // 根据 username + secret 签发 token
                    token: 'Bearer ' + ctx.app.jwt.sign(
                        { username },
                        ctx.app.config.jwt.secret, // token 安全字符串
                        { expiresIn: ctx.app.config.tokenEffectiveTime } // token 有效时间
                    ),
                    userInfo: userInfo[0]
                };
            } else { // 未注册
                // 注册用户
                await ctx.app.mysql.insert('users', { username, password: utils.md5(password) });
                let newUser = await ctx.app.mysql.select('users', { where: { username } });
                strToArr(newUser); // '[' => [
                ctx.body = {
                    code: 200,
                    message: '已将用户注册',
                    // 根据 username + secret 签发 token 
                    token: 'Bearer ' + ctx.app.jwt.sign(
                        { username },
                        ctx.app.config.jwt.secret, // token 安全字符串
                        { expiresIn: ctx.app.config.tokenEffectiveTime } // token 有效时间
                    ),
                    userInfo: newUser[0]
                };
            };
        } catch (error) {
            ctx.body = {
                code: 400,
                message: "捕获到错误：" + error
            }
        };
    };

    // 管理员登录
    async adminLogin() {
        const { ctx } = this;
        try {
            // 校验参数
            let { username, password } = ctx.request.body;
            if (!Boolean(username && password)) return ctx.body = { code: 400, message: '参数缺失' };

            // 校验管理员权限
            let checkAdmin = await ctx.app.mysql.select('users', { where: { username } });
            if (!checkAdmin.length) return ctx.body = { code: 400, message: '你的账号非管理员账号' };

            // 校验密码
            let checkPwdRes = await ctx.app.mysql.select('users', { where: { username, password: utils.md5(password) } });
            if (!checkPwdRes.length) return ctx.body = { code: 400, message: '密码错误' };
            strToArr(checkPwdRes);
            ctx.body = {
                code: 200,
                message: '登录成功',
                token: 'Bearer ' + ctx.app.jwt.sign(
                    { username },
                    ctx.app.config.jwt.secret,
                    { expiresIn: '3h' }
                ),
                userInfo: checkPwdRes[0]
            };
        } catch (error) {
            ctx.body = {
                code: 400,
                message: "捕获到错误：" + error
            }
        }
    };
};