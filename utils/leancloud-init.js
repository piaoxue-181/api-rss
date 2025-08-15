const { registerApp } = require('./leancloud-manager');

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