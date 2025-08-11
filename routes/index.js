const Router = require("koa-router");

const router = new Router();

// 根目录
router.get("/", async (ctx) => {
  await ctx.render("index");
});

const bing = require('./bing');
const rss = require('./rss');
const status = require('./status');

module.exports = (router) => {
  bing(router);
  rss(router);
  status(router);
};

// 404 路由
router.use(async (ctx) => {
  await ctx.render("404");
});

module.exports = router;
