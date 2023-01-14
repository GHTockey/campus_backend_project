// 校验主页文章参数
module.exports = function checkAddArticleParams() {
    return async function (ctx, next) {
        let {
            userID,
            name,
            avatar,
            title,
            describe,
            content,
            cover,
            date,
            is_concern,
            is_like,
            is_topping,
            is_boutique,
            is_collection,
            views
        } = ctx.request.body;
        console.log(ctx.request.body);
        if (!!userID && !!name && !!avatar && !!title && !!describe && !!content && !!cover && !!date && !!String(is_concern) && !!String(is_like) && !!String(is_topping) && !!String(is_boutique) && !!String(is_collection) && !!String(views)) {
            await next(); // 校验通过
        } else {
            ctx.body = {
                code: 400,
                message: "参数缺失, 请检查是否传递参数: userID/name/avatar/title/describe/content/cover/date/is_concern/is_like/is_topping/is_boutique/is_collection/views"
            }
        }
    }
};