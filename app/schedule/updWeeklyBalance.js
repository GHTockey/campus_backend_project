const { strToArr } = require("../utils");

module.exports = {
    schedule: {
        // interval: '1m', // 1 分钟间隔
        // cron: 秒 分 时 日 月 周 [年]
        // * 代表整个时间段
        cron: '0 0 22 * * ?', // 每天22点执行
        type: 'all', // 指定所有的 worker 都需要执行
        immediate: true,
    },
    /** @param {Egg.Context} ctx */
    async task(ctx) {
        // const { ctx } = this;
        try {
            console.log('开始更新用户周余额阶段', new Date());
            let uList = await ctx.app.mysql.select('user_wallet'); // [{id,money,...},...]
            strToArr(uList);
            let ids = uList.map(el => el.user_id);
            let sql = '';
            let ayerSql = '';
            uList.forEach(el => {
                // 今日余额减去昨日余额 == 今天赚了多少钱
                let newItem = +(el.money - el.ayer_balance).toFixed(2) < 0 ? 0 : +(el.money - el.ayer_balance).toFixed(2)
                el.weekly_balance.push(newItem)
                el.weekly_balance.shift()
                sql += ` WHEN ${el.user_id} THEN '[${el.weekly_balance}]'`
                ayerSql += ` WHEN ${el.user_id} THEN ${el.money}`
            });
            await ctx.app.mysql.query(`UPDATE user_wallet 
                                    SET weekly_balance = CASE user_id ${sql} END,
                                    latest_upd_time = NOW(),
                                    ayer_balance = CASE user_id
                                    ${ayerSql} END
                                    WHERE user_id IN (${ids});`);
        } catch (error) {
            console.log("捕获到定时任务的错误：", error);
        };
    }
}