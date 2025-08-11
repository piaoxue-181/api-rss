/**
 * 爬取RSS
 */

const Parser = require('rss-parser');
const axios = require('axios');
const { get, set } = require("../utils/cacheData");

// axios 代理 fetch，支持超时
const parser = new Parser({
  requestOptions: {
    timeout: 5000,
  },
  customFetch: async (url, options) => {
    const res = await axios.get(url, { timeout: 5000, responseType: 'text' });
    return {
      ok: true,
      status: res.status,
      text: async () => res.data,
    };
  }
});

// 调用路径
const url_list = JSON.parse(process.env.RSS_URL || '[]');

function sortByGmtDate(items, dateField = 'date', ascending = true) {
  return [...items].sort((a, b) => {
    const timeA = a[dateField] ? new Date(a[dateField]).getTime() : 0;
    const timeB = b[dateField] ? new Date(b[dateField]).getTime() : 0;
    return ascending ? timeA - timeB : timeB - timeA;
  });
}

module.exports = (router) => {
  router.get("/rss", async (ctx) => {
    const cacheKey = "rss_list_cache";
    let data = await get(cacheKey);
    if (data) {
      ctx.body = data;
      return;
    }

    // 并发抓取所有源
    const results = await Promise.allSettled(
      url_list.map(url =>
        parser.parseURL(url).then(feed =>
          feed.items.map(item => ({
            "title": item.title || '',
            "author": feed.title || '',
            "date": item.pubDate || '',
            "link": item.link || '',
            "content": item.contentSnippet || (item.content ? (item.content.replace(/<[^>]+>/g, '').substring(0, 200) + '...') : '')
          }))
        )
      )
    );

    // 合并所有成功的结果
    let rss_list = [];
    for (const r of results) {
      if (r.status === 'fulfilled') {
        rss_list.push(...r.value);
      }
    }

    let rss_list_new = sortByGmtDate(rss_list, 'date', false);
    await set(cacheKey, rss_list_new);
    ctx.body = rss_list_new;
  });
};
