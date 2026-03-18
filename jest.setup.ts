// Jest setup file - mock native modules
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn().mockResolvedValue(true),
  getGenericPassword: jest.fn().mockResolvedValue(null),
  resetGenericPassword: jest.fn().mockResolvedValue(true),
  STORAGE_TYPE: { AES: 'AES' },
  ACCESSIBLE: { WHEN_UNLOCKED: 'WHEN_UNLOCKED' },
}));

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const View = require('react-native').View;
  const Text = require('react-native').Text;

  const mockAnimatedValue = (initial: number) => ({
    value: initial,
    setValue: jest.fn(),
  });

  return {
    __esModule: true,
    default: {
      View,
      Text,
      ScrollView: View,
      call: () => {},
      event: () => {},
      add: jest.fn(),
      eq: jest.fn(),
      set: jest.fn(),
      cond: jest.fn(),
      interpolate: jest.fn(),
      Value: jest.fn(() => mockAnimatedValue(0)),
      createAnimatedComponent: (component: React.ComponentType) => component,
    },
    useSharedValue: (initial: number) => ({ value: initial }),
    useAnimatedStyle: (fn: () => object) => fn(),
    withTiming: (value: number) => value,
    withSpring: (value: number) => value,
    withSequence: (...args: number[]) => args[args.length - 1],
    withDelay: (_delay: number, value: number) => value,
    interpolate: jest.fn((value: number) => value),
    Extrapolation: { CLAMP: 'clamp', EXTEND: 'extend' },
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      quad: jest.fn(),
      cubic: jest.fn(),
      bezier: jest.fn(),
      in: jest.fn(),
      out: jest.fn(),
      inOut: jest.fn(),
    },
    runOnJS: (fn: (...args: unknown[]) => void) => fn,
    runOnUI: (fn: (...args: unknown[]) => void) => fn,
    useAnimatedRef: jest.fn(() => React.createRef()),
    useAnimatedScrollHandler: jest.fn(),
    useAnimatedGestureHandler: jest.fn(),
  };
});

jest.mock('react-native-svg', () => {
  const React = require('react');
  const mockSvgComponent = (name: string) => {
    const Component = ({ children }: { children?: React.ReactNode }) =>
      React.createElement(name, null, children);
    Component.displayName = name;
    return Component;
  };
  return {
    __esModule: true,
    default: mockSvgComponent('Svg'),
    Svg: mockSvgComponent('Svg'),
    Circle: mockSvgComponent('Circle'),
    Rect: mockSvgComponent('Rect'),
    Path: mockSvgComponent('Path'),
    G: mockSvgComponent('G'),
    Text: mockSvgComponent('SvgText'),
    TSpan: mockSvgComponent('TSpan'),
    Defs: mockSvgComponent('Defs'),
    LinearGradient: mockSvgComponent('LinearGradient'),
    Stop: mockSvgComponent('Stop'),
  };
});

jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
  Screen: 'Screen',
  ScreenStack: 'ScreenStack',
  NativeScreen: 'NativeScreen',
  NativeScreenContainer: 'NativeScreenContainer',
}));

jest.mock('@react-native-vector-icons/material-design-icons', () => 'Icon');

