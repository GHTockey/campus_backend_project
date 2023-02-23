// / <reference path="../../node_modules/egg-core/index.d.ts" />
/**
 * @param {string} control 传入'admin'检查用户是否是管理员
 * @example checkToken('admin') 需要管理员权限
 * @example checkToken() 仅仅检查 token 是否有效
 */
module.exports = (control) => {
    /**@param {Egg.Context} ctx */
    return async function checkToken(ctx, next) {
        try {
            // 从请求头获取 token authorization
            let token = ctx.get('Authorization').replace('Bearer ', '');
            // 校验 token
            let checkRes = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
            let { username } = checkRes;
            // console.log(username);
            if (control === 'admin') {
                // 管理员操作
                let checkAdmin = await ctx.app.mysql.select('users', { where: { username } });
                if (!checkAdmin.length) return ctx.body = { code: 400, message: `此操作需要管理员权限` };
                // 管理员校验通过
                await next();
            }else {
                // 普通用户操作
                await next();
            }
        } catch (error) {
            ctx.body = {
                code: 400,
                message: '请检查 token',
                error
            }
        };
    };
};