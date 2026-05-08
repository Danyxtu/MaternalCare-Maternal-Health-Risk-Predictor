import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Layout,
  Bell,
  AlertTriangle,
  Activity,
  TrendingUp,
  Clock,
} from "lucide-react-native";
import { getAlertsScreenStyles } from "#/src/styles/alerts.styles";
import { router, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { get } from "#/src/api/api";

// --- Types ---
interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  valueColor?: string;
  borderColor?: string;
}

type AlertVariant = "high" | "medium";

interface AlertData {
  id: string;
  patientId: string;
  patientName: string;
  statusText: string;
  age: number;
  bp: string;
  bloodSugar: number;
  heartRate: number;
  timeAgo: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
}

interface AlertStats {
  total: number;
  high: number;
  medium: number;
  low: number;
}

// --- Theme Configurations for Alert Cards ---
const alertThemes = {
  high: {
    bg: "#FFF1F2",
    borderLeft: "#E11D48",
    textMain: "#881337",
    textLabel: "#E11D48",
    badgeBg: "#FECDD3",
    buttonBg: "#E11D48",
  },
  medium: {
    bg: "#FFFBEB",
    borderLeft: "#F59E0B",
    textMain: "#78350F",
    textLabel: "#D97706",
    badgeBg: "#FDE68A",
    buttonBg: "#D97706",
  },
};

// --- Components ---

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  iconBgColor,
  valueColor = "#0F172A",
  borderColor = "#F1F5F9",
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getAlertsScreenStyles(colorScheme);
  return (
    <View style={[styles.summaryCard, { borderColor }]}>
      <View style={styles.summaryCardHeader}>
        <Text style={styles.summaryCardTitle}>{title}</Text>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          {icon}
        </View>
      </View>
      <Text style={[styles.summaryCardValue, { color: valueColor }]}>
        {value}
      </Text>
    </View>
  );
};

const AlertCard: React.FC<{ alert: AlertData }> = ({ alert }) => {
  const variant: AlertVariant =
    alert.severity === "CRITICAL" ? "high" : "medium";
  const theme = alertThemes[variant];
  const colorScheme = useColorScheme() ?? "light";
  const styles = getAlertsScreenStyles(colorScheme);

  // Format timeAgo to something readable
  const date = new Date(alert.timeAgo);
  const timeStr = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View
      style={[
        styles.alertCard,
        { backgroundColor: theme.bg, borderLeftColor: theme.borderLeft },
      ]}
    >
      <View style={styles.alertCardHeader}>
        <View style={styles.alertCardTitleRow}>
          <Text style={[styles.alertCardName, { color: theme.textMain }]}>
            {alert.patientName}
          </Text>
          <View style={[styles.badge, { backgroundColor: theme.badgeBg }]}>
            <Text style={[styles.badgeText, { color: theme.textMain }]}>
              {alert.statusText}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.viewDetailsButton,
            { backgroundColor: theme.buttonBg },
          ]}
          onPress={() =>
            router.push({
              pathname: "/(drawerDoctor)/alertDetails",
              params: { id: alert.id },
            })
          }
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.vitalsGrid}>
        <View style={styles.vitalItem}>
          <Text style={[styles.vitalLabel, { color: theme.textLabel }]}>
            Age
          </Text>
          <Text style={[styles.vitalValue, { color: theme.textMain }]}>
            {alert.age} years
          </Text>
        </View>
        <View style={styles.vitalItem}>
          <Text style={[styles.vitalLabel, { color: theme.textLabel }]}>
            Blood Pressure
          </Text>
          <Text style={[styles.vitalValue, { color: theme.textMain }]}>
            {alert.bp}
          </Text>
        </View>
        <View style={styles.vitalItem}>
          <Text style={[styles.vitalLabel, { color: theme.textLabel }]}>
            Blood Sugar
          </Text>
          <Text style={[styles.vitalValue, { color: theme.textMain }]}>
            {alert.bloodSugar} mmol/L
          </Text>
        </View>
        <View style={styles.vitalItem}>
          <Text style={[styles.vitalLabel, { color: theme.textLabel }]}>
            Heart Rate
          </Text>
          <Text style={[styles.vitalValue, { color: theme.textMain }]}>
            {alert.heartRate} bpm
          </Text>
        </View>
      </View>

      <View style={styles.alertCardFooter}>
        <Clock color={theme.textLabel} size={14} style={{ marginRight: 6 }} />
        <Text style={[styles.footerText, { color: theme.textLabel }]}>
          Assessed at {timeStr}
        </Text>
      </View>
    </View>
  );
};

