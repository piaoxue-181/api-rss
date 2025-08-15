const { useApp } = require('./leancloud-manager');
const dplayerAppId = process.env.APP_ID_DPLAYER;

// 切换到 DPlayer 应用（仅切换配置，不初始化）

/**
 * 创建并保存一条数据
 */
const dplayer_create = async function createData(list) {
  try {
    const dplayer_read = useApp(dplayerAppId);
    const DPlayer = dplayer_read.Object.extend('DPlayer_' + id);
    const dplayerObj = new DPlayer(); // 避免变量名冲突
    
    dplayerObj.set('player', list.player);
    dplayerObj.set('author', list.author);
    dplayerObj.set('time', list.time);
    dplayerObj.set('text', list.text);
    dplayerObj.set('color', list.color);
    dplayerObj.set('type', list.type);
    dplayerObj.set('ip', list.ip);
    dplayerObj.set('referfer', list.referer);
    dplayerObj.set('date', list.date || new Date());
    
    const result = await dplayerObj.save();
    console.log('数据创建成功，ID:', result.objectId);
    return result;
  } catch (error) {
    console.error('创建数据失败:', error);
    return null;
  }
}

/**
 * 查询数据
 */
const dplayer_query = async function queryData(id) {
  try {
    const dplayer_read = useApp(dplayerAppId);
    const query = new dplayer_read.Query('DPlayer_' + id);
    query.descending('time');
    const results = await query.find();
    
    console.log(`查询到 ${results.length} 条数据`);
    return results.map(item => ({
      "id": item.objectId,
      "player": item.get('player'),
      "author": item.get('author'),
      "time": item.get("time"),
      "text": item.get('text'),
      "color": item.get('color'),
      "type": item.get("type"),
      "ip": item.get("ip"),
      "referfer": item.get("referfer"),
      "date": item.get("date"),
    }));
  } catch (error) {
    console.error('查询数据失败:', error);
    return [];
  }
}

module.exports = {
  dplayer_create,
  dplayer_query
};
    