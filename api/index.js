import rss from './rss.js';

export default (router) => {
  router.get("/", async (ctx) => {
    ctx.body = "Hello, Welcome to blowswind's rss";
  });
  rss(router);
};
