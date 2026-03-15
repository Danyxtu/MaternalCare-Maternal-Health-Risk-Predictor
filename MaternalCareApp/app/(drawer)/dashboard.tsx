import React, { useEffect } from "react";
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
import { getDashboardScreenStyles } from "@/styles/dashboard.styles";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { LineChart, PieChart } from "react-native-chart-kit";

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
  valueColor = "#0F172A",
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
  // useEffect(() => {
  //   const API_URL = "http://10.174.203.104/predict";
  //   fetch(API_URL, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       pheinz_physiological_data: [31, 90, 60, 7.1, 90, 66],
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data.prediction);
  //     })
  //     .catch((error) => {
  //       console.error("Connection error: ", error);
  //     });
  // }, []);
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
            value="8"
            icon={<Users color="#3B82F6" size={20} />}
            iconBgColor="#DBEAFE"
          />
          <StatCard
            title="High Risk"
            value="2"
            valueColor="#EF4444"
            subtitle="25.0% of total"
            icon={<AlertTriangle color="#EF4444" size={20} />}
            iconBgColor="#FEE2E2"
          />
          <StatCard
            title="Medium Risk"
            value="2"
            valueColor="#F59E0B"
            subtitle="25.0% of total"
            icon={<Activity color="#F59E0B" size={20} />}
            iconBgColor="#FEF3C7"
          />
          <StatCard
            title="Low Risk"
            value="4"
            valueColor="#10B981"
            subtitle="50.0% of total"
            icon={<TrendingUp color="#10B981" size={20} />}
            iconBgColor="#D1FAE5"
          />
        </ScrollView>

        {/* Risk Distribution Card */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Risk Distribution</Text>

          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <PieChart
              data={[
                {
                  name: "Low Risk",
                  population: 4,
                  color: "#10B981",
                  legendFontColor:
                    colorScheme === "dark" ? "#ECEDEE" : "#64748B",
                  legendFontSize: 12,
                },
                {
                  name: "Medium Risk",
                  population: 2,
                  color: "#F59E0B",
                  legendFontColor:
                    colorScheme === "dark" ? "#ECEDEE" : "#64748B",
                  legendFontSize: 12,
                },
                {
                  name: "High Risk",
                  population: 2,
                  color: "#EF4444",
                  legendFontColor:
                    colorScheme === "dark" ? "#ECEDEE" : "#64748B",
                  legendFontSize: 12,
                },
              ]}
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

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={styles.legendLabelRow}>
                <View
                  style={[
                    styles.legendColorBox,
                    { backgroundColor: "#10B981" },
                  ]}
                />
                <Text style={[styles.legendText, { color: "#10B981" }]}>
                  Low Risk
                </Text>
              </View>
              <Text style={[styles.legendValue, { color: "#10B981" }]}>
                50%
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.legendLabelRow}>
                <View
                  style={[
                    styles.legendColorBox,
                    { backgroundColor: "#F59E0B" },
                  ]}
                />
                <Text style={[styles.legendText, { color: "#F59E0B" }]}>
                  Medium Risk
                </Text>
              </View>
              <Text style={[styles.legendValue, { color: "#F59E0B" }]}>
                25%
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.legendLabelRow}>
                <View
                  style={[
                    styles.legendColorBox,
                    { backgroundColor: "#EF4444" },
                  ]}
                />
                <Text style={[styles.legendText, { color: "#EF4444" }]}>
                  High Risk
                </Text>
              </View>
              <Text style={[styles.legendValue, { color: "#EF4444" }]}>
                25%
              </Text>
            </View>
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
            <TouchableOpacity>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
