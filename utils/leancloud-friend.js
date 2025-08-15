const AV = require('leancloud-storage');

// 从环境变量获取当前应用的配置
const appId = process.env.APP_ID_FRIEND;
const appKey = process.env.APP_KEY_FRIEND;
const serverURLs = process.env.SERVERURL_FRIEND;

// 验证配置
if (!appId || !appKey || !serverURLs) {
  throw new Error('Friend 应用配置缺失，请检查环境变量');
}

// 初始化当前应用（仅初始化一次）
if (!AV._isInitialized) {
  AV.init({ appId, appKey, serverURLs });
} else {
  AV.config({ appId, appKey, serverURLs });
}

// 导出当前应用的实例
module.exports = AV;