/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // 用于cookie签名密钥，应更改为您自己的并保持安全
  config.keys = appInfo.name + '_1672667215718_5729';

  // 在此处添加中间件配置
  config.middleware = [];

  // 在此处添加用户配置
  const userConfig = {
    // myAppName: 'egg',
  };

  // 关闭 csrf 安全验证
  config.security = {
    csrf: {
      enable: false,
    }
  };

  // token 安全字符串
  config.jwt = {
    secret: "China"
  };

  // mysql 配置
  config.mysql = {
    client: {
      host: '1.15.48.103',
      port: '3306',
      user: 'campus',
      password: 'EYCsxBY4CZTXJGMd',
      database: 'campus',
    }
  };

  // config.multipart = {
  //   mode: "file"
  // }

  // 跨域
  config.cors = {
    origin: '*', // 允许所以跨域访问，或者白名单
    credentials: true, // 允许跨域携带cookie
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  //  端口
  config.cluster = {
    listen: {
      // path: '',
      port: 7001
    }
  }

  return {
    ...config,
    ...userConfig,
  };
};
