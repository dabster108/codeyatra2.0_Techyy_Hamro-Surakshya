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
import { type Translations } from "@/locales/en";
import {
  getAllRecords,
  formatNPR,
  type AllRecordsData,
} from "@/services/publicApi";

const { width } = Dimensions.get("window");

const PROVINCE_COLORS = [
  "#007AFF",
  "#FF9500",
  "#4CAF50",
  "#AF52DE",
  "#FF3B30",
  "#5856D6",
  "#00897B",
];

const DISASTER_COLORS: Record<string, string> = {
  Flood: "#007AFF",
  Earthquake: "#FF3B30",
  Landslide: "#FF9500",
  Fire: "#FF6B35",
  Drought: "#FFC107",
  Cyclone: "#9C27B0",
};

// Province name → Nepali
const PROVINCE_NE: Record<string, string> = {
  "koshi province": "कोशी प्रदेश",
  "madhesh province": "मधेश प्रदेश",
  "bagmati province": "बागमती प्रदेश",
  "gandaki province": "गण्डकी प्रदेश",
  "lumbini province": "लुम्बिनी प्रदेश",
  "karnali province": "कर्णाली प्रदेश",
  "sudurpashchim province": "सुदूरपश्चिम प्रदेश",
  "province 1": "प्रदेश नं. १",
  "province 2": "प्रदेश नं. २",
  "province 3": "प्रदेश नं. ३",
  "province 4": "प्रदेश नं. ४",
  "province 5": "प्रदेश नं. ५",
  "province 6": "प्रदेश नं. ६",
  "province 7": "प्रदेश नं. ७",
};

const TABS = [
  "Overview",
  "Province",
  "Disaster",
  "Officers",
  "Records",
] as const;
type Tab = (typeof TABS)[number];

