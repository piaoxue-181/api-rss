require("dotenv").config();
const Koa = require("koa");
const Router = require("koa-router");
const routes = require("./api");
const serverless = require("serverless-http");

const app = new Koa();
const router = new Router();

// 使用路由中间件
routes(router);
app.use(router.routes());
app.use(router.allowedMethods());

module.exports = serverless(app);
