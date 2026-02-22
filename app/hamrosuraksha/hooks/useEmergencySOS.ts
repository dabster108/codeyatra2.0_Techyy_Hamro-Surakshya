import { useState } from "react";
import { Alert, Linking } from "react-native";
import * as SMS from "expo-sms";
import * as Location from "expo-location";
import { useLang } from "@/context/LanguageContext";

const EMERGENCY_NUMBER = "+9779863995341";

export function useEmergencySOS() {
  const { t } = useLang();
  const [sending, setSending] = useState(false);

  const sendSOS = async () => {
    if (sending) return;
    setSending(true);

    try {
      // 1. Get GPS location (best-effort – don't block if denied)
      let lat = "unknown";
      let lng = "unknown";
      let mapsLink = "https://maps.google.com";

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        try {
          const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
          });
          lat = pos.coords.latitude.toFixed(6);
          lng = pos.coords.longitude.toFixed(6);
          mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
        } catch {
          // location fetch failed – continue without coords
        }
      }

      const message = t.sosSmsMessage(lat, lng, mapsLink);

      // 2. Try expo-sms first (shows native SMS composer)
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        const { result } = await SMS.sendSMSAsync([EMERGENCY_NUMBER], message);
        if (result === "sent" || result === "unknown") {
          Alert.alert(t.sosSuccessTitle, t.sosSuccessBody);
        }
      } else {
        // 3. Fallback: open sms: URL (works on most Android devices)
        const encoded = encodeURIComponent(message);
        const url = `sms:${EMERGENCY_NUMBER}?body=${encoded}`;
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          Alert.alert(t.sosNoSmsTitle, t.sosNoSmsBody);
        }
      }
    } catch (err) {
      Alert.alert(t.sosErrorTitle, t.sosErrorBody);
    } finally {
      setSending(false);
    }
  };

  /** Shows a confirmation dialog, then calls sendSOS */
  const confirmAndSendSOS = () => {
    Alert.alert(
      t.sosConfirmTitle,
      t.sosConfirmBody,
      [
        { text: t.sosConfirmCancel, style: "cancel" },
        {
          text: t.sosConfirmSend,
          style: "destructive",
          onPress: sendSOS,
        },
      ],
      { cancelable: true },
    );
  };

  return { confirmAndSendSOS, sending };
}