// ─── Animated bar ─────────────────────────────────────────────────────────────
function Bar({
  pct,
  color,
  delay,
  height = 10,
}: {
  pct: number;
  color: string;
  delay: number;
  height?: number;
}) {
  const w = useSharedValue(0);
  useEffect(() => {
    const t = setTimeout(() => {
      w.value = withTiming(Math.min(pct, 100), { duration: 800 });
    }, delay);
    return () => clearTimeout(t);
  }, [pct]);
  const aStyle = useAnimatedStyle(() => ({ width: `${w.value}%` }));
  return (
    <View style={[styles.barTrack, { height }]}>
      <Animated.View
        style={[
          styles.barFill,
          { backgroundColor: color, height, borderRadius: height / 2 },
          aStyle,
        ]}
      />
    </View>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  value,
  label,
  color,
  delay,
}: {
  icon: string;
  value: string;
  label: string;
  color: string;
  delay: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
      style={[styles.statCard, { borderTopColor: color }]}
    >
      <Ionicons name={icon as any} size={22} color={color} />
      <Text style={[styles.statVal, { color }]}>{value}</Text>
      <Text style={styles.statLbl}>{label}</Text>
    </Animated.View>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ t }: { t: Translations }) {
  return (
    <View style={styles.emptyBox}>
      <Ionicons name="bar-chart-outline" size={44} color="#ddd" />
      <Text style={styles.emptyText}>{t.dashNoRecordsYet}</Text>
      <Text style={[styles.emptyText, { fontSize: 12, marginTop: 4 }]}>
        {t.dashNoRecordsSub}
      </Text>
    </View>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lang, t, toggleLang } = useLang();

  const [data, setData] = useState<AllRecordsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const tabLabels: Record<Tab, string> = {
    Overview: t.tabOverview,
    Province: t.tabProvince,
    Disaster: t.tabDisaster,
    Officers: t.tabOfficers,
    Records: t.tabRecords,
  };

  // Translate province name (from DB English → current language)
  const tProvince = (name: string) => {
    if (lang === "en") return name;
    return PROVINCE_NE[name.toLowerCase()] ?? name;
  };

  // Translate disaster type (from DB English → current language)
  const tDisaster = (type: string) => {
    if (lang === "en") return type;
    const map: Record<string, string> = {
      Flood: t.catFlood,
      Landslide: t.catLandslide,
      Fire: t.catFire,
      Earthquake: t.catEarthquake,
      Storm: t.catStorm,
      Disease: t.catDisease,
      Cyclone: t.catCyclone,
      Drought: t.catDrought,
    };
    return map[type] ?? type;
  };

  const load = useCallback(async () => {
    setError(false);
    try {
      const d = await getAllRecords();
      setData(d);
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

  // ── Overview ────────────────────────────────────────────────────────────────
  const renderOverview = () => {
    if (!data) return null;
    const s = data.summary;
    const topProvince = data.by_province[0];
    const topDisaster = data.by_disaster[0];
    return (
      <View style={styles.tabContent}>
        <Animated.View
          entering={FadeInDown.delay(80).springify()}
          style={styles.statsRow}
        >
          <StatCard
            icon="cash-outline"
            value={formatNPR(s.total_distributed)}
            label={t.dashTotalDist}
            color="#007AFF"
            delay={100}
          />
          <StatCard
            icon="document-text-outline"
            value={s.total_records.toString()}
            label={t.dashRecordsLabel}
            color="#FF9500"
            delay={160}
          />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(140).springify()}
          style={styles.statsRow}
        >
          <StatCard
            icon="map-outline"
            value={s.unique_provinces.toString()}
            label={t.dashProvincesLabel}
            color="#4CAF50"
            delay={200}
          />
          <StatCard
            icon="location-outline"
            value={s.unique_districts.toString()}
            label={t.dashDistrictsLabel}
            color="#AF52DE"
            delay={260}
          />
        </Animated.View>

        {topProvince && (
          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            style={styles.highlightCard}
          >
            <View style={styles.highlightRow}>
              <View
                style={[styles.highlightIcon, { backgroundColor: "#EBF5FF" }]}
              >
                <Ionicons name="trophy-outline" size={20} color="#007AFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.highlightLabel}>{t.dashHighestDist}</Text>
                <Text style={styles.highlightTitle}>
                  {topProvince.province.toUpperCase()}
                </Text>
                <Text style={styles.highlightValue}>
                  {formatNPR(topProvince.total_amount)}
                </Text>
              </View>
              <Text style={styles.highlightBadge}>
                {topProvince.record_count} {t.dashRecordsSuffix}
              </Text>
            </View>
          </Animated.View>
        )}

        {topDisaster && (
          <Animated.View
            entering={FadeInDown.delay(260).springify()}
            style={styles.highlightCard}
          >
            <View style={styles.highlightRow}>
              <View
                style={[styles.highlightIcon, { backgroundColor: "#FFF3E0" }]}
              >
                <Ionicons name="warning-outline" size={20} color="#FF9500" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.highlightLabel}>{t.dashMostDisaster}</Text>
                <Text style={styles.highlightTitle}>
                  {tDisaster(topDisaster.disaster_type)}
                </Text>
                <Text style={styles.highlightValue}>
                  {formatNPR(topDisaster.total_amount)}
                </Text>
              </View>
              <Text style={styles.highlightBadge}>
                {topDisaster.record_count} {t.dashRecordsSuffix}
              </Text>
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(320).springify()}>
          <Text style={styles.sectionHead}>{t.dashRecentRecords}</Text>
        </Animated.View>
        {data.recent_records.slice(0, 3).map((r, i) => (
          <Animated.View
            entering={FadeInDown.delay(340 + i * 50).springify()}
            key={r.id}
            style={styles.recentRow}
          >
            <View
              style={[
                styles.recentAvatar,
                { backgroundColor: DISASTER_COLORS[r.disaster_type] ?? "#888" },
              ]}
            >
              <Text style={styles.recentAvatarText}>
                {r.full_name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.recentName}>{r.full_name}</Text>
              <Text style={styles.recentMeta}>
                {tDisaster(r.disaster_type)} · {r.district}
              </Text>
            </View>
            <Text style={[styles.recentAmt, { color: "#007AFF" }]}>
              {formatNPR(r.relief_amount)}
            </Text>
          </Animated.View>
        ))}
        {data.recent_records.length === 0 && <EmptyState t={t} />}
      </View>
    );
  };

  // ── Province ────────────────────────────────────────────────────────────────
  const renderProvince = () => {
    if (!data) return null;
    const max = Math.max(...data.by_province.map((p) => p.total_amount), 1);
    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionHead}>{t.dashProvinceBreak}</Text>
        {data.by_province.map((p, i) => {
          const color = PROVINCE_COLORS[i % PROVINCE_COLORS.length];
          const pct = (p.total_amount / max) * 100;
          return (
            <Animated.View
              entering={FadeInDown.delay(60 + i * 55).springify()}
              key={p.province}
              style={styles.provinceCard}
            >
              <View style={styles.provinceTop}>
                <View style={styles.provinceLeft}>
                  <View style={[styles.dot, { backgroundColor: color }]} />
                  <Text style={styles.provinceName}>
                    {tProvince(p.province)}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={[styles.provinceAmt, { color }]}>
                    {formatNPR(p.total_amount)}
                  </Text>
                  <Text style={styles.provinceCount}>
                    {p.record_count} {t.dashRecordsSuffix}
                  </Text>
                </View>
              </View>
              <Bar pct={pct} color={color} delay={100 + i * 55} />
            </Animated.View>
          );
        })}
        {data.by_province.length === 0 && <EmptyState t={t} />}
      </View>
    );
  };

  // ── Disaster ─────────────────────────────────────────────────────────────────
  const renderDisaster = () => {
    if (!data) return null;
    const totalAmt =
      data.by_disaster.reduce((s, d) => s + d.total_amount, 0) || 1;
    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionHead}>{t.dashDisasterBreak}</Text>
        {data.by_disaster.map((d, i) => {
          const color =
            DISASTER_COLORS[d.disaster_type] ??
            PROVINCE_COLORS[i % PROVINCE_COLORS.length];
          const pct = (d.total_amount / totalAmt) * 100;
          return (
            <Animated.View
              entering={FadeInDown.delay(60 + i * 60).springify()}
              key={d.disaster_type}
              style={styles.disasterCard}
            >
              <View style={styles.disasterTop}>
                <View
                  style={[
                    styles.disasterIcon,
                    { backgroundColor: color + "20" },
                  ]}
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={18}
                    color={color}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.disasterName}>
                    {tDisaster(d.disaster_type)}
                  </Text>
                  <Text style={styles.disasterCount}>
                    {d.record_count} {t.dashReliefSuffix}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={[styles.disasterAmt, { color }]}>
                    {formatNPR(d.total_amount)}
                  </Text>
                  <Text style={styles.disasterPct}>{pct.toFixed(1)}%</Text>
                </View>
              </View>
              <Bar pct={pct} color={color} delay={120 + i * 60} height={8} />
            </Animated.View>
          );
        })}
        {data.by_disaster.length === 0 && <EmptyState t={t} />}
      </View>
    );
  };

  // ── Officers ─────────────────────────────────────────────────────────────────
  const renderOfficers = () => {
    if (!data) return null;
    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionHead}>{t.dashOfficersHead}</Text>
        {data.by_officer.map((o, i) => (
          <Animated.View
            entering={FadeInDown.delay(60 + i * 60).springify()}
            key={o.officer_id}
            style={styles.officerRow}
          >
            <View
              style={[
                styles.rankBadge,
                {
                  backgroundColor:
                    i === 0
                      ? "#FFC107"
                      : i === 1
                        ? "#aaa"
                        : i === 2
                          ? "#CD7F32"
                          : "#e8eaf6",
                },
              ]}
            >
              <Text
                style={[styles.rankNum, { color: i < 3 ? "#fff" : "#666" }]}
              >
                #{i + 1}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.officerName}>{o.officer_name}</Text>
              <Text style={styles.officerId}>
                {t.dashOfficerId} {o.officer_id}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.officerAmt}>{formatNPR(o.total_amount)}</Text>
              <Text style={styles.officerCount}>
                {o.record_count} {t.dashRecordsSuffix}
              </Text>
            </View>
          </Animated.View>
        ))}
        {data.by_officer.length === 0 && <EmptyState t={t} />}
      </View>
    );
  };

  // ── Records ──────────────────────────────────────────────────────────────────
  const renderRecords = () => {
    if (!data) return null;
    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionHead}>{t.dashReliefsHead}</Text>
        {data.recent_records.map((r, i) => {
          const color = DISASTER_COLORS[r.disaster_type] ?? "#888";
          const date = new Date(r.created_at).toLocaleDateString("en-NP", {
            day: "numeric",
            month: "short",
          });
          return (
            <Animated.View
              entering={FadeInDown.delay(40 + i * 40).springify()}
              key={r.id}
              style={styles.recordCard}
            >
              <View style={styles.recordTop}>
                <View
                  style={[styles.recordTag, { backgroundColor: color + "18" }]}
                >
                  <Text style={[styles.recordTagText, { color }]}>
                    {tDisaster(r.disaster_type)}
                  </Text>
                </View>
                <Text style={styles.recordDate}>{date}</Text>
              </View>
              <Text style={styles.recordName}>{r.full_name}</Text>
              <Text style={styles.recordSub}>
                {t.dashCitizenship} {r.citizenship_no}
              </Text>
              <View style={styles.recordBottom}>
                <View style={styles.recordMeta}>
                  <Ionicons name="location-outline" size={12} color="#888" />
                  <Text style={styles.recordMetaText}>
                    {r.district}, {r.province}
                  </Text>
                </View>
                <View style={styles.recordMeta}>
                  <Ionicons name="person-outline" size={12} color="#888" />
                  <Text style={styles.recordMetaText}>{r.officer_name}</Text>
                </View>
              </View>
              <View style={styles.recordAmtRow}>
                <Text style={styles.recordAmtLabel}>{t.dashReliefAmt}</Text>
                <Text style={styles.recordAmt}>
                  {formatNPR(r.relief_amount)}
                </Text>
              </View>
            </Animated.View>
          );
        })}
        {data.recent_records.length === 0 && <EmptyState t={t} />}
      </View>
    );
  };

  const tabContent: Record<Tab, () => React.ReactNode> = {
    Overview: renderOverview,
    Province: renderProvince,
    Disaster: renderDisaster,
    Officers: renderOfficers,
    Records: renderRecords,
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{t.dashRelief}</Text>
          <Text style={styles.headerSub}>{t.dashLiveSubtitle}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.langBtn} onPress={toggleLang}>
            <Ionicons name="globe-outline" size={16} color="#4CAF50" />
            <Text style={styles.langLabel}>{lang === "en" ? "EN" : "NE"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={() => {
              setLoading(true);
              load();
            }}
          >
            <Ionicons name="refresh-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === tab && styles.tabLabelActive,
                ]}
              >
                {tabLabels[tab]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Body */}
      {loading ? (
        <View style={styles.centre}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.centreText}>{t.dashLoadingLabel}</Text>
        </View>
      ) : error ? (
        <View style={styles.centre}>
          <Ionicons name="cloud-offline-outline" size={54} color="#ccc" />
          <Text
            style={[styles.centreText, { color: "#FF3B30", marginTop: 12 }]}
          >
            {t.dashBackendErr}
          </Text>
          <Text style={[styles.centreText, { fontSize: 12, marginTop: 4 }]}>
            {t.dashBackendErrSub}
          </Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => {
              setLoading(true);
              load();
            }}
          >
            <Text style={styles.retryText}>{t.dashboardRetry}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: 100 + insets.bottom },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#007AFF"
            />
          }
        >
          <Animated.View entering={FadeInDown.delay(30).springify()}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>{t.dashLiveBadge}</Text>
            </View>
          </Animated.View>

          {tabContent[activeTab]()}
        </ScrollView>
      )}

      <BottomNav activeTab="home" />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    zIndex: 10,
    boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
  },
  backBtn: {
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginRight: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#222" },
  headerSub: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4CAF50",
    marginTop: 1,
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  langBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: "#f0faf0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c8e6c9",
  },
  langLabel: { fontSize: 11, fontWeight: "700", color: "#4CAF50" },
  refreshBtn: { padding: 8, backgroundColor: "#EBF5FF", borderRadius: 10 },

  tabBar: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tabScroll: { paddingHorizontal: 12, paddingVertical: 8, gap: 6 },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  tabBtnActive: { backgroundColor: "#007AFF" },
  tabLabel: { fontSize: 13, fontWeight: "600", color: "#999" },
  tabLabelActive: { color: "#fff", fontWeight: "700" },

  centre: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 32,
  },
  centreText: { fontSize: 14, color: "#888", textAlign: "center" },
  retryBtn: {
    marginTop: 12,
    paddingHorizontal: 28,
    paddingVertical: 12,
    backgroundColor: "#007AFF",
    borderRadius: 12,
  },
  retryText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  scroll: { paddingTop: 14, paddingHorizontal: 14 },
  tabContent: { paddingBottom: 8 },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 14,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#4CAF50" },
  liveText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4CAF50",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },

  sectionHead: {
    fontSize: 12,
    fontWeight: "700",
    color: "#007AFF",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
    marginTop: 4,
  },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 6,
    borderTopWidth: 3,
    boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
  },
  statVal: { fontSize: 18, fontWeight: "800", textAlign: "center" },
  statLbl: {
    fontSize: 10,
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    textAlign: "center",
  },

  highlightCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  highlightRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  highlightIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  highlightLabel: {
    fontSize: 10,
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  highlightTitle: { fontSize: 15, fontWeight: "800", color: "#222" },
  highlightValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555",
    marginTop: 2,
  },
  highlightBadge: {
    fontSize: 11,
    color: "#888",
    fontWeight: "600",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    boxShadow: "0px 1px 4px rgba(0,0,0,0.04)",
  },
  recentAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  recentAvatarText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  recentName: { fontSize: 14, fontWeight: "700", color: "#222" },
  recentMeta: { fontSize: 12, color: "#888", marginTop: 1 },
  recentAmt: { fontSize: 14, fontWeight: "800" },

  provinceCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
    borderWidth: 1,
    borderColor: "#f4f4f4",
  },
  provinceTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  provinceLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  provinceName: { fontSize: 14, fontWeight: "700", color: "#333" },
  provinceAmt: { fontSize: 15, fontWeight: "800" },
  provinceCount: { fontSize: 11, color: "#999", marginTop: 1 },

  disasterCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    boxShadow: "0px 1px 6px rgba(0,0,0,0.04)",
    borderWidth: 1,
    borderColor: "#f4f4f4",
  },
  disasterTop: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  disasterIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  disasterName: { fontSize: 15, fontWeight: "700", color: "#222" },
  disasterCount: { fontSize: 11, color: "#888", marginTop: 2 },
  disasterAmt: { fontSize: 15, fontWeight: "800" },
  disasterPct: { fontSize: 11, color: "#aaa", marginTop: 1 },

  officerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    boxShadow: "0px 1px 4px rgba(0,0,0,0.04)",
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  rankNum: { fontSize: 13, fontWeight: "800" },
  officerName: { fontSize: 14, fontWeight: "700", color: "#222" },
  officerId: { fontSize: 11, color: "#aaa", marginTop: 1 },
  officerAmt: { fontSize: 14, fontWeight: "800", color: "#007AFF" },
  officerCount: { fontSize: 11, color: "#888", marginTop: 1 },

  recordCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
    borderWidth: 1,
    borderColor: "#f4f4f4",
  },
  recordTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  recordTag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  recordTagText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  recordDate: { fontSize: 11, color: "#aaa", fontWeight: "600" },
  recordName: { fontSize: 16, fontWeight: "800", color: "#222" },
  recordSub: { fontSize: 12, color: "#888", marginTop: 2 },
  recordBottom: { flexDirection: "row", gap: 16, marginTop: 10 },
  recordMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  recordMetaText: { fontSize: 11, color: "#888" },
  recordAmtRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f5f5f5",
  },
  recordAmtLabel: {
    fontSize: 11,
    color: "#aaa",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  recordAmt: { fontSize: 17, fontWeight: "900", color: "#007AFF" },

  barTrack: {
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 2,
  },
  barFill: { height: "100%", borderRadius: 6 },

  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 56,
    gap: 8,
  },
  emptyText: {
    fontSize: 15,
    color: "#bbb",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
