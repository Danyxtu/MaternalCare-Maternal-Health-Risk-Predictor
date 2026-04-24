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
      if (role === "PATIENT") {
        router.replace("/(drawerPatient)/dashboard");
      } else {
        router.replace("/welcomePage");
      }
    }
  }, [role, isLoading, router]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          drawerType: "slide",
          overlayColor: "transparent",
          drawerStyle: {
            backgroundColor: "#f8f9fa",
            width: "100%",
          },
          // Customizing the transition speed
          // @ts-ignore - transitionSpec is supported but sometimes types lag
          transitionSpec: {
            open: {
              animation: "timing",
              config: {
                duration: 3000, // Extremely slow opening
              },
            },
            close: {
              animation: "timing",
              config: {
                duration: 3000, // Extremely slow closing
              },
            },
          },
        }}
      >
        <Drawer.Screen
          name="dashboard"
          options={{
            title: "Home",
            drawerLabel: "Dashboard",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="patientRecords"
          options={{
            title: "Patient Records",
            drawerLabel: "Patient Records",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="assessment"
          options={{
            title: "Assessment",
            drawerLabel: "New Assessment",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="alerts"
          options={{
            title: "Alerts",
            drawerLabel: "Alerts",
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
        <Drawer.Screen
          name="profile"
          options={{
            title: "Profile",
            drawerLabel: "My Profile",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="alertDetails"
          options={{
            title: "Alert Details",
            drawerLabel: () => null,
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="assessedRisk"
          options={{
            title: "Assessed Risk",
            drawerLabel: () => null,
            headerShown: false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
