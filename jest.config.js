module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-screens|react-native-safe-area-context|react-native-reanimated|react-native-worklets|react-native-svg|react-native-keychain|zustand)/)',
  ],
  setupFiles: ['./jest.setup.ts'],
};


