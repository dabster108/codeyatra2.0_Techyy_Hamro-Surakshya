// This file defines types and navigation helpers for the app
import { Href } from "expo-router";
import { View } from "react-native";

// Default export to satisfy Expo Router
export default function NavigationRoute() {
  return <View />;
}

export type AppRoutes = {
  index: undefined;
  home: undefined;
  details: { id: string };
};

export const navigateTo = (router: any, route: Href) => {
  router.push(route);
};

export const Routes = {
  SPLASH: "/" as Href,
  HOME: "/home" as Href,
};
