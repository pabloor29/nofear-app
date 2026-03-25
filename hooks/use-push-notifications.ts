import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { AppState, AppStateStatus, Platform } from "react-native";
import { supabase } from "@/lib/supabase";
import { useSession } from "./use-session";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushNotifications() {
  const { session } = useSession();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!session) return;

    const userId = session.user.id;

    const register = async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      console.log("Permission status:", finalStatus);
      if (finalStatus !== "granted") {
        console.log("Permission refusée");
        return;
      }

      const token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        })
      ).data;

      console.log("Token récupéré:", token);

      const { error } = await supabase
        .from("profiles")
        .update({ push_token: token })
        .eq("id", userId);

      if (error) {
        console.error("Erreur lors de la mise à jour du push token:", error);
      } else {
        console.log("Push token mis à jour pour user:", userId);
      }
    };

    register();

    const subscription = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        if (appState.current.match(/inactive|background/) && nextState === "active") {
          register();
        }
        appState.current = nextState;
      }
    );

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    return () => {
      subscription.remove();
    };
  }, [session]);
}