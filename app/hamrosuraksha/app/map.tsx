import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import BottomNav from "@/components/ui/BottomNav";
import { useLang } from "@/context/LanguageContext";
import {
  getWildfirePredictions,
  WildfirePrediction,
} from "@/services/publicApi";

type EvacuationType = "Police" | "Hospital" | "Area 3" | null;
type DisasterType = "Flood" | "Landslide" | "Fire" | "Other" | null;

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, lang, toggleLang } = useLang();

  // State
  const [evacuationFilter, setEvacuationFilter] =
    useState<EvacuationType>(null);
  const [disasterFilter, setDisasterFilter] = useState<DisasterType>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [wildfirePredictions, setWildfirePredictions] = useState<
    WildfirePrediction[]
  >([]);
  const [loadingWildfire, setLoadingWildfire] = useState(false);

  // UI State
  const [isEvacDropdownOpen, setIsEvacDropdownOpen] = useState(false);
  const [isDisasterDropdownOpen, setIsDisasterDropdownOpen] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  // Animations
  const evacDropdownHeight = useSharedValue(0);
  const disasterDropdownHeight = useSharedValue(0);

  // Direct close helpers — avoid cross-calling toggles which causes stale-closure animation glitches
  const closeEvacDropdown = () => {
    evacDropdownHeight.value = withTiming(0, { duration: 250 });
    setIsEvacDropdownOpen(false);
  };

  const closeDisasterDropdown = () => {
    disasterDropdownHeight.value = withTiming(0, { duration: 250 });
    setIsDisasterDropdownOpen(false);
  };

  // Toggle Evacuation Dropdown
  const toggleEvacDropdown = () => {
    if (isEvacDropdownOpen) {
      closeEvacDropdown();
    } else {
      closeDisasterDropdown();
      evacDropdownHeight.value = withTiming(180, { duration: 300 });
      setIsEvacDropdownOpen(true);
    }
  };

  // Toggle Disaster Dropdown
  const toggleDisasterDropdown = () => {
    if (isDisasterDropdownOpen) {
      closeDisasterDropdown();
    } else {
      closeEvacDropdown();
      disasterDropdownHeight.value = withTiming(220, { duration: 300 });
      setIsDisasterDropdownOpen(true);
    }
  };

  const animatedEvacStyle = useAnimatedStyle(() => ({
    height: evacDropdownHeight.value,
    opacity: evacDropdownHeight.value === 0 ? 0 : 1,
    overflow: "hidden",
  }));

  const animatedDisasterStyle = useAnimatedStyle(() => ({
    height: disasterDropdownHeight.value,
    opacity: disasterDropdownHeight.value === 0 ? 0 : 1,
    overflow: "hidden",
  }));

  // Fetch wildfire predictions when Fire disaster type is selected
  useEffect(() => {
    if (disasterFilter === t.fire || disasterFilter === "Fire") {
      fetchWildfireData();
    } else {
      setWildfirePredictions([]);
    }
  }, [disasterFilter, selectedDate]);

  const fetchWildfireData = async () => {
    setLoadingWildfire(true);
    try {
      // Format date to YYYY-MM-DD
      const dateStr = selectedDate.toISOString().split("T")[0];

      const predictions = await getWildfirePredictions({
        date: dateStr, // Use single date for prediction day
        min_fire_prob: 0.5, // Show predictions with 50%+ probability for better visualization
        limit: 500, // Limit to 500 predictions
      });

      setWildfirePredictions(predictions);
      console.log(
        `Fetched ${predictions.length} wildfire predictions for ${dateStr}`,
      );
    } catch (error) {
      console.error("Failed to fetch wildfire predictions:", error);
      setWildfirePredictions([]);
    } finally {
      setLoadingWildfire(false);
    }
  };

  // Get risk severity based on fire probability (same logic as web)
  const getRiskSeverity = (fireProb: number): string => {
    if (fireProb > 0.99) return "extreme";
    if (fireProb > 0.94) return "high";
    if (fireProb > 0.8) return "medium";
    return "minimal";
  };

  // Get color based on severity
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "extreme":
        return "#8B0000"; // Dark red
      case "high":
        return "#FF0000"; // Red
      case "medium":
        return "#FF6B00"; // Orange
      case "minimal":
        return "#FFA500"; // Light orange
      default:
        return "#FF5722";
    }
  };

  // Generating Leaflet HTML based on filters
  const getLeafletHtml = () => {
    // Icons as SVGs
    const svgs = {
      hospital: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F44336" width="24px" height="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/></svg>`,
      police: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2196F3" width="24px" height="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>`,
      area3: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4CAF50" width="24px" height="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
      flood: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#00BCD4" width="24px" height="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2L2 22h20L12 2zm0 3.99L19.53 19H4.47L12 5.99zM13 18h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`,
      landslide: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#795548" width="24px" height="24px"><g><path d="M12,2L2.5,19h19L12,2z M13,16h-2v-2h2V16z M13,12h-2V7h2V12z"/></g></svg>`,
    };

    // Prepare wildfire markers as small colored dots
    const wildfireMarkers = wildfirePredictions.map((p: WildfirePrediction) => {
      const severity = getRiskSeverity(p.fire_prob);
      const color = getSeverityColor(severity);
      // Use the selected date (not database date which is 7 days behind)
      const displayDate = selectedDate.toLocaleDateString();
      return {
        lat: p.latitude,
        lng: p.longitude,
        type: `${p.district}`,
        category: "Disaster",
        subType: "Fire",
        isFireDot: true,
        color: color,
        severity: severity,
        popup: `<b>${p.district}</b><br/>Fire Probability: ${(p.fire_prob * 100).toFixed(1)}%<br/>Severity: ${severity.toUpperCase()}<br/>Prediction Date: ${displayDate}`,
      };
    });

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { width: 100%; height: 100vh; background: #e0e0e0; }
          .custom-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.25);
          }
          .fire-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 8px rgba(0,0,0,0.4);
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          try {
            const map = L.map('map', { zoomControl: false }).setView([27.7172, 85.3240], 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap',
              maxZoom: 19
            }).addTo(map);

            // Static locations for evacuation areas and other disasters
            const staticLocations = [
              { lat: 27.7172, lng: 85.3240, type: 'Teaching Hospital', category: 'Hospital', icon: '${svgs.hospital}' },
              { lat: 27.6915, lng: 85.3420, type: 'Civil Hospital', category: 'Hospital', icon: '${svgs.hospital}' },
              { lat: 27.7100, lng: 85.3300, type: 'Police HQ', category: 'Police', icon: '${svgs.police}' },
              { lat: 27.7050, lng: 85.3150, type: 'Durbar Marg Police', category: 'Police', icon: '${svgs.police}' },
              { lat: 27.6710, lng: 85.3230, type: 'Jawalakhel Area', category: 'Area 3', icon: '${svgs.area3}' },
              { lat: 27.7000, lng: 85.3000, type: 'Severe Flood', category: 'Disaster', subType: 'Flood', icon: '${svgs.flood}' },
              { lat: 27.7400, lng: 85.3500, type: 'Landslide Zone', category: 'Disaster', subType: 'Landslide', icon: '${svgs.landslide}' },
            ];

            // Wildfire predictions from API
            const wildfireLocations = ${JSON.stringify(wildfireMarkers)};

            // Combine static and wildfire locations
            const locations = [...staticLocations, ...wildfireLocations];

            const activeEvacFilter = "${evacuationFilter || ""}";
            const activeDisasterFilter = "${disasterFilter || ""}";

            const filtered = locations.filter(loc => {
                if (activeDisasterFilter && loc.category === 'Disaster') {
                    return loc.subType === activeDisasterFilter;
                }
                if (activeEvacFilter && loc.category === activeEvacFilter) {
                    return true;
                }
                // If filters are active, strict mode
                if (activeDisasterFilter || activeEvacFilter) return false;
                
                // If no filters, show all
                return true;
            });

            if (filtered.length > 0) {
                const group = new L.featureGroup();
                filtered.forEach(loc => {
                  let marker;
                  
                  // Use small colored dots for wildfire predictions
                  if (loc.isFireDot) {
                    const icon = L.divIcon({
                      className: '',
                      html: '<div class="fire-dot" style="background-color: ' + loc.color + ';"></div>',
                      iconSize: [10, 10],
                      iconAnchor: [5, 5]
                    });
                    marker = L.marker([loc.lat, loc.lng], { icon: icon });
                  } else {
                    // Use regular icons for static locations
                    const icon = L.divIcon({
                      className: 'custom-icon',
                      html: loc.icon,
                      iconSize: [40, 40],
                      iconAnchor: [20, 20]
                    });
                    marker = L.marker([loc.lat, loc.lng], { icon: icon });
                  }
                  
                  const popupText = loc.popup || ('<b>' + loc.type + '</b><br>' + (loc.subType || loc.category));
                  marker.bindPopup(popupText);
                  group.addLayer(marker);
                });
                group.addTo(map);
                map.fitBounds(group.getBounds().pad(0.1));
            }
          } catch (e) {
            console.error(e);
          }
        </script>
      </body>
    </html>
  `;
  };

  const onSelectEvac = (type: EvacuationType) => {
    setEvacuationFilter(type);
    setDisasterFilter(null);
    toggleEvacDropdown();
  };

  const onSelectDisaster = (type: DisasterType) => {
    setDisasterFilter(type);
    setEvacuationFilter(null);
    toggleDisasterDropdown();
  };

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(350)}>
      {/* Header */}
      {!isMapFullscreen && (
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.maps}</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.langButton} onPress={toggleLang}>
              <Ionicons name="globe-outline" size={18} color="#4CAF50" />
              <Text style={styles.langLabel}>
                {lang === "en" ? "EN" : "NE"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationButton}>
              <View style={styles.notificationBadge} />
              <Ionicons name="notifications-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Filter Section */}
        {!isMapFullscreen && (
          <View style={styles.imageBackgroundWrapper}>
            <View style={styles.filtersWrapper}>
              {/* Filter Box 1: Evacuation Areas */}
              <View style={styles.filterBoxContainer}>
                <TouchableOpacity
                  style={styles.filterBox}
                  onPress={toggleEvacDropdown}
                  activeOpacity={0.8}
                >
                  <Text style={styles.filterLabel}>{t.evacAreaLabel}</Text>
                  <View style={styles.filterValueRow}>
                    <Text style={styles.filterValue}>
                      {evacuationFilter || t.selectArea}
                    </Text>
                    <Ionicons
                      name={isEvacDropdownOpen ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#666"
                    />
                  </View>
                </TouchableOpacity>

                <Animated.View style={[styles.dropdownList, animatedEvacStyle]}>
                  {([t.police, t.hospital, t.area3] as string[]).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.dropdownItem,
                        evacuationFilter === type && styles.activeItem,
                      ]}
                      onPress={() => onSelectEvac(type as EvacuationType)}
                    >
                      <Text
                        style={[
                          styles.itemText,
                          evacuationFilter === type && styles.activeItemText,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              </View>

              {/* Filter Box 2: Disaster Type */}
              <View style={styles.filterBoxContainer}>
                <TouchableOpacity
                  style={styles.filterBox}
                  onPress={toggleDisasterDropdown}
                  activeOpacity={0.8}
                >
                  <Text style={styles.filterLabel}>{t.disasterType}</Text>
                  <View style={styles.filterValueRow}>
                    <Text style={styles.filterValue}>
                      {disasterFilter || t.selectType}
                    </Text>
                    <Ionicons
                      name={
                        isDisasterDropdownOpen ? "chevron-up" : "chevron-down"
                      }
                      size={20}
                      color="#666"
                    />
                  </View>
                </TouchableOpacity>

                <Animated.View
                  style={[styles.dropdownList, animatedDisasterStyle]}
                >
                  {([t.flood, t.landslide, t.fire, t.other] as string[]).map(
                    (type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.dropdownItem,
                          disasterFilter === type && styles.activeItem,
                        ]}
                        onPress={() => onSelectDisaster(type as DisasterType)}
                      >
                        <Text
                          style={[
                            styles.itemText,
                            disasterFilter === type && styles.activeItemText,
                          ]}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ),
                  )}
                </Animated.View>
              </View>

              {/* Date Picker (Visible when Disaster Type is selected) */}
              {disasterFilter && (
                <View style={styles.datePickerContainer}>
                  <Text style={styles.dateLabel}>{t.selectDate}</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color="#007AFF"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.dateButtonText}>
                      {selectedDate.toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="default"
                      onChange={(event, date) => {
                        // On Android the dialog dismisses after one pick; on iOS it's inline
                        setShowDatePicker(Platform.OS === "ios");
                        if (date) setSelectedDate(date);
                      }}
                    />
                  )}
                </View>
              )}
            </View>
          </View>
        )}

        {/* Map Container */}
        <View
          style={[
            styles.mapContainer,
            isMapFullscreen && styles.fullscreenContainer,
            !isMapFullscreen && { marginBottom: 90 },
          ]}
        >
          {Platform.OS === "web" ? (
            <iframe
              srcDoc={getLeafletHtml()}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: isMapFullscreen ? 0 : 12,
              }}
              title="Map"
            />
          ) : (
            <WebView
              originWhitelist={["*"]}
              source={{ html: getLeafletHtml() }}
              style={styles.map}
              scrollEnabled={false}
            />
          )}

          {/* Loading indicator for wildfire data */}
          {loadingWildfire && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#FF5722" />
              <Text style={styles.loadingText}>Loading wildfire data...</Text>
            </View>
          )}

          {/* Fullscreen Toggle Button */}
          <TouchableOpacity
            style={[styles.fullscreenButton, { bottom: insets.bottom + 20 }]}
            onPress={() => setIsMapFullscreen(!isMapFullscreen)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isMapFullscreen ? "contract" : "expand"}
              size={22}
              color="#333"
            />
          </TouchableOpacity>
        </View>
        {/* Shared Bottom Nav */}
        {!isMapFullscreen && <BottomNav activeTab="map" />}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  contentContainer: {
    flex: 1,
    position: "relative",
  },
  imageBackgroundWrapper: {
    zIndex: 10,
    backgroundColor: "transparent",
  },
  filtersWrapper: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    boxShadow: "0px 5px 10px rgba(0,0,0,0.1)",
    marginBottom: 10,
  },
  filterBoxContainer: {
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
  },
  filterBox: {
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  filterLabel: {
    fontSize: 12,
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
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  dropdownList: {
    backgroundColor: "#fafafa",
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  activeItem: {
    backgroundColor: "#e6f0ff",
  },
  itemText: {
    fontSize: 15,
    color: "#444",
  },
  activeItemText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Spread label and picker
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    boxShadow: "0px 1px 2px rgba(0,0,0,0.05)",
  },
  dateLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f0f7ff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cce0ff",
  },
  dateButtonText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    // The "border type" background requested
    borderWidth: 6,
    borderColor: "#f0f0f0",
    backgroundColor: "#fff",
    // Deep shadow for card effect
    boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
  },
  fullscreenContainer: {
    marginHorizontal: 0,
    marginBottom: 0,
    borderRadius: 0,
    borderWidth: 0,
  },
  map: {
    flex: 1,
    backgroundColor: "#e0e0e0",
  },
  fullscreenButton: {
    position: "absolute",
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
    zIndex: 999,
    borderWidth: 1,
    borderColor: "#eee",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 998,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#FF5722",
    fontWeight: "600",
  },
});
