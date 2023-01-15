let strToArr = function (data) {
    data.forEach(el => {
        for (const key in el) {
            if (el[key]) { // 排除 null
                if (el[key][0] == '[') { // 筛选 [0] 为字符串 '[' 的字段
                    el[key] = el[key].replace(/'/g, '"'); 
                    el[key] = JSON.parse(el[key])
                }
            }
        }
    });
};


module.exports = { strToArr }