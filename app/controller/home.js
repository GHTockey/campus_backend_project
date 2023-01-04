'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'eggjs 服务已启动1';
  };

  // 添加轮播图
  async addSwiper(){
    const {ctx} = this;
    console.log(ctx.request.body);
    let res = await ctx.app.mysql.select('users');
    ctx.body = res;
  };
}

module.exports = HomeController;
