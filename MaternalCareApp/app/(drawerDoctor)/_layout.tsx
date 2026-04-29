import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { useRouter } from "expo-router";

import CustomDrawerContent from "#components/DrawerContent.tsx";
import { useAuth } from "#context/authContext.tsx";

export default function DrawerLayout() {
  const { role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (role !== "DOCTOR") {
      router.replace("/welcomePage");
    }
  }, [role, isLoading, router]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: "slide",
          overlayColor: "transparent",
          drawerStyle: {
            backgroundColor: "#f8f9fa",
            width: "100%",
          },
        }}
      >
        {/* The Tabs are the primary screen in the Drawer */}
        <Drawer.Screen
          name="(tabs)"
          options={{
            title: "Main",
            drawerLabel: "Main Menu",
          }}
        />

        {/* Additional Screens accessible from Drawer and outside */}
        <Drawer.Screen
          name="profile"
          options={{
            title: "Profile",
            drawerLabel: "My Profile",
          }}
        />

        {/* Hidden Stack Screens */}
        <Drawer.Screen
          name="alertDetails"
          options={{
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="assessedRisk"
          options={{
            drawerItemStyle: { display: "none" },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
