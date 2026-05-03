import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Layout, User, ChevronRight, Phone, Mail } from "lucide-react-native";
import { getPatientDashboardStyles } from "#/src/styles/patientDashboard.styles";
import { useNavigation, useRouter } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import api from "#/src/api/api";

const MyDoctorsScreen = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getPatientDashboardStyles(colorScheme);
  const navigation = useNavigation();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);

  const fetchDoctors = async () => {
    try {
      const response = await api.get("/patients/me/doctors");
      setDoctors(response.data.data);
    } catch (error: any) {
      if (error.status !== 401) {
        console.error("Failed to fetch my doctors:", error);
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDoctors();
  };

  const renderDoctorItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        { marginHorizontal: 20, marginBottom: 12, padding: 16 },
      ]}
      onPress={() => {
        // Siloed view: show only this doctor's assessments for this patient
        // We can reuse the record detail view but with a filter
        // For now, just navigate to the consolidated record
        router.push("/records" as any);
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "#F1F5F9",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 16,
          }}
        >
          <User color="#64748B" size={24} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { fontSize: 16 }]}>{item.name}</Text>
          <Text style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>
            {item.specialty}
          </Text>
        </View>
        <ChevronRight color="#CBD5E1" size={20} />
      </View>

      <View
        style={{
          flexDirection: "row",
          marginTop: 16,
          borderTopWidth: 1,
          borderTopColor: "#F1F5F9",
          paddingTop: 12,
        }}
      >
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginRight: 24 }}>
          <Phone color="#10B981" size={16} />
          <Text style={{ marginLeft: 8, fontSize: 13, color: "#10B981", fontWeight: "600" }}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
          <Mail color="#3B82F6" size={16} />
          <Text style={{ marginLeft: 8, fontSize: 13, color: "#3B82F6", fontWeight: "600" }}>Message</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Layout
            color={colorScheme === "dark" ? "#ECEDEE" : "#11181C"}
            size={24}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitle}>My Care Team</Text>
          <Text style={styles.headerSubtitle}>Healthcare providers you've visited</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#E11D48" />
        </View>
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDoctorItem}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={{ flex: 1, alignItems: "center", marginTop: 40, paddingHorizontal: 40 }}>
              <User color="#CBD5E1" size={64} strokeWidth={1} />
              <Text style={{ marginTop: 16, fontSize: 16, fontWeight: "600", color: "#64748B", textAlign: "center" }}>
                No providers found
              </Text>
              <Text style={{ marginTop: 8, fontSize: 14, color: "#94A3B8", textAlign: "center" }}>
                Your care team will appear here once a doctor performs an assessment.
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E11D48" />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default MyDoctorsScreen;
