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
            width: "100%",
          },
          // Customizing the transition speed
          // @ts-ignore - transitionSpec is supported but sometimes types lag
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 3000, // Extremely slow opening
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 3000, // Extremely slow closing
              },
            },
          },
        }}
      >
        <Drawer.Screen
          name="dashboard"
          options={{ title: "Home", drawerLabel: "Dashboard", headerShown: false }}
        />
        <Drawer.Screen
          name="patientRecords"
          options={{ title: "Patient Records", drawerLabel: "Patient Records", headerShown: false }}
        />
        <Drawer.Screen
          name="assessment"
          options={{ title: "Assessment", drawerLabel: "New Assessment", headerShown: false }}
        />
        <Drawer.Screen
          name="alerts"
          options={{ title: "Alerts", drawerLabel: "Alerts", headerShown: false }}
        />
        <Drawer.Screen
          name="settings"
          options={{ title: "Settings", drawerLabel: "Settings", headerShown: false }}
        />
        <Drawer.Screen
          name="profile"
          options={{ title: "Profile", drawerLabel: "My Profile", headerShown: false }}
        />
        <Drawer.Screen
          name="alertDetails"
          options={{ title: "Alert Details", drawerLabel: () => null, headerShown: false }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
