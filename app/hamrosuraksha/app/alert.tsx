import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import BottomNav from "@/components/ui/BottomNav";

// ─── Nepal Location Data ───────────────────────────────────────────────────────

type Municipality = string;

interface DistrictData {
  [district: string]: Municipality[];
}

interface ProvinceData {
  [province: string]: DistrictData;
}

const NEPAL_DATA: ProvinceData = {
  "Koshi Province": {
    Taplejung: [
      "Taplejung Municipality",
      "Phungling Municipality",
      "Sidingba Rural",
    ],
    Sankhuwasabha: [
      "Chainpur Municipality",
      "Khandbari Municipality",
      "Madi Rural",
    ],
    Solukhumbu: [
      "Solukhumbu Rural",
      "Khumbu Pasanglhamu Rural",
      "Likhu Pike Rural",
    ],
    Bhojpur: ["Bhojpur Municipality", "Shadananda Municipality"],
    Dhankuta: ["Dhankuta Municipality", "Pakhribas Municipality"],
    Terhathum: ["Myanglung Municipality", "Laligurans Municipality"],
    Okhaldhunga: ["Siddhicharan Municipality", "Molung Rural"],
    Khotang: [
      "Diktel Rupakot Majhuwagadhi Municipality",
      "Halesi Tundhunge Municipality",
    ],
    Udayapur: ["Triyuga Municipality", "Udayapurgadhi Rural"],
    Sunsari: [
      "Dharan Sub-Metropolitan",
      "Inaruwa Municipality",
      "Itahari Sub-Metropolitan",
    ],
    Morang: [
      "Biratnagar Metropolitan",
      "Urlabari Municipality",
      "Sundarharaicha Municipality",
    ],
    Jhapa: [
      "Mechinagar Municipality",
      "Birtamod Municipality",
      "Damak Municipality",
    ],
    Ilam: ["Ilam Municipality", "Deumai Municipality", "Mai Municipality"],
    Panchthar: ["Phidim Municipality", "Phungling Municipality"],
  },
  "Madhesh Province": {
    Saptari: [
      "Rajbiraj Municipality",
      "Kanchanrup Municipality",
      "Saptakoshi Rural",
    ],
    Siraha: [
      "Lahan Municipality",
      "Siraha Municipality",
      "Golbazar Municipality",
    ],
    Dhanusha: [
      "Janakpur Sub-Metropolitan",
      "Mithila Municipality",
      "Dhanusadham Municipality",
    ],
    Mahottari: [
      "Jaleshwar Municipality",
      "Bardibas Municipality",
      "Gaushala Municipality",
    ],
    Sarlahi: [
      "Malangwa Municipality",
      "Haripur Municipality",
      "Ishworpur Municipality",
    ],
    Rautahat: [
      "Gaur Municipality",
      "Brindaban Municipality",
      "Rajpur Municipality",
    ],
    Bara: [
      "Kalaiya Sub-Metropolitan",
      "Jitpur Simara Sub-Metropolitan",
      "Nijgadh Municipality",
    ],
    Parsa: [
      "Birgunj Metropolitan",
      "Pkalikamai Municipality",
      "Bahudarmai Municipality",
    ],
  },
  "Bagmati Province": {
    Kathmandu: [
      "Kathmandu Metropolitan",
      "Kirtipur Municipality",
      "Budhanilkantha Municipality",
      "Tokha Municipality",
      "Gokarneshwor Municipality",
      "Kageshwori Manohara Municipality",
      "Shankharapur Municipality",
    ],
    Lalitpur: [
      "Lalitpur Metropolitan",
      "Mahalaxmi Municipality",
      "Godawari Municipality",
      "Bagmati Rural",
    ],
    Bhaktapur: [
      "Bhaktapur Municipality",
      "Madhyapur Thimi Municipality",
      "Changunarayan Municipality",
      "Suryabinayak Municipality",
    ],
    Kavrepalanchok: [
      "Banepa Municipality",
      "Dhulikhel Municipality",
      "Panauti Municipality",
    ],
    Sindhupalchok: [
      "Chautara Sangachokgadhi Municipality",
      "Melamchi Municipality",
    ],
    Rasuwa: ["Uttargaya Rural", "Gosaikunda Rural", "Naukunda Rural"],
    Nuwakot: [
      "Bidur Municipality",
      "Belkotgadhi Municipality",
      "Suryagadhi Rural",
    ],
    Dhading: ["Nilkantha Municipality", "Dhading Besi Municipality"],
    Makwanpur: [
      "Hetauda Sub-Metropolitan",
      "Thaha Municipality",
      "Indrasarowar Rural",
    ],
    Chitwan: [
      "Bharatpur Metropolitan",
      "Ratnanagar Municipality",
      "Rapti Municipality",
    ],
    Ramechhap: ["Manthali Municipality", "Ramechhap Municipality"],
    Sindhuli: ["Kamalamai Municipality", "Dudhauli Municipality"],
    Dolakha: ["Bhimeshwor Municipality", "Kalinchok Rural"],
  },
  "Gandaki Province": {
    Kaski: ["Pokhara Metropolitan", "Annapurna Rural", "Madi Municipality"],
    Tanahun: [
      "Damauli Municipality",
      "Bhimad Municipality",
      "Shuklagandaki Municipality",
    ],
    Lamjung: ["Besishahar Municipality", "Sundarbazar Municipality"],
    Gorkha: ["Gorkha Municipality", "Palungtar Municipality", "Sulikot Rural"],
    Manang: ["Manang Ngisyang Rural", "Narph Rural"],
    Mustang: ["Mustang Rural", "Lomanthang Rural"],
    Myagdi: ["Beni Municipality", "Malika Rural"],
    Parbat: ["Kushma Municipality", "Phalewas Municipality"],
    Baglung: ["Baglung Municipality", "Dhorpatan Municipality"],
    Nawalpur: ["Kawasoti Municipality", "Madhyabindu Municipality"],
    Syangja: [
      "Waling Municipality",
      "Galyang Municipality",
      "Phedikhola Rural",
    ],
  },
  "Lumbini Province": {
    Rupandehi: [
      "Butwal Sub-Metropolitan",
      "Siddharthanagar Municipality",
      "Tilottama Municipality",
    ],
    Kapilvastu: [
      "Kapilvastu Municipality",
      "Buddhabhumi Municipality",
      "Shuddhodhan Rural",
    ],
    Nawalparasi: ["Sunwal Municipality", "Palhinandan Rural", "Sarawal Rural"],
    Arghakhanchi: ["Sandhikharka Municipality", "Shitganga Municipality"],
    Gulmi: ["Resunga Municipality", "Musikot Municipality"],
    Palpa: ["Tansen Municipality", "Ribdikot Rural"],
    Dang: [
      "Tulsipur Sub-Metropolitan",
      "Ghorahi Sub-Metropolitan",
      "Lamahi Municipality",
    ],
    Pyuthan: ["Pyuthan Municipality", "Swargadwari Municipality"],
    Rolpa: ["Rolpa Municipality", "Runtigadhi Rural"],
    Rukum: ["Musikot Municipality", "Chaurjahari Municipality"],
    Banke: ["Nepalgunj Sub-Metropolitan", "Janki Rural", "Narainapur Rural"],
    Bardiya: [
      "Gulariya Municipality",
      "Rajapur Municipality",
      "Barbardiya Municipality",
    ],
  },
  "Karnali Province": {
    Surkhet: [
      "Birendranagar Municipality",
      "Bheriganga Municipality",
      "Gurbhakot Municipality",
    ],
    Dailekh: [
      "Narayan Municipality",
      "Dullu Municipality",
      "Aathabis Municipality",
    ],
    Jajarkot: ["Bheri Municipality", "Chhedagad Municipality"],
    "Rukum West": ["Musikot Municipality", "Aathbiskot Municipality"],
    Dolpa: ["Thuli Bheri Municipality", "Dolpa Rural"],
    Humla: ["Simkot Rural", "Kharpunath Rural"],
    Jumla: ["Chandannath Municipality", "Tatopani Rural"],
    Kalikot: ["Khadachakra Municipality", "Pachaljharana Rural"],
    Mugu: ["Mugum Karmarong Rural", "Khatyad Rural"],
    Salyan: ["Sharada Municipality", "Bagchaur Municipality"],
  },
  "Sudurpashchim Province": {
    Kanchanpur: [
      "Mahendranagar Municipality",
      "Bedkot Municipality",
      "Punarbas Municipality",
    ],
    Kailali: [
      "Dhangadhi Sub-Metropolitan",
      "Tikapur Municipality",
      "Godawari Municipality",
    ],
    Bajhang: ["Chainpur Municipality", "Bungal Municipality"],
    Bajura: ["Triveni Municipality", "Budinanda Municipality"],
    Achham: ["Mangalsen Municipality", "Sanphebagar Municipality"],
    Doti: ["Dipayal Silgadhi Municipality", "Shikhar Municipality"],
    Dadeldhura: ["Amargadhi Municipality", "Parashuram Municipality"],
    Baitadi: ["Dasharathchand Municipality", "Melauli Municipality"],
    Darchula: ["Darchula Municipality", "Mahakali Municipality"],
  },
};

