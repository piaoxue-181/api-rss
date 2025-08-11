/**
 * 爬取RSS
 */

import Parser from 'rss-parser';
import axios from 'axios';
import cache from "../utils/cacheData.js";

const parser = new Parser({
  customFetch: async (url, options) => {
    const res = await axios.get(url, { timeout: 5000, responseType: 'text' });
    return {
      ok: true,
      status: res.status,
      text: async () => res.data,
    };
  }
});

const url_list = JSON.parse(process.env.RSS_URL || '[]');

function sortByGmtDate(items, dateField = 'date', ascending = true) {
  return [...items].sort((a, b) => {
    const timeA = a[dateField] ? new Date(a[dateField]).getTime() : 0;
    const timeB = b[dateField] ? new Date(b[dateField]).getTime() : 0;
    return ascending ? timeA - timeB : timeB - timeA;
  });
}

export default async (req, res) => {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end('Method Not Allowed');
    return;
  }

  const cacheKey = "rss_list_cache";
  let data = await cache.get(cacheKey);
  if (data) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
    return;
  }

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

  let rss_list = [];
  for (const r of results) {
    if (r.status === 'fulfilled') {
      rss_list.push(...r.value);
    }
  }

  let rss_list_new = sortByGmtDate(rss_list, 'date', false);
  await cache.set(cacheKey, rss_list_new);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(rss_list_new));
};
