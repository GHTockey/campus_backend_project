'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'eggjs 服务已启动';
  };

  // 添加 home 轮播图
  async addHomeSwiper() {
    const { ctx } = this;
    try {
      let { id, title, image, cid } = ctx.request.body;
      if (!!title && !!image && !!cid) {
        // insert into homeSwiper values(0, "我是标题", "56B04EBA7C016A7A259BC2A76C9412C9CC1168E4_size456_w780_h390", "78946514865");
        await ctx.app.mysql.insert("homeSwiper", { id: id ? id : '0', title, image, cid });
        ctx.body = {
          code: 200,
          message: "添加成功"
        }
      } else {
        ctx.body = {
          code: 400,
          message: "参数缺失, 请检查是否传递参数: title/image/cid"
        }
      }
    } catch (error) {
      ctx.body = {
        code: 400,
        message: "捕获到错误：" + error
      }
    };
  };

  // 通过 ID 删除 home 轮播图
  async delHomeSwiper() {
    const { ctx } = this;
    try {
      let { id } = ctx.params;
      console.log(id);
      if (!!id) { // 判断有无 ID
        let check = await ctx.app.mysql.query(`SELECT * FROM homeSwiper WHERE id=${id}`);
        if (check.length) { // 表中有这个 ID 可以删除
          // delete from homeSwiper where id="114";        
          await ctx.app.mysql.delete('homeSwiper', { id })
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

  // 通过 ID 修改 home 轮播图数据
  async updHomeSwiper() {
    const { ctx } = this;
    try {
      let { id } = ctx.params;
      let { title, image, cid } = ctx.request.body;
      console.log(id);
      if (!!id && !!title && !!image) { // 判断有无 ID
        let check = await ctx.app.mysql.query(`SELECT * FROM homeSwiper WHERE id=${id}`);
        if (check.length) { // 表中有这个 ID 可以修改
          await ctx.app.mysql.query(`update homeSwiper set title="${title}", image="${image}", cid="${cid}" where id="${id}"`)
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
          message: "参数缺失, 请检查是否传递参数: id/title/image"
        }
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
        let res = await ctx.app.mysql.query(`SELECT * FROM homeSwiper WHERE id=${id}`);
        if (res.length) {
          console.log(res);
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
      let res = await ctx.app.mysql.select("homeSwiper");
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
}

module.exports = HomeController;
