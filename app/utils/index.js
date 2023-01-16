// 字符串数组转真数组
let strToArr = function (data) {
    data.forEach(el => {
        for (const key in el) {
            if (key == 'password') delete el.password; // 删除 pwd 字段
            if (el[key]) { // 排除 null
                if (el[key][0] == '[') { // 筛选 [0] 为字符串 '[' 的字段
                    el[key] = el[key].replace(/'/g, '"'); // 单引号转双引号
                    el[key] = JSON.parse(el[key])
                }
            }
        }
    });
};


module.exports = { strToArr }