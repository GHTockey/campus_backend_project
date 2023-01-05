module.exports = function checkToken(){
    return async function(ctx,next){
        console.log("校验 token");
        await next();
    }
};