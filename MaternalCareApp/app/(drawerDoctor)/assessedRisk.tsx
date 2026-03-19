import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Animated,
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
} from "lucide-react-native";
import { useNavigation, useLocalSearchParams } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { getAssessedRiskStyles } from "@/styles/assessedRisk.styles";

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
}> = ({ feature, index, styles, colorScheme }) => {
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
  const barWidth = Math.min(absWeight * 100, 100);

  const impactColor = isIncreased ? "#E11D48" : "#10B981";
  const barColor = isIncreased ? "#FEE2E2" : "#D1FAE5";
  const barFillColor = isIncreased ? "#E11D48" : "#10B981";

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
            { backgroundColor: isIncreased ? "#FFF1F2" : "#ECFDF5" },
          ]}
        >
          <Text style={[styles.impactBadgeText, { color: impactColor }]}>
            {feature.impact}
          </Text>
        </View>
      </View>

      {/* Weight bar */}
      <View style={[styles.barTrack, { backgroundColor: barColor }]}>
        <View
          style={[
            styles.barFill,
            {
              width: `${barWidth}%` as any,
              backgroundColor: barFillColor,
            },
          ]}
        />
      </View>

      <Text style={styles.featureWeight}>
        Weight: {feature.weight > 0 ? "+" : ""}
        {feature.weight.toFixed(4)}
      </Text>
    </Animated.View>
  );
};

// --- Main Screen ---
const AssessedRiskScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getAssessedRiskStyles(colorScheme);
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  // Parse result from route params (pass as JSON string)
  let result: AssessmentResult | null = null;
  try {
    result = params.result ? JSON.parse(params.result as string) : null;
  } catch {
    result = null;
  }

  const riskConfig = getRiskConfig(result?.predicted_class ?? "");
  const probabilityPercent = ((result?.probability ?? 0) * 100).toFixed(1);

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

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right", "bottom"]}
    >
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

          {/* Probability gauge */}
          <View style={styles.gaugeContainer}>
            <Text style={styles.gaugeValue}>{probabilityPercent}%</Text>
            <Text style={styles.gaugeSubtext}>Confidence Score</Text>
          </View>

          <View style={styles.probabilityBarTrack}>
            <View
              style={[
                styles.probabilityBarFill,
                {
                  width: `${probabilityPercent}%` as any,
                  backgroundColor: riskConfig.color,
                },
              ]}
            />
          </View>

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
            Each factor's influence on the predicted risk classification,
            derived from LIME explainability analysis.
          </Text>

          <View style={styles.divider} />

          {(result?.features ?? []).map((feature, index) => (
            <FeatureRow
              key={index}
              feature={feature}
              index={index}
              styles={styles}
              colorScheme={colorScheme}
            />
          ))}
        </View>

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
            <TrendingUp color="#E11D48" size={16} />
            <Text style={styles.legendText}>
              <Text style={{ fontWeight: "700", color: "#E11D48" }}>
                Increased
              </Text>{" "}
              — This factor raises the predicted risk level. A positive weight
              means it pushed the model toward the current classification.
            </Text>
          </View>

          <View style={styles.legendItem}>
            <TrendingDown color="#10B981" size={16} />
            <Text style={styles.legendText}>
              <Text style={{ fontWeight: "700", color: "#10B981" }}>
                Decreased
              </Text>{" "}
              — This factor lowers the predicted risk level. A negative weight
              means it pulled the model away from high-risk classifications.
            </Text>
          </View>

          <View style={styles.legendItem}>
            <Minus color="#94A3B8" size={16} />
            <Text style={styles.legendText}>
              <Text style={{ fontWeight: "700" }}>Weight magnitude</Text> —
              Larger absolute values indicate stronger influence on the final
              prediction. Smaller values have marginal effect.
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
          >
            <Text style={styles.primaryButtonText}>New Assessment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Save Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AssessedRiskScreen;