// --- Main Screen ---
const AlertSystemScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getAlertsScreenStyles(colorScheme);
  const navigation = useNavigation();

  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [stats, setStats] = useState<AlertStats>({
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const initialFetch = async () => {
      setIsLoading(true);
      await fetchData();
      setIsLoading(false);
    };
    initialFetch();
  }, []);

  const fetchData = async () => {
    try {
      const [alertsRes, statsRes]: any = await Promise.all([
        get("/alerts"),
        get("/alerts/stats"),
      ]);
      setAlerts(alertsRes.data.data);
      setStats(statsRes.data.data);
    } catch (error: any) {
      if (error.status !== 401) {
      }
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const highPriorityAlerts = alerts.filter((a) => a.severity === "CRITICAL");
  const mediumPriorityAlerts = alerts.filter((a) => a.severity === "WARNING");

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right", "bottom"]}
    >
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
          <Text style={styles.headerTitle}>Real-time Alert System</Text>
          <Text style={styles.headerSubtitle}>
            Monitor and respond to patient risk alerts
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.summaryScrollContent}
            style={styles.summaryScrollView}
          >
            <SummaryCard
              title="Active Alerts"
              value={stats.total}
              valueColor="#3B82F6"
              icon={<Bell color="#3B82F6" size={20} />}
              iconBgColor="#DBEAFE"
            />
            <SummaryCard
              title="High Priority"
              value={stats.high}
              valueColor="#E11D48"
              borderColor="#FECDD3"
              icon={<AlertTriangle color="#E11D48" size={20} />}
              iconBgColor="#FFE4E6"
            />
            <SummaryCard
              title="Medium Priority"
              value={stats.medium}
              valueColor="#F59E0B"
              icon={<Activity color="#F59E0B" size={20} />}
              iconBgColor="#FEF3C7"
            />
            <SummaryCard
              title="Low Priority"
              value={stats.low}
              valueColor="#10B981"
              icon={<TrendingUp color="#10B981" size={20} />}
              iconBgColor="#D1FAE5"
            />
          </ScrollView>

          {alerts.length === 0 ? (
            <View style={{ padding: 40, alignItems: "center" }}>
              <Bell color="#94A3B8" size={48} />
              <Text
                style={{
                  marginTop: 16,
                  fontSize: 16,
                  color: "#64748B",
                  textAlign: "center",
                }}
              >
                No active alerts found. All patients are currently stable.
              </Text>
            </View>
          ) : (
            <>
              {highPriorityAlerts.length > 0 && (
                <View style={styles.sectionContainer}>
                  <View style={styles.sectionHeader}>
                    <AlertTriangle
                      color="#E11D48"
                      size={20}
                      style={styles.sectionIcon}
                    />
                    <Text style={styles.sectionTitle}>
                      High Priority Alerts
                    </Text>
                  </View>
                  {highPriorityAlerts.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </View>
              )}

              {mediumPriorityAlerts.length > 0 && (
                <View style={styles.sectionContainer}>
                  <View style={styles.sectionHeader}>
                    <TrendingUp
                      color="#D97706"
                      size={20}
                      style={styles.sectionIcon}
                    />
                    <Text style={styles.sectionTitle}>
                      Medium Priority Alerts
                    </Text>
                  </View>
                  {mediumPriorityAlerts.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default AlertSystemScreen;
