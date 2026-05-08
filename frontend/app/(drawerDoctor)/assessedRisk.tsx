import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Animated,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Layout,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldAlert,
  Activity,
  ChevronLeft,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react-native";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { getAssessedRiskStyles } from "#/src/styles/assessedRisk.styles";
import api from "#/src/api/api";
import StatusModal from "#/src/components/StatusModal";

// --- Types ---
interface Feature {
  condition: string;
  weight: number;
  impact: "Increased" | "Decreased";
}

interface AssessmentResult {
  predicted_class: string;
  probability: number;
  features: Feature[];
  possible_maternal_risks?: string[];
  recommendations?: string[];
}

type RiskSeverity = "HIGH" | "MEDIUM" | "LOW";

interface PredictionProp {
  factor: string;
  severity: RiskSeverity;
  description: string;
}

// --- Theme Configuration ---
const severityThemes: Record<string, any> = {
  HIGH: {
    bg: "#FFF1F2",
    borderLeft: "#E11D48",
    textMain: "#E11D48",
    textDark: "#9F1239",
    badgeBg: "#FECDD3",
    icon: <AlertTriangle color="#E11D48" size={20} />,
  },
  MEDIUM: {
    bg: "#FFFBEB",
    borderLeft: "#F59E0B",
    textMain: "#D97706",
    textDark: "#92400E",
    badgeBg: "#FDE68A",
    icon: <AlertCircle color="#D97706" size={20} />,
  },
  LOW: {
    bg: "#ECFDF5",
    borderLeft: "#10B981",
    textMain: "#10B981",
    textDark: "#065F46",
    badgeBg: "#D1FAE5",
    icon: <CheckCircle2 color="#10B981" size={20} />,
  },
};

// --- Sub-Components ---

const PredictionCard: React.FC<PredictionProp> = ({
  factor,
  severity,
  description,
}) => {
  const theme = severityThemes[severity] || severityThemes.LOW;
  const colorScheme = useColorScheme() ?? "light";
  const styles = getAssessedRiskStyles(colorScheme);
  const textColor = theme.textDark;

  return (
    <View
      style={[
        styles.predictionCard,
        { backgroundColor: theme.bg, borderLeftColor: theme.borderLeft },
      ]}
    >
      <View style={styles.predictionHeader}>
        <View style={styles.predictionTitleRow}>
          <Text style={[styles.predictionFactor, { color: textColor }]}>
            {factor}
          </Text>
          <View style={[styles.badge, { backgroundColor: theme.badgeBg }]}>
            <Text style={[styles.badgeText, { color: theme.textDark }]}>
              {severity}
            </Text>
          </View>
        </View>
        {theme.icon}
      </View>
      <Text style={[styles.predictionDescription, { color: textColor }]}>
        {description}
      </Text>
    </View>
  );
};

// --- Risk Config ---
const getRiskConfig = (predictedClass: string) => {
  const lower = predictedClass?.toLowerCase() ?? "";
  if (lower.includes("high")) {
    return {
      color: "#E11D48",
      bg: "#FFF1F2",
      darkBg: "#3B0764",
      label: "High Risk",
      icon: "alert",
      description:
        "The patient's vitals indicate elevated cardiovascular and metabolic risk. Immediate medical evaluation is recommended.",
    };
  }
  if (lower.includes("mid") || lower.includes("moderate")) {
    return {
      color: "#F97316",
      bg: "#FFF7ED",
      darkBg: "#431407",
      label: "Moderate Risk",
      icon: "warn",
      description:
        "The patient's vitals suggest moderate risk factors. A follow-up consultation is advised within the week.",
    };
  }
  return {
    color: "#10B981",
    bg: "#ECFDF5",
    darkBg: "#064E3B",
    label: "Low Risk",
    icon: "ok",
    description:
      "The patient's vitals are within acceptable ranges. Routine monitoring is recommended.",
  };
};

