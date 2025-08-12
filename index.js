require("dotenv").config();
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("koa2-cors");
const serve = require("koa-static");
const views = require("koa-views");

const app = new Koa();
const net = require("net");
const router = require("./routes");

// 配置信息
let domain = (() => {
  if (!process.env.ALLOWED_DOMAIN) return '*';
  try {
    const parsed = JSON.parse(process.env.ALLOWED_DOMAIN);
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === 'string') return [parsed];
    return '*';
  } catch {
    return process.env.ALLOWED_DOMAIN;
  }
})();
let port = process.env.PORT || 6688;

// 解析请求体
app.use(bodyParser());

// 静态文件目录
app.use(serve(__dirname + "/public"));
app.use(views(__dirname + "/public"));

// 跨域
app.use(
  cors({
    origin: (ctx) => {
      if (domain === '*') return '*';
      const allowList = Array.isArray(domain) ? domain : [domain];
      const reqOrigin = ctx.headers.origin || ctx.headers.referer || '';
      // 提取主机名部分
      let reqHost = '';
      try {
        reqHost = new URL(reqOrigin).hostname;
      } catch {
        reqHost = reqOrigin.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
      }
      if (allowList.includes(reqHost)) return reqOrigin;
      return false;
    },
  })
);

app.use(async (ctx, next) => {
  if (domain === '*') {
    await next();
  } else {
    const allowList = Array.isArray(domain) ? domain : [domain];
    const reqOrigin = ctx.headers.origin || ctx.headers.referer || '';
    let reqHost = '';
    try {
      reqHost = new URL(reqOrigin).hostname;
    } catch {
      reqHost = reqOrigin.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
    }
    if (allowList.includes(reqHost)) {
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
