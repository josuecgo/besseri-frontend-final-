const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  resolver: {
    resolveRequest: (context, moduleName, platform) => {
      // Redirige react-dom a react-native
      if (moduleName === 'react-dom') {
        return context.resolveRequest(
          context,
          'react-native',
          platform,
        );
      }
      // Continúa con la resolución normal
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);