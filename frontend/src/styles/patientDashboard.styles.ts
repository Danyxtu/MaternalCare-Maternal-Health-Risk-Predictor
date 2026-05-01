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
    welcomeCard: {
      backgroundColor: "#E11D48",
      borderRadius: 16,
      padding: 24,
      marginHorizontal: 20,
      marginTop: 10,
      marginBottom: 20,
      shadowColor: "#E11D48",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    welcomeTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: "#FFFFFF",
      marginBottom: 8,
    },
    welcomeSubtitle: {
      fontSize: 14,
      color: "rgba(255, 255, 255, 0.9)",
      lineHeight: 20,
    },
    actionCard: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#334155" : "#F1F5F9",
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    actionIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: "#FFF1F2",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    actionTextContainer: {
      flex: 1,
    },
    actionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    actionSubtitle: {
      fontSize: 13,
      color: colors.tabIconDefault,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginHorizontal: 20,
      marginBottom: 16,
      marginTop: 8,
    },
    statGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: 14,
      marginBottom: 10,
    },
    statCard: {
      width: "50%",
      padding: 6,
    },
    statCardInner: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#334155" : "#F1F5F9",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    statIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    statValue: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.tabIconDefault,
      fontWeight: "500",
    },
    riskCard: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#334155" : "#F1F5F9",
      alignItems: "center",
    },
    riskTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
      alignSelf: "flex-start",
    },
    riskBadge: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginBottom: 12,
    },
    riskBadgeText: {
      fontSize: 14,
      fontWeight: "700",
    },
    riskDescription: {
      fontSize: 13,
      color: colors.tabIconDefault,
      textAlign: "center",
      lineHeight: 18,
    },
  });
};
