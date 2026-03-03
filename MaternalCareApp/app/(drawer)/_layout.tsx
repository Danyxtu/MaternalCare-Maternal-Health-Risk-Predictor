import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

import CustomDrawerContent from "@/components/DrawerContent";

export default function DrawerLayout() {
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
            width: "70%",
          },
        }}
      >
        <Drawer.Screen
          name="dashboard"
          options={{ title: "Home", drawerLabel: "Dashboard" }}
        />
        <Drawer.Screen
          name="patientRecords"
          options={{ title: "Patient Records", drawerLabel: "Patient Records" }}
        />
        <Drawer.Screen
          name="assessment"
          options={{ title: "Assessment", drawerLabel: "New Assessment" }}
        />
        <Drawer.Screen
          name="alerts"
          options={{ title: "Alerts", drawerLabel: "Alerts" }}
        />
        <Drawer.Screen
          name="settings"
          options={{ title: "Settings", drawerLabel: "Settings" }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
