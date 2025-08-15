const AV = require('leancloud-storage');
const axios = require('axios'); // 引入 Axios（LeanCloud 依赖的请求库）

const appConfigs = {};
let activeAppId = null;
let isGlobalInitialized = false;

function registerApp(appId, config) {
  if (!appId) throw new Error('注册应用失败：缺少 appId');
  if (!config) throw new Error('注册应用失败：缺少配置对象');
  if (!config.appKey) throw new Error(`应用 ${appId} 注册失败：缺少 appKey`);
  if (!config.serverURLs) throw new Error(`应用 ${appId} 注册失败：缺少 serverURLs`);
  if (!config.serverURLs.startsWith('http')) {
    throw new Error(`应用 ${appId} 注册失败：serverURLs 格式错误（当前值：${config.serverURLs}）`);
  }

  appConfigs[appId] = { ...config, appId };
}

function useApp(appId) {
  if (!appConfigs[appId]) throw new Error(`应用 ${appId} 未注册，请先调用 registerApp`);

  const targetConfig = appConfigs[appId];
  console.log(`[应用切换] 从 ${activeAppId || '未初始化'} 切换到 ${appId}`);
  console.log(`[应用切换] 目标服务器地址：${targetConfig.serverURLs}`);

  if (!isGlobalInitialized) {
    // 首次初始化（使用任意应用的配置，后续通过拦截器修改）
    AV.init(targetConfig);
    isGlobalInitialized = true;
    activeAppId = appId;
    
    // 关键修复：使用 Axios 拦截器强制修改请求地址
    axios.interceptors.request.use(config => {
      // 只拦截 LeanCloud 的 API 请求
      if (config.url?.startsWith('/1.1/')) {
        const currentServerURL = appConfigs[activeAppId].serverURLs;
        // 替换请求的基础地址为当前活跃应用的服务器地址
        config.baseURL = currentServerURL;
        console.log(`[Axios 拦截] 请求已重定向到：${currentServerURL + config.url}`);
      }
      return config;
    });
    
    return AV;
  }

  if (activeAppId !== appId) {
    activeAppId = appId;
  }

  return AV;
}

module.exports = { registerApp, useApp };