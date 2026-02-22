import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import BottomNav from "@/components/ui/BottomNav";
import { useLang } from "@/context/LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────
type IoniconsName = keyof typeof Ionicons.glyphMap;

interface SettingRowProps {
  icon: IoniconsName;
  iconBg: string;
  iconColor: string;
  label: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  isLast?: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function SettingRow({
  icon,
  iconBg,
  iconColor,
  label,
  subtitle,
  rightElement,
  onPress,
  isLast,
}: SettingRowProps) {
  const Inner = (
    <View style={[styles.row, isLast && styles.rowLast]}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
      </View>
      {rightElement !== undefined ? (
        rightElement
      ) : (
        <Ionicons name="chevron-forward" size={18} color="#ccc" />
      )}
    </View>
  );

  if (!onPress) return Inner;
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      {Inner}
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, lang, toggleLang } = useLang();

  const [notifications, setNotifications] = useState(true);
  const [alertSounds, setAlertSounds] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);

  const handleLogout = () => {
    Alert.alert(t.settingsLogout, t.settingsLogoutSub, [
      { text: t.all === "All" ? "Cancel" : "रद्द गर्नुस्", style: "cancel" },
      {
        text: t.settingsLogout,
        style: "destructive",
        onPress: () => router.replace("/"),
      },
    ]);
  };

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(350)}>
      <StatusBar style="dark" />

      {/* ── Header ──────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.settingsTitle}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.langButton} onPress={toggleLang}>
            <Ionicons name="globe-outline" size={18} color="#4CAF50" />
            <Text style={styles.langLabel}>{lang === "en" ? "EN" : "NE"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationButton}>
            <View style={styles.notificationBadge} />
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Profile Card ─────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: 100 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.profileCard} activeOpacity={0.85}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color="#fff" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Hamro Suraksha User</Text>
            <Text style={styles.profileEmail}>user@hamrosuraksha.com.np</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#4CAF50" />
        </TouchableOpacity>

        {/* ── Preferences ──────────────────────────────────────── */}
        <SectionHeader title={t.settingsPreferences} />
        <View style={styles.card}>
          {/* Language */}
          <SettingRow
            icon="globe-outline"
            iconBg="#e8f5e9"
            iconColor="#4CAF50"
            label={t.settingsLanguage}
            subtitle={t.settingsLanguageSub}
            onPress={toggleLang}
            rightElement={
              <View style={styles.langPill}>
                <Text style={styles.langPillText}>
                  {lang === "en" ? "EN" : "NE"}
                </Text>
              </View>
            }
          />
          {/* Notifications */}
          <SettingRow
            icon="notifications-outline"
            iconBg="#fff3e0"
            iconColor="#FF9800"
            label={t.settingsNotifications}
            subtitle={t.settingsNotificationsSub}
            rightElement={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#e0e0e0", true: "#a5d6a7" }}
                thumbColor={notifications ? "#4CAF50" : "#f5f5f5"}
              />
            }
          />
          {/* Alert Sounds */}
          <SettingRow
            icon="volume-high-outline"
            iconBg="#e3f2fd"
            iconColor="#1976D2"
            label={t.settingsAlertSounds}
            subtitle={t.settingsAlertSoundsSub}
            rightElement={
              <Switch
                value={alertSounds}
                onValueChange={setAlertSounds}
                trackColor={{ false: "#e0e0e0", true: "#a5d6a7" }}
                thumbColor={alertSounds ? "#4CAF50" : "#f5f5f5"}
              />
            }
          />
          {/* Vibration */}
          <SettingRow
            icon="radio-outline"
            iconBg="#fce4ec"
            iconColor="#E91E63"
            label={t.settingsVibration}
            subtitle={t.settingsVibrationSub}
            isLast
            rightElement={
              <Switch
                value={vibration}
                onValueChange={setVibration}
                trackColor={{ false: "#e0e0e0", true: "#a5d6a7" }}
                thumbColor={vibration ? "#4CAF50" : "#f5f5f5"}
              />
            }
          />
        </View>

        {/* ── Safety ───────────────────────────────────────────── */}
        <SectionHeader title={t.settingsSafety} />
        <View style={styles.card}>
          <SettingRow
            icon="shield-checkmark-outline"
            iconBg="#ffebee"
            iconColor="#D32F2F"
            label={t.settingsEmergencySOS}
            subtitle={t.settingsEmergencySOSSub}
            onPress={() => {}}
          />
          <SettingRow
            icon="people-outline"
            iconBg="#e8eaf6"
            iconColor="#3F51B5"
            label={t.settingsEmergencyContacts}
            subtitle={t.settingsEmergencyContactsSub}
            onPress={() => {}}
          />
          <SettingRow
            icon="location-outline"
            iconBg="#e0f7fa"
            iconColor="#00897B"
            label={t.settingsLocationSharing}
            subtitle={t.settingsLocationSharingSub}
            isLast
            rightElement={
              <Switch
                value={locationSharing}
                onValueChange={setLocationSharing}
                trackColor={{ false: "#e0e0e0", true: "#a5d6a7" }}
                thumbColor={locationSharing ? "#4CAF50" : "#f5f5f5"}
              />
            }
          />
        </View>

        {/* ── Account ──────────────────────────────────────────── */}
        <SectionHeader title={t.settingsAccount} />
        <View style={styles.card}>
          <SettingRow
            icon="person-circle-outline"
            iconBg="#e8f5e9"
            iconColor="#388E3C"
            label={t.settingsProfile}
            subtitle={t.settingsProfileSub}
            onPress={() => {}}
          />
          <SettingRow
            icon="lock-closed-outline"
            iconBg="#f3e5f5"
            iconColor="#7B1FA2"
            label={t.settingsChangePassword}
            subtitle={t.settingsChangePasswordSub}
            isLast
            onPress={() => {}}
          />
        </View>

        {/* ── About ────────────────────────────────────────────── */}
        <SectionHeader title={t.settingsAbout} />
        <View style={styles.card}>
          <SettingRow
            icon="information-circle-outline"
            iconBg="#e3f2fd"
            iconColor="#1565C0"
            label={t.settingsAppVersion}
            rightElement={
              <Text style={styles.versionText}>{t.settingsAppVersionVal}</Text>
            }
          />
          <SettingRow
            icon="star-outline"
            iconBg="#fff8e1"
            iconColor="#F9A825"
            label={t.settingsRateApp}
            subtitle={t.settingsRateAppSub}
            onPress={() => {}}
          />
          <SettingRow
            icon="document-text-outline"
            iconBg="#e8f5e9"
            iconColor="#4CAF50"
            label={t.settingsPrivacy}
            onPress={() => {}}
          />
          <SettingRow
            icon="reader-outline"
            iconBg="#fff3e0"
            iconColor="#E65100"
            label={t.settingsTerms}
            isLast
            onPress={() => {}}
          />
        </View>

        {/* ── Log Out ──────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color="#D32F2F" />
          <Text style={styles.logoutText}>{t.settingsLogout}</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav activeTab="settings" />
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
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

  // Scroll
  scroll: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },

  // Profile card
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e8f5e9",
    boxShadow: "0px 2px 10px rgba(0,0,0,0.06)",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 3,
  },
  profileEmail: {
    fontSize: 13,
    color: "#888",
  },

  // Section header
  sectionHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4CAF50",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    overflow: "hidden",
    boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
  },

  // Row
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f8f8",
    gap: 14,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  rowSub: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },

  // Language pill
  langPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: "#f0faf0",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#c8e6c9",
  },
  langPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4CAF50",
  },

  // Version text
  versionText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },

  // Logout
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#ffcdd2",
    marginBottom: 8,
    boxShadow: "0px 2px 8px rgba(211,47,47,0.06)",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#D32F2F",
  },
});
