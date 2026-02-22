import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreenModule from "expo-splash-screen";

export default function SplashScreen() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // Shared values for animations
  const opacity1 = useSharedValue(0);
  const scale1 = useSharedValue(0.5);
  const translateY1 = useSharedValue(20);

  const opacity2 = useSharedValue(0);
  const scale2 = useSharedValue(0.5);
  const translateY2 = useSharedValue(20);

  useEffect(() => {
    // Hide native splash screen once the component mounts
    const prepare = async () => {
      await SplashScreenModule.hideAsync();
    };
    prepare();

    // Animate "Hamro"
    opacity1.value = withTiming(1, { duration: 800 });
    scale1.value = withSpring(1, { damping: 10, stiffness: 100 });
    translateY1.value = withTiming(0, { duration: 800 });

    // Animate "सुरक्षा" with delay
    opacity2.value = withDelay(400, withTiming(1, { duration: 800 }));
    scale2.value = withDelay(
      400,
      withSpring(1, { damping: 10, stiffness: 100 }),
    );
    translateY2.value = withDelay(400, withTiming(0, { duration: 800 }));

    // Navigate to Home after 3 seconds
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => ({
    opacity: opacity1.value,
    transform: [{ scale: scale1.value }, { translateY: translateY1.value }],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    opacity: opacity2.value,
    transform: [{ scale: scale2.value }, { translateY: translateY2.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Animated.Text style={[styles.title, animatedStyle1]}>
          Hamro
        </Animated.Text>
        <Animated.Text style={[styles.subtitle, animatedStyle2]}>
          सुरक्षा
        </Animated.Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Secure • Reliable • Fast</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#333",
    letterSpacing: 2,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#007AFF",
    letterSpacing: 1,
  },
  footer: {
    position: "absolute",
    bottom: 50,
  },
  footerText: {
    color: "#999",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
