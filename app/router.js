'use strict';

/**
 * @param {Egg.Application} app - egg 实例
 */
module.exports = app => {
  const { router, controller } = app;
  const { checkToken, checkHomeArticleParams } = app.middleware; // 解构中间件
  // home
  router.get('/', controller.home.index); // test
  router.post('/api/home/swiper', controller.home.addHomeSwiper); // 添加 home 轮播图
  router.delete('/api/home/swiper/:id', controller.home.delHomeSwiper); // 通过 ID 删除 home 轮播图
  router.patch('/api/home/swiper/:id', controller.home.updHomeSwiper); // 通过 ID 修改 home 轮播图数据
  router.get('/api/home/swiper/get/:id', controller.home.getHomeSwiper); // 通过 ID 获取单个轮播图数据
  router.get('/api/home/swiper', controller.home.getHomeSwiperList); // 通过 ID 获取所有轮播图数据
  router.post('/api/home/article', checkHomeArticleParams(),controller.home.addHomeArticle); // 新增主页文章
  router.patch('/api/home/article/:id', checkHomeArticleParams(), controller.home.updHomeArticle); // 修改主页文章
  router.delete('/api/home/article/:id', controller.home.delHomeArticle); // 删除主页文章
  router.get('/api/home/article/get/:id', controller.home.getHomeArticle); // 获取主页文章
  router.get('/api/home/article', controller.home.getHomeArticleList); // 获取主页文章列表
  // hobby
  router.post('/api/hobby/swiper',controller.hobby.addHobbySwiper); // 添加 hobby 轮播图
  router.delete('/api/hobby/swiper/:id',controller.hobby.delHobbySwiper); // 删除 hobby 轮播图
  router.patch('/api/hobby/swiper/:id',controller.hobby.updHobbySwiper); // 修改 hobby 轮播图
  router.get('/api/hobby/swiper/get/:id',controller.hobby.getHobbySwiper); // 获取 hobby 轮播图
  router.get('/api/hobby/swiper',controller.hobby.getHobbySwiperList); // 获取 hobby 轮播图列表
};
