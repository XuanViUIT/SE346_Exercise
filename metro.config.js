const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Thêm '.wasm' vào danh sách các tệp tài sản (assets) được hỗ trợ
config.resolver.assetExts.push('wasm');

module.exports = config;