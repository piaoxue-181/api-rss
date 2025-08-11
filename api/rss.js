/**
 * 爬取RSS
 */

const Parser = require('rss-parser');
const parser = new Parser();
const { get, set } = require("../utils/cacheData");

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
    let rss_list = [];
    // 缓存键名
    const cacheKey = "rss_list_cache";
    let data = await get(cacheKey);
    if (data) {
      ctx.body = data;
      return;
    }
    for (const url of url_list) {
      let feed = await parser.parseURL(url);
      feed.items.forEach(item => {
        let snippet = '';
        if (item.contentSnippet) {
          snippet = item.contentSnippet;
        } else if (item.content) {
          const plain = item.content.replace(/<[^>]+>/g, '');
          snippet = plain.length > 200 ? plain.substring(0, 200) + '...' : plain;
        }
        rss_list.push({
          "title": item.title || '',
          "author": feed.title || '',
          "date": item.pubDate || '',
          "link": item.link || '',
          "content": snippet
        });
      });
    }
    let rss_list_new = sortByGmtDate(rss_list, 'date', false);
    await set(cacheKey, rss_list_new);
    ctx.body = rss_list_new;
  });
};
