"use strict";

const Controller = require("egg").Controller;

class MaintainController extends Controller {
  // 新增
  async add() {
    const { app, ctx } = this;

    const { info, type } = ctx.request.body;
    console.log(info, type);

    const res = await app.mysql.insert("maintain", { info, type });

    if (res.affectedRows === 0) {
      return (ctx.body = {
        code: 400,
        message: "新增维权失败",
      });
    }

    ctx.body = {
      code: 200,
      message: "新增维权成功",
    };
  }

  // 删除
  async del() {
    const { app, ctx } = this;

    const res = app.mysql.delete("maintain", { id: ctx.params.id });

    if (res.affectedRows === 0) {
      return (ctx.body = {
        code: 400,
        message: "删除维权失败",
      });
    }

    ctx.body = {
      code: 200,
      message: "删除维权成功",
    };
  }

  // 更新
  async state() {
    const { app, ctx } = this

    try {
      const res = await app.mysql.update("maintain", { id: ctx.params.id, state: ctx.request.body.state })
      console.log(res);

      if (res.affectedRows !== 1) {
        return ctx.body = {
          code: 400,
          message: "更新状态失败"
        }
      }

      ctx.body = {
        code: 200,
        message: "更新状态成功"
      }
    } catch (error) {
      ctx.body = {
        code: 400,
        message: "捕获到错误：" + error
      }
    }
  }

  // 获取
  async get() {
    const { app, ctx } = this;

    const res = await app.mysql.get("maintain", { id: ctx.params.id });

    ctx.body = {
      code: 200,
      message: "获取数据成功",
      data: res,
    };
  }

  // 获取全部
  async all() {
    const { app, ctx } = this;

    const res = await app.mysql.select("maintain");

    ctx.body = {
      code: 200,
      message: "获取数据成功",
      data: res || [],
    };
  }
}

module.exports = MaintainController;
