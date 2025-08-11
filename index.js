require("dotenv").config();
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("koa2-cors");
const Router = require("koa-router");
const routes = require("./routes");
const serverless = require("serverless-http");

const app = new Koa();
const router = new Router();

// 配置信息
let domain = process.env.ALLOWED_DOMAIN || "*";

// 解析请求体
app.use(bodyParser());

// 跨域
app.use(
  cors({
    origin: domain,
  })
);

app.use(async (ctx, next) => {
  if (domain === "*") {
    await next();
  } else {
    if (ctx.headers.origin === domain || ctx.headers.referer === domain) {
      await next();
    } else {
      ctx.status = 403;
      ctx.body = {
        code: 403,
        message: "请通过正确的域名访问",
      };
    }
  }
});

// 使用路由中间件
routes(router);
app.use(router.routes());
app.use(router.allowedMethods());

module.exports = serverless(app);
