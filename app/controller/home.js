'use strict';

const await = require('await-stream-ready/lib/await');
const { Controller } = require('egg');
const { strToArr } = require('../utils');

module.exports = class HomeController extends Controller {
  // 添加 home 轮播图
  async addHomeSwiper() {
    const { ctx } = this;
    try {
      let { id, title, image, cid } = ctx.request.body;
      let check = await ctx.app.mysql.select('swipers', { where: { id, type: 'home' } });
      if (check.length) {
        ctx.body = {
          code: 400,
          message: "ID 重复, 请尝试修改传递的 ID 或者取消传递"
        }
      } else {
        await ctx.app.mysql.insert("swipers", { id: id ? id : '0', title, image, cid, type: 'home' });
        ctx.body = {
          code: 200,
          message: "添加成功"
        }
      }

    } catch (error) {
      ctx.body = {
        code: 400,
        message: "捕获到错误：" + error
      }
    };
  };

  // 通过 ID 删除轮播图
  async delHomeSwiper() {
    const { ctx } = this;
    try {
      let { id } = ctx.params;
      if (!!id) { // 判断有无 ID
        let check = await ctx.app.mysql.query(`SELECT * FROM swipers WHERE id=${id}`);
        if (check.length) { // 表中有这个 ID 可以删除   
          await ctx.app.mysql.delete('swipers', { id })
          ctx.body = {
            code: 200,
            message: "删除成功"
          }
        } else {
          ctx.body = {
            code: 400,
            message: "没有与此 id 相关的数据"
          }
        };
      } else {
        ctx.body = {
          code: 400,
          message: "参数缺失, 请检查是否传递参数: id"
        }
      }
    } catch (error) {
      ctx.body = {
        code: 400,
        message: "捕获到错误：" + error
      }
    };
  };

  // 通过 ID 修改轮播图数据
  async updHomeSwiper() {
    const { ctx } = this;
    try {
      let { id } = ctx.params;
      let { title, image, cid } = ctx.request.body;
      if (!!id) { // 判断有无 ID
        let check = await ctx.app.mysql.query(`SELECT * FROM swipers WHERE id=${id}`);
        if (check.length) { // 表中有这个 ID 可以修改
          await ctx.app.mysql.update('swipers', ctx.request.body, { where: { id } });
          ctx.body = {
            code: 200,
            message: "修改成功"
          }
        } else {
          ctx.body = {
            code: 400,
            message: "没有与此 id 相关的数据"
          }
        };
      }
    } catch (error) {
      ctx.body = {
        code: 400,
        message: "捕获到错误：" + error
      }
    };
  };

  // 通过 ID 获取轮播图数据
  async getHomeSwiper() {
    const { ctx } = this;
    try {
      let { id } = ctx.params;
      if (!!id) { // 判断有无 ID
        let res = await ctx.app.mysql.query(`SELECT * FROM swipers WHERE id=${id}`);
        if (res.length) {
          ctx.body = {
            code: 200,
            message: "获取成功",
            data: res
          }
        } else {
          ctx.body = {
            code: 400,
            message: "没有与此 id 相关的数据"
          }
        };
      } else {
        ctx.body = {
          code: 400,
          message: "参数缺失, 请检查是否传递参数: id"
        }
      }
    } catch (error) {
      ctx.body = {
        code: 400,
        message: "捕获到错误：" + error
      }
    };
  };

  // 获取所有 home 轮播图数据
  async getHomeSwiperList() {
    const { ctx } = this;
    try {
      let res = await ctx.app.mysql.select("swipers",{where:{type:'home'}});
      if (res.length) {
        ctx.body = {
          code: 200,
          message: "获取成功",
          data: res
        }
      } else {
        ctx.body = {
          code: 400,
          message: "没有数据"
        }
      };
    } catch (error) {
      ctx.body = {
        code: 400,
        message: "捕获到错误：" + error
      }
    };
  };

  // 新增文章
  async addHomeArticle() {
    const { ctx } = this;
    try {
      // console.log(ctx.request.body);
      await ctx.app.mysql.insert('articles', { ...ctx.request.body, type: 'home' });
      ctx.body = {
        code: 200,
        message: "添加成功"
      }
    } catch (error) {
      ctx.body = {
        code: 400,
        message: "捕获到错误：" + error
      }
    };
  };

  // 删除文章
  async delHomeArticle() {
    const { ctx } = this;
    try {
      let { id } = ctx.params;
      if (!!id) { // 判断有无 ID
        let check = await ctx.app.mysql.select('articles', { where: { id, type: 'home' } });
        if (check.length) { // 表中有这个 ID 可以删除   
          await ctx.app.mysql.delete('articles', { id, type: 'home' })
          ctx.body = {
            code: 200,
            message: "删除成功"
          }
        } else {
          ctx.body = {
            code: 400,
            message: "没有与此 id 相关的数据"
          }
        };
      } else {
        ctx.body = {
          code: 400,
          message: "参数缺失, 请检查是否传递参数: id"
        }
      }
    } catch (error) {
      ctx.body = {
        code: 400,
        message: "捕获到错误：" + error
      }
    };
  };

  // 修改文章
  async updHomeArticle() {
    const { ctx } = this;
    try {
      let { id } = ctx.params;
      if (!!id) {
        let check = await ctx.app.mysql.select('articles', { where: { id, type: 'home' } });
        if (check.length) {
          await ctx.app.mysql.update('articles', ctx.request.body, { where: { id, type: 'home' } });
          ctx.body = {
            code: 200,
            message: "修改成功"
          }
        } else {
          ctx.body = {
            code: 400,
            message: "没有与此 id 相关的数据"
          }
        };
      } else {
        ctx.body = {
          code: 400,
          message: "参数缺失, 请检查是否传递参数: id"
        }
      }
    } catch (error) {
      ctx.body = {
        code: 400,
        message: "捕获到错误：" + error
      }
    };
  };

  // 获取文章
  async getHomeArticle() {
    const { ctx } = this;
    try {
      let { id } = ctx.params;
      if (!!id) { // 判断有无 ID
        let res = await ctx.app.mysql.select('articles', { where: { id, type: 'home' } });
        strToArr(res); // 字符串'[]'转数组
        if (res.length) {
          ctx.body = {
            code: 200,
            message: "获取成功",
            data: res
          }
        } else {
          ctx.body = {
            code: 400,
            message: "没有与此 id 相关的数据"
          }
        };
      } else {
        ctx.body = {
          code: 400,
          message: "参数缺失, 请检查是否传递参数: id"
        }
      }
    } catch (error) {
      ctx.body = {
        code: 400,
        message: "捕获到错误：" + error
      }
    };
  };

  // 获取所有 home 轮播图数据
  async getHomeArticleList() {
    const { ctx } = this;
    try {
      let res = await ctx.app.mysql.select("articles", { where: { type: 'home' } });
      strToArr(res); // 字符串'[]'转数组
      if (res.length) {
        ctx.body = {
          code: 200,
          message: "获取成功",
          data: res
        }
      } else {
        ctx.body = {
          code: 400,
          message: "没有数据"
        }
      };
    } catch (error) {
      ctx.body = {
        code: 400,
        message: "捕获到错误：" + error
      }
    };
  };
};
