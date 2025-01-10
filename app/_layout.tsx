import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import "../global.css";

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    "BeVietnamPro": require("../assets/fonts/Be-Vietnam-Pro/BeVietnamPro-Regular.ttf"),
    "BeVietnamProBlack": require("../assets/fonts/Be-Vietnam-Pro/BeVietnamPro-Black.ttf"),
    "BeVietnamProBlackItalic": require("../assets/fonts/Be-Vietnam-Pro/BeVietnamPro-BlackItalic.ttf"),
    "BeVietnamProBold": require("../assets/fonts/Be-Vietnam-Pro/BeVietnamPro-Bold.ttf"),
    "BeVietnamProBoldItalic": require("../assets/fonts/Be-Vietnam-Pro/BeVietnamPro-BoldItalic.ttf"),
    "BeVietnamProExtraBold": require("../assets/fonts/Be-Vietnam-Pro/BeVietnamPro-ExtraBold.ttf"),
    "BeVietnamProExtraBoldItalic": require("../assets/fonts/Be-Vietnam-Pro/BeVietnamPro-ExtraBoldItalic.ttf"),
    "BeVietnamProExtraLight": require("../assets/fonts/Be-Vietnam-Pro/BeVietnamPro-ExtraLight.ttf"),
    "BeVietnamProExtraLightItalic": require("../assets/fonts/Be-Vietnam-Pro/BeVietnamPro-ExtraLightItalic.ttf"),
    "BeVietnamProItalic": require("../assets/fonts/Be-Vietnam-Pro/BeVietnamPro-Italic.ttf"),
    "BeVietnamProLight": require("../assets/fonts/Be-Vietnam-Pro/BeVietnamPro-Light.ttf"),
    "BeVietnamProLightItalic": require("../assets/fonts/Be-Vietnam-Pro/BeVietnamPro-LightItalic.ttf"),
    "BeVietnamProMedium": require("../assets/fonts/Be-Vietnam-Pro/BeVietnamPro-Medium.ttf"),
    "BeVietnamProMediumItalic": require("../assets/fonts/Be-Vietnam-Pro/BeVietnamPro-MediumItalic.ttf"),
    "BeVietnamProSemiBold": require("../assets/fonts/Be-Vietnam-Pro/BeVietnamPro-SemiBold.ttf"),
    "BeVietnamProSemiBoldItalic": require("../assets/fonts/Be-Vietnam-Pro/BeVietnamPro-SemiBoldItalic.ttf"),
    "BeVietnamProThin": require("../assets/fonts/Be-Vietnam-Pro/BeVietnamPro-Thin.ttf"),
    "BeVietnamProThinItalic": require("../assets/fonts/Be-Vietnam-Pro/BeVietnamPro-ThinItalic.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
