// 校验主页文章参数
module.exports = function checkAddArticleParams() {
    return async function (ctx, next) {
        // 必要的字段
        let checkFields = ['userID', 'name', 'avatar', 'title', 'describe', 'content', 'cover', 'date', 'is_concern', 'is_like', 'is_topping', 'is_boutique', 'is_collection', 'views', 'cate'];
        // 缺少的字段
        let lackFields = [];
        // 遍历必要的字段名
        checkFields.forEach(item => {
            // 判断空值
            if (!(ctx.request.body[item] || ctx.request.body[item] == 0)) return lackFields.push(item);
        });
        if (!ctx.request.body.cate) lackFields.push('cate');
        if (!lackFields.length) return await next(); // 校验通过

        ctx.body = { code: 400, message: `参数缺失: ${lackFields}` }

    }
};