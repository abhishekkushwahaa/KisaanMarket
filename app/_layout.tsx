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
    PoppinsRegular: require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
    PoppinsSemiBold: require('../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    PoppinsMedium: require('../assets/fonts/Poppins/Poppins-Medium.ttf'),
    PoppinsLight: require('../assets/fonts/Poppins/Poppins-Light.ttf'),
    PoppinsThin: require('../assets/fonts/Poppins/Poppins-Thin.ttf'),
    PoppinsThinItalic: require('../assets/fonts/Poppins/Poppins-ThinItalic.ttf'),
    PoppinsExtraBold: require('../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
    PoppinsExtraLight: require('../assets/fonts/Poppins/Poppins-ExtraLight.ttf'),
    PoppinsItalic: require('../assets/fonts/Poppins/Poppins-Italic.ttf'),
    PoppinsBoldItalic: require('../assets/fonts/Poppins/Poppins-BoldItalic.ttf'),
    PoppinsSemiBoldItalic: require('../assets/fonts/Poppins/Poppins-SemiBoldItalic.ttf'),
    PoppinsMediumItalic: require('../assets/fonts/Poppins/Poppins-MediumItalic.ttf'),
    PoppinsLightItalic: require('../assets/fonts/Poppins/Poppins-LightItalic.ttf'),
    PoppinsExtraBoldItalic: require('../assets/fonts/Poppins/Poppins-ExtraBoldItalic.ttf'),
    PoppinsExtraLightItalic: require('../assets/fonts/Poppins/Poppins-ExtraLightItalic.ttf'),
    PoppinsBlack: require('../assets/fonts/Poppins/Poppins-Black.ttf'),
    PoppinsBlackItalic: require('../assets/fonts/Poppins/Poppins-BlackItalic.ttf'),
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