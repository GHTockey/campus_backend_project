'use strict';

const { strToArr, updUserWeeklyBalance } = require("./utils");

// 【必要字段】
// 添加轮播图
let swiperNeedFields = ['title', 'image', 'cid'];
// 添加文章
let articleNeedFields = ['userID', 'title', 'describe', 'content', 'is_topping', 'is_boutique'];
// 添加兴趣分类
let classifyNeedFields = ['title', 'icon', 'url', 'color'];
// 添加用户实名信息
let certifiedNeedFields = ['id', 'name', 'phone', 'class', 'teacher', 'type'];
// 添加评论
let commentsNeedFields = ['aid', 'name', 'avatar', 'content'];
// 新增兼职
let jobNeedFields = ['uid', 'price', 'describe', 'tag', 'phone', 'title'];

/**
 * @param {Egg.Application} app
 */
module.exports = app => {
    updUserWeeklyBalance(app); // 更新用户 weekly_balance 数据
    const { router, controller, middleware, io } = app; // egg 实例
    const { checkToken, checkFieldsTRAstr } = middleware; // 中间件
    // home 主页
    router.post('/api/home/swiper', checkFieldsTRAstr(swiperNeedFields), controller.home.addHomeSwiper); // 添加 home 轮播图
    router.delete('/api/home/swiper/:id', controller.home.delHomeSwiper); // 删除 home 轮播图
    router.post('/api/home/swiper/:id', checkFieldsTRAstr(), controller.home.updHomeSwiper); // 修改 home 轮播图数据
    router.get('/api/home/swiper/get/:id', controller.home.getHomeSwiper); // 获取单个轮播图数据
    router.get('/api/home/swiper', controller.home.getHomeSwiperList); // 获取所有轮播图数据
    router.post('/api/home/article', checkFieldsTRAstr(articleNeedFields), controller.home.addHomeArticle); // 新增主页文章
    router.post('/api/home/article/:id', checkFieldsTRAstr(), controller.home.updHomeArticle); // 修改主页文章 
    router.delete('/api/home/article/:id', controller.home.delHomeArticle); // 删除主页文章
    router.get('/api/home/article/get/:id', controller.home.getHomeArticle); // 获取主页文章
    router.get('/api/home/article', controller.home.getHomeArticleList); // 获取主页文章列表
    // hobby 兴趣圈
    router.post('/api/hobby/swiper', checkFieldsTRAstr(swiperNeedFields), controller.hobby.addHobbySwiper); // 添加 hobby 轮播图
    router.delete('/api/hobby/swiper/:id', controller.hobby.delHobbySwiper); // 删除 hobby 轮播图
    router.post('/api/hobby/swiper/:id', checkFieldsTRAstr(), controller.hobby.updHobbySwiper); // 修改 hobby 轮播图
    router.get('/api/hobby/swiper/get/:id', controller.hobby.getHobbySwiper); // 获取 hobby 轮播图  置顶
    router.get('/api/hobby/swiper', controller.hobby.getHobbySwiperList); // 获取 hobby 轮播图列表
    router.post('/api/hobby/article', checkFieldsTRAstr(articleNeedFields), controller.hobby.addHobbyArticle); // 添加兴趣圈文章
    router.delete('/api/hobby/article/:id', controller.hobby.delHobbyArticle); // 删除兴趣圈文章
    router.post('/api/hobby/article/:id', checkFieldsTRAstr(), controller.hobby.updHobbyArticle); // 修改兴趣圈文章
    router.get('/api/hobby/article/get/:id', controller.hobby.getHobbyArticle); // 获取兴趣圈文章
    router.get('/api/hobby/article', controller.hobby.getHobbyArticleList); // 获取兴趣圈文章列表
    router.post('/api/hobby/cate', checkFieldsTRAstr(classifyNeedFields), controller.hobby.addClassify); // 添加分类
    router.get('/api/hobby/cate', controller.hobby.getClassifyList); // 获取分类列表
    router.post('/api/hobby/cate/:id', checkFieldsTRAstr(), controller.hobby.updClassify); // 修改分类
    router.delete('/api/hobby/cate/:id', controller.hobby.delClassify); // 删除分类
    router.get('/api/hobby/cate/:id', controller.hobby.getClassify); // 获取分类
    // socialize 朋友圈
    router.post('/api/socialize/article', checkFieldsTRAstr(articleNeedFields), controller.socialize.addSocializeArticle); // 添加朋友圈文章
    router.delete('/api/socialize/article/:id', controller.socialize.delSocializeArticle); // 删除朋友圈文章
    router.post('/api/socialize/article/:id', checkFieldsTRAstr(), controller.socialize.updSocializeArticle); // 修改朋友圈文章
    router.get('/api/socialize/article/get/:id', controller.socialize.getSocializeArticle); // 获取朋友圈文章
    router.get('/api/socialize/article', controller.socialize.getSocializeArticleList); // 获取朋友圈文章列表
    // login / register 登录注册
    router.post('/api/LoginOrRegister', controller.login.userLogin); // 登录注册
    router.post('/api/admin/login', controller.login.adminLogin); // 管理员登录
    // other 其它
    router.post('/api/search', controller.other.searchArticle); // 模糊搜索文章
    router.post('/api/upload', controller.other.fileUpdCos); // 文件上传
    router.get('/api/article/topping', controller.other.getToppingArticle); // 获取置顶文章
    router.post('/api/chatlist', checkFieldsTRAstr(['sender_id', 'receiver_id']), controller.other.getChatList); // 获取历史聊天数据
    // users 用户
    router.get('/api/user', controller.user.getUserInfoList); // 获取所有的用户信息
    router.get('/api/user/:id', controller.user.getUserInfo); // 获取用户信息
    router.post('/api/user/pwd/:id', controller.user.updUserPwd); // 修改用户密码
    router.post('/api/user/info/:id', checkFieldsTRAstr(), controller.user.updUserInfo); // 修改用户信息
    router.post('/api/user/:id', checkFieldsTRAstr(), controller.user.updUserData); // 修改用户数据
    router.delete('/api/user/:id', checkToken('admin'), controller.user.delUser); // 删除用户
    router.post('/api/certified/:id', checkFieldsTRAstr(certifiedNeedFields), controller.user.addCertified); // 添加用户实名信息
    router.get('/api/certified', controller.user.getCertifiedList); // 获取所有已实名用户
    router.get('/api/basiclist', controller.user.getUserBasicList); // 获取所有已注册用户名单(仅仅用于注册前输入验证码)
    // 钱包 
    router.post('/api/pay/create', checkFieldsTRAstr(['username', 'price']), controller.pay.createOrder); // 创建订单
    router.get('/api/pay/orders/:username', controller.pay.getOrderList); // 获取订单列表
    router.get('/api/pay/order/:order_id', controller.pay.getOrderDetail); // 获取订单详情
    router.post('/api/pay/res', controller.pay.payResponse); // 接收支付响应 
    router.get('/api/pay/balance/:user_id', controller.pay.getBalance); // 获取用户余额
    // 文章评论
    router.post('/api/comment', checkFieldsTRAstr(commentsNeedFields), controller.other.addComment); // 添加评论
    router.delete('/api/comment/:id', controller.other.delComment); // 删除评论
    router.get('/api/comment/:id', controller.other.getArticleComments); // 获取文章评论
    router.get('/api/comments', controller.other.getAllComments); // 获取所有评论
    // 跑腿
    router.post('/api/task', checkFieldsTRAstr(['issue_id', 'price', 'from', 'to']), controller.errand.createErrandOrders); // 发布跑单
    router.post('/api/task/receice', checkFieldsTRAstr(['oid', 'receive_id', 'state']), controller.errand.takeOrders); // 接单者操作
    router.post('/api/task/issue', checkFieldsTRAstr(['oid', 'issue_id', 'state']), controller.errand.issueHandler); // 发布者操作
    router.get('/api/task/:oid', controller.errand.errandDetail); // 跑单详情
    router.get('/api/tasklist', controller.errand.errandList); // 跑单列表
    router.get('/api/tasklist/receive/:uid', controller.errand.getMyReceiveList); // 获取我的接单列表
    router.get('/api/tasklist/issue/:uid', controller.errand.getMyIssueList); // 获取我发布的跑单列表
    router.delete('/api/task/:oid', controller.errand.delErrandOrder); // 删除跑单
    // 兼职
    router.post('/api/job', checkFieldsTRAstr(jobNeedFields), controller.job.addJob); // 新增兼职
    router.delete('/api/job/:id', controller.job.delJob); // 删除兼职
    router.get('/api/job/list', controller.job.getJobList); // 获取兼职列表
    router.get('/api/job/my/:uid', controller.job.getMySendJobs); // 获取我发布的兼职列表

    // socket.io serve 
    io.of('/').route('updUserOnlineState', io.controller.user.updUserSid); // 更新用户在线状态
    io.of('/').route('sendMsg', io.controller.user.sendMsg); // 发送私聊消息
    io.of('/').route('triggerMsgSend', io.controller.user.sendMsg); // 客户端触发消息返回
};
/*

const { ctx } = this;
try {

} catch (error) {
    ctx.body = { code: 400, message: "捕获到错误：" + error }
};

ctx.body = { code: 400, message: '参数缺失' };

*/

/*
        const { ctx } = this;
        try {
            let data = ctx.args[0]; // 客户端发过来的数据
        } catch (error) {
            await ctx.socket.emit('err', { code: 400, message: "捕获到 socket.io 错误：" + error })
        };
*/

