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
  Share2,
  QrCode,
  X,
} from "lucide-react-native";
import { getPatientDashboardStyles } from "#/src/styles/patientDashboard.styles";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import api, { post } from "#/src/api/api";
import { Modal } from "react-native";
import QRCode from 'react-native-qrcode-svg';

const PatientDashboard = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getPatientDashboardStyles(colorScheme);
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // One-Click Share State
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

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

  const handleGenerateShareCode = async () => {
    try {
      setIsGeneratingCode(true);
      const response: any = await post("/patients/generate-code");
      setShareCode(response.data.data.code);
      setIsShareModalVisible(true);
    } catch (err: any) {
      console.error("Failed to generate share code:", err);
      alert("Failed to generate sharing code. Please try again.");
    } finally {
      setIsGeneratingCode(false);
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
        <TouchableOpacity
          style={[styles.headerIcon, { backgroundColor: '#E11D4820' }]}
          onPress={handleGenerateShareCode}
          disabled={isGeneratingCode}
        >
          {isGeneratingCode ? (
            <ActivityIndicator size="small" color="#E11D48" />
          ) : (
            <Share2 color="#E11D48" size={20} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E11D48" />
        }
      >
        {/* Share Access Card - Moved to top so it's always accessible */}
        <TouchableOpacity 
          style={[styles.tipCard, { backgroundColor: '#E11D4810', borderColor: '#E11D4820', borderWidth: 1, marginBottom: 16 }]}
          onPress={handleGenerateShareCode}
        >
          <View style={[styles.tipIconContainer, { backgroundColor: '#E11D48' }]}>
            <QrCode color="#FFFFFF" size={24} />
          </View>
          <View style={styles.tipTextContainer}>
            <Text style={[styles.tipTitle, { color: '#E11D48' }]}>One-Click Share</Text>
            <Text style={styles.tipDescription}>
              Visiting a new doctor? Generate a temporary code to share your health history instantly.
            </Text>
          </View>
        </TouchableOpacity>

        {(!data) ? (
          <View style={{ alignItems: 'center', padding: 40, backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#F9FAFB', borderRadius: 20, borderStyle: 'dashed', borderWidth: 2, borderColor: '#CBD5E1' }}>
            <Heart color="#CBD5E1" size={60} strokeWidth={1} />
            <Text style={{ marginTop: 16, fontSize: 16, fontWeight: '700', color: '#64748B', textAlign: 'center' }}>
              {error === "Patient record not found" ? "Account Initializing" : "No Clinical Data Yet"}
            </Text>
            <Text style={{ marginTop: 8, fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 18 }}>
              {error === "Patient record not found" 
                ? "Your profile is being set up. Please refresh in a moment."
                : "Once a doctor performs your first assessment, your health standing will appear here."}
            </Text>
          </View>
        ) : (
          <>
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
            <View style={[styles.tipCard, { marginTop: 12 }]}>
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
                <Text style={styles.gaugeUnit}>°F</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Share Modal */}
      <Modal
        visible={isShareModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsShareModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ 
            backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF', 
            width: '85%', 
            borderRadius: 20, 
            padding: 24, 
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}>
            <TouchableOpacity 
              style={{ position: 'absolute', right: 16, top: 16, padding: 4 }}
              onPress={() => setIsShareModalVisible(false)}
            >
              <X color={colorScheme === 'dark' ? '#94A3B8' : '#64748B'} size={24} />
            </TouchableOpacity>

            <QrCode color="#E11D48" size={48} style={{ marginBottom: 16 }} />
            <Text style={{ fontSize: 20, fontWeight: '700', color: colorScheme === 'dark' ? '#FFFFFF' : '#11181C', marginBottom: 8 }}>
              Patient Access Code
            </Text>
            <Text style={{ textAlign: 'center', color: '#64748B', marginBottom: 24, lineHeight: 20 }}>
              Show this QR code or give the 6-digit code to your doctor to share your medical history.
            </Text>

            <View style={{ 
              backgroundColor: '#FFFFFF', 
              padding: 16, 
              borderRadius: 12, 
              width: '100%', 
              alignItems: 'center',
              marginBottom: 24,
              borderWidth: 1,
              borderColor: '#E2E8F0'
            }}>
              {shareCode && (
                <View style={{ marginBottom: 20 }}>
                  <QRCode
                    value={shareCode}
                    size={180}
                    color="#000000"
                    backgroundColor="#FFFFFF"
                  />
                </View>
              )}
              <Text style={{ fontSize: 32, fontWeight: '800', letterSpacing: 8, color: '#E11D48' }}>
                {shareCode}
              </Text>
            </View>

            <Text style={{ color: '#94A3B8', fontSize: 12, marginBottom: 8 }}>
              This code will expire in 15 minutes.
            </Text>

            <TouchableOpacity 
              style={{ 
                backgroundColor: '#E11D48', 
                paddingVertical: 14, 
                paddingHorizontal: 32, 
                borderRadius: 12,
                width: '100%',
                alignItems: 'center'
              }}
              onPress={() => setIsShareModalVisible(false)}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PatientDashboard;
