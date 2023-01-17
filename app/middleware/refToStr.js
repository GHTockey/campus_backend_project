module.exports = () => {
    return async function refToStr(ctx, next) {
        let obj = ctx.request.body;
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                obj[key] = JSON.stringify(obj[key])
            }
        }
        await next()
    };
};