const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const config = getDefaultConfig(__dirname);

// @hikka/api is also consumed by the web app on React 19.3; its peers must resolve to this app's copies or the bundle gets two Reacts.
const SINGLETONS = ['react', 'react-dom', '@tanstack/react-query'];
const APP_ORIGIN = path.join(__dirname, 'package.json');
const resolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
    const pinned = SINGLETONS.some(
        (name) => moduleName === name || moduleName.startsWith(`${name}/`),
    );
    const next = resolveRequest ?? context.resolveRequest;
    return next(
        pinned ? { ...context, originModulePath: APP_ORIGIN } : context,
        moduleName,
        platform,
    );
};

module.exports = withUniwindConfig(config, {
    cssEntryFile: './src/global.css',
    dtsFile: './src/uniwind-types.d.ts',
});
