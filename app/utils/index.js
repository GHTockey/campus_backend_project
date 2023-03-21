/**
 * 字符串数据转引用数据返回给前端
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

/**
 * 定义一个函数来生成指定长度的随机数
 * @param {number} length 
 * @returns {string}
 */
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
 * 根据传入的 Date 判断是否是今天
 * @param {Date} date 
 * @returns {boolean}
 */
function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

module.exports = {
    strToArr,
    sendOnlineUser,
    getRandomDigits,
    isToday
};