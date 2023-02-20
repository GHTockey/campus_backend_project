'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  // 跨域包
  cors: {
    enable: true,
    package: "egg-cors"
  },

  jwt: {
    enable: true,
    package: "egg-jwt"
  },

  mysql: {
    enable: true, // 启用前先备好好 MySQL 数据库
    package: 'egg-mysql',
  },

  //  egg-socket.io 注册到 egg 中
  io: {
    enable: true,
    package: 'egg-socket.io'
  },

  tencentCloudCos: {
    enable: true,
    package: 'egg-tencent-cloud-cos'
  }
};
