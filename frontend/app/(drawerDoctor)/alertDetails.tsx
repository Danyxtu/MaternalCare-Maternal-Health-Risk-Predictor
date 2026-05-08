import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Calendar,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  User,
  Droplet,
  Thermometer,
  Activity,
  ClipboardList,
} from "lucide-react-native";
import { getAlertDetailsScreenStyles } from "#/src/styles/alertDetails.styles";
import { router, useLocalSearchParams } from "expo-router";
import { BarChart, LineChart } from "react-native-chart-kit";
import { Svg, Polygon, Line as SvgLine, Circle, Text as SvgText } from "react-native-svg";
import { get } from "#/src/api/api";
import AppLogo from "#/src/components/AppLogo";

const screenWidth = Dimensions.get("window").width;

// --- Types ---
type RiskSeverity = "HIGH" | "MEDIUM" | "LOW";

interface VitalCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  label: string;
  value: string;
  unit: string;
}

interface PredictionProp {
  factor: string;
  severity: RiskSeverity;
  description: string;
}

interface AlertDetailData {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  overallRisk: string;
  severity: string;
  createdAt: string;
  physiologicalData: any;
  predictions: any[];
  recommendations: string[];
  possibleRisks: string[];
  history: any[];
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
  CRITICAL: {
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
  WARNING: {
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
  INFO: {
    bg: "#ECFDF5",
    borderLeft: "#10B981",
    textMain: "#10B981",
    textDark: "#065F46",
    badgeBg: "#D1FAE5",
    icon: <CheckCircle2 color="#10B981" size={20} />,
  },
};

// --- Sub-Components ---

const VitalCard: React.FC<VitalCardProps> = ({
  icon,
  iconBgColor,
  label,
  value,
  unit,
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getAlertDetailsScreenStyles(colorScheme);
  return (
    <View style={styles.vitalCard}>
      <View style={styles.vitalHeader}>
        <View style={[styles.vitalIconBox, { backgroundColor: iconBgColor }]}>
          {icon}
        </View>
        <Text style={styles.vitalLabel} numberOfLines={1}>{label}</Text>
      </View>
      <Text style={styles.vitalValue}>{value}</Text>
      <Text style={styles.vitalUnit}>{unit}</Text>
    </View>
  );
};

const PredictionCard: React.FC<PredictionProp> = ({
  factor,
  severity,
  description,
}) => {
  const theme = severityThemes[severity] || severityThemes.LOW;
  const colorScheme = useColorScheme() ?? "light";
  const styles = getAlertDetailsScreenStyles(colorScheme);
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

// --- Custom Radar Chart using SVG ---
const RadarChart = ({
  data,
  labels,
  size,
  isDark,
}: {
  data: number[];
  labels: string[];
  size: number;
  isDark: boolean;
}) => {
  const radius = size / 2.5;
  const centerX = size / 2;
  const centerY = size / 2;
  const angleStep = (Math.PI * 2) / data.length;

  // Grid levels
  const levels = [1, 2, 3];
  const gridLines = levels.map((level) => {
    const points = labels
      .map((_, i) => {
        const x =
          centerX +
          radius * (level / 3) * Math.cos(i * angleStep - Math.PI / 2);
        const y =
          centerY +
          radius * (level / 3) * Math.sin(i * angleStep - Math.PI / 2);
        return `${x},${y}`;
      })
      .join(" ");
    return (
      <Polygon
        key={level}
        points={points}
        fill="none"
        stroke={isDark ? "#334155" : "#E2E8F0"}
        strokeWidth="1"
      />
    );
  });

  // Axis lines and labels
  const axes = labels.map((label, i) => {
    const x = centerX + radius * Math.cos(i * angleStep - Math.PI / 2);
    const y = centerY + radius * Math.sin(i * angleStep - Math.PI / 2);

    // Label positioning
    const lx = centerX + (radius + 25) * Math.cos(i * angleStep - Math.PI / 2);
    const ly = centerY + (radius + 15) * Math.sin(i * angleStep - Math.PI / 2);

    return (
      <React.Fragment key={i}>
        <SvgLine
          x1={centerX}
          y1={centerY}
          x2={x}
          y2={y}
          stroke={isDark ? "#334155" : "#E2E8F0"}
          strokeWidth="1"
        />
        <SvgText
          x={lx}
          y={ly}
          fill={isDark ? "#94A3B8" : "#64748B"}
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {label}
        </SvgText>
      </React.Fragment>
    );
  });

  // Data area
  const dataPoints = data
    .map((val, i) => {
      const x =
        centerX + radius * (val / 3) * Math.cos(i * angleStep - Math.PI / 2);
      const y =
        centerY + radius * (val / 3) * Math.sin(i * angleStep - Math.PI / 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <Svg width={size} height={size}>
      {gridLines}
      {axes}
      <Polygon
        points={dataPoints}
        fill="rgba(225, 29, 72, 0.3)"
        stroke="#E11D48"
        strokeWidth="2"
      />
    </Svg>
  );
};

// --- Main Screen ---
const AlertDetailsScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? "light";
  const styles = getAlertDetailsScreenStyles(colorScheme);
  const isDark = colorScheme === "dark";

  const [alert, setAlert] = useState<AlertDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAlertDetail = async () => {
    try {
      const response = await get(`/alerts/${id}`);
      setAlert(response.data.data);
    } catch (error: any) {
      console.error("Failed to fetch alert details:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchAlertDetail();
      setIsLoading(false);
    };
    init();
  }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlertDetail();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#E11D48" />
        </View>
      </SafeAreaView>
    );
  }

  if (!alert) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: isDark ? "#ECEDEE" : "#11181C" }}>Alert not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
            <Text style={{ color: "#E11D48" }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const overallRiskLabel = alert.overallRisk === "CRITICAL" ? "HIGH" : (alert.overallRisk === "WARNING" ? "MEDIUM" : "LOW");
  const headerTheme = severityThemes[alert.overallRisk] || severityThemes.LOW;
  const isHighRisk = alert.overallRisk === "CRITICAL";

  // Chart Data
  const radarLabels = ["Age", "BP", "Sugar", "Temp", "HR"];
  const radarData = alert.predictions.map(p => {
    if (p.severity === "HIGH") return 3;
    if (p.severity === "MEDIUM") return 2;
    return 1;
  });

  const barData = alert.predictions.map(p => ({
    factor: p.factor,
    risk: p.severity === "HIGH" ? 3 : (p.severity === "MEDIUM" ? 2 : 1)
  }));

  const trendData = alert.history.map((h, i) => ({
    x: i,
    risk: h.riskScore,
    systolic: h.systolic
  }));

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right", "bottom"]}
    >
      {/* Top Navigation */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#E11D48" size={20} />
          <Text style={styles.backButtonText}>Back to Alerts</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E11D48" />
        }
      >
        {/* Patient Header Section */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.patientName}>{alert.patientName}</Text>
            <View style={styles.dateContainer}>
              <Calendar color="#64748B" size={14} style={{ marginRight: 6 }} />
              <Text style={styles.dateText}>
                {formatDate(alert.createdAt)} at {formatTime(alert.createdAt)}
              </Text>
            </View>
          </View>

          <View style={[styles.mainBadge, { backgroundColor: headerTheme.bg }]}>
            {headerTheme.icon}
            <Text
              style={[styles.mainBadgeText, { color: headerTheme.textDark }]}
            >
              {overallRiskLabel} RISK
            </Text>
          </View>
        </View>

        {/* Conditional Critical Warning Banner */}
        {isHighRisk && (
          <View style={styles.warningBanner}>
            <View style={styles.warningBannerHeader}>
              <AlertTriangle
                color="#E11D48"
                size={20}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.warningBannerTitle}>
                Immediate Attention Required
              </Text>
            </View>
            <Text style={styles.warningBannerText}>
              This patient has been classified as high risk. Please review the
              risk factors below and consult with a healthcare provider
              immediately.
            </Text>
          </View>
        )}

        {/* Vitals Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.vitalsScroll}
          contentContainerStyle={styles.vitalsScrollContent}
        >
          <VitalCard
            icon={<User color="#8B5CF6" size={18} />}
            iconBgColor="#EDE9FE"
            label="Age"
            value={alert.age.toString()}
            unit="years"
          />
          <VitalCard
            icon={<AppLogo size={18} />}
            iconBgColor="#FFE4E6"
            label="Blood Pressure"
            value={`${alert.physiologicalData.SystolicBP}/${alert.physiologicalData.DiastolicBP}`}
            unit="mmHg"
          />
          <VitalCard
            icon={<Droplet color="#3B82F6" size={18} />}
            iconBgColor="#DBEAFE"
            label="Blood Sugar"
            value={(alert.physiologicalData.BS || alert.physiologicalData.BloodSugar || 0).toString()}
            unit="mmol/L"
          />
          <VitalCard
            icon={<Thermometer color="#F59E0B" size={18} />}
            iconBgColor="#FEF3C7"
            label="Body Temp"
            value={(alert.physiologicalData.BodyTemp || 0).toString()}
            unit="°F"
          />
          <VitalCard
            icon={<Activity color="#10B981" size={18} />}
            iconBgColor="#D1FAE5"
            label="Heart Rate"
            value={(alert.physiologicalData.HeartRate || 0).toString()}
            unit="bpm"
          />
        </ScrollView>

        {/* Risk Factor Analysis (Radar Chart) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Risk Factor Analysis</Text>
          <View style={{ alignItems: "center", marginVertical: 10 }}>
            <RadarChart
              data={radarData}
              labels={radarLabels}
              size={screenWidth - 80}
              isDark={isDark}
            />
          </View>
        </View>

        {/* Vitals Trending (Line Chart) */}
        {trendData.length > 1 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Systolic BP Trend</Text>
            <View style={{ marginTop: 10, alignItems: 'center' }}>
              <LineChart
                data={{
                  labels: trendData.map((_, i) => (i + 1).toString()),
                  datasets: [{ data: trendData.map(h => h.systolic) }]
                }}
                width={screenWidth - 80}
                height={200}
                chartConfig={{
                  backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                  backgroundGradientFrom: isDark ? "#1E293B" : "#FFFFFF",
                  backgroundGradientTo: isDark ? "#1E293B" : "#FFFFFF",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(225, 29, 72, ${opacity})`,
                  labelColor: (opacity = 1) => isDark ? `rgba(148, 163, 184, ${opacity})` : `rgba(100, 116, 139, ${opacity})`,
                  style: { borderRadius: 16 },
                  propsForDots: { r: "4", strokeWidth: "2", stroke: "#E11D48" }
                }}
                bezier
                style={{ marginVertical: 8, borderRadius: 16 }}
              />
            </View>
          </View>
        )}

        {/* Risk Contribution by Factor (Bar Chart) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Risk Contribution by Factor</Text>
          <View style={{ marginTop: 10, alignItems: 'center' }}>
            <BarChart
              data={{
                labels: barData.map(d => d.factor),
                datasets: [{ data: barData.map(d => d.risk) }]
              }}
              width={screenWidth - 80}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              fromZero
              chartConfig={{
                backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                backgroundGradientFrom: isDark ? "#1E293B" : "#FFFFFF",
                backgroundGradientTo: isDark ? "#1E293B" : "#FFFFFF",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(225, 29, 72, ${opacity})`,
                labelColor: (opacity = 1) => isDark ? `rgba(148, 163, 184, ${opacity})` : `rgba(100, 116, 139, ${opacity})`,
                style: { borderRadius: 16 },
              }}
              style={{ marginVertical: 8, borderRadius: 16 }}
              showValuesOnTopOfBars
            />
          </View>
        </View>

        {/* Explainable Risk Predictions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Explainable Risk Predictions</Text>
          <Text style={styles.cardSubtitle}>
            Detailed analysis of each physiological factor contributing to the
            overall risk assessment.
          </Text>

          {alert.predictions.map((pred, index) => (
            <PredictionCard key={index} {...pred} />
          ))}
        </View>

        {/* Maternal Risks */}
        {alert.possibleRisks.length > 0 && (
          <View style={[styles.card, { borderColor: "#FECDD3" }]}>
             <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <AlertTriangle color="#E11D48" size={20} style={{ marginRight: 8 }} />
                <Text style={[styles.cardTitle, { marginBottom: 0, color: "#9F1239" }]}>Maternal Risks</Text>
             </View>
             {alert.possibleRisks.map((risk, index) => (
                <View key={index} style={styles.bulletRow}>
                  <View style={[styles.bulletPoint, { backgroundColor: "#E11D48" }]} />
                  <Text style={[styles.recommendationText, { color: isDark ? "#FECDD3" : "#9F1239" }]}>{risk}</Text>
                </View>
             ))}
          </View>
        )}

        {/* Clinical Recommendations */}
        {alert.recommendations.length > 0 && (
          <View style={styles.recommendationsCard}>
            <Text style={styles.recommendationsTitle}>
              Clinical Recommendations
            </Text>
            {alert.recommendations.map((rec, index) => (
              <View key={index} style={styles.bulletRow}>
                <View style={styles.bulletPoint} />
                <Text style={styles.recommendationText}>{rec}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Re-assessment Button */}
        <TouchableOpacity 
          style={styles.reassessmentButton}
          onPress={() => router.push({
            pathname: "/(drawerDoctor)/(tabs)/assessment",
            params: { 
              patientId: alert.patientId,
              patientName: alert.patientName
            }
          })}
        >
          <ClipboardList color="#FFFFFF" size={20} />
          <Text style={styles.reassessmentButtonText}>Perform Re-assessment</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default AlertDetailsScreen;