const PROVINCES = Object.keys(NEPAL_DATA);

// ─── Alert Data ────────────────────────────────────────────────────────────────

type AlertCategory =
  | "Flood"
  | "Landslide"
  | "Fire"
  | "Earthquake"
  | "Storm"
  | "Disease";

interface AlertItem {
  id: string;
  title: string;
  location: string;
  province: string;
  district: string;
  date: string;
  category: AlertCategory;
  severity: "High" | "Medium" | "Low";
  description: string;
}

const MOCK_ALERTS: AlertItem[] = [
  {
    id: "1",
    title: "Severe Flooding in Terai Region",
    location: "Bardiya, Lumbini Province",
    province: "Lumbini Province",
    district: "Bardiya",
    date: "2026-02-20",
    category: "Flood",
    severity: "High",
    description: "Heavy rainfall causing severe flooding. Evacuation advised.",
  },
  {
    id: "2",
    title: "Landslide Risk Alert",
    location: "Sindhupalchok, Bagmati Province",
    province: "Bagmati Province",
    district: "Sindhupalchok",
    date: "2026-02-19",
    category: "Landslide",
    severity: "High",
    description:
      "Soil saturation has reached critical levels on northern slopes.",
  },
  {
    id: "3",
    title: "Forest Fire Spreading",
    location: "Chitwan, Bagmati Province",
    province: "Bagmati Province",
    district: "Chitwan",
    date: "2026-02-18",
    category: "Fire",
    severity: "Medium",
    description: "Wildfire spreading near buffer zone. Community on standby.",
  },
  {
    id: "4",
    title: "Minor Earthquake Reported",
    location: "Kaski, Gandaki Province",
    province: "Gandaki Province",
    district: "Kaski",
    date: "2026-02-17",
    category: "Earthquake",
    severity: "Low",
    description:
      "Magnitude 3.8 earthquake recorded near Pokhara. No damage reported.",
  },
  {
    id: "5",
    title: "Monsoon Storm Warning",
    location: "Sunsari, Koshi Province",
    province: "Koshi Province",
    district: "Sunsari",
    date: "2026-02-16",
    category: "Storm",
    severity: "Medium",
    description: "Strong winds expected. Residents advised to stay indoors.",
  },
  {
    id: "6",
    title: "Disease Outbreak Alert",
    location: "Kailali, Sudurpashchim Province",
    province: "Sudurpashchim Province",
    district: "Kailali",
    date: "2026-02-15",
    category: "Disease",
    severity: "High",
    description:
      "Cholera cases rising. Medical teams deployed. Boil water before use.",
  },
  {
    id: "7",
    title: "Flash Flood Advisory",
    location: "Humla, Karnali Province",
    province: "Karnali Province",
    district: "Humla",
    date: "2026-02-14",
    category: "Flood",
    severity: "Medium",
    description:
      "Glacial lake overflow risk. Communities downstream should prepare.",
  },
  {
    id: "8",
    title: "Earthquake Aftershocks Ongoing",
    location: "Bajhang, Sudurpashchim Province",
    province: "Sudurpashchim Province",
    district: "Bajhang",
    date: "2026-02-13",
    category: "Earthquake",
    severity: "High",
    description:
      "Aftershocks continuing. Structural damage reported in 3 VDCs.",
  },
];

