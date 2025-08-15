const AV = require('leancloud-storage');

// 从环境变量获取当前应用的配置
const appId = process.env.APP_ID_DPLAYER;
const appKey = process.env.APP_KEY_DPLAYER;
const serverURLs = process.env.SERVERURL_DPLAYER;

// 验证配置
if (!appId || !appKey || !serverURLs) {
  throw new Error('DPlayer 应用配置缺失，请检查环境变量');
}

// 初始化当前应用（仅初始化一次）
if (!AV._isInitialized) { // 检查是否已初始化
  AV.init({ appId, appKey, serverURLs });
} else {
  // 若已初始化，强制更新当前应用的配置（避免跨应用污染）
  AV.config({ appId, appKey, serverURLs });
}

// 导出当前应用的实例
module.exports = AV;