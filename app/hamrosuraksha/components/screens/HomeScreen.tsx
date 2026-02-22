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
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import BottomNav from "@/components/ui/BottomNav";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const welcomeOpacity = useSharedValue(0);
  const welcomeTranslateY = useSharedValue(24);

  useEffect(() => {
    welcomeOpacity.value = withTiming(1, { duration: 700 });
    welcomeTranslateY.value = withSpring(0, { damping: 14, stiffness: 90 });
  }, []);

  const welcomeStyle = useAnimatedStyle(() => ({
    opacity: welcomeOpacity.value,
    transform: [{ translateY: welcomeTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header Section */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={24} color="#333" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Hamro Suraksha</Text>
            <Text style={styles.headerSubtitle}>सुरक्षा</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <View style={styles.notificationBadge} />
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <Animated.View style={[styles.welcomeSection, welcomeStyle]}>
          <Text style={styles.welcomeTitle}>Stay Safe,</Text>
          <Text style={styles.welcomeTitleHighlight}>Stay Secure</Text>
          <Text style={styles.welcomeDesc}>
            Real-time protection and monitoring.
          </Text>
        </Animated.View>

        {/* Real-time Alerts */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Real-time Alerts</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View All</Text>
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
                <Text style={styles.alertTitle}>Heavy Rainfall Warning</Text>
                <Text style={styles.alertSubtitle}>
                  Kathmandu Valley • 2m ago
                </Text>
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
                <Text style={styles.alertTitle}>Traffic Congestion</Text>
                <Text style={styles.alertSubtitle}>
                  Koteshwor - Tinkune • 15m ago
                </Text>
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
                <Text style={styles.alertTitle}>System Maintenance</Text>
                <Text style={styles.alertSubtitle}>
                  Scheduled for 12:00 AM • 1h ago
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
          </View>
        </View>

        {/* Evacuation Areas - Compact Modern Scrollable List */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Evacuation Areas</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See Map</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.evacuationList}
          >
            {/* Evacuation Item 1 */}
            <TouchableOpacity style={styles.evacuationCard}>
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={32} color="#ccc" />
                <Text style={styles.placeholderLabel}>Tudikhel</Text>
              </View>
              <View style={styles.evacuationInfo}>
                <Text style={styles.evacuationName}>Tudikhel Ground</Text>
                <View style={styles.evacuationMeta}>
                  <Ionicons name="location-sharp" size={14} color="#4CAF50" />
                  <Text style={styles.evacuationDistance}>0.5 km</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Evacuation Item 2 */}
            <TouchableOpacity style={styles.evacuationCard}>
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={32} color="#ccc" />
                <Text style={styles.placeholderLabel}>Dasharath</Text>
              </View>
              <View style={styles.evacuationInfo}>
                <Text style={styles.evacuationName}>Dasharath Stadium</Text>
                <View style={styles.evacuationMeta}>
                  <Ionicons name="location-sharp" size={14} color="#4CAF50" />
                  <Text style={styles.evacuationDistance}>2.1 km</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Evacuation Item 3 */}
            <TouchableOpacity style={styles.evacuationCard}>
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={32} color="#ccc" />
                <Text style={styles.placeholderLabel}>UN Park</Text>
              </View>
              <View style={styles.evacuationInfo}>
                <Text style={styles.evacuationName}>UN Park</Text>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuButton: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
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
    maxWidth: "80%",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
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
