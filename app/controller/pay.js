'use strict';
const { Controller } = require('egg');
const { strToArr, payCodeChangeHandler } = require('../utils');

module.exports = class Pay extends Controller {
    // 创建订单
    async createOrder() {
        const { ctx } = this;
        try {
            let stage; // 存放充值档位
            let { username, price } = ctx.request.body;
            if (price == 0.01) stage = 'test';
            if (price == 10) stage = 'ten';
            if (price == 30) stage = 'thirty';
            if (price == 50) stage = 'fifty';
            if (!stage) return ctx.body = { code: 400, message: '参数 price 错误' };

            let res = await ctx.app.mysql.select('user_wallet', { where: { username } });
            if (!res.length) return ctx.body = { code: 400, message: "用户未实名或不存在" };

            // 校验该用户是否有未结束的订单
            let checkRes = await ctx.app.mysql.select('user_orders', { where: { username, state: 1 } });
            if (checkRes.length) return ctx.body = { code: 400, message: '您还有未支付的订单' };

            // 校验订单通道是否有空余
            let checkOrder = await ctx.app.mysql.select('pay_codes', { where: { stage: stage, state: 0 } });
            if (checkOrder.length == 0) return ctx.body = { code: 400, message: '当前金额没有可用的通道' };

            // 分配充值通道
            let passages = await ctx.app.mysql.select('pay_codes', { where: { stage: stage, state: 0 } });
            let time = +new Date(); // 生成创建时间
            let expiration_time = new Date(time + 120000); // 生成过期时间
            let order_id = String(time) + String(Math.random()).slice(-5); // 生成订单号
            // pay_codes 设为占用状态并写入订单ID
            await ctx.app.mysql.update('pay_codes', { state: 1, expiration_time, date: new Date(time), order_id }, {
                where: { stage: passages[0].stage, really_price: passages[0].really_price }
            });

            // 通知中控端
            payCodeChangeHandler(ctx);

            let uOrder = {
                order_id, // 订单号
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
            let orderList = await ctx.app.mysql.query(`SELECT order_id,price,remarks,state,date FROM user_orders where username = ?`, username);
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
            let payee_code = await ctx.app.mysql.query('SELECT payee_code FROM pay_codes WHERE order_id = ?', order_id);
            ctx.body = { code: 200, message: '获取成功', order: { ...order[0], payee_code: payee_code[0]?.payee_code } };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error };
        };
    };
    // 支付响应
    async payResponse() {
        const { ctx, app } = this;
        // 订单状态：-1  |  订单过期 0   |   等待支付 1   |   完成  2
        try {
            let { money, time, type, title, deviceid, content } = ctx.request.body;
            money = money == 'null' ? content.match(/(\d+\.\d+|\d+)(?=元)/)[1] : money;
            // console.log(money);
            if(Number(money) > 1) money = Number(money) + 20
            // console.log(content.match(/(\d+\.\d+|\d+)(?=元)/)[1]);
            // 根据金额浮点数筛选出充值的用户
            let person = await ctx.app.mysql.select('user_orders', { where: { really_price: money, state: 1 } });
            if (!person.length) return ctx.body = { code: 400, message: '当前没有订单' };

            person = person[0];
            // console.log(person);
            let { username, order_id, really_price, remarks } = person;
            let pay_time = new Date(time); // 完成支付时间

            // 将用户订单更新为成功状态
            await ctx.app.mysql.update('user_orders', { state: 2, remarks, pay_time }, { where: { really_price: money, state: 1 } });
            // 释放支付通道
            await ctx.app.mysql.update('pay_codes', { state: 0, expiration_time: null, date: null, order_id: null }, { where: { really_price, state: 1, order_id } });
            // 通知中控端
            payCodeChangeHandler(ctx);
            // 余额增加
            let yue = await ctx.app.mysql.select('user_wallet', { where: { username } });
            await ctx.app.mysql.update('user_wallet', { money: yue[0].money + money }, { where: { username } });

            console.log(`${pay_time} 用户 ${person.username} 充值 ${person.really_price} 成功 `);
            ctx.body = { code: 200, message: '充值完成' };

            // 主动发送 socket 响应到客户端
            let user = await ctx.app.mysql.query(`SELECT users.socket_id,users.id FROM users WHERE username=?`, [username]);
            // console.log(user[0].socket_id);
            app.io.to(user[0].socket_id).emit('payOutcome', { code: 200, message: '支付完成', username, uid: user[0].id, money });
        } catch (error) {
            // console.log(error);
            ctx.body = { code: 400, message: "捕获到错误：" + error };
        };
    };
    // 获取余额
    async getBalance() {
        const { ctx } = this;
        try {
            let { user_id } = ctx.params;
            let res = await ctx.app.mysql.select('user_wallet', { where: { user_id } });
            if (!res.length) return ctx.body = { code: 400, message: "用户未实名或不存在" };
            strToArr(res);
            ctx.body = { code: 200, message: "获取成功", balance: res[0] };
        } catch (error) {
            ctx.body = { code: 400, message: "捕获到错误：" + error };
        };

    };
}