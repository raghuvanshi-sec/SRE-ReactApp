import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme, LogBox, Platform } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

// Ignore React 19 / react-native-web third-party event warnings and SVG negative value issues
LogBox.ignoreLogs([
  'Unknown event handler property',
  'attribute width: A negative value is not valid.',
  'attribute height: A negative value is not valid.',
]);

if (Platform.OS === 'web') {
  const ignoreWarnings = [
    'Unknown event handler property',
    'attribute width: A negative value is not valid.',
    'attribute height: A negative value is not valid.',
  ];

  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const message = args.map(arg => typeof arg === 'string' ? arg : String(arg)).join(' ');
    if (ignoreWarnings.some(warning => message.includes(warning))) {
      return;
    }
    originalConsoleError(...args);
  };

  const originalConsoleWarn = console.warn;
  console.warn = (...args: any[]) => {
    const message = args.map(arg => typeof arg === 'string' ? arg : String(arg)).join(' ');
    if (ignoreWarnings.some(warning => message.includes(warning))) {
      return;
    }
    originalConsoleWarn(...args);
  };
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}

