import React, { useMemo, useState, useEffect } from "react";
import { get } from "#/src/api/api";
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

  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPatients = async ({ showLoader = true } = {}) => {
    try {
      if (showLoader) setIsLoading(true);
      const response: any = await get("/patients");
      if (response.data && response.data.data) {
        setPatients(response.data.data);
      }
    } catch (error: any) {
      if (error.status !== 401) {
        console.error("Failed to fetch patients:", error);
      }
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchPatients({ showLoader: false });
    } finally {
      setRefreshing(false);
    }
  };

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
      if (base[p.risk]) {
        base[p.risk].count += 1;
      }
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

      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#10B981"]}
              tintColor={colorScheme === "dark" ? "#ECEDEE" : "#10B981"}
            />
          }
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

            {totalPatients > 0 ? (
              <>
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <PieChart
                    data={riskBreakdown.map((item) => ({
                      name: `${item.label} (${item.count})`,
                      population: item.count,
                      color: item.color,
                      legendFontColor:
                        colorScheme === "dark" ? "#ECEDEE" : "#64748B",
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
                        <Text
                          style={[styles.legendText, { color: item.color }]}
                        >
                          {item.label}
                        </Text>
                      </View>
                      <Text style={[styles.legendValue, { color: item.color }]}>
                        {formatPercent(item.count)}
                      </Text>
                      <Text
                        style={{
                          color: item.color,
                          fontSize: 12,
                          marginTop: 2,
                        }}
                      >
                        {item.count} patients
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : (
              <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: "#64748B" }}>
                  No patient data available.
                </Text>
              </View>
            )}
          </View>

          {/* Recent Assessments Card */}
          <View style={styles.cardContainer}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Recent Assessments</Text>
              <TouchableOpacity
                onPress={() =>
                  router.push("/(drawerDoctor)/(tabs)/patientRecords")
                }
              >
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>

            {patients.length > 0 ? (
              <>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderText, styles.colPatient]}>
                    Patient
                  </Text>
                  <Text style={[styles.tableHeaderText, styles.colAge]}>
                    Age
                  </Text>
                  <Text style={[styles.tableHeaderText, styles.colBP]}>BP</Text>
                </View>

                {/* Table Rows */}
                {patients.slice(0, 5).map((record, index) => (
                  <TouchableOpacity
                    key={record.id}
                    activeOpacity={0.7}
                    onPress={() => 
                      router.push({
                        pathname: "/(drawerDoctor)/(tabs)/patientRecords/[id]",
                        params: { id: record.id },
                      })
                    }
                    style={[
                      styles.tableRow,
                      index === Math.min(patients.length, 5) - 1 && {
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
                      {record.bp || "N/A"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: "#64748B" }}>
                  No recent assessments found.
                </Text>
              </View>
            )}
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
                pathname: "/(drawerDoctor)/(tabs)/patientRecords/[id]",
                params: { id: patientId },
              });
            }}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default DashboardScreen;
