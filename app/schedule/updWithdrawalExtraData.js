const { strToArr, isToday } = require("../utils");

module.exports = {
    schedule: {
        // interval: '1m', // 1 分钟间隔
        // cron: 秒 分 时 日 月 周 [年]
        // * 代表整个时间段
        cron: '0 0 0 * * ?', // 每天0点执行
        type: 'all', // 指定所有的 worker 都需要执行
        // immediate: true, // 项目启动立即执行
    },
    /** @param {Egg.Context} ctx */
    async task(ctx) {
        // const { ctx } = this;
        try {
            console.log('开始统计过去7天的提现情况', new Date());
            // 今日提现申请  今日提现金额 
            let todayReq = 0, todayAmount = 0;
            let withdrawalList = await ctx.app.mysql.select('user_withdrawal');
            withdrawalList.forEach(el => {
                // 是否是当天的订单
                if (isToday(el.application_time)) {
                    todayReq++
                    todayAmount += el.withdrawal_money
                };
            })

            // 今天的数据
            let todayData = {
                date: new Date(),
                todayReq,
                todayAmount,
            }
            // 存到杂项数据表 sundry
            let sql = `select sundry.withdrawal_additional_data from sundry`;
            let [{ withdrawal_additional_data }] = await ctx.app.mysql.query(sql);
            withdrawal_additional_data = JSON.parse(withdrawal_additional_data)
            if (withdrawal_additional_data.length >= 7) {
                // 数量大于7就删除最旧的一项并添加新数据到末尾
                withdrawal_additional_data.splice(0, 1)
                withdrawal_additional_data.push(todayData)
            } else {
                withdrawal_additional_data.push(todayData)
            };
            await ctx.app.mysql.update('sundry', {
                withdrawal_additional_data: JSON.stringify(withdrawal_additional_data)
            }, { where: { id: 1 } });
        } catch (error) {
            console.log("捕获到定时任务的错误：", error);
        };
    }
}