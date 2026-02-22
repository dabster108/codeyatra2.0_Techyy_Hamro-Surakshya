import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import BottomNav from "@/components/ui/BottomNav";
import { useLang } from "@/context/LanguageContext";
import {
  getPublicSummary,
  getProvinceUtilization,
  formatNPR,
  PROVINCE_NAMES,
  PROVINCE_NAMES_NE,
  type PublicSummary,
  type ProvinceUtilization,
} from "@/services/publicApi";

const { width } = Dimensions.get("window");

// ─── Province colour palette ──────────────────────────────────────────────────
const PROVINCE_COLORS = [
  "#007AFF",
  "#FF9500",
  "#4CAF50",
  "#AF52DE",
  "#FF3B30",
  "#5856D6",
  "#00897B",
];

// ─── Animated progress bar ────────────────────────────────────────────────────
function ProgressBar({
  percent,
  color,
  delay,
}: {
  percent: number;
  color: string;
  delay: number;
}) {
  const barWidth = useSharedValue(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      barWidth.value = withTiming(Math.min(percent, 100), { duration: 900 });
    }, delay);
    return () => clearTimeout(timer);
  }, [percent]);

  const style = useAnimatedStyle(() => ({
    width: `${barWidth.value}%`,
  }));

  return (
    <View style={styles.barTrack}>
      <Animated.View
        style={[styles.barFill, { backgroundColor: color }, style]}
      />
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, lang, toggleLang } = useLang();

  const [summary, setSummary] = useState<PublicSummary | null>(null);
  const [provinces, setProvinces] = useState<ProvinceUtilization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setError(false);
    try {
      const [s, p] = await Promise.all([
        getPublicSummary(),
        getProvinceUtilization(),
      ]);
      setSummary(s);
      // Sort by province_id for consistent display
      setProvinces([...p].sort((a, b) => a.province_id - b.province_id));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const usedPercent =
    summary && summary.total_allocated > 0
      ? (summary.total_used / summary.total_allocated) * 100
      : 0;

  const remainingAmount = summary
    ? summary.total_allocated - summary.total_used
    : 0;

  const provinceNames = lang === "ne" ? PROVINCE_NAMES_NE : PROVINCE_NAMES;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* ── Header ──────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t.dashboardTitle}</Text>
          <Text style={styles.headerSubtitle}>{t.dashboardSubtitle}</Text>
        </View>
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

      {/* ── Body ────────────────────────────────────────────────── */}
      {loading ? (
        <View style={styles.centreState}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.stateText}>{t.dashboardLoading}</Text>
        </View>
      ) : error ? (
        <View style={styles.centreState}>
          <Ionicons name="cloud-offline-outline" size={54} color="#ccc" />
          <Text style={[styles.stateText, { color: "#FF3B30", marginTop: 12 }]}>
            {t.dashboardError}
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={load}>
            <Text style={styles.retryText}>{t.dashboardRetry}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: 100 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#007AFF"
            />
          }
        >
          {/* ── Live badge ─────────────────────────────────────── */}
          <Animated.View entering={FadeInDown.delay(50).springify()}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>{t.dashboardLastUpdated}</Text>
            </View>
          </Animated.View>

          {/* ── 3-stat summary strip ───────────────────────────── */}
          {summary && (
            <Animated.View
              entering={FadeInDown.delay(100).springify()}
              style={styles.statsRow}
            >
              <View style={[styles.statCard, { borderTopColor: "#007AFF" }]}>
                <Ionicons name="wallet-outline" size={22} color="#007AFF" />
                <Text style={[styles.statValue, { color: "#007AFF" }]}>
                  {formatNPR(summary.total_allocated)}
                </Text>
                <Text style={styles.statLabel}>{t.dashboardAllocated}</Text>
              </View>
              <View style={[styles.statCard, { borderTopColor: "#FF3B30" }]}>
                <Ionicons
                  name="trending-up-outline"
                  size={22}
                  color="#FF3B30"
                />
                <Text style={[styles.statValue, { color: "#FF3B30" }]}>
                  {formatNPR(summary.total_used)}
                </Text>
                <Text style={styles.statLabel}>{t.dashboardUsed}</Text>
              </View>
              <View style={[styles.statCard, { borderTopColor: "#4CAF50" }]}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={22}
                  color="#4CAF50"
                />
                <Text style={[styles.statValue, { color: "#4CAF50" }]}>
                  {formatNPR(remainingAmount)}
                </Text>
                <Text style={styles.statLabel}>{t.dashboardRemaining}</Text>
              </View>
            </Animated.View>
          )}

          {/* ── Wide utilization card ──────────────────────────── */}
          {summary && (
            <Animated.View
              entering={FadeInDown.delay(180).springify()}
              style={styles.utilizationCard}
            >
              <View style={styles.utilizationHeader}>
                <View>
                  <Text style={styles.utilizationTitle}>
                    {t.dashboardUtilization}
                  </Text>
                  <Text style={styles.utilizationPercent}>
                    {usedPercent.toFixed(1)}%
                  </Text>
                </View>
                <View style={styles.benefBox}>
                  <Ionicons name="people-outline" size={20} color="#5856D6" />
                  <Text style={styles.benefValue}>
                    {summary.total_beneficiaries.toLocaleString()}
                  </Text>
                  <Text style={styles.benefLabel}>
                    {t.dashboardBeneficiaries}
                  </Text>
                </View>
              </View>
              <ProgressBar percent={usedPercent} color="#007AFF" delay={300} />
              <View style={styles.barLabels}>
                <Text style={styles.barLabelLeft}>0%</Text>
                <Text style={styles.barLabelRight}>100%</Text>
              </View>
            </Animated.View>
          )}

          {/* ── Province breakdown ─────────────────────────────── */}
          <Animated.View entering={FadeInDown.delay(260).springify()}>
            <Text style={styles.sectionHeader}>{t.dashboardProvinces}</Text>
          </Animated.View>

          {provinces.length === 0 ? (
            <Animated.View
              entering={FadeInDown.delay(320).springify()}
              style={styles.emptyBox}
            >
              <Ionicons name="bar-chart-outline" size={40} color="#ccc" />
              <Text style={styles.emptyText}>{t.dashboardNoData}</Text>
            </Animated.View>
          ) : (
            provinces.map((p, i) => {
              const pct = p.allocated > 0 ? (p.used / p.allocated) * 100 : 0;
              const color = PROVINCE_COLORS[i % PROVINCE_COLORS.length];
              const remaining = p.allocated - p.used;

              return (
                <Animated.View
                  key={p.province_id}
                  entering={FadeInDown.delay(300 + i * 60).springify()}
                  style={styles.provinceCard}
                >
                  {/* Province name + percent */}
                  <View style={styles.provinceTop}>
                    <View style={styles.provinceLeft}>
                      <View
                        style={[styles.provinceDot, { backgroundColor: color }]}
                      />
                      <Text style={styles.provinceName}>
                        {provinceNames[p.province_id] ??
                          `Province ${p.province_id}`}
                      </Text>
                    </View>
                    <Text style={[styles.provincePercent, { color }]}>
                      {pct.toFixed(1)}%
                    </Text>
                  </View>

                  {/* Progress bar */}
                  <ProgressBar
                    percent={pct}
                    color={color}
                    delay={400 + i * 60}
                  />

                  {/* Allocated / Used / Remaining */}
                  <View style={styles.provinceStats}>
                    <View style={styles.pStat}>
                      <Text style={styles.pStatVal}>
                        {formatNPR(p.allocated)}
                      </Text>
                      <Text style={styles.pStatLabel}>
                        {t.dashboardAllocated}
                      </Text>
                    </View>
                    <View style={styles.pStat}>
                      <Text style={[styles.pStatVal, { color: "#FF3B30" }]}>
                        {formatNPR(p.used)}
                      </Text>
                      <Text style={styles.pStatLabel}>{t.dashboardUsed}</Text>
                    </View>
                    <View style={styles.pStat}>
                      <Text style={[styles.pStatVal, { color: "#4CAF50" }]}>
                        {formatNPR(remaining)}
                      </Text>
                      <Text style={styles.pStatLabel}>
                        {t.dashboardRemaining}
                      </Text>
                    </View>
                  </View>
                </Animated.View>
              );
            })
          )}
        </ScrollView>
      )}

      <BottomNav activeTab="home" />
    </View>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginRight: 10,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    lineHeight: 22,
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#4CAF50",
    fontWeight: "600",
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

  // States
  centreState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  stateText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
  },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 12,
    backgroundColor: "#007AFF",
    borderRadius: 12,
  },
  retryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  // Scroll
  scroll: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },

  // Live badge
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 16,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
  liveText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4CAF50",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Stats strip
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 6,
    borderTopWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
  statLabel: {
    fontSize: 10,
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    textAlign: "center",
  },

  // Utilization card
  utilizationCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  utilizationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  utilizationTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  utilizationPercent: {
    fontSize: 32,
    fontWeight: "900",
    color: "#007AFF",
  },
  benefBox: {
    alignItems: "center",
    gap: 3,
  },
  benefValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#5856D6",
  },
  benefLabel: {
    fontSize: 10,
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  barLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  barLabelLeft: {
    fontSize: 10,
    color: "#bbb",
  },
  barLabelRight: {
    fontSize: 10,
    color: "#bbb",
  },

  // Progress bar
  barTrack: {
    height: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 6,
  },

  // Section header
  sectionHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: "#007AFF",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
    marginLeft: 2,
  },

  // Province card
  provinceCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  provinceTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  provinceLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  provinceDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  provinceName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  provincePercent: {
    fontSize: 16,
    fontWeight: "800",
  },
  provinceStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  pStat: {
    alignItems: "center",
    flex: 1,
  },
  pStatVal: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
  },
  pStatLabel: {
    fontSize: 10,
    color: "#999",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  // Empty
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    color: "#bbb",
  },
});
