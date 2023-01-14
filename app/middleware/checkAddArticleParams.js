// 校验主页文章参数
module.exports = function checkAddArticleParams() {
    return async function (ctx, next) {
        // 必要的字段
        let checkFields = ['userID', 'name', 'avatar', 'title', 'describe', 'content', 'cover', 'date', 'is_concern', 'is_like', 'is_topping', 'is_boutique', 'is_collection', 'views', 'cate'];
        // 缺少的字段
        let lackFields = [];

        checkFields.forEach(item => {
            if (typeof ctx.request.body[item] === 'string') {
                if (!ctx.request.body[item].length) lackFields.push(item)
            } else if (typeof ctx.request.body[item] === 'undefined') {
                lackFields.push(item)
            } else {
                if (!String(ctx.request.body[item]).length) lackFields.push(item)
            }

        })

        if (lackFields.length) {
            ctx.body = { code: 400, message: `参数缺失: ${lackFields}` }
        } else {
            await next(); // 校验通过
            console.log('校验通过', lackFields);
        }



    }
};