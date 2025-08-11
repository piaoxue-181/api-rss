import "dotenv/config";
import Koa from "koa";
import Router from "koa-router";
import routes from "./api/index.js";
import serverless from "serverless-http";

const app = new Koa();
const router = new Router();

// 使用路由中间件
routes(router);
app.use(router.routes());
app.use(router.allowedMethods());

export default serverless(app);
