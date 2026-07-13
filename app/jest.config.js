module.exports = {
  preset: '@react-native/jest-preset',
  testEnvironment: '@shopify/react-native-skia/jestEnv.js',
  setupFiles: [
    require.resolve('@react-native/jest-preset/jest/setup.js'),
    'react-native-gesture-handler/jestSetup.js',
    '@shopify/react-native-skia/jestSetup.js',
    '<rootDir>/jest/setup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?' +
      '|@react-native-async-storage/async-storage' +
      '|react-native-gesture-handler|react-native-reanimated|react-native-worklets' +
      '|@shopify/react-native-skia|react-native-safe-area-context' +
      '|socket.io-client|engine.io-client|socket.io-parser|engine.io-parser)/)',
  ],
};
