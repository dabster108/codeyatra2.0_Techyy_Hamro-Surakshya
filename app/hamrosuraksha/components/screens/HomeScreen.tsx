import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import BottomNav from "@/components/ui/BottomNav";
import { useLang } from "@/context/LanguageContext";
import { useEmergencySOS } from "@/hooks/useEmergencySOS";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, lang, toggleLang } = useLang();
  const { confirmAndSendSOS, sending } = useEmergencySOS();

  const welcomeOpacity = useSharedValue(0);
  const welcomeTranslateY = useSharedValue(24);
  const sosScale = useSharedValue(1);
  const sosGlow = useSharedValue(1);

  useEffect(() => {
    welcomeOpacity.value = withTiming(1, { duration: 700 });
    welcomeTranslateY.value = withSpring(0, { damping: 14, stiffness: 90 });
    // Pulse the SOS ring endlessly
    sosScale.value = withRepeat(
      withSequence(
        withTiming(1.13, { duration: 700 }),
        withTiming(1, { duration: 700 }),
      ),
      -1,
      false,
    );
    sosGlow.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 700 }),
        withTiming(0.12, { duration: 700 }),
      ),
      -1,
      false,
    );
  }, []);

  const welcomeStyle = useAnimatedStyle(() => ({
    opacity: welcomeOpacity.value,
    transform: [{ translateY: welcomeTranslateY.value }],
  }));

  const sosRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sosScale.value }],
    opacity: sosGlow.value,
  }));

  const handleSOS = () => {
    if (!sending) confirmAndSendSOS();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header Section */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerLeft}>
          <View>
            <Text style={styles.headerTitle}>{t.appName}</Text>
            <Text style={styles.headerSubtitle}>{t.appSubtitle}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {/* Language Toggle */}
          <TouchableOpacity style={styles.langButton} onPress={toggleLang}>
            <Ionicons name="globe-outline" size={18} color="#4CAF50" />
            <Text style={styles.langLabel}>{lang === "en" ? "EN" : "NE"}</Text>
          </TouchableOpacity>
          {/* Notification */}
          <TouchableOpacity style={styles.notificationButton}>
            <View style={styles.notificationBadge} />
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <Animated.View style={[styles.welcomeSection, welcomeStyle]}>
          <View style={styles.welcomeRow}>
            {/* Text left */}
            <View style={styles.welcomeTextBlock}>
              <Text style={styles.welcomeTitle}>{t.welcomeLine1}</Text>
              <Text style={styles.welcomeTitleHighlight}>{t.welcomeLine2}</Text>
              <Text style={styles.welcomeDesc}>{t.welcomeDesc}</Text>
            </View>

            {/* SOS button right */}
            <TouchableOpacity
              style={[styles.sosButton, sending && { opacity: 0.7 }]}
              onPress={handleSOS}
              activeOpacity={0.85}
              disabled={sending}
            >
              {/* Pulsing ring behind */}
              <Animated.View style={[styles.sosRing, sosRingStyle]} />
              {/* Circle */}
              <View style={styles.sosCircle}>
                <Ionicons
                  name={sending ? "hourglass" : "flash"}
                  size={28}
                  color="#fff"
                />
                <Text style={styles.sosLabel}>
                  {sending ? t.sosSending : t.sosLabel}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Real-time Alerts */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t.realtimeAlerts}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>{t.viewAll}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.alertList}>
            {/* Alert Item 1 */}
            <View style={styles.alertItem}>
              <View
                style={[
                  styles.alertIconBg,
                  { backgroundColor: "rgba(255, 82, 82, 0.1)" },
                ]}
              >
                <Ionicons name="warning" size={24} color="#FF5252" />
              </View>
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>{t.alert1Title}</Text>
                <Text style={styles.alertSubtitle}>{t.alert1Sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>

            {/* Alert Item 2 */}
            <View style={styles.alertItem}>
              <View
                style={[
                  styles.alertIconBg,
                  { backgroundColor: "rgba(255, 152, 0, 0.1)" },
                ]}
              >
                <Ionicons name="car" size={24} color="#FF9800" />
              </View>
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>{t.alert2Title}</Text>
                <Text style={styles.alertSubtitle}>{t.alert2Sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>

            {/* Alert Item 3 */}
            <View style={styles.alertItem}>
              <View
                style={[
                  styles.alertIconBg,
                  { backgroundColor: "rgba(33, 150, 243, 0.1)" },
                ]}
              >
                <Ionicons name="information-circle" size={24} color="#2196F3" />
              </View>
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>{t.alert3Title}</Text>
                <Text style={styles.alertSubtitle}>{t.alert3Sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
          </View>
        </View>

        {/* Evacuation Areas */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t.evacuationAreas}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>{t.seeMap}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.evacuationList}
          >
            <TouchableOpacity style={styles.evacuationCard}>
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={32} color="#ccc" />
                <Text style={styles.placeholderLabel}>Tudikhel</Text>
              </View>
              <View style={styles.evacuationInfo}>
                <Text style={styles.evacuationName}>{t.evac1Name}</Text>
                <View style={styles.evacuationMeta}>
                  <Ionicons name="location-sharp" size={14} color="#4CAF50" />
                  <Text style={styles.evacuationDistance}>0.5 km</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.evacuationCard}>
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={32} color="#ccc" />
                <Text style={styles.placeholderLabel}>Dasharath</Text>
              </View>
              <View style={styles.evacuationInfo}>
                <Text style={styles.evacuationName}>{t.evac2Name}</Text>
                <View style={styles.evacuationMeta}>
                  <Ionicons name="location-sharp" size={14} color="#4CAF50" />
                  <Text style={styles.evacuationDistance}>2.1 km</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.evacuationCard}>
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={32} color="#ccc" />
                <Text style={styles.placeholderLabel}>UN Park</Text>
              </View>
              <View style={styles.evacuationInfo}>
                <Text style={styles.evacuationName}>{t.evac3Name}</Text>
                <View style={styles.evacuationMeta}>
                  <Ionicons name="location-sharp" size={14} color="#4CAF50" />
                  <Text style={styles.evacuationDistance}>3.4 km</Text>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Shared Bottom Nav */}
      <BottomNav activeTab="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    zIndex: 10,
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  langButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 9,
    paddingVertical: 8,
    backgroundColor: "#f0faf0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c8e6c9",
  },
  langLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4CAF50",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },
  notificationButton: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF5252",
    borderWidth: 1.5,
    borderColor: "#f5f5f5",
    zIndex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  welcomeTextBlock: {
    flex: 1,
    paddingRight: 12,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "300",
    color: "#333",
  },
  welcomeTitleHighlight: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 5,
  },
  welcomeDesc: {
    fontSize: 15,
    color: "#666",
    maxWidth: "90%",
  },
  // SOS
  sosButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  sosRing: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#FF3B30",
    backgroundColor: "rgba(255,59,48,0.08)",
  },
  sosCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 4px 10px rgba(255,59,48,0.45)",
    gap: 1,
  },
  sosLabel: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },
  alertList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  alertItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
  },
  alertIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  alertSubtitle: {
    fontSize: 12,
    color: "#888",
  },
  evacuationList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  evacuationCard: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    overflow: "hidden",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
  },
  imagePlaceholder: {
    height: 100,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderLabel: {
    marginTop: 5,
    fontSize: 12,
    color: "#999",
  },
  evacuationInfo: {
    padding: 12,
  },
  evacuationName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  evacuationMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  evacuationDistance: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
});
