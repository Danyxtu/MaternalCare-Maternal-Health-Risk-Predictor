import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  useColorScheme,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Calendar,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  User,
  Heart,
  Droplet
} from 'lucide-react-native';
import { getAlertDetailsScreenStyles } from '@/styles/alertDetails.styles';
import { router } from 'expo-router';
import { CartesianChart, Bar } from "victory-native";
import { Svg, Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';

const screenWidth = Dimensions.get("window").width;

// --- Types ---
type RiskSeverity = 'HIGH' | 'MEDIUM' | 'LOW';

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

// --- Theme Configuration ---
const severityThemes = {
  HIGH: {
    bg: '#FFF1F2',
    borderLeft: '#E11D48',
    textMain: '#E11D48',
    textDark: '#9F1239',
    badgeBg: '#FECDD3',
    icon: <AlertTriangle color="#E11D48" size={20} />
  },
  MEDIUM: {
    bg: '#FFFBEB',
    borderLeft: '#F59E0B',
    textMain: '#D97706',
    textDark: '#92400E',
    badgeBg: '#FDE68A',
    icon: <AlertCircle color="#D97706" size={20} />
  },
  LOW: {
    bg: '#ECFDF5',
    borderLeft: '#10B981',
    textMain: '#10B981',
    textDark: '#065F46',
    badgeBg: '#D1FAE5',
    icon: <CheckCircle2 color="#10B981" size={20} />
  }
};

// --- Mock Data (Maria Garcia - High Risk) ---
const patientData = {
  name: "Maria Garcia",
  date: "Saturday, February 21, 2026",
  time: "04:15 PM",
  overallRisk: "HIGH" as RiskSeverity,
  predictions: [
    { factor: "Age", severity: "HIGH", description: "Advanced maternal age (>35) associated with higher risks" },
    { factor: "Blood Pressure", severity: "HIGH", description: "Hypertension detected - risk of preeclampsia" },
    { factor: "Blood Sugar", severity: "MEDIUM", description: "Elevated blood sugar - monitor for gestational diabetes" },
    { factor: "Body Temperature", severity: "LOW", description: "Body temperature normal" },
    { factor: "Heart Rate", severity: "MEDIUM", description: "Slightly elevated heart rate" },
  ] as PredictionProp[],
  recommendations: [
    "Immediate consultation with obstetrician recommended",
    "Daily vital signs monitoring required",
    "Consider hospitalization for close observation"
  ]
};

// --- Sub-Components ---

const VitalCard: React.FC<VitalCardProps> = ({ icon, iconBgColor, label, value, unit }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getAlertDetailsScreenStyles(colorScheme);
  return (
    <View style={styles.vitalCard}>
      <View style={styles.vitalHeader}>
        <View style={[styles.vitalIconBox, { backgroundColor: iconBgColor }]}>
          {icon}
        </View>
        <Text style={styles.vitalLabel}>{label}</Text>
      </View>
      <Text style={styles.vitalValue}>{value}</Text>
      <Text style={styles.vitalUnit}>{unit}</Text>
    </View>
  );
};

const PredictionCard: React.FC<PredictionProp> = ({ factor, severity, description }) => {
  const theme = severityThemes[severity];
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getAlertDetailsScreenStyles(colorScheme);

  return (
    <View style={[styles.predictionCard, { backgroundColor: theme.bg, borderLeftColor: theme.borderLeft }]}>
      <View style={styles.predictionHeader}>
        <View style={styles.predictionTitleRow}>
          <Text style={styles.predictionFactor}>{factor}</Text>
          <View style={[styles.badge, { backgroundColor: theme.badgeBg }]}>
            <Text style={[styles.badgeText, { color: theme.textDark }]}>{severity}</Text>
          </View>
        </View>
        {theme.icon}
      </View>
      <Text style={styles.predictionDescription}>{description}</Text>
    </View>
  );
};

// --- Custom Radar Chart using SVG ---
const RadarChart = ({ data, labels, size, isDark }: { data: number[], labels: string[], size: number, isDark: boolean }) => {
  const radius = size / 2.5;
  const centerX = size / 2;
  const centerY = size / 2;
  const angleStep = (Math.PI * 2) / data.length;

  // Grid levels
  const levels = [1, 2, 3];
  const gridLines = levels.map(level => {
    const points = labels.map((_, i) => {
      const x = centerX + (radius * (level / 3)) * Math.cos(i * angleStep - Math.PI / 2);
      const y = centerY + (radius * (level / 3)) * Math.sin(i * angleStep - Math.PI / 2);
      return `${x},${y}`;
    }).join(' ');
    return <Polygon key={level} points={points} fill="none" stroke={isDark ? "#334155" : "#E2E8F0"} strokeWidth="1" />;
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
        <Line x1={centerX} y1={centerY} x2={x} y2={y} stroke={isDark ? "#334155" : "#E2E8F0"} strokeWidth="1" />
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
  const dataPoints = data.map((val, i) => {
    const x = centerX + (radius * (val / 3)) * Math.cos(i * angleStep - Math.PI / 2);
    const y = centerY + (radius * (val / 3)) * Math.sin(i * angleStep - Math.PI / 2);
    return `${x},${y}`;
  }).join(' ');

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
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getAlertDetailsScreenStyles(colorScheme);
  const isHighRisk = patientData.overallRisk === 'HIGH';
  const headerTheme = severityThemes[patientData.overallRisk];
  const isDark = colorScheme === 'dark';

  const radarData = [3, 3, 2, 1, 2]; // Age, BP, Sugar, Temp, HR
  const radarLabels = ["Age", "BP", "Sugar", "Temp", "HR"];

  const barData = [
    { factor: "Age", risk: 3 },
    { factor: "BP", risk: 3 },
    { factor: "Sugar", risk: 2 },
    { factor: "Temp", risk: 1 },
    { factor: "HR", risk: 2 }
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>

      {/* Top Navigation */}
      <View style={styles.navHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#E11D48" size={20} />
          <Text style={styles.backButtonText}>Back to Alerts</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* Patient Header Section */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.patientName}>{patientData.name}</Text>
            <View style={styles.dateContainer}>
              <Calendar color="#64748B" size={14} style={{ marginRight: 6 }} />
              <Text style={styles.dateText}>
                {patientData.date}{' '}at {patientData.time}
              </Text>
            </View>
          </View>

          <View style={[styles.mainBadge, { backgroundColor: headerTheme.bg }]}>
            {headerTheme.icon}
            <Text style={[styles.mainBadgeText, { color: headerTheme.textDark }]}>
              {patientData.overallRisk} RISK
            </Text>
          </View>
        </View>

        {/* Conditional Critical Warning Banner */}
        {isHighRisk && (
          <View style={styles.warningBanner}>
            <View style={styles.warningBannerHeader}>
              <AlertTriangle color="#E11D48" size={20} style={{ marginRight: 8 }} />
              <Text style={styles.warningBannerTitle}>Immediate Attention Required</Text>
            </View>
            <Text style={styles.warningBannerText}>
              This patient has been classified as high risk. Please review the risk factors below and consult with a healthcare provider immediately.
            </Text>
          </View>
        )}

        {/* Vitals Horizontal Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vitalsScroll} contentContainerStyle={styles.vitalsScrollContent}>
          <VitalCard
            icon={<User color="#8B5CF6" size={18} />} iconBgColor="#EDE9FE"
            label="Age" value="38" unit="years"
          />
          <VitalCard
            icon={<Heart color="#E11D48" size={18} />} iconBgColor="#FFE4E6"
            label="Blood Pressure" value="145/95" unit="mmHg"
          />
          <VitalCard
            icon={<Droplet color="#3B82F6" size={18} />} iconBgColor="#DBEAFE"
            label="Blood Sugar" value="110" unit="mg/dL"
          />
        </ScrollView>

        {/* Risk Factor Analysis (Radar Chart) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Risk Factor Analysis</Text>
          <View style={{ alignItems: 'center', marginVertical: 10 }}>
            <RadarChart 
              data={radarData} 
              labels={radarLabels} 
              size={screenWidth - 80} 
              isDark={isDark} 
            />
          </View>
        </View>

        {/* Risk Contribution by Factor (Bar Chart) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Risk Contribution by Factor</Text>
          <View style={{ height: 250, marginTop: 10 }}>
            <CartesianChart
              data={barData}
              xKey="factor"
              yKeys={["risk"]}
              domainPadding={{ left: 30, right: 30, top: 20 }}
              axisOptions={{
                font: null, // Victory V41 uses Skia fonts, null uses default
                lineColor: isDark ? "#334155" : "#F1F5F9",
                labelColor: isDark ? "#94A3B8" : "#64748B",
                tickCount: 4,
              }}
            >
              {({ points, chartBounds }) => (
                <Bar
                  chartBounds={chartBounds}
                  points={points.risk}
                  roundedCorners={{ topLeft: 4, topRight: 4 }}
                  color="#E11D48"
                  barWidth={24}
                />
              )}
            </CartesianChart>
          </View>
        </View>

        {/* Explainable Risk Predictions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Explainable Risk Predictions</Text>
          <Text style={styles.cardSubtitle}>
            Detailed analysis of each physiological factor contributing to the overall risk assessment.
          </Text>

          {patientData.predictions.map((pred, index) => (
            <PredictionCard key={index} {...pred} />
          ))}
        </View>

        {/* Clinical Recommendations */}
        <View style={styles.recommendationsCard}>
          <Text style={styles.recommendationsTitle}>Clinical Recommendations</Text>
          {patientData.recommendations.map((rec, index) => (
            <View key={index} style={styles.bulletRow}>
              <View style={styles.bulletPoint} />
              <Text style={styles.recommendationText}>{rec}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default AlertDetailsScreen;
