'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'eggjs 服务已启动';
  }
}

module.exports = HomeController;
