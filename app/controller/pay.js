'use strict';
const { Controller } = require('egg');
const { strToArr } = require('../utils');

module.exports = class Pay extends Controller {
    // 创建订单
    async createOrder() {
        const { ctx } = this;
        try {
            let stage; // 存放充值档位
            let { username, price } = ctx.request.body;
            if (price == 10) stage = 'ten';
            if (price == 30) stage = 'thirty';
            if (price == 50) stage = 'fifty';
            if (!stage) return ctx.body = { code: 400, message: '参数 price 错误' };

            // 校验该用户是否有未结束的订单
            let checkRes = await ctx.app.mysql.select('user_orders', { where: { username, state: 1 } });
            if (checkRes.length) return ctx.body = { code: 400, message: '您还有未支付的订单' };

            // 校验订单通道是否有空余
            let checkOrder = await ctx.app.mysql.select('pay_codes', { where: { stage: stage, state: 0 } });
            if (checkOrder.length == 0) return ctx.body = { code: 400, message: '当前金额充值通道已满, 请稍后再试' };

            // 分配充值通道
            let passages = await ctx.app.mysql.select('pay_codes', { where: { stage: stage, state: 0 } });
            let time = +new Date(); // 当前时间
            let expiration_time = new Date(time + 120000); // 过期时间
            // pay_codes 设为占用状态
            await ctx.app.mysql.update('pay_codes', { state: 1, expiration_time, date: new Date(time) }, {
                where: { stage: passages[0].stage, really_price: passages[0].really_price }
            });

            let uOrder = {
                order_id: String(time) + String(Math.random()).slice(-5), // 订单号
                price,
                username,
                remarks: '账号充值',
                really_price: passages[0].really_price, // 实际金额
                state: 1, // 等待支付中
                expiration_time, // 两分钟后过期
                date: new Date(time) // 创建时间
            };
            // 创建订单
            await ctx.app.mysql.insert('user_orders', uOrder);
            // 返回订单
            let order = await ctx.app.mysql.select('user_orders', { where: { order_id: uOrder.order_id } });
            if (!order.length) return ctx.body = { code: 400, message: '发生异常, 没有 order' };
            ctx.body = {
                code: 200,
                message: "创建订单成功",
                order: { ...order[0], payee_code: passages[0].payee_code }
            };

        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    // 查询订单列表 
    async getOrderList() {
        const { ctx } = this;
        try {
            let { username } = ctx.params;
            if (!username) return ctx.body = { code: 400, message: '参数缺失：username' };
            // let orderList = await ctx.app.mysql.select('user_orders', { where: { username } });
            let orderList = await ctx.app.mysql.query(`SELECT order_id,price,remarks,state,date FROM user_orders`);
            ctx.body = { code: 200, message: '获取成功', orderList };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    // 获取订单详情
    async getOrderDetail() {
        const { ctx } = this;
        try {
            let { order_id } = ctx.params;
            if (!order_id) return ctx.body = { code: 400, message: '参数缺失：order_id' };
            let order = await ctx.app.mysql.select('user_orders', { where: { order_id } });
            if (!order.length) return ctx.body = { code: 400, message: '没有此单号的数据' };
            ctx.body = { code: 200, message: '获取成功', order: order[0] };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    // 支付响应
    async payResponse() {
        const { ctx } = this;
        // 订单状态：-1  |  订单过期 0   |   等待支付 1   |   完成  2
        try {
            let { money, time, type, title, deviceid, content } = ctx.request.body;
            money = Number(money) + 10
            console.log(money);
            // 根据金额+浮点数筛选出充值的用户
            let person = await ctx.app.mysql.select('user_orders', { where: { really_price: money, state: 1 } });
            person = person[0];

            let pay_time = new Date(); // 完成支付时间
            // 将用户订单更新为成功状态
            await ctx.app.mysql.update('user_orders', { state: 2, pay_time })

            console.log(`${pay_time} 用户 ${person.username} 充值 ${person.really_price} 成功 `);
            ctx.body = 'ok';
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
    // 获取余额
    async getBalance() {
        const { ctx } = this;
        try {
            let { user_id } = ctx.params;
            let res = await ctx.app.mysql.select('user_wallet', { where: { user_id } });
            if (!res.length) return ctx.body = { code: 400, message: "用户未实名或不存在" };
            ctx.body = { code: 200, message: "获取成功", balance: res[0] };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };

    };
}