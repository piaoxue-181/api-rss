/**
 * 爬取RSS订阅
 */

const { get, set } = require("../utils/cacheData");
const Parser = require('rss-parser');
const Router = require("koa-router");
const axios = require('axios'); // 新增
const rssRouter = new Router();

const url_list = JSON.parse(process.env.RSS_URL || '[]');

const parser = new Parser({
  requestOptions: {
    timeout: 5000,
  },
  customFetch: async (url, _options) => {
    const res = await axios.get(url, { timeout: 5000, responseType: 'text' });
    return {
      ok: true,
      status: res.status,
      text: async () => res.data,
    };
  }
});

function sortByGmtDate(items, dateField = 'date', ascending = true) {
  return [...items].sort((a, b) => {
    const timeA = a[dateField] ? new Date(a[dateField]).getTime() : 0;
    const timeB = b[dateField] ? new Date(b[dateField]).getTime() : 0;
    return ascending ? timeA - timeB : timeB - timeA;
  });
}

rssRouter.get("/rss", async (ctx) => {
  const { limit } = ctx.query;
  const cacheKey = "rss_list_cache";
  let data = await get(cacheKey);
  if (data) {
    ctx.body = data.slice(0, limit); // 优化：返回前limit条
    return;
  }

  // 并发抓取所有源
  const results = await Promise.allSettled(
    url_list.map(url =>
      parser.parseURL(url).then(feed =>
        feed.items.map(item => ({
          "title": item.title || '',
          "auther": feed.title || '',
          "date": item.pubDate ? new Date(item.pubDate).toISOString().replace(/\.\d{3}Z$/, 'Z') : '',
          "link": item.link || '',
          "content": item.contentSnippet || (item.content ? (item.content.replace(/<[^>]+>/g, '').substring(0, 200) + '...') : '')
        }))
      )
    )
  );

  let rss_list = [];
  for (const r of results) {
    if (r.status === 'fulfilled') {
      rss_list.push(...r.value);
    }
  }

  let rss_list_new = sortByGmtDate(rss_list, 'date', false);
  await set(cacheKey, rss_list_new, 60 * 10); // 设置缓存10分钟
  ctx.body = rss_list_new.slice(0, limit); // 返回前limit条
});

module.exports = rssRouter;
