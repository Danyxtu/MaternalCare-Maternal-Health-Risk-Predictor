import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
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

  const fetchPatientDetail = async () => {
    if (!id) return;
    try {
      const response = await get(`/patients/${id}`);
      setPatient(response.data.data);
    } catch (error) {
      console.error("Failed to fetch patient detail:", error);
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

  const renderHistoryItem = ({ item }: { item: AssessmentRecord }) => {
    const riskLower = item.riskLevel.toLowerCase();
    const isHigh = riskLower.includes("high");
    const isModerate = riskLower.includes("mid") || riskLower.includes("moderate") || riskLower.includes("medium");

    return (
      <View style={styles.historyRow}>
        <View style={[styles.historyCell, styles.colDateHistory]}>
          <Text style={styles.cellText}>{formatDate(item.date)}</Text>
          <Text style={styles.unitText}>{formatTime(item.date)}</Text>
        </View>
        <View style={[styles.historyCell, styles.colVitalsHistory]}>
          <Text style={styles.cellText}>
            BP {item.systolic}/{item.diastolic} mmHg
          </Text>
          <Text style={styles.cellText}>Blood Sugar {item.bloodSugar} mg/dL</Text>
          <Text style={styles.cellText}>Heart Rate {item.heartRate} bpm</Text>
          <Text style={styles.cellText}>
            Body Temp {item.bodyTemp.toFixed(1)} °C
          </Text>
          {item.note ? <Text style={styles.noteText}>{item.note}</Text> : null}
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
            {(item.riskScore * 100).toFixed(0)}% model confidence
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#10B981"]} />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default PatientRecordDetail;
