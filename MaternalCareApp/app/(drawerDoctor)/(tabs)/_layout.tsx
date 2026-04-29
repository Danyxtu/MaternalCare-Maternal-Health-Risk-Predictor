import { View, StyleSheet, useColorScheme } from "react-native";
import { Tabs } from "expo-router";
import {
  LayoutDashboard,
  FileText,
  Plus,
  Bell,
  Settings,
  BrainCircuit,
} from "lucide-react-native";

export default function TabsLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const isDark = colorScheme === "dark";

  const activeColor = "#E11D48";
  const inactiveColor = isDark ? "#94A3B8" : "#64748B";
  const bgColor = isDark ? "#151718" : "#FFFFFF";
  const borderColor = isDark ? "#334155" : "#E2E8F0";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: bgColor,
          borderTopColor: borderColor,
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="patientRecords"
        options={{
          title: "Records",
          tabBarIcon: ({ color, size }) => (
            <FileText color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="assessment"
        options={{
          title: "New",
          tabBarIcon: () => (
            <View style={styles.plusIconContainer}>
              <Plus color="#FFFFFF" size={30} strokeWidth={3} />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="model"
        options={{
          title: "Model",
          tabBarIcon: ({ color, size }) => (
            <BrainCircuit color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  plusIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E11D48",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#E11D48",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
});
