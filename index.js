import "dotenv/config";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa2-cors";
import serve from "koa-static";
import views from "koa-views";
import net from "net";
import router from "./routes/index.js"; // 用 import

const app = new Koa();

// 配置信息
let domain = process.env.ALLOWED_DOMAIN || "*";
let port = process.env.PORT || 6688;

// 解析请求体
app.use(bodyParser());

// 静态文件目录
app.use(serve(process.cwd() + "/public"));
app.use(views(process.cwd() + "/public"));

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
app.use(router.routes());
app.use(router.allowedMethods());

// 启动应用程序并监听端口
const startApp = (port) => {
  app.listen(port, () => {
    console.log(`成功在 ${port} 端口上运行`);
  });
};

// 检测端口是否被占用
const checkPort = (port) => {
  return new Promise((resolve, reject) => {
    const server = net
      .createServer()
      .once("error", (err) => {
        if (err.code === "EADDRINUSE") {
          console.log(`端口 ${port} 已被占用, 正在尝试其他端口...`);
          server.close();
          resolve(false);
        } else {
          reject(err);
        }
      })
      .once("listening", () => {
        server.close();
        resolve(true);
      })
      .listen(port);
  });
};

// 尝试启动应用程序
const tryStartApp = async (port) => {
  let isPortAvailable = await checkPort(port);
  while (!isPortAvailable) {
    port++;
    isPortAvailable = await checkPort(port);
  }
  startApp(port);
};

tryStartApp(port);
