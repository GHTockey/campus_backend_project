module.exports = () => {
    return async function refToStr(ctx, next) {
        let obj = ctx.request.body;
        console.log(2);
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                console.log(obj[key]);
                obj[key] = JSON.stringify(obj[key])
            }
        }
        await next()
    };
};