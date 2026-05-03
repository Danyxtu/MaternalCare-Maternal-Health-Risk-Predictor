import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  RefreshControl,
  Modal,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Layout, X, AlertTriangle, CheckCircle2, ChevronRight, Clock } from "lucide-react-native";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import api from "#/src/api/api";
import { useAuth } from "#/src/context/authContext";
import { getPatientRecordsScreenStyles } from "#/src/styles/patientRecords.styles";

// --- Types ---
interface AssessmentRecord {
  id: string;
  date: string;
  systolic: number;
  diastolic: number;
  bloodSugar: number;
  heartRate: number;
  bodyTemp: number;
  riskLevel: string;
  riskScore: number;
  possible_maternal_risks?: string[];
  recommendations?: string[];
  note?: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: "short", day: "numeric", year: "numeric"
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit", minute: "2-digit"
  });
};

const PatientRecordsTimeline: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getPatientRecordsScreenStyles(colorScheme);
  const navigation = useNavigation();
  const { patientId } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentRecord | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchRecords = async () => {
    if (!patientId) return;
    try {
      const response = await api.get(`/patients/${patientId}`);
      setAssessments(response.data.data.assessments);
    } catch (error: any) {
      if (error.status !== 401) {
        console.error("Failed to fetch personal records:", error);
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [patientId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRecords();
  };

  const renderItem = ({ item }: { item: AssessmentRecord }) => {
    const riskLower = item.riskLevel.toLowerCase();
    const isHigh = riskLower.includes("high");
    const isModerate = riskLower.includes("mid") || riskLower.includes("moderate");

    return (
      <TouchableOpacity
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: "#F1F5F9",
          flexDirection: "row",
          alignItems: "center"
        }}
        onPress={() => {
          setSelectedAssessment(item);
          setModalVisible(true);
        }}
      >
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFF1F2", alignItems: "center", justifyContent: "center", marginRight: 16 }}>
          <Clock color="#E11D48" size={20} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: "#334155" }}>{formatDate(item.date)}</Text>
          <Text style={{ fontSize: 13, color: "#64748B" }}>{formatTime(item.date)}</Text>
        </View>
        <View style={{ alignItems: "flex-end", marginRight: 12 }}>
          <View style={[
            styles.riskPill,
            isHigh ? styles.riskHigh : isModerate ? styles.riskModerate : styles.riskLow
          ]}>
            <Text style={styles.riskText}>{item.riskLevel}</Text>
          </View>
        </View>
        <ChevronRight color="#CBD5E1" size={20} />
      </TouchableOpacity>
    );
  };

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
          <Text style={styles.headerTitle}>Clinical History</Text>
          <Text style={styles.headerSubtitle}>All your clinical assessments</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#E11D48" />
        </View>
      ) : (
        <FlatList
          data={assessments}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E11D48" />
          }
          ListEmptyComponent={
            <View style={{ flex: 1, alignItems: "center", marginTop: 40 }}>
              <Text style={{ color: "#64748B" }}>No clinical records yet.</Text>
            </View>
          }
        />
      )}

      {/* Reusing Modal logic from Doctor Record Detail */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: "#FFFFFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: "85%" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: "700" }}>Assessment Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {selectedAssessment && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ backgroundColor: "#F3F4F6", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                   <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                    <Text style={{ color: "#4B5563" }}>Blood Pressure</Text>
                    <Text style={{ fontWeight: "600" }}>{selectedAssessment.systolic}/{selectedAssessment.diastolic} mmHg</Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                    <Text style={{ color: "#4B5563" }}>Blood Sugar</Text>
                    <Text style={{ fontWeight: "600" }}>{selectedAssessment.bloodSugar} mmol/L</Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                    <Text style={{ color: "#4B5563" }}>Heart Rate</Text>
                    <Text style={{ fontWeight: "600" }}>{selectedAssessment.heartRate} bpm</Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ color: "#4B5563" }}>Body Temp</Text>
                    <Text style={{ fontWeight: "600" }}>{selectedAssessment.bodyTemp.toFixed(1)} °C</Text>
                  </View>
                </View>

                {selectedAssessment.recommendations && selectedAssessment.recommendations.length > 0 && (
                  <View style={{ marginBottom: 20 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                      <CheckCircle2 size={18} color="#10B981" style={{ marginRight: 8 }} />
                      <Text style={{ fontSize: 16, fontWeight: "600" }}>Doctor's Recommendations</Text>
                    </View>
                    {selectedAssessment.recommendations.map((rec, idx) => (
                      <View key={idx} style={{ flexDirection: "row", marginBottom: 8 }}>
                        <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center", marginRight: 8 }}>
                          <Text style={{ fontSize: 10, fontWeight: "700", color: "#065F46" }}>{idx + 1}</Text>
                        </View>
                        <Text style={{ flex: 1, color: "#4B5563" }}>{rec}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={{ backgroundColor: "#F1F5F9", padding: 12, borderRadius: 8, marginTop: 10 }}>
                  <Text style={{ fontSize: 12, color: "#64748B", fontStyle: "italic", textAlign: "center" }}>
                    These results are provided for your information. Please follow your doctor's specific clinical instructions.
                  </Text>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PatientRecordsTimeline;
