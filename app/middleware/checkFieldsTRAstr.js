/**
 * 校验字段参数并转换字符串 data:obj  field:str[]
 * @param {*} fields 必填字段
 */
module.exports = (fields) => {
    return async function (ctx, next) {
        // 校验字段
        let data = fields?.indexOf('id') != -1 ? { ...ctx.request.body, id: ctx.params.id } : ctx.request.body;
        let lackFields = []; // 接收缺省字段
        fields?.forEach(key => {
            if (typeof data[key] === 'string') {
                if (data[key][0] == '[' || data[key[0] == '{']) { // '[1]'.length == 3
                    if (data[key].length < 3) lackFields.push(key) // 排除空字符串的数组/空字符串对象
                } else if (!data[key].length) lackFields.push(key) // 排除空字符串
            } else if (typeof data[key] === 'undefined') { // 排除空值
                lackFields.push(key)
            } else if (typeof data[key] === 'object') { // 排除真空数组真空对象
                if (!Object.values(data[key]).length) lackFields.push(key)
            }
        })
        if (lackFields.length) return ctx.body = { code: 400, message: `参数缺失: ${lackFields}` };


        // 将值转为字符串给函数进一步处理
        for (const key in data) {
            if (typeof data[key] === 'object') {
                data[key] = JSON.stringify(data[key])
            }
        }
        ctx.request.body = data;
        await next()
    }

};