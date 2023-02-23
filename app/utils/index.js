/**
 * 字符串数组转真数组返回给前端
 * @param {EggMySQLSelectResult} data 
 */
let strToArr = (data) => {
    data.forEach(el => {
        for (const key in el) {
            if (key == 'password') delete el.password; // 删除 pwd 字段
            if (el[key]) { // 排除 null
                if (el[key][0] == '[' || el[key][0] == '{') { // 筛选 [0] 为字符串 '[{' 的字段
                    el[key] = el[key].replace(/'/g, '"'); // 单引号转双引号
                    el[key] = JSON.parse(el[key])
                }
            }
        }
    });
};

/**
 * 发送在线用户数据
 * @param {Egg.BaseContextClass} ctx 
 */
let sendOnlineUser = async (ctx) => {
    let onlineUser = await ctx.app.mysql.query(`SELECT id,name,username,avatar,signature,sex,is_admin,socket_id FROM users WHERE is_online=1`);
    if (!onlineUser.length) return;
    ctx.socket.broadcast.emit('onlineUser', { message: '当前在线的用户：', onlineUser });
    ctx.socket.emit('onlineUser', { message: '当前在线的用户：', onlineUser });
};

// 定义一个函数来生成指定长度的随机数
function getRandomDigits(length) {
    // 计算范围的最小值，比如length为5时，min为10的4次方
    let min = Math.pow(10, length - 1);
    // 计算范围的最大值，比如length为5时，max为10的5次方减1
    let max = Math.pow(10, length) - 1;
    // 生成一个min到max之间的整数
    let num = Math.floor(Math.random() * (max - min + 1)) + min;
    // 返回数字作为字符串
    return num.toString();
};

/**
 * 定时自动更新用户 weekly_balance 数据
 * @param {Egg.Application} app 
 */
function updUserWeeklyBalance(app) {
    var now = new Date(); // 当前时间
    var end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0, 0); // 表示今天22点
    // 计算两个Date对象之间的毫秒数差 得到当天距离当天22点之间的毫秒
    var diff = end.getTime() - now.getTime();
    // 定时器会在每天22点执行
    setTimeout(async () => {
        console.log('开始更新用户周余额阶段', new Date());
        let uList = await app.mysql.select('user_wallet'); // [{id,money,...},...]
        strToArr(uList);
        uList.forEach(el => {
            // 判断今天是否已更新 避免过了22点的时候一直修改数据
            if (!(new Date(el.latest_upd_time).toDateString() == new Date().toDateString()) || el.latest_upd_time == null) {
                el.weekly_balance.shift()
                el.weekly_balance.push(el.money)
                app.mysql.update('user_wallet', {
                    weekly_balance: JSON.stringify(el.weekly_balance), // 最新数据
                    latest_upd_time: new Date() // 修改时间
                }, { where: { user_id: el.user_id } });
            }
        })
    }, diff);

};

module.exports = {
    strToArr,
    sendOnlineUser,
    getRandomDigits,
    updUserWeeklyBalance,
};