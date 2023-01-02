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
    package: "egg-core"
  },

  jwt: {
    enable: true,
    package: "egg-jwt"
  },

  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
};
