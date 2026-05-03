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

// --- Feature Row Component ---
const FeatureRow: React.FC<{
  feature: Feature;
  index: number;
  styles: ReturnType<typeof getAssessedRiskStyles>;
  colorScheme: "light" | "dark";
  isLowRisk: boolean;
  maxWeight: number;
}> = ({ feature, index, styles, colorScheme, isLowRisk, maxWeight }) => {
  const slideAnim = useRef(new Animated.Value(30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isIncreased = feature.impact === "Increased";
  const absWeight = Math.abs(feature.weight);

  // Normalize bar width based on max weight in the set
  const barWidth = maxWeight > 0 ? (absWeight / maxWeight) * 100 : 0;

  // Logic:
  // If Low Risk: Positive (Increased) is GREEN (Good), Negative (Decreased) is RED (Bad)
  // If High/Mid Risk: Positive (Increased) is RED (Bad), Negative (Decreased) is GREEN (Good)
  const isGood = isLowRisk ? isIncreased : !isIncreased;

  const impactColor = isGood ? "#10B981" : "#E11D48";
  const barColor = isGood ? "#D1FAE5" : "#FEE2E2";
  const barFillColor = isGood ? "#10B981" : "#E11D48";

  return (
    <Animated.View
      style={[
        styles.featureRow,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.featureHeader}>
        <View style={styles.featureLeft}>
          {isIncreased ? (
            <TrendingUp color={impactColor} size={16} />
          ) : (
            <TrendingDown color={impactColor} size={16} />
          )}
          <Text style={styles.featureCondition}>{feature.condition}</Text>
        </View>
        <View
          style={[
            styles.impactBadge,
            { backgroundColor: isGood ? "#ECFDF5" : "#FFF1F2" },
          ]}
        >
          <Text style={[styles.impactBadgeText, { color: impactColor }]}>
            {isLowRisk
              ? isIncreased
                ? "Good"
                : "Needs Attention"
              : isIncreased
                ? "Risk Factor"
                : "Mitigating"}
          </Text>
        </View>
      </View>

      {/* Weight bar */}
      <View style={[styles.barTrack, { backgroundColor: barColor }]}>
        <View
          style={[
            styles.barFill,
            {
              width: `${Math.max(barWidth, 2)}%` as any, // Minimum 2% visibility
              backgroundColor: barFillColor,
            },
          ]}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.featureWeight}>
          Weight: {feature.weight > 0 ? "+" : ""}
          {feature.weight.toFixed(4)}
        </Text>
        <Text
          style={[
            styles.featureWeight,
            { fontWeight: "600", color: impactColor },
          ]}
        >
          {Math.round(barWidth)}% Influence
        </Text>
      </View>
    </Animated.View>
  );
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
  const formatFeature = (feature: string) => {
    if (!feature) return "";

    // Removes "num_" prefix
    const stripped = feature.replace("num__", "");

    // If you actually want Title Case, add this:
    // return stripped.charAt(0).toUpperCase() + stripped.slice(1);

    return stripped;
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
            <Text style={styles.sectionTitle}>Contributing Factors</Text>
          </View>

          <Text style={styles.sectionSubtitle}>
            {isLowRisk
              ? "Key factors supporting the healthy status and areas that could be further optimized."
              : "Each factor's influence on the predicted risk classification, derived from AI explainability analysis."}
          </Text>

          <View style={styles.divider} />

          {(result?.features ?? []).map((feature, index) => {
            const formattedFeature = {
              ...feature,
              condition: formatFeature(feature.condition),
            };

            return (
              <FeatureRow
                key={index}
                feature={formattedFeature}
                index={index}
                styles={styles}
                colorScheme={colorScheme}
                isLowRisk={isLowRisk}
                maxWeight={maxWeight}
              />
            );
          })}
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
