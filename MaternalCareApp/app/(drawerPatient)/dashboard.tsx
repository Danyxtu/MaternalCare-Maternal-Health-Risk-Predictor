import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Activity,
  Heart,
  Droplet,
  Thermometer,
  Layout,
  ArrowRight,
} from "lucide-react-native";
import { getPatientDashboardStyles } from "@/styles/patientDashboard.styles";
import { useNavigation, useRouter } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

// --- Types ---
interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, iconBg }) => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getPatientDashboardStyles(colorScheme);
  return (
    <View style={styles.statCard}>
      <View style={styles.statCardInner}>
        <View style={[styles.statIconContainer, { backgroundColor: iconBg }]}>
          {icon}
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
};

const PatientDashboard: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getPatientDashboardStyles(colorScheme);
  const navigation = useNavigation();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
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
          <Text style={styles.headerTitle}>MaternalCare</Text>
          <Text style={styles.headerSubtitle}>Patient Dashboard</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Hello, Sarah!</Text>
          <Text style={styles.welcomeSubtitle}>
            Keep track of your health daily to ensure a safe pregnancy journey.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/(drawerPatient)/selfAssessment")}
        >
          <View style={styles.actionIconContainer}>
            <Activity color="#E11D48" size={24} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Start New Assessment</Text>
            <Text style={styles.actionSubtitle}>Log your latest vitals</Text>
          </View>
          <ArrowRight color="#94A3B8" size={20} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Latest Vitals</Text>
        <View style={styles.statGrid}>
          <StatCard
            label="BP (Systolic)"
            value="120"
            icon={<Heart color="#EF4444" size={18} />}
            iconBg="#FEE2E2"
          />
          <StatCard
            label="BP (Diastolic)"
            value="80"
            icon={<Heart color="#EF4444" size={18} />}
            iconBg="#FEE2E2"
          />
          <StatCard
            label="Blood Sugar"
            value="95"
            icon={<Droplet color="#3B82F6" size={18} />}
            iconBg="#DBEAFE"
          />
          <StatCard
            label="Temperature"
            value="37.0°C"
            icon={<Thermometer color="#F97316" size={18} />}
            iconBg="#FFEDD5"
          />
        </View>

        <Text style={styles.sectionTitle}>Health Standing</Text>
        <TouchableOpacity
          style={styles.riskCard}
          onPress={() => router.push("/(drawerPatient)/healthRisk")}
        >
          <Text style={styles.riskTitle}>Current Risk Level</Text>
          <View style={[styles.riskBadge, { backgroundColor: "#D1FAE5" }]}>
            <Text style={[styles.riskBadgeText, { color: "#10B981" }]}>
              LOW RISK
            </Text>
          </View>
          <Text style={styles.riskDescription}>
            Your vitals are within the normal range. Continue following your
            prescribed health routine.
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PatientDashboard;
