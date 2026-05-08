import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Modal,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, usePathname } from "expo-router";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import {
  LayoutDashboard,
  Activity,
  ShieldCheck,
  Layout,
  Settings,
  User,
  LogOut,
} from "lucide-react-native";
import { getDrawerContentStyles } from "#/src/styles/drawer.styles";
import { useAuth } from "#/src/context/authContext";
import AppLogo from "./AppLogo";

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
const CustomDrawerContentPatient: React.FC<DrawerContentComponentProps> = (
  props,
) => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getDrawerContentStyles(colorScheme);
  const pathname = usePathname();

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

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
    setLogoutModalVisible(false);
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={localStyles.modalOverlay}>
          <View style={[localStyles.modalContent, { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF' }]}>
            <View style={localStyles.modalHeader}>
              <View style={localStyles.logoutIconCircle}>
                <LogOut color="#E11D48" size={28} />
              </View>
              <Text style={[localStyles.modalTitle, { color: colorScheme === 'dark' ? '#F9FAFB' : '#111827' }]}>
                Confirm Logout
              </Text>
              <Text style={[localStyles.modalSubtitle, { color: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280' }]}>
                Are you sure you want to log out of your account?
              </Text>
            </View>

            <View style={localStyles.modalFooter}>
              <TouchableOpacity
                style={[localStyles.modalButton, localStyles.cancelButton, { borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB' }]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={[localStyles.cancelButtonText, { color: colorScheme === 'dark' ? '#D1D5DB' : '#4B5563' }]}>
                  Cancel, stay logged in
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[localStyles.modalButton, localStyles.confirmButton]}
                onPress={handleLogout}
              >
                <Text style={localStyles.confirmButtonText}>
                  Okay, logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={[styles.logoIconContainer, { backgroundColor: 'transparent', width: 40, height: 40 }]}>
              <AppLogo size={40} borderColor="#E11D48" backgroundColor="transparent" borderWidth={2} imageScale={1.1} />
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

          <TouchableOpacity style={styles.logoutButton} onPress={() => setLogoutModalVisible(true)}>
            <LogOut color="#E11D48" size={20} style={{ marginRight: 12 }} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoutIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFF1F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  modalFooter: {
    width: "100%",
    gap: 12,
  },
  modalButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#E11D48",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default CustomDrawerContentPatient;
