'use strict';
const { Controller } = require('egg');
const { getRandomDigits } = require('../utils');

module.exports = class Errand extends Controller {
    // 创建跑单
    async createErrandOrders() {
        const { ctx } = this;
        try {
            let { issue_id, price, remarks, from, to } = ctx.request.body;
            let u = await ctx.app.mysql.select(`users`, { where: { id: issue_id } });
            if (!u.length) return ctx.body = { code: 400, message: '用户不存在' };
            let oid = 'task' + getRandomDigits(6); // 生成随机单号
            await ctx.app.mysql.insert('errand_orders', { issue_id, price, remarks, from, to, oid });
            ctx.body = { code: 200, message: '跑单创建成功' };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    // 接单者操作 (0待接单-1待取货-2送货中-3已送达)
    async takeOrders() {
        const { ctx } = this;
        try {
            let { oid, receive_id, state } = ctx.request.body;
            // console.log(state)
            // 检查接单者是否还有为完成的跑单
            // let isSingle = await ctx.app.mysql.select('errand_orders', { where: { receive_id } });

            if (state == 0) { // 用户接单 此时将 state 改为 1 待取货状态
                let executionRes = await ctx.app.mysql.update('errand_orders', { state: 1, receive_id }, { where: { oid, state: 0 } });
                if (executionRes.affectedRows == 0) return ctx.body = { code: 400, message: '已被抢单或单号不存在' };
                ctx.body = { code: 200, message: '接单成功, 开始取货' };
            } else if (state == 1) { // 跑腿取到货 此时改为 state: 2 送货状态
                let executeRes = await ctx.app.mysql.update('errand_orders', { state: 2 }, { where: { oid, receive_id, state: 1 } });
                if (executeRes.affectedRows == 0) return ctx.body = { code: 400, message: '此订单不是待取货状态' };
                ctx.body = { code: 200, message: '取货操作成功, 开始送货' };
            } else if (state == 2) { // 跑腿送货完成 此时 state 改为 3 送达状态
                let executeRes = await ctx.app.mysql.update('errand_orders', { state: 3 }, { where: { oid, receive_id, state: 2 } });
                if (executeRes.affectedRows == 0) return ctx.body = { code: 400, message: '此订单不是送货状态' };
                ctx.body = { code: 200, message: '送达操作成功, 等待对方确定' };
            }
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    // 发布者操作 (4已取消-5已完成)
    async issueHandler() {
        const { ctx } = this;
        try {
            let { oid, receive_id, state } = ctx.request.body;
            if (state == 4) {
                let executionRes = await ctx.app.mysql.update('errand_orders', { state }, { where: { oid } });
                if (executionRes.affectedRows == 0) return ctx.body = { code: 400, message: '此订单已取消或已完成' };
                ctx.body = { code: 200, message: '取消成功' };
            } else if (state == 5) {
                // Handler .................. // 开始转移资金 ...
                let executionRes = await ctx.app.mysql.update('errand_orders', { state, finish_time: new Date() }, { where: { state: 3, oid } });
                if (executionRes.affectedRows == 0) return ctx.body = { code: 400, message: '此订单未进入送达状态' };
                ctx.body = { code: 200, message: '确定送达成功' };
            }
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    // 跑单详情
    async errandDetail() {
        const { ctx } = this;
        try {
            let { oid } = ctx.params;
            if (!oid) return ctx.body = { code: 400, message: '请在URL传入参数: /[oid]' };
            // let res = await ctx.app.mysql.select('errand_orders', { where: { oid } });
            let res = await ctx.app.mysql.query(`SELECT errand_orders.*,users.avatar,users.name
                                                 from errand_orders
                                                 join users
                                                 on errand_orders.issue_id = users.id
                                                 where oid=?`, [oid]);
            if (!res.length) return ctx.body = { code: 400, message: '单号不存在' };
            ctx.body = { code: 200, message: '获取成功', data: res[0] };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    // 跑单列表 待接单
    async errandList() {
        const { ctx } = this;
        try {
            // let { uid } = ctx.params;
            // if (!uid) return ctx.body = { code: 404, message: '参数缺失: uid' };
            // let res = await ctx.app.mysql.select('errand_orders', { where: { state: 0 } });
            let res = await ctx.app.mysql.query(`SELECT errand_orders.*,users.avatar,users.name
                                                FROM errand_orders 
                                                JOIN users 
                                                ON errand_orders.issue_id = users.id
                                                where state = 0`);
            ctx.body = { code: 200, message: '获取成功', data: res };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    // 获取我的跑单列表 (我接到的摊单子)
    async getMyReceiveList() {
        const { ctx } = this;
        try {
            let { uid } = ctx.params;
            let res = await ctx.app.mysql.query(`SELECT
                                                    errand_orders.*,
                                                    users.avatar,users.name
                                                FROM
                                                    errand_orders
                                                JOIN
                                                    users
                                                ON
                                                    errand_orders.issue_id = users.id
                                                WHERE
                                                    state !=4 AND state !=5 AND receive_id=?`, [uid]);
            ctx.body = { code: 200, message: '获取成功', data: res };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error };
        };
    };
    // 获取我发布的跑单列表
    async getMyIssueList() {
        const { ctx } = this;
        try {
            let { uid } = ctx.params;
            // let res = await ctx.app.mysql.select('errand_orders', { where: { issue_id: uid } });
            let res = await ctx.app.mysql.query(`SELECT errand_orders.*, users.avatar,users.name
                                                 FROM errand_orders
                                                 JOIN users
                                                 ON errand_orders.issue_id = users.id
                                                 WHERE errand_orders.issue_id=?`, [uid]);
            ctx.body = { code: 200, message: '获取成功', data: res };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    // 删除跑单
    async delErrandOrder() {
        const { ctx } = this;
        try {
            let { oid } = ctx.params;
            let executeRes = await ctx.app.mysql.delete(`errand_orders`, { oid });
            if (executeRes.affectedRows == 0) return ctx.body = { code: 400, message: '没有与此ID相关的数据' };
            ctx.body = { code: 200, message: '删除成功' };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
};