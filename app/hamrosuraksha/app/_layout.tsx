import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { LanguageProvider } from "@/context/LanguageContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <LanguageProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="home"
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
          <Stack.Screen name="map" options={{ headerShown: false }} />
          <Stack.Screen name="alert" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </LanguageProvider>
  );
}
