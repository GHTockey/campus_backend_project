'use strict';
const { Controller } = require('egg');
const { getRandomDigits } = require('../utils');

module.exports = class Withdrawal extends Controller {
    // 新增提现申请
    async addWithdrawalApplication() {
        const { ctx } = this;
        try {
            let { uid, withdrawal_money, phone, wx_name } = ctx.request.body;
            // console.log(uid, withdrawal_money, phone, wx_name);
            // 检查用户是否存在
            let sql = `SELECT users.*,user_wallet.money
                        FROM users JOIN user_wallet
                        ON users.id = user_wallet.user_id
                        WHERE user_id = ?`;
            let u = await ctx.app.mysql.query(sql, [uid]);
            if (!u.length) return ctx.body = { code: 400, message: '用户不存在' };
            // 检查用户是否实名
            if (u[0].is_realname != 1) return ctx.body = { code: 400, message: '用户未实名' };
            // 检查用户余额是否足够
            if (withdrawal_money > u[0].money) return ctx.body = { code: 400, message: '发布失败, 余额不足' };
            // 减金额
            let executeRes = await ctx.app.mysql.update('user_wallet', { money: u[0].money - withdrawal_money }, {
                where: { user_id: uid }
            });
            if (executeRes.affectedRows == 1) {
                let oid = 'UW' + getRandomDigits(8); // 生成随机单号
                await ctx.app.mysql.insert('user_withdrawal', { oid, uid, withdrawal_money, phone, wx_name });
                ctx.body = { code: 200, message: '提现申请已提交', oid };
            }
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    // 处理提现申请
    async handlingWithdrawalApplication() {
        const { ctx } = this;
        try {
            let { remark, oid, state } = ctx.request.body;
            let executeRes = await ctx.app.mysql.update('user_withdrawal', {
                remark, state,
                handling_time: new Date()
            }, {
                where: { oid }
            })
            if (executeRes.affectedRows == 1) {
                ctx.body = { code: 200, message: `${state == 2 ? '已拒绝' : '已通过'}该申请` }
            }


            // ctx.body = 'ok'
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    // 获取待审的申请
    async getWithdrawalList() {
        const { ctx } = this;
        try {
            let { state } = ctx.params;
            var res;
            if (!state) return ctx.body = { code: 400, message: '参数缺失: state' };
            if (+state == 0) { // 待审列表
                let sql = `select users.name, user_withdrawal.* from users
                            join user_withdrawal on users.id = user_withdrawal.uid
                            where user_withdrawal.state = 0`;
                res = await ctx.app.mysql.query(sql);
            } else if (+state != 0) { // 获取已处理的申请列表
                let sql = `select users.name, user_withdrawal.* from users
                join user_withdrawal on users.id = user_withdrawal.uid
                where user_withdrawal.state != 0`;
                res = await ctx.app.mysql.query(sql);
            }
            ctx.body = { code: 200, message: '获取成功', data: res || [] }
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    // 获取用户的申请列表
    async getUserApplicationList() {
        const { ctx } = this;
        try {
            let { uid } = ctx.params;
            // 检查 uid 是否存在
            let u = await ctx.app.mysql.select('users', { where: { id: uid } });
            if (!u.length) return ctx.body = { code: 400, message: '用户不存在' };
            if (!uid) return ctx.body = { code: 400, message: '参数缺失: state' };
            let res = await ctx.app.mysql.select('user_withdrawal', { where: { uid } });
            ctx.body = { code: 200, message: '获取成功', data: res };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    // 设置提现额度
    async setWithdrawalLimit() {
        const { ctx } = this;
        try {
            let { limit_max, limit_min } = ctx.request.body;
            // console.log(limit_max, limit_min);
            if (typeof limit_max === 'number' && typeof limit_min === 'number') {
                let executeRes = await ctx.app.mysql.update('sundry', {
                    withdrawal_limit_min: limit_min,
                    withdrawal_limit_max: limit_max,
                }, { where: { id: 1 } });
                if (executeRes.affectedRows == 1) {
                    ctx.body = { code: 200, message: '设置成功' }
                }
            } else {
                ctx.body = { code: 400, message: 'limit 不是 number 类型' }
            }
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    }
};