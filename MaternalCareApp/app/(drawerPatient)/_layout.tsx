import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { useRouter } from "expo-router";

import { useAuth } from "@/context/authContext";

const PatientDrawerLayout = () => {
  const { role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (role !== "PATIENT") {
      if (role === "DOCTOR") {
        router.replace("/(drawerDoctor)/dashboard");
      } else {
        router.replace("/welcomePage");
      }
    }
  }, [role, isLoading, router]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: true,
          drawerType: "slide",
          overlayColor: "transparent",
          drawerStyle: {
            backgroundColor: "#f8f9fa",
            width: "100%",
          },
        }}
      >
        <Drawer.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            drawerLabel: "Dashboard",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            title: "Profile",
            drawerLabel: "My Profile",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: "Settings",
            drawerLabel: "Settings",
            headerShown: false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default PatientDrawerLayout;
