'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/api/home/swiper',controller.home.addHomeSwiper); // 添加 home 轮播图
  router.delete('/api/home/swiper/:id',controller.home.delHomeSwiper); // 通过 ID 删除 home 轮播图
  router.patch('/api/home/swiper/:id', controller.home.updHomeSwiper); // 通过 ID 修改 home 轮播图数据
  router.get('/api/home/swiper/get/:id', controller.home.getHomeSwiper); // 通过 ID 获取单个轮播图数据
  router.get('/api/home/swiper', controller.home.getHomeSwiperList); // 通过 ID 获取所有轮播图数据
};
