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
import { ArrowLeft, X, AlertTriangle, CheckCircle2 } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { get } from "#/src/api/api";

import { getPatientRecordsScreenStyles } from "#/src/styles/patientRecords.styles";

// --- Types ---
interface AssessmentRecord {
  id: string;
  date: string; // ISO string
  systolic: number;
  diastolic: number;
  bloodSugar: number;
  heartRate: number;
  bodyTemp: number;
  riskLevel: string;
  riskScore: number; // 0 - 1
  possible_maternal_risks?: string[];
  recommendations?: string[];
  note?: string;
}

interface PatientDetail {
  id: string;
  name: string;
  age: number;
  contact: string;
  assessments: AssessmentRecord[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const PatientRecordDetail: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getPatientRecordsScreenStyles(colorScheme);
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal State
  const [selectedAssessment, setSelectedAssessment] =
    useState<AssessmentRecord | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchPatientDetail = async () => {
    if (!id) return;
    try {
      const response = await get(`/patients/${id}`);
      setPatient(response.data.data);
    } catch (error: any) {
      if (error.status !== 401) {
        console.error("Failed to fetch patient detail:", error);
      }
    }
  };

  useEffect(() => {
    const initialFetch = async () => {
      setIsLoading(true);
      await fetchPatientDetail();
      setIsLoading(false);
    };
    initialFetch();
  }, [id]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchPatientDetail();
    setRefreshing(false);
  }, [id]);

