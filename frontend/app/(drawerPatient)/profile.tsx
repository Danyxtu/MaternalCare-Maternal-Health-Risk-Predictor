import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Mail,
  Phone,
  Calendar,
  Layout,
  Edit2,
} from "lucide-react-native";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { useAuth } from "#/src/context/authContext";
import { getProfileScreenStyles } from "#/src/styles/profile.styles";

const ProfileScreen = () => {
  const { first_name, last_name, middle_initial, email, role, age, contact } = useAuth();
  const colorScheme = useColorScheme() ?? "light";
  const styles = getProfileScreenStyles(colorScheme);
  const navigation = useNavigation();

  const buildFullName = (
    first?: string | null,
    middleInitial?: string | null,
    last?: string | null,
  ) => {
    const firstPart = (first ?? "").trim();
    const lastPart = (last ?? "").trim();
    const mi = (middleInitial ?? "").trim();
    const miText = mi ? `${mi.charAt(0).toUpperCase()}.` : "";
    return [firstPart, miText, lastPart].filter(Boolean).join(" ").trim();
  };

  const getInitials = (nameOrEmail: string) => {
    const value = (nameOrEmail ?? "").trim();
    if (!value) return "--";

    if (value.includes("@")) {
      const local = value.split("@")[0] ?? value;
      const lettersOnly = local.replace(/[^a-zA-Z]/g, "");
      return (lettersOnly.slice(0, 2) || local.slice(0, 2)).toUpperCase();
    }

    const parts = value.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
    return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
  };

  const fullName = buildFullName(first_name, middle_initial, last_name) || email || "My Profile";
  const initials = getInitials(fullName);
  const roleLabel = role || "PATIENT";
  const phoneNumber = contact || "N/A";
  const ageLabel = age ? `${age} years old` : "N/A";

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right", "bottom"]}
    >
      <View style={styles.navHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Layout
            color={colorScheme === "dark" ? "#ECEDEE" : "#11181C"}
            size={24}
          />
        </TouchableOpacity>
        <View style={styles.navTitleContainer}>
          <Text style={styles.navTitle}>My Profile</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Edit2 color="#E11D48" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userRole}>{roleLabel}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Mail color="#64748B" size={18} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{email || "N/A"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Phone color="#64748B" size={18} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{phoneNumber}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Details</Text>

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Calendar color="#64748B" size={18} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>{ageLabel}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
