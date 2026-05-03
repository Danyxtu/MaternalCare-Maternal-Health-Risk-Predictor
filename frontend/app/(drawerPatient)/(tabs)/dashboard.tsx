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
  Layout,
  Heart,
  Activity,
  Droplet,
  Thermometer,
  Zap,
} from "lucide-react-native";
import { getPatientDashboardStyles } from "#/src/styles/patientDashboard.styles";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import api from "#/src/api/api";

const PatientDashboard = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getPatientDashboardStyles(colorScheme);
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const response = await api.get("/patients/me/dashboard");
      setData(response.data.data);
    } catch (err: any) {
      if (err.status !== 401) {
        console.error("Failed to fetch patient dashboard:", err);
      }
      setError(err.message || "Something went wrong while loading your health data.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const getRiskColor = (label: string) => {
    const lower = label?.toLowerCase() ?? "";
    if (lower.includes("high")) return "#E11D48";
    if (lower.includes("mid") || lower.includes("mod")) return "#F59E0B";
    return "#10B981";
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#E11D48" />
      </View>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Layout color={colorScheme === "dark" ? "#ECEDEE" : "#11181C"} size={24} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerTitle}>My Health Dashboard</Text>
          </View>
        </View>
        <ScrollView 
          contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E11D48" />}
        >
          <Heart color="#CBD5E1" size={80} strokeWidth={1} />
          <Text style={{ marginTop: 24, fontSize: 18, fontWeight: '700', color: '#64748B', textAlign: 'center' }}>
            {error === "Patient record not found" ? "Account Initializing" : "No Clinical Data Yet"}
          </Text>
          <Text style={{ marginTop: 12, fontSize: 14, color: '#94A3B8', textAlign: 'center', lineHeight: 20 }}>
            {error === "Patient record not found" 
              ? "Your patient profile is being set up. Please wait a moment and pull down to refresh."
              : "Once a doctor performs your first risk assessment, your vitals and health standing will appear here."}
          </Text>
          <TouchableOpacity 
            style={{ marginTop: 32, paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#E11D48', borderRadius: 8 }}
            onPress={onRefresh}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Refresh Dashboard</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const riskColor = getRiskColor(data?.risk_label);

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
          <Text style={styles.headerTitle}>My Health Dashboard</Text>
          <Text style={styles.headerSubtitle}>Real-time vitals and AI insights</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E11D48" />
        }
      >
        {/* Risk Status Card */}
        <View style={[styles.statusCard, { borderColor: riskColor + "40" }]}>
          <Text style={styles.statusTitle}>Current Health Standing</Text>
          <Text style={[styles.statusValue, { color: riskColor }]}>
            {data?.risk_label || "No Assessment"}
          </Text>
          <Text style={styles.statusSubtitle}>
            {data?.date ? `Last assessed on ${new Date(data.date).toLocaleDateString()}` : "Pending initial assessment"}
          </Text>
          {data?.doctor && (
            <Text style={[styles.statusSubtitle, { marginTop: 4 }]}>
              By {data.doctor.name}
            </Text>
          )}
        </View>

        {/* Daily Wellness Tip */}
        <View style={styles.tipCard}>
          <View style={styles.tipIconContainer}>
            <Zap color="#FFFFFF" size={24} />
          </View>
          <View style={styles.tipTextContainer}>
            <Text style={styles.tipTitle}>Maternal Wellness Tip</Text>
            <Text style={styles.tipDescription}>
              {data?.recommendations?.[0] || "Stay hydrated and ensure you're getting at least 8 hours of restful sleep tonight."}
            </Text>
          </View>
        </View>

        {/* Vitals Grid */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Recent Vitals</Text>
        <View style={styles.gaugeGrid}>
          <View style={styles.gaugeCard}>
            <Text style={styles.gaugeLabel}>Blood Pressure</Text>
            <Heart color="#E11D48" size={24} />
            <Text style={styles.gaugeValue}>
              {data?.vitals?.systolic || "--"}/{data?.vitals?.diastolic || "--"}
            </Text>
            <Text style={styles.gaugeUnit}>mmHg</Text>
          </View>

          <View style={styles.gaugeCard}>
            <Text style={styles.gaugeLabel}>Blood Sugar</Text>
            <Droplet color="#3B82F6" size={24} />
            <Text style={styles.gaugeValue}>{data?.vitals?.bloodSugar || "--"}</Text>
            <Text style={styles.gaugeUnit}>mmol/L</Text>
          </View>

          <View style={styles.gaugeCard}>
            <Text style={styles.gaugeLabel}>Heart Rate</Text>
            <Activity color="#8B5CF6" size={24} />
            <Text style={styles.gaugeValue}>{data?.vitals?.heartRate || "--"}</Text>
            <Text style={styles.gaugeUnit}>bpm</Text>
          </View>

          <View style={styles.gaugeCard}>
            <Text style={styles.gaugeLabel}>Body Temp</Text>
            <Thermometer color="#F97316" size={24} />
            <Text style={styles.gaugeValue}>{data?.vitals?.bodyTemp || "--"}</Text>
            <Text style={styles.gaugeUnit}>°C</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PatientDashboard;
