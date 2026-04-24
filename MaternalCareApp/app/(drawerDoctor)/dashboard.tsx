import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Users,
  AlertTriangle,
  Activity,
  TrendingUp,
  Layout,
} from "lucide-react-native";
import { getDashboardScreenStyles } from "#/src/styles/dashboard.styles";
import { useRouter, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { LineChart, PieChart } from "react-native-chart-kit";
import RiskPatientsModal from "#/src/components/Doctor/RiskPatientsModal";

const screenWidth = Dimensions.get("window").width;

// --- Types ---
interface StatCardProps {
  title: string;
  value: string | number;
  valueColor?: string;
  subtitle?: string;
  icon: React.ReactNode;
  iconBgColor: string;
}

interface AssessmentRecord {
  id: string;
  name: string;
  age: number;
  bp: string;
}

type RiskLevel = "low" | "medium" | "high";

interface RiskBreakdownItem {
  key: RiskLevel;
  label: string;
  count: number;
  color: string;
}

interface PatientSummary {
  id: string;
  name: string;
  age: number;
  bp?: string;
  risk: RiskLevel;
}

// --- Mock Data ---
const recentAssessments: AssessmentRecord[] = [
  { id: "1", name: "Sarah Johnson", age: 28, bp: "115/75" },
  { id: "2", name: "Maria Garcia", age: 38, bp: "145/95" },
  { id: "3", name: "Emily Chen", age: 25, bp: "122/82" },
  { id: "4", name: "Aisha Patel", age: 32, bp: "135/88" },
  { id: "5", name: "Jessica Williams", age: 22, bp: "110/70" },
];

// --- Components ---

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  valueColor = "#89a3e4ff",
  subtitle,
  icon,
  iconBgColor,
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getDashboardScreenStyles(colorScheme);
  return (
    <View style={styles.statCard}>
      <View style={styles.statCardHeader}>
        <Text style={styles.statCardTitle}>{title}</Text>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          {icon}
        </View>
      </View>
      <Text style={[styles.statCardValue, { color: valueColor }]}>{value}</Text>
      {subtitle && <Text style={styles.statCardSubtitle}>{subtitle}</Text>}
    </View>
  );
};

const DashboardScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getDashboardScreenStyles(colorScheme);
  const navigation = useNavigation();

  const [selectedRisk, setSelectedRisk] = useState<RiskBreakdownItem | null>(
    null,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  // TODO: replace with real API data
  const patients: PatientSummary[] = useMemo(
    () => [
      { id: "1", name: "Sarah Johnson", age: 28, bp: "115/75", risk: "low" },
      { id: "2", name: "Maria Garcia", age: 38, bp: "145/95", risk: "high" },
      { id: "3", name: "Emily Chen", age: 25, bp: "122/82", risk: "low" },
      { id: "4", name: "Aisha Patel", age: 32, bp: "135/88", risk: "medium" },
      {
        id: "5",
        name: "Jessica Williams",
        age: 22,
        bp: "110/70",
        risk: "medium",
      },
      { id: "6", name: "Linda Martinez", age: 37, bp: "148/92", risk: "high" },
      { id: "7", name: "Priya Kumar", age: 29, bp: "118/76", risk: "low" },
      { id: "8", name: "Amanda Brown", age: 34, bp: "132/86", risk: "low" },
    ],
    [],
  );

  const riskBreakdown = useMemo<RiskBreakdownItem[]>(() => {
    const base: Record<RiskLevel, RiskBreakdownItem> = {
      low: { key: "low", label: "Low Risk", count: 0, color: "#10B981" },
      medium: {
        key: "medium",
        label: "Medium Risk",
        count: 0,
        color: "#F59E0B",
      },
      high: { key: "high", label: "High Risk", count: 0, color: "#EF4444" },
    };

    patients.forEach((p) => {
      base[p.risk].count += 1;
    });

    return Object.values(base);
  }, [patients]);

  const totalPatients = useMemo(
    () => riskBreakdown.reduce((sum, item) => sum + item.count, 0),
    [riskBreakdown],
  );

  const formatPercent = (count: number) => {
    if (!totalPatients) return "0%";
    return `${((count / totalPatients) * 100).toFixed(1)}%`;
  };

  const handleSlicePress = (riskKey: RiskLevel) => {
    const risk = riskBreakdown.find((r) => r.key === riskKey);
    if (!risk) return;
    console.log("Pie slice pressed", riskKey);
    setSelectedRisk(risk);
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right", "bottom"]}
    >
      {/* Header Section - Fixed at top */}
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
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Overview of maternal health monitoring
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Row Section (Horizontally Scrollable) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsScrollContent}
          style={styles.statsScrollView}
        >
          <StatCard
            title="Total Patients"
            value={totalPatients}
            valueColor="#255db8ff"
            icon={<Users color="#255db8ff" size={20} />}
            iconBgColor="#DBEAFE"
          />
          <StatCard
            title="High Risk"
            value={riskBreakdown.find((r) => r.key === "high")?.count ?? 0}
            valueColor="#EF4444"
            subtitle={`${formatPercent(
              riskBreakdown.find((r) => r.key === "high")?.count ?? 0,
            )} of total`}
            icon={<AlertTriangle color="#EF4444" size={20} />}
            iconBgColor="#FEE2E2"
          />
          <StatCard
            title="Medium Risk"
            value={riskBreakdown.find((r) => r.key === "medium")?.count ?? 0}
            valueColor="#F59E0B"
            subtitle={`${formatPercent(
              riskBreakdown.find((r) => r.key === "medium")?.count ?? 0,
            )} of total`}
            icon={<Activity color="#F59E0B" size={20} />}
            iconBgColor="#FEF3C7"
          />
          <StatCard
            title="Low Risk"
            value={riskBreakdown.find((r) => r.key === "low")?.count ?? 0}
            valueColor="#10B981"
            subtitle={`${formatPercent(
              riskBreakdown.find((r) => r.key === "low")?.count ?? 0,
            )} of total`}
            icon={<TrendingUp color="#10B981" size={20} />}
            iconBgColor="#D1FAE5"
          />
        </ScrollView>

        {/* Risk Distribution Card */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Patient Risk Distribution</Text>

          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <PieChart
              data={riskBreakdown.map((item) => ({
                name: `${item.label} (${item.count})`,
                population: item.count,
                color: item.color,
                legendFontColor: colorScheme === "dark" ? "#ECEDEE" : "#64748B",
                legendFontSize: 12,
                onPress: () => handleSlicePress(item.key),
              }))}
              width={screenWidth - 40}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={(screenWidth / 4).toString()} // Centers the pie when hasLegend is false
              center={[0, 0]}
              absolute
              hasLegend={false} // Hide internal legend to center the pie
            />
          </View>

          {/* Fallback quick actions for web/non-touch issues */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 12,
            }}
          >
            {riskBreakdown.map((item) => (
              <TouchableOpacity
                key={`chip-${item.key}`}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  backgroundColor: `${item.color}22`,
                  borderWidth: 1,
                  borderColor: `${item.color}66`,
                }}
                onPress={() => handleSlicePress(item.key)}
                activeOpacity={0.85}
              >
                <View style={styles.legendLabelRow}>
                  <View
                    style={[
                      styles.legendColorBox,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <Text style={[styles.legendText, { color: item.color }]}>
                    {item.label}
                  </Text>
                </View>
                <Text style={[styles.legendValue, { color: item.color }]}>
                  {formatPercent(item.count)}
                </Text>
                <Text style={{ color: item.color, fontSize: 12, marginTop: 2 }}>
                  {item.count} patients
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weekly Vital Trends Card */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Weekly Vital Trends</Text>

          <LineChart
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [
                {
                  data: [120, 118, 122, 115, 125, 128, 120], // Systolic BP
                  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Blue
                },
                {
                  data: [80, 82, 85, 78, 88, 90, 82], // Heart Rate
                  color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // Green
                },
                {
                  data: [95, 98, 92, 105, 102, 110, 96], // Blood Sugar
                  color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`, // Orange
                },
              ],
            }}
            width={screenWidth - 72}
            height={220}
            withDots={true}
            withShadow={false}
            withInnerLines={true}
            chartConfig={{
              backgroundColor: colorScheme === "dark" ? "#151718" : "#FFFFFF",
              backgroundGradientFrom:
                colorScheme === "dark" ? "#151718" : "#FFFFFF",
              backgroundGradientTo:
                colorScheme === "dark" ? "#151718" : "#FFFFFF",
              decimalPlaces: 0,
              color: (opacity = 1) =>
                colorScheme === "dark"
                  ? `rgba(155, 161, 166, ${opacity})`
                  : `rgba(148, 163, 184, ${opacity})`, // Grid color
              labelColor: (opacity = 1) =>
                colorScheme === "dark"
                  ? `rgba(236, 237, 238, ${opacity})`
                  : `rgba(100, 116, 139, ${opacity})`, // Text color
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: colorScheme === "dark" ? "#151718" : "#FFFFFF",
              },
              style: {
                borderRadius: 16,
              },
            }}
            bezier // Adds the smooth curve to the line
            style={{
              marginVertical: 8,
              borderRadius: 16,
              marginLeft: -16,
            }}
          />

          {/* Line Chart Legend */}
          <View style={styles.lineLegendContainer}>
            <View style={styles.legendItem}>
              <Text style={[styles.lineLegendMarker, { color: "#3B82F6" }]}>
                —○—
              </Text>
              <Text style={[styles.legendText, { color: "#3B82F6" }]}>
                Avg BP
              </Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={[styles.lineLegendMarker, { color: "#10B981" }]}>
                —○—
              </Text>
              <Text style={[styles.legendText, { color: "#10B981" }]}>
                Avg Heart Rate
              </Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={[styles.lineLegendMarker, { color: "#F59E0B" }]}>
                —○—
              </Text>
              <Text style={[styles.legendText, { color: "#F59E0B" }]}>
                Avg Blood Sugar
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Assessments Card */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Recent Assessments</Text>
            <TouchableOpacity
              onPress={() => router.push("/(drawerDoctor)/patientRecords")}
            >
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colPatient]}>
              Patient
            </Text>
            <Text style={[styles.tableHeaderText, styles.colAge]}>Age</Text>
            <Text style={[styles.tableHeaderText, styles.colBP]}>BP</Text>
          </View>

          {/* Table Rows */}
          {recentAssessments.map((record, index) => (
            <View
              key={record.id}
              style={[
                styles.tableRow,
                index === recentAssessments.length - 1 && {
                  borderBottomWidth: 0,
                }, // Hide border on last item
              ]}
            >
              <Text
                style={[
                  styles.tableRowText,
                  styles.colPatient,
                  styles.patientNameText,
                ]}
              >
                {record.name}
              </Text>
              <Text style={[styles.tableRowText, styles.colAge]}>
                {record.age}
              </Text>
              <Text style={[styles.tableRowText, styles.colBP]}>
                {record.bp}
              </Text>
            </View>
          ))}
        </View>

        <RiskPatientsModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          riskLabel={selectedRisk?.label ?? ""}
          riskColor={selectedRisk?.color ?? "#0EA5E9"}
          patients={patients.filter((p) => p.risk === selectedRisk?.key)}
          theme={colorScheme === "dark" ? "dark" : "light"}
          onSelectPatient={(patientId: string) => {
            setIsModalVisible(false);
            router.push({
              pathname: "/(drawerDoctor)/patientRecords/[id]",
              params: { id: patientId },
            });
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
