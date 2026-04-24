import React, { useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";

import { getPatientRecordsScreenStyles } from "#/src/styles/patientRecords.styles";

// --- Types ---
type RiskLevel = "Low" | "Moderate" | "High";

interface AssessmentRecord {
  id: string;
  date: string; // ISO string
  systolic: number;
  diastolic: number;
  bloodSugar: number;
  heartRate: number;
  bodyTemp: number;
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 1
  note?: string;
}

interface PatientDetail {
  id: string;
  name: string;
  age: number;
  gravidity: number;
  parity: number;
  lastBloodPressure: string;
  lastBloodSugar: number;
  lastHeartRate: number;
  gestationalAgeWeeks: number;
  assessments: AssessmentRecord[];
}

const patientHistoryData: Record<string, PatientDetail> = {
  "1": {
    id: "1",
    name: "Sarah Johnson",
    age: 28,
    gravidity: 1,
    parity: 0,
    lastBloodPressure: "115/75",
    lastBloodSugar: 92,
    lastHeartRate: 78,
    gestationalAgeWeeks: 26,
    assessments: [
      {
        id: "1-3",
        date: "2026-03-12T15:10:00Z",
        systolic: 115,
        diastolic: 75,
        bloodSugar: 92,
        heartRate: 78,
        bodyTemp: 36.8,
        riskLevel: "Low",
        riskScore: 0.14,
        note: "Vitals stable. Recommended routine follow-up in 2 weeks.",
      },
      {
        id: "1-2",
        date: "2026-03-02T09:00:00Z",
        systolic: 118,
        diastolic: 76,
        bloodSugar: 96,
        heartRate: 81,
        bodyTemp: 36.9,
        riskLevel: "Low",
        riskScore: 0.18,
        note: "Slight increase in HR after exercise, no intervention needed.",
      },
      {
        id: "1-1",
        date: "2026-02-18T10:30:00Z",
        systolic: 120,
        diastolic: 78,
        bloodSugar: 98,
        heartRate: 80,
        bodyTemp: 37.0,
        riskLevel: "Low",
        riskScore: 0.22,
        note: "Baseline visit for prenatal check-up.",
      },
    ],
  },
  "2": {
    id: "2",
    name: "Maria Garcia",
    age: 38,
    gravidity: 3,
    parity: 2,
    lastBloodPressure: "145/95",
    lastBloodSugar: 110,
    lastHeartRate: 92,
    gestationalAgeWeeks: 30,
    assessments: [
      {
        id: "2-3",
        date: "2026-03-14T11:45:00Z",
        systolic: 145,
        diastolic: 95,
        bloodSugar: 110,
        heartRate: 92,
        bodyTemp: 37.2,
        riskLevel: "High",
        riskScore: 0.78,
        note: "Elevated BP and HR. Advised close monitoring and repeat labs.",
      },
      {
        id: "2-2",
        date: "2026-03-05T08:20:00Z",
        systolic: 138,
        diastolic: 90,
        bloodSugar: 105,
        heartRate: 88,
        bodyTemp: 37.1,
        riskLevel: "Moderate",
        riskScore: 0.55,
        note: "BP trending up; started low-sodium plan and home BP log.",
      },
      {
        id: "2-1",
        date: "2026-02-25T10:00:00Z",
        systolic: 132,
        diastolic: 88,
        bloodSugar: 102,
        heartRate: 85,
        bodyTemp: 37.0,
        riskLevel: "Moderate",
        riskScore: 0.42,
        note: "Baseline for third trimester; advised hydration.",
      },
    ],
  },
  "3": {
    id: "3",
    name: "Emily Chen",
    age: 25,
    gravidity: 1,
    parity: 0,
    lastBloodPressure: "122/82",
    lastBloodSugar: 88,
    lastHeartRate: 76,
    gestationalAgeWeeks: 18,
    assessments: [
      {
        id: "3-2",
        date: "2026-03-10T13:15:00Z",
        systolic: 122,
        diastolic: 82,
        bloodSugar: 88,
        heartRate: 76,
        bodyTemp: 36.7,
        riskLevel: "Low",
        riskScore: 0.12,
        note: "Steady vitals, encourage regular prenatal vitamins.",
      },
      {
        id: "3-1",
        date: "2026-02-27T09:50:00Z",
        systolic: 124,
        diastolic: 83,
        bloodSugar: 90,
        heartRate: 78,
        bodyTemp: 36.8,
        riskLevel: "Low",
        riskScore: 0.16,
        note: "Normal findings.",
      },
    ],
  },
};

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

  const patient = id ? patientHistoryData[String(id)] : undefined;

  const sortedAssessments = useMemo(() => {
    if (!patient) return [];
    return [...patient.assessments].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [patient]);

  const renderHistoryItem = ({ item }: { item: AssessmentRecord }) => (
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
            item.riskLevel === "High"
              ? styles.riskHigh
              : item.riskLevel === "Moderate"
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
              <Text style={styles.metaLabel}>Gestational Age</Text>
              <Text style={styles.metaValue}>
                {patient.gestationalAgeWeeks} wks
              </Text>
            </View>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Gravidity / Parity</Text>
              <Text style={styles.metaValue}>
                G{patient.gravidity} • P{patient.parity}
              </Text>
            </View>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Last BP</Text>
              <Text style={styles.metaValue}>
                {patient.lastBloodPressure} mmHg
              </Text>
            </View>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Last Blood Sugar</Text>
              <Text style={styles.metaValue}>
                {patient.lastBloodSugar} mg/dL
              </Text>
            </View>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Last Heart Rate</Text>
              <Text style={styles.metaValue}>{patient.lastHeartRate} bpm</Text>
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
        />
      </View>
    </SafeAreaView>
  );
};

export default PatientRecordDetail;
