const bing = require('./bing');
const rss = require('./rss');
const status = require('./status');

module.exports = (router) => {
  router.get("/", async (ctx) => {
    await ctx.render("index");
  });
  bing(router);
  rss(router);
  status(router);
};
