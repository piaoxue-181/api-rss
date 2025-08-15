const AV = require('leancloud-storage');

// 存储所有应用的配置（key: appId，value: 配置对象）
const appConfigs = {};
// 当前激活的应用 ID
let activeAppId = null;
// 标记是否已执行过首次初始化
let isGlobalInitialized = false;

/**
 * 注册应用配置
 * @param {string} appId - 应用 ID
 * @param {Object} config - 应用配置（appId, appKey, serverURLs）
 */
function registerApp(appId, config) {
  if (!appId || !config) throw new Error('注册应用需要 appId 和配置');
  appConfigs[appId] = { ...config, appId }; // 确保配置包含 appId
}

/**
 * 切换到指定应用（核心：不重新初始化，只切换配置）
 * @param {string} appId - 要切换的应用 ID
 * @returns {Object} LeanCloud 实例（已切换到目标应用）
 */
function useApp(appId) {
  if (!appConfigs[appId]) throw new Error(`应用 ${appId} 未注册，请先调用 registerApp`);

  const targetConfig = appConfigs[appId];

  // 首次使用：执行初始化（仅一次）
  if (!isGlobalInitialized) {
    AV.init(targetConfig);
    isGlobalInitialized = true;
    activeAppId = appId;
    return AV;
  }

  // 非首次使用：仅切换配置（不重新初始化）
  if (activeAppId !== appId) {
    // 手动更新 SDK 内部的配置（避免调用 AV.init() 触发警告）
    AV._config = { ...AV._config, ...targetConfig };
    activeAppId = appId;
  }

  return AV;
}

module.exports = { registerApp, useApp };