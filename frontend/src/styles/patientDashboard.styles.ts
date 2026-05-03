import { StyleSheet } from "react-native";
import { Colors } from "../../constants/theme";

type Theme = "light" | "dark";

export const getPatientDashboardStyles = (theme: Theme) => {
  const colors = Colors[theme];
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme === "dark" ? colors.background : "#FAFAFA",
    },
    scrollContainer: {
      paddingBottom: 40,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      height: 80,
      backgroundColor: colors.background,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 2,
    },
    headerSubtitle: {
      fontSize: 13,
      color: colors.tabIconDefault,
    },
    headerIcon: {
      padding: 8,
      marginRight: 8,
      marginLeft: -8,
    },
    
    // Risk Status Card
    statusCard: {
      margin: 20,
      padding: 24,
      borderRadius: 20,
      backgroundColor: colors.background,
      borderWidth: 1.5,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    statusTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.tabIconDefault,
      marginBottom: 8,
    },
    statusValue: {
      fontSize: 32,
      fontWeight: "800",
      marginBottom: 4,
    },
    statusSubtitle: {
      fontSize: 13,
      color: colors.tabIconDefault,
    },

    // Gauge Section
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginHorizontal: 20,
      marginBottom: 16,
    },
    gaugeGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: 14,
      justifyContent: "space-between",
    },
    gaugeCard: {
      width: "47%",
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#334155" : "#F1F5F9",
      alignItems: "center",
    },
    gaugeLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.tabIconDefault,
      marginBottom: 12,
    },
    gaugeValue: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginTop: 8,
    },
    gaugeUnit: {
      fontSize: 11,
      color: colors.tabIconDefault,
    },

    // Tips Card
    tipCard: {
      marginHorizontal: 20,
      padding: 20,
      borderRadius: 16,
      backgroundColor: theme === "dark" ? "#1E293B" : "#FFF1F2",
      borderWidth: 1,
      borderColor: theme === "dark" ? "#334155" : "#FECDD3",
      flexDirection: "row",
      alignItems: "center",
    },
    tipIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "#E11D48",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    tipTextContainer: {
      flex: 1,
    },
    tipTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: "#E11D48",
      marginBottom: 4,
    },
    tipDescription: {
      fontSize: 13,
      color: theme === "dark" ? "#CBD5E1" : "#475569",
      lineHeight: 18,
    },
  });
};
