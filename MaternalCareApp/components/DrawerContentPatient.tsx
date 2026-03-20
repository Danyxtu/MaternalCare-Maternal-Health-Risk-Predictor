import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, usePathname } from "expo-router";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import {
  LayoutDashboard,
  Activity,
  ShieldCheck,
  Heart,
  Layout,
  Settings,
  User,
  LogOut,
} from "lucide-react-native";
import { getDrawerContentStyles } from "@/styles/drawer.styles";
import { useAuth } from "@/context/authContext";

// --- Types ---
interface DrawerItemProps {
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onPress: () => void;
}

// --- Reusable Component ---
const DrawerItem: React.FC<DrawerItemProps> = ({
  label,
  icon,
  isActive,
  onPress,
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getDrawerContentStyles(colorScheme);
  const textColor = isActive
    ? "#E11D48"
    : colorScheme === "dark"
      ? "#CBD5E1"
      : "#334155";
  const bgColor = isActive ? "#FFF1F2" : "transparent";

  return (
    <TouchableOpacity
      style={[styles.drawerItem, { backgroundColor: bgColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconWrapper}>{icon}</View>
      <Text
        style={[
          styles.drawerItemText,
          { color: textColor, fontWeight: isActive ? "600" : "500" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// --- Main Sidebar Component ---
const CustomDrawerContentPatient: React.FC<DrawerContentComponentProps> = (props) => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getDrawerContentStyles(colorScheme);
  const pathname = usePathname();

  const getActiveRoute = () => {
    if (pathname.includes("/dashboard")) return "Dashboard";
    if (pathname.includes("/selfAssessment")) return "Self Assessment";
    if (pathname.includes("/healthRisk")) return "Health Standing";
    if (pathname.includes("/settings")) return "Settings";
    if (pathname.includes("/profile")) return "My Profile";
    return "";
  };

  const activeRoute = getActiveRoute();

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoIconContainer}>
              <Heart color="#FFFFFF" size={24} fill="#FFFFFF" />
            </View>
            <View style={styles.logoTextContainer}>
              <Text style={styles.brandName}>MaternalCare</Text>
              <Text style={styles.brandSubtitle}>Patient Portal</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.collapseButton}
            onPress={() => props.navigation.closeDrawer()}
          >
            <Layout
              color={colorScheme === "dark" ? "#ECEDEE" : "#11181C"}
              size={24}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Navigation Links */}
        <ScrollView
          contentContainerStyle={styles.navContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Primary Nav */}
          <View style={styles.navGroup}>
            <DrawerItem
              label="Dashboard"
              icon={
                <LayoutDashboard
                  color={activeRoute === "Dashboard" ? "#E11D48" : "#475569"}
                  size={20}
                />
              }
              isActive={activeRoute === "Dashboard"}
              onPress={() => router.push("/dashboard" as any)}
            />
            <DrawerItem
              label="Self Assessment"
              icon={
                <Activity
                  color={
                    activeRoute === "Self Assessment" ? "#E11D48" : "#475569"
                  }
                  size={20}
                />
              }
              isActive={activeRoute === "Self Assessment"}
              onPress={() => router.push("/selfAssessment" as any)}
            />
            <DrawerItem
              label="Health Standing"
              icon={
                <ShieldCheck
                  color={
                    activeRoute === "Health Standing" ? "#E11D48" : "#475569"
                  }
                  size={20}
                />
              }
              isActive={activeRoute === "Health Standing"}
              onPress={() => router.push("/healthRisk" as any)}
            />
          </View>

          {/* Secondary Nav */}
          <View style={styles.navGroup}>
            <View style={styles.subDivider} />
            <DrawerItem
              label="My Profile"
              icon={
                <User
                  color={activeRoute === "My Profile" ? "#E11D48" : "#475569"}
                  size={20}
                />
              }
              isActive={activeRoute === "My Profile"}
              onPress={() => router.push("/profile" as any)}
            />
            <DrawerItem
              label="Settings"
              icon={
                <Settings
                  color={activeRoute === "Settings" ? "#E11D48" : "#475569"}
                  size={20}
                />
              }
              isActive={activeRoute === "Settings"}
              onPress={() => router.push("/settings" as any)}
            />
          </View>
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <View style={styles.helpCard}>
            <Text style={styles.helpCardTitle}>Need Assistance?</Text>
            <TouchableOpacity>
              <Text style={styles.helpCardLink}>Contact your doctor</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color="#E11D48" size={20} style={{ marginRight: 12 }} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CustomDrawerContentPatient;
