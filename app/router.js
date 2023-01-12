'use strict';

/**
 * @param {Egg.Application} app - egg 实例
 */
module.exports = app => {
  const { router, controller } = app;
  const { checkToken, checkAddArticleParams } = app.middleware; // 解构中间件
  // home 主页
  router.get('/', checkToken(), controller.home.index); // test
  router.post('/api/home/swiper', controller.home.addHomeSwiper); // 添加 home 轮播图
  router.delete('/api/home/swiper/:id', controller.home.delHomeSwiper); // 删除 home 轮播图
  router.patch('/api/home/swiper/:id', controller.home.updHomeSwiper); // 修改 home 轮播图数据
  router.get('/api/home/swiper/get/:id', controller.home.getHomeSwiper); // 获取单个轮播图数据
  router.get('/api/home/swiper', controller.home.getHomeSwiperList); // 获取所有轮播图数据
  router.post('/api/home/article', checkAddArticleParams(), controller.home.addHomeArticle); // 新增主页文章
  router.patch('/api/home/article/:id', checkAddArticleParams(), controller.home.updHomeArticle); // 修改主页文章
  router.delete('/api/home/article/:id', controller.home.delHomeArticle); // 删除主页文章
  router.get('/api/home/article/get/:id', controller.home.getHomeArticle); // 获取主页文章
  router.get('/api/home/article', controller.home.getHomeArticleList); // 获取主页文章列表
  // hobby 兴趣圈
  router.post('/api/hobby/swiper', controller.hobby.addHobbySwiper); // 添加 hobby 轮播图
  router.delete('/api/hobby/swiper/:id', controller.hobby.delHobbySwiper); // 删除 hobby 轮播图
  router.patch('/api/hobby/swiper/:id', controller.hobby.updHobbySwiper); // 修改 hobby 轮播图
  router.get('/api/hobby/swiper/get/:id', controller.hobby.getHobbySwiper); // 获取 hobby 轮播图
  router.get('/api/hobby/swiper', controller.hobby.getHobbySwiperList); // 获取 hobby 轮播图列表
  router.post('/api/hobby/article', checkAddArticleParams(), controller.hobby.addHobbyArticle); // 添加兴趣圈文章
  router.delete('/api/hobby/article/:id', controller.hobby.delHobbyArticle); // 删除兴趣圈文章
  router.patch('/api/hobby/article/:id', checkAddArticleParams(), controller.hobby.updHobbyArticle); // 修改兴趣圈文章
  router.get('/api/hobby/article/get/:id', controller.hobby.getHobbyArticle); // 获取兴趣圈文章
  router.get('/api/hobby/article', controller.hobby.getHobbyArticleList); // 获取兴趣圈文章列表
  router.post('/api/hobby/cate', controller.hobby.addClassify); // 添加分类
  router.get('/api/hobby/cate', controller.hobby.getClassifyList); // 获取分类列表
  router.patch('/api/hobby/cate/:id', controller.hobby.updClassify); // 修改分类
  router.delete('/api/hobby/cate/:id', controller.hobby.delClassify); // 删除分类
  router.get('/api/hobby/cate/:id', controller.hobby.getClassify); // 获取分类
  // socialize 朋友圈
  router.post('/api/socialize/article', checkAddArticleParams(), controller.socialize.addSocializeArticle); // 添加朋友圈文章
  router.delete('/api/socialize/article/:id', controller.socialize.delSocializeArticle); // 删除朋友圈文章
  router.patch('/api/socialize/article/:id', checkAddArticleParams(), controller.socialize.updSocializeArticle); // 修改朋友圈文章
  router.get('/api/socialize/article/get/:id', controller.socialize.getSocializeArticle); // 获取朋友圈文章
  router.get('/api/socialize/article', controller.socialize.getSocializeArticleList); // 获取朋友圈文章列表
  // login / register 登录注册
  router.post('/api/LoginOrRegister', controller.login.userLogin); // 登录注册
  router.post('/api/admin/login', controller.login.adminLogin); // 管理员登录
  // other 其它
  router.post('/api/search', controller.other.searchArticle); // 模糊搜索文章
  router.post('/api/upload', controller.other.fileUpload); // 文件上传
  // users 用户
  router.get('/api/user', controller.user.getUserInfoList); // 获取所有的用户信息
  router.get('/api/user/:id', controller.user.getUserInfo); // 获取用户信息
  router.patch('/api/user/pwd/:id', controller.user.updUserPwd); // 修改用户密码
  router.patch('/api/user/info/:id', controller.user.updUserInfo); // 修改用户信息
  router.patch('/api/user/:id', controller.user.updUserData); // 修改用户数据
  router.delete('/api/user/:id', checkToken(true), controller.user.delUser); // 删除用户
};
/*

const { ctx } = this;
try {

} catch (error) {
    ctx.body = { code: 400, message: "捕获到错误：" + error }
};

ctx.body = { code: 400, message: '参数缺失' };

*/

