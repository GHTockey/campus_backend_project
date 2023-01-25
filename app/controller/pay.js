'use strict';
const { Controller } = require('egg');
const { strToArr } = require('../utils')

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

            // 校验订单通道是否有空余项
            let checkOrder = await ctx.app.mysql.select('pay_codes', { where: { stage: stage, state: 0 } });
            if (checkOrder.length == 0) return ctx.body = { code: 400, message: '当前金额充值通道已满, 请稍后再试' };

            // 分配充值通道
            let passages = await ctx.app.mysql.select('pay_codes', { where: { stage: stage, state: 0 } });
            // pay_codes 设为占用状态
            let time = +new Date(); // 当前时间
            let expiration_time = new Date(time + 120000); // 过期时间
            await ctx.app.mysql.update('pay_codes', { state: 1, expiration_time, date: new Date(time) }, {
                where: { stage: passages[0].stage, really_price: passages[0].really_price }
            });

            let uOrder = {
                order_id: String(time) + String(Math.random()).slice(-5), // 订单号
                price,
                username,
                really_price: passages[0].really_price, // 实际金额
                state: 1, // 等待支付中
                expiration_time, // 两分钟后过期
                date: new Date(time) // 创建时间
            };
            // 创建订单
            await ctx.app.mysql.insert('user_orders', uOrder);
            // 返回订单
            let order = await ctx.app.mysql.select('user_orders', { where: { order_id: uOrder.order_id } });
            ctx.body = {
                code: 200,
                message: "创建订单成功",
                order: { ...order[0], payee_code: passages[0].payee_code }
            }

        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error }
        };
    };
};