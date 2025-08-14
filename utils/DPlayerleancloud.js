const AV = require('leancloud-storage');

const appid = process.env.APP_ID_DPLAYER;
const appkey = process.env.APP_KEY_DPLAYER;
const serverURL = process.env.SERVERURL_DPLAYER;

// 初始化 LeanCloud 连接
AV.init({
  appId: appid,
  appKey: appkey,
  serverURL: serverURL
});

/**
 * 创建并保存一条数据
 */
const dplayer_create = async function createData(list) {
  try {
    const DPlayer = AV.Object.extend('DPlayer');
    const dplayer = new DPlayer();
    
    dplayer.set('player', list.player);
    dplayer.set('author', list.author);
    dplayer.set('time', list.time);
    dplayer.set('text', list.text);
    dplayer.set('color', list.color);
    dplayer.set('type', list.type);
    dplayer.set('ip', list.ip);
    dplayer.set('referfer', list.referer);
    dplayer.set('date', list.date);
    
    const result = await dplayer.save();
    console.log('数据创建成功，ID:', result.id);
    return result;
  } catch (error) {
    console.error('创建数据失败:', error);
    return null; // 确保始终返回一个值
  }
}

/**
 * 查询数据 - 修复版
 */
const dplayer_query = async function queryData(id) {
  try {
    const query = new AV.Query('DPlayer_' + id);
    query.descending('time'); // 按时间降序排序
    const results = await query.find();
    
    console.log(`查询到 ${results.length} 条数据:`);
    
    // 使用 map 替代 forEach，因为 map 会返回新数组
    const list_get = results.map(item => ({
      "id": item.id,
      "player": item.get('player'),
      "author": item.get('author'),
      "time": item.get("time"),
      "text": item.get('text'), // 修复：之前错误地获取了 'status'
      "color": item.get('color'),   // 修复：之前错误地获取了 'priority'
      "type": item.get("type"),
      "ip": item.get("ip"),
      "referfer": item.get("referfer"),
      "date": item.get("date"),
    }));
    
    // 移除了错误的 Promise 处理逻辑，因为查询结果不是 Promise 数组
    return list_get;
  } catch (error) {
    console.error('查询数据失败:', error);
    return []; // 错误时返回空数组，避免 undefined
  }
}

module.exports = {
  dplayer_create,
  dplayer_query
};
