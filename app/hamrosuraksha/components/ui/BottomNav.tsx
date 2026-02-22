import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ActiveTab = "home" | "alert" | "map" | "settings";

interface BottomNavProps {
  activeTab: ActiveTab;
}

export default function BottomNav({ activeTab }: BottomNavProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 20 }]}>
      <View style={styles.bar}>
        {/* Home */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => activeTab !== "home" && router.replace("/home")}
        >
          <Ionicons
            name={activeTab === "home" ? "home" : "home-outline"}
            size={24}
            color={activeTab === "home" ? "#007AFF" : "#888"}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "home" && { color: "#007AFF" },
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        {/* Alert */}
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons
            name={activeTab === "alert" ? "warning" : "warning-outline"}
            size={24}
            color={activeTab === "alert" ? "#4CAF50" : "#888"}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "alert" && { color: "#4CAF50" },
            ]}
          >
            Alert
          </Text>
        </TouchableOpacity>

        {/* Center FAB */}
        <View style={styles.fabWrapper}>
          <TouchableOpacity style={styles.fab}>
            <Ionicons name="add" size={32} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Map */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => activeTab !== "map" && router.push("/map")}
        >
          <Ionicons
            name={activeTab === "map" ? "map" : "map-outline"}
            size={24}
            color={activeTab === "map" ? "#007AFF" : "#888"}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "map" && { color: "#007AFF" },
            ]}
          >
            Map
          </Text>
        </TouchableOpacity>

        {/* Settings */}
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons
            name={activeTab === "settings" ? "settings" : "settings-outline"}
            size={24}
            color={activeTab === "settings" ? "#4CAF50" : "#888"}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === "settings" && { color: "#4CAF50" },
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 10,
  },
  bar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: "500",
    color: "#888",
  },
  fabWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 3,
    borderColor: "#fff",
  },
});
