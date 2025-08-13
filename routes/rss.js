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
  const { limit = 36 } = ctx.query;
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
          // 转换为东八区（UTC+8）时间字符串，格式为YYYY-MM-DD HH:mm:ss
          "date": item.pubDate ? formatDateToCST(item.pubDate) : '',
          "link": item.link || '',
          "content": item.contentSnippet.replace(/</g, '&lt;').replace(/>/g, '&gt;') || (item.content ? (item.content.replace(/<[^>]+>/g, '').substring(0, 200) + '...') : '')
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


// 格式化为 2025-06-24 21:16:16（东八区）
function formatDateToCST(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  // 转为东八区
  const cstDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  const pad = n => n.toString().padStart(2, '0');
  return `${cstDate.getFullYear()}-${pad(cstDate.getMonth() + 1)}-${pad(cstDate.getDate())} ${pad(cstDate.getHours())}:${pad(cstDate.getMinutes())}:${pad(cstDate.getSeconds())}`;
}

module.exports = rssRouter;