// --- Main Screen ---
const AssessedRiskScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getAssessedRiskStyles(colorScheme);
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [isSaving, setIsSaving] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    status: "success" | "error";
    title: string;
    message: string;
  }>({
    visible: false,
    status: "success",
    title: "",
    message: "",
  });

  // Parse result from route params
  let result: AssessmentResult | null = null;
  let physiologicalData: string[] = [];
  try {
    result = params.result ? JSON.parse(params.result as string) : null;
    physiologicalData = params.physiological_data
      ? JSON.parse(params.physiological_data as string)
      : [];
  } catch {
    result = null;
  }

  const riskConfig = getRiskConfig(result?.predicted_class ?? "");
  const probabilityPercent = ((result?.probability ?? 0) * 100).toFixed(1);
  const isLowRisk = result?.predicted_class?.toLowerCase().includes("low");

  // Derive human-readable predictions from physiological data
  const ageVal = Number(physiologicalData[0]);
  const systolicVal = Number(physiologicalData[1]);
  const diastolicVal = Number(physiologicalData[2]);
  const bsVal = Number(physiologicalData[3]);
  const tempVal = Number(physiologicalData[4]);
  const hrVal = Number(physiologicalData[5]);

  const predictions: PredictionProp[] = [
    {
      factor: "Age",
      severity: ageVal > 35 ? "HIGH" : ageVal > 30 ? "MEDIUM" : "LOW",
      description:
        ageVal > 35
          ? "Advanced maternal age (>35) associated with higher risks"
          : ageVal > 30
            ? "Maternal age is slightly elevated"
            : "Age within normal maternal range",
    },
    {
      factor: "Blood Pressure",
      severity:
        systolicVal > 140 || diastolicVal > 90
          ? "HIGH"
          : systolicVal > 130 || diastolicVal > 80
            ? "MEDIUM"
            : "LOW",
      description:
        systolicVal > 140 || diastolicVal > 90
          ? `Hypertension detected (${systolicVal}/${diastolicVal}) - risk of preeclampsia`
          : systolicVal > 130 || diastolicVal > 80
            ? `Elevated BP (${systolicVal}/${diastolicVal}) - requires monitoring`
            : "Blood pressure is within normal range",
    },
    {
      factor: "Blood Sugar",
      severity: bsVal > 11 ? "HIGH" : bsVal > 7.8 ? "MEDIUM" : "LOW",
      description:
        bsVal > 11
          ? `Critically high blood sugar (${bsVal}) - risk of gestational diabetes`
          : bsVal > 7.8
            ? `Elevated blood sugar (${bsVal}) - monitor glucose levels`
            : "Blood sugar levels are stable",
    },
    {
      factor: "Heart Rate",
      severity: hrVal > 100 || hrVal < 60 ? "MEDIUM" : "LOW",
      description:
        hrVal > 100 || hrVal < 60
          ? `Heart rate (${hrVal} bpm) is outside normal range`
          : "Heart rate is normal",
    },
    {
      factor: "Body Temperature",
      severity: tempVal > 100.4 || tempVal < 97 ? "MEDIUM" : "LOW",
      description:
        tempVal > 100.4 || tempVal < 97
          ? `Body temperature (${tempVal} °F) is abnormal`
          : "Body temperature is normal",
    },
  ];

  // Calculate maximum weight for normalization
  const maxWeight = Math.max(
    ...(result?.features ?? []).map((f) => Math.abs(f.weight)),
    0.0001, // Prevent division by zero
  );

  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSaveReport = async () => {
    if (!result || isSaving) return;

    setIsSaving(true);
    try {
      const getParamString = (value: unknown): string => {
        if (Array.isArray(value)) {
          return typeof value[0] === "string" ? value[0] : "";
        }
        return typeof value === "string" ? value : "";
      };

      const patientName = getParamString(params.patient_name).trim();
      const patientIdRaw = getParamString(params.patient_id).trim();
      const patientAgeRaw = getParamString(params.patient_age).trim();

      const patientId = patientIdRaw ? Number(patientIdRaw) : undefined;
      const patientAgeFromParams = patientAgeRaw
        ? Number(patientAgeRaw)
        : undefined;

      const ageNum = Number(physiologicalData[0]);
      const systolicNum = Number(physiologicalData[1]);
      const diastolicNum = Number(physiologicalData[2]);
      const bloodSugarNum = Number(physiologicalData[3]);
      const temperatureNum = Number(physiologicalData[4]);
      const heartRateNum = Number(physiologicalData[5]);
      const sleepHoursNum = Number(physiologicalData[6]);
      const hemoglobinNum = Number(physiologicalData[7]);
      const ironSupplementNum = Number(physiologicalData[8]);
      const folicSupplementNum = Number(physiologicalData[9]);
      const dietAdherenceVal = physiologicalData[10];

      const vitals = [
        ageNum,
        systolicNum,
        diastolicNum,
        bloodSugarNum,
        temperatureNum,
        heartRateNum,
        sleepHoursNum,
        hemoglobinNum,
        ironSupplementNum,
        folicSupplementNum,
      ];

      if (vitals.some((v) => !Number.isFinite(v))) {
        setModalConfig({
          visible: true,
          status: "error",
          title: "Invalid Data",
          message:
            "Missing or invalid physiological data. Please run a new assessment.",
        });
        return;
      }

      if (!Number.isFinite(patientId as number) && !patientName) {
        setModalConfig({
          visible: true,
          status: "error",
          title: "Missing Patient",
          message: "Missing patient information. Please run a new assessment.",
        });
        return;
      }

      const safeParseInt = (val: any) => {
        if (!val || val === "null" || val === "undefined") return undefined;
        const parsed = parseInt(val);
        return isFinite(parsed) ? parsed : undefined;
      };

      const payload = {
        patientId: safeParseInt(params.patient_id),
        patientName: (params.patient_name as string) || undefined,
        patientAge: safeParseInt(params.patient_age) || Math.trunc(ageNum),
        physiological_data: {
          Age: ageNum,
          SystolicBP: systolicNum,
          DiastolicBP: diastolicNum,
          BS: bloodSugarNum,
          BodyTemp: temperatureNum,
          HeartRate: heartRateNum,
          sleep_hours: sleepHoursNum,
          hemoglobin_g_dL: hemoglobinNum,
          iron_supplement: ironSupplementNum,
          folic_supplement: folicSupplementNum,
          diet_adherence: dietAdherenceVal,
        },
        predicted_class: result.predicted_class,
        probability: result.probability,
        features: result.features,
        possible_maternal_risks: result.possible_maternal_risks,
        recommendations: result.recommendations,
      };

      await api.post("/assessments/save-report", payload);

      setModalConfig({
        visible: true,
        status: "success",
        title: "Report Saved",
        message:
          "The patient's assessment report has been successfully saved to the database.",
      });
    } catch (error: any) {
      if (error.status !== 401) {
        console.error("Save Report Error:", error);
      }
      setModalConfig({
        visible: true,
        status: "error",
        title: "Save Failed",
        message:
          error.message ||
          "We encountered an error while saving the report. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleModalClose = () => {
    const isSuccess = modalConfig.status === "success";
    setModalConfig((prev) => ({ ...prev, visible: false }));
    if (isSuccess) {
      router.push("/(drawerDoctor)/(tabs)/dashboard");
    }
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right", "bottom"]}
    >
      <StatusModal
        visible={modalConfig.visible}
        status={modalConfig.status}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={handleModalClose}
      />
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft
            color={colorScheme === "dark" ? "#ECEDEE" : "#11181C"}
            size={24}
          />
        </TouchableOpacity>
        <View style={[styles.headerTextContainer, { marginLeft: 12 }]}>
          <Text style={styles.headerTitle}>Risk Assessment Report</Text>
          <Text style={styles.headerSubtitle}>
            AI-powered physiological analysis
          </Text>
        </View>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Layout
            color={colorScheme === "dark" ? "#ECEDEE" : "#11181C"}
            size={22}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Risk Level Hero Card ── */}
        <Animated.View
          style={[
            styles.heroCard,
            {
              borderColor: riskConfig.color + "40",
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View
            style={[
              styles.riskIconCircle,
              { backgroundColor: riskConfig.color + "20" },
            ]}
          >
            <ShieldAlert color={riskConfig.color} size={32} />
          </View>

          <Text style={[styles.riskLabel, { color: riskConfig.color }]}>
            {riskConfig.label}
          </Text>

          <View style={[styles.infoBox, { borderLeftColor: riskConfig.color }]}>
            <Info color={riskConfig.color} size={14} style={{ marginTop: 2 }} />
            <Text style={styles.infoBoxText}>{riskConfig.description}</Text>
          </View>
        </Animated.View>

        {/* ── Feature Contributions Card ── */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Activity color="#E11D48" size={20} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Explainable Risk Predictions</Text>
          </View>

          <Text style={styles.sectionSubtitle}>
            Detailed analysis of each physiological factor contributing to the
            overall risk assessment.
          </Text>

          <View style={styles.divider} />

          {predictions.map((pred, index) => (
            <PredictionCard key={index} {...pred} />
          ))}
        </View>

        {/* ── Possible Maternal Risks Card ── */}
        {!isLowRisk &&
          result?.possible_maternal_risks &&
          result.possible_maternal_risks.length > 0 && (
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <AlertTriangle
                  color="#E11D48"
                  size={20}
                  style={styles.sectionIcon}
                />
                <Text style={styles.sectionTitle}>Possible Maternal Risks</Text>
              </View>
              <Text style={styles.sectionSubtitle}>
                Potential health complications identified by AI analysis based
                on the physiological patterns.
              </Text>
              <View style={styles.divider} />
              {result.possible_maternal_risks.map((risk, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    marginBottom: 8,
                    alignItems: "flex-start",
                  }}
                >
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: "#E11D48",
                      marginTop: 8,
                      marginRight: 10,
                    }}
                  />
                  <Text
                    style={{
                      flex: 1,
                      color: colorScheme === "dark" ? "#ECEDEE" : "#1F2937",
                      fontSize: 14,
                      lineHeight: 20,
                    }}
                  >
                    {risk}
                  </Text>
                </View>
              ))}
            </View>
          )}

        {/* ── Recommendations Card ── */}
        {result?.recommendations && result.recommendations.length > 0 && (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <CheckCircle2
                color="#10B981"
                size={20}
                style={styles.sectionIcon}
              />
              <Text style={styles.sectionTitle}>Medical Recommendations</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Actionable steps and clinical advice generated to mitigate
              identified risks.
            </Text>
            <View style={styles.divider} />
            {result.recommendations.map((rec, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  marginBottom: 12,
                  alignItems: "flex-start",
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: "#D1FAE5",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: "#065F46",
                    }}
                  >
                    {index + 1}
                  </Text>
                </View>
                <Text
                  style={{
                    flex: 1,
                    color: colorScheme === "dark" ? "#ECEDEE" : "#1F2937",
                    fontSize: 14,
                    lineHeight: 20,
                  }}
                >
                  {rec}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Interpretation Guide Card ── */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <AlertTriangle
              color="#F97316"
              size={20}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>How to Interpret</Text>
          </View>

          <View style={styles.legendItem}>
            <TrendingUp color={isLowRisk ? "#10B981" : "#E11D48"} size={16} />
            <Text style={styles.legendText}>
              <Text
                style={{
                  fontWeight: "700",
                  color: isLowRisk ? "#10B981" : "#E11D48",
                }}
              >
                Increased
              </Text>{" "}
              —{" "}
              {isLowRisk
                ? "This factor strongly supports the Low Risk classification (Healthy indicator)."
                : "This factor raises the predicted risk level. A positive weight means it pushed the model toward the current classification."}
            </Text>
          </View>

          <View style={styles.legendItem}>
            <TrendingDown color={isLowRisk ? "#E11D48" : "#10B981"} size={16} />
            <Text style={styles.legendText}>
              <Text
                style={{
                  fontWeight: "700",
                  color: isLowRisk ? "#E11D48" : "#10B981",
                }}
              >
                Decreased
              </Text>{" "}
              —{" "}
              {isLowRisk
                ? "This factor pulls the patient away from Low Risk (Area for optimization)."
                : "This factor lowers the predicted risk level. A negative weight means it pulled the model away from high-risk classifications."}
            </Text>
          </View>

          <View style={styles.legendItem}>
            <Minus color="#94A3B8" size={16} />
            <Text style={styles.legendText}>
              <Text style={{ fontWeight: "700" }}>Influence percentage</Text> —
              Relative strength of each factor on the final prediction compared
              to the most significant factor.
            </Text>
          </View>
        </View>

        {/* ── Disclaimer ── */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            ⚠️ This assessment is generated by a machine learning model and is
            intended for informational purposes only. It does not constitute
            medical advice. Always consult a licensed healthcare professional
            for clinical decisions.
          </Text>
        </View>

        {/* ── Actions ── */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.goBack()}
            disabled={isSaving}
          >
            <Text style={styles.primaryButtonText}>New Assessment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryButton, isSaving && { opacity: 0.7 }]}
            onPress={handleSaveReport}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#10B981" size="small" />
            ) : (
              <Text style={styles.secondaryButtonText}>Save Report</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AssessedRiskScreen;
