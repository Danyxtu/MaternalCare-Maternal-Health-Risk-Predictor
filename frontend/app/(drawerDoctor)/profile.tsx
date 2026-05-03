import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Edit2,
  Layout,
} from "lucide-react-native";
import { getProfileScreenStyles } from "#/src/styles/profile.styles";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { get } from "#/src/api/api";

type UserRole = "DOCTOR" | "PATIENT";

interface DoctorProfile {
  id: number;
  first_name: string;
  last_name: string;
  middle_initial?: string | null;
  contact?: string | null;
}

interface PatientProfile {
  id: number;
  first_name: string;
  last_name: string;
  middle_initial?: string | null;
  contact?: string | null;
  age?: number;
}

interface UserProfile {
  id: number;
  email: string;
  role?: UserRole;
  first_name?: string | null;
  last_name?: string | null;
  middle_initial?: string | null;
  doctor?: DoctorProfile | null;
  patient?: PatientProfile | null;
}

const MyProfileScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getProfileScreenStyles(colorScheme);
  const navigation = useNavigation();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const fetchProfile = async () => {
    try {
      setErrorMessage(null);
      const response = await get("/auth/profile");
      const fetchedUser = (response.data?.user ?? null) as UserProfile | null;
      if (!fetchedUser) {
        throw new Error("Profile not found");
      }
      setUser(fetchedUser);
    } catch (error: any) {
      if (error.status !== 401) {
        console.error("Failed to fetch profile:", error);
      }
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to fetch profile",
      );
    }
  };

  useEffect(() => {
    const initialFetch = async () => {
      setIsLoading(true);
      await fetchProfile();
      setIsLoading(false);
    };
    initialFetch();
  }, []);

  const onRefresh = React.useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchProfile();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const doctor = user?.doctor ?? null;
  const patient = user?.patient ?? null;
  const fullName =
    buildFullName(
      doctor?.first_name,
      doctor?.middle_initial ?? null,
      doctor?.last_name,
    ) ||
    buildFullName(
      patient?.first_name,
      patient?.middle_initial ?? null,
      patient?.last_name,
    ) ||
    buildFullName(
      user?.first_name ?? null,
      user?.middle_initial ?? null,
      user?.last_name ?? null,
    ) ||
    user?.email ||
    "My Profile";

  const phoneNumber = doctor?.contact || patient?.contact || "N/A";
  const roleLabel = user?.role || "DOCTOR";
  const initials = getInitials(fullName);

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right", "bottom"]}
    >
      {/* Fixed Navigation Header */}
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

      {isLoading && !refreshing ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#10B981"]}
              tintColor={colorScheme === "dark" ? "#ECEDEE" : "#10B981"}
            />
          }
        >
          {user ? (
            <>
              {/* Profile Header */}
              <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarText}>{initials}</Text>
                  </View>
                </View>
                <Text style={styles.userName}>{fullName}</Text>
                <Text style={styles.userRole}>{roleLabel}</Text>
              </View>

              {/* Contact Information Card */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Contact Information</Text>

                <View style={styles.infoRow}>
                  <View style={styles.iconBox}>
                    <Mail color="#64748B" size={18} />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{user?.email || "N/A"}</Text>
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

              {/* Professional Details Card */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Professional Details</Text>

                <View style={styles.infoRow}>
                  <View style={styles.iconBox}>
                    <Briefcase color="#64748B" size={18} />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Primary Clinic</Text>
                    <Text style={styles.infoValue}>N/A</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <View style={styles.iconBox}>
                    <MapPin color="#64748B" size={18} />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Location</Text>
                    <Text style={styles.infoValue}>N/A</Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Profile</Text>
              <Text style={styles.infoValue}>
                {errorMessage || "No profile data available. Pull to refresh."}
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default MyProfileScreen;
