const { registerApp } = require('./leancloud-manager');
console.log('DPlayer 服务器地址:', process.env.SERVERURL_DPLAYER);
console.log('Friend 服务器地址:', process.env.SERVERURL_FRIEND);
// 注册 DPlayer 应用
registerApp(process.env.APP_ID_DPLAYER, {
  appKey: process.env.APP_KEY_DPLAYER,
  serverURLs: process.env.SERVERURL_DPLAYER,
});

// 注册 Friend 应用
registerApp(process.env.APP_ID_FRIEND, {
  appKey: process.env.APP_KEY_FRIEND,
  serverURLs: process.env.SERVERURL_FRIEND,
});