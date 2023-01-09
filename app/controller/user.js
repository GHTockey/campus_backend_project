'use strict';
const {Controller} = require('egg');
module.exports = class UserController extends Controller {
    // 获取全部用户信息
    async index(){
        const {ctx}= this;

        ctx.body='index'
    };

    // 获取用户信息
    async show(){
        this.ctx.body='show'
    };


};