// ─── Category Config ───────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<
  AlertCategory,
  { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }
> = {
  Flood: { icon: "water", color: "#0288D1", bg: "#E1F5FE" },
  Landslide: { icon: "earth", color: "#6D4C41", bg: "#EFEBE9" },
  Fire: { icon: "flame", color: "#E64A19", bg: "#FBE9E7" },
  Earthquake: { icon: "pulse", color: "#7B1FA2", bg: "#F3E5F5" },
  Storm: { icon: "thunderstorm", color: "#1565C0", bg: "#E3F2FD" },
  Disease: { icon: "medkit", color: "#2E7D32", bg: "#E8F5E9" },
};

const SEVERITY_COLOR: Record<"High" | "Medium" | "Low", string> = {
  High: "#D32F2F",
  Medium: "#F57C00",
  Low: "#388E3C",
};

// ─── Dropdown component ────────────────────────────────────────────────────────

interface DropdownProps {
  label: string;
  value: string | null;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (val: string | null) => void;
  disabled?: boolean;
}

function FilterDropdown({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
  disabled = false,
}: DropdownProps) {
  const height = useSharedValue(0);
  const prevOpen = useRef(false);

  if (prevOpen.current !== isOpen) {
    prevOpen.current = isOpen;
    height.value = withTiming(isOpen ? Math.min(options.length * 48, 240) : 0, {
      duration: 280,
    });
  }

  const animStyle = useAnimatedStyle(() => ({
    height: height.value,
    overflow: "hidden",
  }));

  return (
    <View style={[styles.filterBoxContainer, disabled && { opacity: 0.45 }]}>
      <TouchableOpacity
        style={styles.filterBox}
        onPress={onToggle}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <Text style={styles.filterLabel}>{label}</Text>
        <View style={styles.filterValueRow}>
          <Text
            style={[
              styles.filterValue,
              !value && { color: "#aaa", fontWeight: "400" },
            ]}
            numberOfLines={1}
          >
            {value || `Select ${label}`}
          </Text>
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color="#666"
          />
        </View>
      </TouchableOpacity>

      <Animated.View style={animStyle}>
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          bounces={false}
          style={styles.dropdownScroll}
        >
          {/* Clear option */}
          <TouchableOpacity
            style={[styles.dropdownItem, !value && styles.activeItem]}
            onPress={() => onSelect(null)}
          >
            <Text style={[styles.itemText, !value && styles.activeItemText]}>
              All
            </Text>
          </TouchableOpacity>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.dropdownItem, value === opt && styles.activeItem]}
              onPress={() => onSelect(opt)}
            >
              <Text
                style={[
                  styles.itemText,
                  value === opt && styles.activeItemText,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function AlertScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // ── Location filter state
  const [province, setProvince] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);
  const [municipality, setMunicipality] = useState<string | null>(null);

  const [openDropdown, setOpenDropdown] = useState<
    "province" | "district" | "municipality" | null
  >(null);

  // ── Date filter state
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);

  const [fromDate, setFromDate] = useState<Date>(oneWeekAgo);
  const [toDate, setToDate] = useState<Date>(today);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  // ── Derived option lists
  const districtOptions = province
    ? Object.keys(NEPAL_DATA[province] ?? {})
    : [];
  const municipalityOptions =
    province && district ? (NEPAL_DATA[province]?.[district] ?? []) : [];

  // ── Toggle helpers
  const toggle = (key: "province" | "district" | "municipality") => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const onProvinceSelect = (val: string | null) => {
    setProvince(val);
    setDistrict(null);
    setMunicipality(null);
    setOpenDropdown(null);
  };

  const onDistrictSelect = (val: string | null) => {
    setDistrict(val);
    setMunicipality(null);
    setOpenDropdown(null);
  };

  const onMunicipalitySelect = (val: string | null) => {
    setMunicipality(val);
    setOpenDropdown(null);
  };

  // ── Filtered alerts
  const filteredAlerts = MOCK_ALERTS.filter((alert) => {
    if (province && alert.province !== province) return false;
    if (district && alert.district !== district) return false;
    // Municipality is a sub-filter; MOCK data only has district so we treat it as no-op
    const alertDate = new Date(alert.date);
    if (alertDate < fromDate || alertDate > toDate) return false;
    return true;
  });

  // ── Bell badge bounce animation
  const badgeScale = useSharedValue(1);
  const prevCount = useRef(filteredAlerts.length);
  useEffect(() => {
    if (prevCount.current !== filteredAlerts.length) {
      badgeScale.value = withSpring(1.5, { damping: 4, stiffness: 300 }, () => {
        badgeScale.value = withSpring(1, { damping: 8, stiffness: 200 });
      });
      prevCount.current = filteredAlerts.length;
    }
  }, [filteredAlerts.length]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  // ── Renderers
  const renderAlertItem = ({
    item,
    index,
  }: {
    item: AlertItem;
    index: number;
  }) => {
    const cfg = CATEGORY_CONFIG[item.category];
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 60).springify()}
        style={styles.alertCard}
      >
        <View style={[styles.alertIconWrap, { backgroundColor: cfg.bg }]}>
          <Ionicons name={cfg.icon} size={22} color={cfg.color} />
        </View>

        <View style={styles.alertContent}>
          <View style={styles.alertTopRow}>
            <Text style={styles.alertTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <View
              style={[
                styles.severityBadge,
                { backgroundColor: SEVERITY_COLOR[item.severity] + "22" },
              ]}
            >
              <Text
                style={[
                  styles.severityText,
                  { color: SEVERITY_COLOR[item.severity] },
                ]}
              >
                {item.severity}
              </Text>
            </View>
          </View>

          <View style={styles.alertMetaRow}>
            <Ionicons name="location-outline" size={12} color="#888" />
            <Text style={styles.alertMeta} numberOfLines={1}>
              {item.location}
            </Text>
          </View>

          <View style={styles.alertBottomRow}>
            <View style={[styles.categoryChip, { backgroundColor: cfg.bg }]}>
              <Text style={[styles.categoryChipText, { color: cfg.color }]}>
                {item.category}
              </Text>
            </View>
            <View style={styles.alertDateRow}>
              <Ionicons name="calendar-outline" size={12} color="#aaa" />
              <Text style={styles.alertDate}>
                {new Date(item.date).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>

          <Text style={styles.alertDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </Animated.View>
    );
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alerts</Text>
        <View style={styles.bellWrapper}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <Animated.View style={[styles.bellBadge, badgeStyle]}>
            <Text style={styles.bellBadgeText}>{filteredAlerts.length}</Text>
          </Animated.View>
        </View>
      </View>

      <FlatList
        key={`${province}-${district}-${municipality}-${fromDate.toISOString()}-${toDate.toISOString()}`}
        data={filteredAlerts}
        keyExtractor={(item) => item.id}
        renderItem={renderAlertItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: 100 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* ── Filters Section ───────────────────────────── */}
            <View style={styles.filtersWrapper}>
              {/* Section Title */}
              <View style={styles.sectionTitleRow}>
                <Ionicons name="funnel-outline" size={16} color="#007AFF" />
                <Text style={styles.sectionTitle}>Filter by Location</Text>
              </View>

              {/* Province */}
              <FilterDropdown
                label="Province"
                value={province}
                options={PROVINCES}
                isOpen={openDropdown === "province"}
                onToggle={() => toggle("province")}
                onSelect={onProvinceSelect}
              />

              {/* District */}
              <FilterDropdown
                label="District"
                value={district}
                options={districtOptions}
                isOpen={openDropdown === "district"}
                onToggle={() => toggle("district")}
                onSelect={onDistrictSelect}
                disabled={!province}
              />

              {/* Municipality */}
              <FilterDropdown
                label="Municipality"
                value={municipality}
                options={municipalityOptions}
                isOpen={openDropdown === "municipality"}
                onToggle={() => toggle("municipality")}
                onSelect={onMunicipalitySelect}
                disabled={!district}
              />

              {/* ── Date Range ─────────────────────────────── */}
              <View style={styles.sectionTitleRow}>
                <Ionicons name="calendar-outline" size={16} color="#007AFF" />
                <Text style={styles.sectionTitle}>Filter by Date</Text>
              </View>

              <View style={styles.dateRangeRow}>
                {/* From Date */}
                <View style={styles.datePickerBlock}>
                  <Text style={styles.dateRangeLabel}>From</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => {
                      setShowToPicker(false);
                      setShowFromPicker((v) => !v);
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={15}
                      color="#007AFF"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.dateButtonText}>
                      {formatDate(fromDate)}
                    </Text>
                  </TouchableOpacity>
                  {showFromPicker && (
                    <DateTimePicker
                      value={fromDate}
                      mode="date"
                      display="default"
                      maximumDate={toDate}
                      onChange={(_, date) => {
                        setShowFromPicker(Platform.OS === "ios");
                        if (date) setFromDate(date);
                      }}
                    />
                  )}
                </View>

                <View style={styles.dateSeparator}>
                  <Ionicons name="arrow-forward" size={16} color="#ccc" />
                </View>

                {/* To Date */}
                <View style={styles.datePickerBlock}>
                  <Text style={styles.dateRangeLabel}>To</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => {
                      setShowFromPicker(false);
                      setShowToPicker((v) => !v);
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={15}
                      color="#007AFF"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.dateButtonText}>
                      {formatDate(toDate)}
                    </Text>
                  </TouchableOpacity>
                  {showToPicker && (
                    <DateTimePicker
                      value={toDate}
                      mode="date"
                      display="default"
                      minimumDate={fromDate}
                      maximumDate={today}
                      onChange={(_, date) => {
                        setShowToPicker(Platform.OS === "ios");
                        if (date) setToDate(date);
                      }}
                    />
                  )}
                </View>
              </View>
            </View>

            {/* ── Alerts List Header ─────────────────────── */}
            <View style={styles.alertsHeaderRow}>
              <Text style={styles.alertsHeaderText}>
                {filteredAlerts.length === 0
                  ? "No alerts found"
                  : `${filteredAlerts.length} Alert${filteredAlerts.length !== 1 ? "s" : ""} Found`}
              </Text>
              {(province || district || municipality) && (
                <TouchableOpacity
                  onPress={() => {
                    setProvince(null);
                    setDistrict(null);
                    setMunicipality(null);
                    setOpenDropdown(null);
                  }}
                >
                  <Text style={styles.clearText}>Clear Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          <Animated.View entering={FadeIn.delay(200)} style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={48} color="#ccc" />
            <Text style={styles.emptyTitle}>No Alerts</Text>
            <Text style={styles.emptySubtitle}>
              No alerts match the selected filters.{"\n"}Try adjusting the
              location or date range.
            </Text>
          </Animated.View>
        }
      />

      <BottomNav activeTab="alert" />
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  bellWrapper: {
    position: "relative",
    width: 44,
    height: 44,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  bellBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF5252",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#f5f5f5",
  },
  bellBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
    lineHeight: 12,
  },

  // ── Filters
  filtersWrapper: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 12,
    zIndex: 20,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#007AFF",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  filterBoxContainer: {
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
    zIndex: 10,
  },
  filterBox: {
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  filterLabel: {
    fontSize: 11,
    color: "#888",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  filterValueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  dropdownScroll: {
    backgroundColor: "#fafafa",
  },
  dropdownItem: {
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
  },
  activeItem: {
    backgroundColor: "#e6f0ff",
  },
  itemText: {
    fontSize: 14,
    color: "#444",
  },
  activeItemText: {
    color: "#007AFF",
    fontWeight: "600",
  },

  // ── Date Range
  dateRangeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    marginBottom: 4,
  },
  datePickerBlock: {
    flex: 1,
  },
  dateRangeLabel: {
    fontSize: 11,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
    fontWeight: "500",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#f0f7ff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cce0ff",
  },
  dateButtonText: {
    fontSize: 13,
    color: "#007AFF",
    fontWeight: "600",
  },
  dateSeparator: {
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Alerts header row
  alertsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  alertsHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  clearText: {
    fontSize: 13,
    color: "#007AFF",
    fontWeight: "500",
  },

  // ── Alert cards
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  alertCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#eee",
  },
  alertIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  alertContent: {
    flex: 1,
    gap: 4,
  },
  alertTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
    flex: 1,
    lineHeight: 20,
  },
  severityBadge: {
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    flexShrink: 0,
  },
  severityText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  alertMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  alertMeta: {
    fontSize: 12,
    color: "#777",
    flex: 1,
  },
  alertBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  categoryChip: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: "600",
  },
  alertDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  alertDate: {
    fontSize: 11,
    color: "#aaa",
  },
  alertDescription: {
    fontSize: 12,
    color: "#888",
    lineHeight: 17,
    marginTop: 2,
  },

  // ── Empty
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#bbb",
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#ccc",
    textAlign: "center",
    lineHeight: 20,
  },
});
