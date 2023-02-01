'use strict';
const await = require('await-stream-ready/lib/await');
const { Controller } = require('egg');
const utils = require('utility');
const { strToArr, checkFields } = require('../utils');
module.exports = class UserController extends Controller {
    // 获取全部用户信息
    async getUserInfoList() {
        const { ctx } = this;
        try {
            let res = await ctx.app.mysql.select('users');
            strToArr(res);
            ctx.body = { code: 200, message: '获取成功', data: res };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };

    // 获取用户信息
    async getUserInfo() {
        const { ctx } = this;
        try {
            // 判断有无 ID
            let { id } = ctx.params;
            if (!id) return ctx.body = { code: 400, message: "参数缺失, 请检查是否传递参数: id" };

            // 校验有无数据
            let res = await ctx.app.mysql.select('users', { where: { id } });
            if (!res.length) return ctx.body = { code: 400, message: "没有与此 id 相关的数据" };
            strToArr(res);
            ctx.body = { code: 200, message: "获取成功", data: res };

        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };

    // 修改用户密码
    async updUserPwd() {
        const { ctx } = this;
        try {
            // 校验参数
            let id = ctx.params.id;
            let { oldPwd, newPwd } = ctx.request.body;
            if (!(id && oldPwd && newPwd)) return ctx.body = { code: 400, message: '参数缺失' };

            // 校验有无用户
            let userInfo = await ctx.app.mysql.select('users', { where: { id } });
            if (!userInfo.length) return ctx.body = { code: 400, message: '用户不存在, 请检查 ID' };

            // 校验密码 传入的旧密码 === 原密码 取反
            if (!(utils.md5(oldPwd) === userInfo[0].password)) return ctx.body = { code: 400, message: '密码错误' };

            // 校验新密码是否和旧密码相同  新密码 === 旧密码
            if (utils.md5(newPwd) === userInfo[0].password) return ctx.body = { code: 400, message: '旧密码和新密码不能相同' };

            // 修改密码
            await ctx.app.mysql.update('users', { password: utils.md5(newPwd) }, { where: { id } })
            ctx.body = { code: 200, message: '修改成功' };

        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };

    // 修改用户信息
    async updUserInfo() {
        const { ctx } = this;
        try {
            let { id } = ctx.params;
            if (!id) return ctx.body = { code: 400, message: '参数缺失: id' };

            let res = await ctx.app.mysql.update('users', ctx.request.body, { where: { id } });
            if (res.affectedRows == 0) return ctx.body = { code: 400, message: '用户不存在, 请检查 ID' };
            ctx.body = { code: 200, message: '修改成功' };

        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };

    // 修改用户数据
    async updUserData() {
        const { ctx } = this;
        try {
            let { id } = ctx.params;
            if (!id) return ctx.body = { code: 400, message: '参数缺失: id' };

            let res = await ctx.app.mysql.update('users', ctx.request.body, { where: { id } });
            if (res.affectedRows == 0) return ctx.body = { code: 400, message: '用户不存在, 请检查 ID' };
            ctx.body = { code: 200, message: '修改成功' };

        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };

    // 删除用户
    async delUser() {
        const { ctx } = this;
        try {
            let { id } = ctx.params;
            if (!id) return ctx.body = { code: 400, message: '参数缺失: id' };

            if (id == 1) return ctx.body = { code: 400, message: '无法删除超级管理员' };

            let res = await ctx.app.mysql.delete('users', { id });
            if (res.affectedRows == 0) return ctx.body = { code: 400, message: '用户不存在, 请检查 ID' };
            ctx.body = { code: 200, message: '删除成功' };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };

    // 添加实名信息
    async addCertified() {
        const { ctx } = this;
        try {
            let { id } = ctx.params;

            // 是否已实名
            let wherRepeat = await ctx.app.mysql.select('users', { where: { is_realname: 1, id } });
            if (wherRepeat.length) return ctx.body = { code: 400, message: '该用户已实名，请勿重复实名' };

            // 通过 ID 获取用户名并在 user_wallet 表新增这个用户以允许用户充值
            let person = await ctx.app.mysql.select('users', { where: { id } });
            person = person[0]
            await ctx.app.mysql.insert('user_wallet', { user_id: id, username: person.username });

            // 添加实名数据
            await ctx.app.mysql.update('users', { is_realname: 1, certified: JSON.stringify(ctx.request.body) }, { where: { id } });
            ctx.body = { code: 200, message: '添加成功' }
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    // 获取实名信息列表
    async getCertifiedList() {
        const { ctx } = this;
        try {
            let data = await ctx.app.mysql.select('users', { where: { is_realname: 1 } });
            strToArr(data);
            ctx.body = {
                code: 200,
                message: '获取成功',
                data: data
            }
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    }
};