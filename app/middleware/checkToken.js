module.exports = (isAdmin) => {
    return async function checkToken(ctx, next) {
        try {
            // 从请求头获取 token authorization
            let token = ctx.get('Authorization').replace('Bearer ', '');
            // 校验 token
            let checkRes = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
            let { username } = checkRes;
            // console.log(username);
            if (isAdmin) {
                // 管理员操作
                let checkAdmin = await ctx.app.mysql.select('users', { where: { username } });
                if (!checkAdmin.length) return ctx.body = { code: 400, message: `此操作需要管理员权限` };
                // 管理员校验通过
                await next();
            } else {
                // 普通用户操作
                await next();
            }
        } catch (error) {
            ctx.body = {
                code: 400,
                message: 'token 无效或已过期',
                error
            }
        };
    };
};