  const sortedAssessments = useMemo(() => {
    if (!patient) return [];
    return [...patient.assessments].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [patient]);

  const openAssessmentModal = (assessment: AssessmentRecord) => {
    setSelectedAssessment(assessment);
    setModalVisible(true);
  };

  const renderHistoryItem = ({ item }: { item: AssessmentRecord }) => {
    const riskLower = item.riskLevel.toLowerCase();
    const isHigh = riskLower.includes("high");
    const isModerate =
      riskLower.includes("mid") ||
      riskLower.includes("moderate") ||
      riskLower.includes("medium");

    return (
      <TouchableOpacity
        style={[
          styles.historyRow,
          { flexDirection: "column", paddingVertical: 12 },
        ]}
        onPress={() => openAssessmentModal(item)}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={[styles.historyCell, styles.colDateHistory]}>
            <Text style={styles.cellText}>{formatDate(item.date)}</Text>
            <Text style={styles.unitText}>{formatTime(item.date)}</Text>
          </View>
          <View style={[styles.historyCell, styles.colVitalsHistory]}>
            <Text style={styles.cellText}>
              BP {item.systolic}/{item.diastolic} mmHg
            </Text>
            <Text style={styles.cellText}>
              Blood Sugar {item.bloodSugar} mmol/L
            </Text>
            <Text style={styles.cellText}>Heart Rate {item.heartRate} bpm</Text>
            <Text style={styles.cellText}>
              Body Temp {item.bodyTemp.toFixed(1)} °C
            </Text>
          </View>
          <View style={[styles.historyCell, styles.colRiskHistory]}>
            <View
              style={[
                styles.riskPill,
                isHigh
                  ? styles.riskHigh
                  : isModerate
                    ? styles.riskModerate
                    : styles.riskLow,
              ]}
            >
              <Text style={styles.riskText}>{item.riskLevel} Risk</Text>
            </View>
            <Text style={styles.riskScore}>
              {(item.riskScore * 100).toFixed(0)}% confidence
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      </SafeAreaView>
    );
  }

  if (!patient) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "left", "right", "bottom"]}
      >
        <View style={styles.detailHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft
              size={20}
              color={colorScheme === "dark" ? "#ECEDEE" : "#11181C"}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Patient not found</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No record available</Text>
          <Text style={styles.emptySubtitle}>
            We couldn't find the patient you selected. Try returning to the
            list.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right", "bottom"]}
    >
      <View style={styles.detailContainer}>
        <View style={styles.detailHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft
              size={20}
              color={colorScheme === "dark" ? "#ECEDEE" : "#11181C"}
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{patient.name}</Text>
            <Text style={styles.headerSubtitle}>
              Historical assessments (latest first)
            </Text>
          </View>
        </View>

        <View style={styles.patientCard}>
          <View style={styles.patientNameRow}>
            <Text style={styles.headerTitle}>{patient.name}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                ID #{patient.id.padStart(3, "0")}
              </Text>
            </View>
          </View>
          <View style={styles.patientMetaRow}>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Age</Text>
              <Text style={styles.metaValue}>{patient.age} yrs</Text>
            </View>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Contact</Text>
              <Text style={styles.metaValue}>{patient.contact}</Text>
            </View>
          </View>
        </View>

        <View style={styles.historyHeader}>
          <Text style={styles.historyHeaderText}>Assessment History</Text>
          <Text style={styles.historyCount}>
            {sortedAssessments.length} records
          </Text>
        </View>

        <View style={styles.historyTableHeader}>
          <Text style={[styles.historyTableHeaderText, styles.colDateHistory]}>
            Date
          </Text>
          <Text
            style={[styles.historyTableHeaderText, styles.colVitalsHistory]}
          >
            Vitals
          </Text>
          <Text style={[styles.historyTableHeaderText, styles.colRiskHistory]}>
            Risk
          </Text>
        </View>

        <FlatList
          data={sortedAssessments}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#10B981"]}
            />
          }
        />

        {/* Assessment Details Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: colorScheme === "dark" ? "#1F2937" : "#FFFFFF",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
                maxHeight: "85%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: colorScheme === "dark" ? "#F9FAFB" : "#111827",
                  }}
                >
                  Assessment Details
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <X
                    size={24}
                    color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                  />
                </TouchableOpacity>
              </View>

              {selectedAssessment && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 20,
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: 12,
                          color: colorScheme === "dark" ? "#9CA3AF" : "#6B7280",
                        }}
                      >
                        Date
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: colorScheme === "dark" ? "#F9FAFB" : "#111827",
                        }}
                      >
                        {formatDate(selectedAssessment.date)} at{" "}
                        {formatTime(selectedAssessment.date)}
                      </Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: colorScheme === "dark" ? "#9CA3AF" : "#6B7280",
                        }}
                      >
                        Risk Level
                      </Text>
                      <View
                        style={[
                          styles.riskPill,
                          selectedAssessment.riskLevel
                            .toLowerCase()
                            .includes("high")
                            ? styles.riskHigh
                            : selectedAssessment.riskLevel
                                  .toLowerCase()
                                  .includes("mid") ||
                                selectedAssessment.riskLevel
                                  .toLowerCase()
                                  .includes("medium")
                              ? styles.riskModerate
                              : styles.riskLow,
                          { marginTop: 4 },
                        ]}
                      >
                        <Text style={styles.riskText}>
                          {selectedAssessment.riskLevel}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: colorScheme === "dark" ? "#F9FAFB" : "#111827",
                      marginBottom: 10,
                    }}
                  >
                    Vital Signs
                  </Text>
                  <View
                    style={{
                      backgroundColor:
                        colorScheme === "dark" ? "#374151" : "#F3F4F6",
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 20,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: colorScheme === "dark" ? "#D1D5DB" : "#4B5563",
                        }}
                      >
                        Blood Pressure
                      </Text>
                      <Text
                        style={{
                          fontWeight: "600",
                          color: colorScheme === "dark" ? "#F9FAFB" : "#111827",
                        }}
                      >
                        {selectedAssessment.systolic}/
                        {selectedAssessment.diastolic} mmHg
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: colorScheme === "dark" ? "#D1D5DB" : "#4B5563",
                        }}
                      >
                        Blood Sugar
                      </Text>
                      <Text
                        style={{
                          fontWeight: "600",
                          color: colorScheme === "dark" ? "#F9FAFB" : "#111827",
                        }}
                      >
                        {selectedAssessment.bloodSugar} mmol/L
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: colorScheme === "dark" ? "#D1D5DB" : "#4B5563",
                        }}
                      >
                        Heart Rate
                      </Text>
                      <Text
                        style={{
                          fontWeight: "600",
                          color: colorScheme === "dark" ? "#F9FAFB" : "#111827",
                        }}
                      >
                        {selectedAssessment.heartRate} bpm
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          color: colorScheme === "dark" ? "#D1D5DB" : "#4B5563",
                        }}
                      >
                        Body Temp
                      </Text>
                      <Text
                        style={{
                          fontWeight: "600",
                          color: colorScheme === "dark" ? "#F9FAFB" : "#111827",
                        }}
                      >
                        {selectedAssessment.bodyTemp.toFixed(1)} °C
                      </Text>
                    </View>
                  </View>

                  {selectedAssessment.possible_maternal_risks &&
                    selectedAssessment.possible_maternal_risks.length > 0 && (
                      <View style={{ marginBottom: 20 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 10,
                          }}
                        >
                          <AlertTriangle
                            size={18}
                            color="#E11D48"
                            style={{ marginRight: 8 }}
                          />
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "600",
                              color:
                                colorScheme === "dark" ? "#F9FAFB" : "#111827",
                            }}
                          >
                            Possible Risks
                          </Text>
                        </View>
                        {selectedAssessment.possible_maternal_risks.map(
                          (risk, idx) => (
                            <View
                              key={idx}
                              style={{ flexDirection: "row", marginBottom: 6 }}
                            >
                              <View
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: "#E11D48",
                                  marginTop: 6,
                                  marginRight: 8,
                                }}
                              />
                              <Text
                                style={{
                                  flex: 1,
                                  color:
                                    colorScheme === "dark"
                                      ? "#D1D5DB"
                                      : "#4B5563",
                                }}
                              >
                                {risk}
                              </Text>
                            </View>
                          ),
                        )}
                      </View>
                    )}

                  {selectedAssessment.recommendations &&
                    selectedAssessment.recommendations.length > 0 && (
                      <View style={{ marginBottom: 20 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 10,
                          }}
                        >
                          <CheckCircle2
                            size={18}
                            color="#10B981"
                            style={{ marginRight: 8 }}
                          />
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "600",
                              color:
                                colorScheme === "dark" ? "#F9FAFB" : "#111827",
                            }}
                          >
                            Recommendations
                          </Text>
                        </View>
                        {selectedAssessment.recommendations.map((rec, idx) => (
                          <View
                            key={idx}
                            style={{ flexDirection: "row", marginBottom: 8 }}
                          >
                            <View
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: 9,
                                backgroundColor: "#D1FAE5",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 8,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 10,
                                  fontWeight: "700",
                                  color: "#065F46",
                                }}
                              >
                                {idx + 1}
                              </Text>
                            </View>
                            <Text
                              style={{
                                flex: 1,
                                color:
                                  colorScheme === "dark"
                                    ? "#D1D5DB"
                                    : "#4B5563",
                              }}
                            >
                              {rec}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}

                  {selectedAssessment.note ? (
                    <View style={{ marginBottom: 40 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: colorScheme === "dark" ? "#F9FAFB" : "#111827",
                          marginBottom: 10,
                        }}
                      >
                        Notes
                      </Text>
                      <Text
                        style={{
                          color: colorScheme === "dark" ? "#D1D5DB" : "#4B5563",
                          fontStyle: "italic",
                        }}
                      >
                        {selectedAssessment.note}
                      </Text>
                    </View>
                  ) : (
                    <View style={{ height: 20 }} />
                  )}
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default PatientRecordDetail;
