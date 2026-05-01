import { StyleSheet } from "react-native";
import { Colors } from "../../constants/theme";

type Theme = "light" | "dark";

export const getPatientRiskStyles = (theme: Theme) => {
  const colors = Colors[theme];
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
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
      marginLeft: 12,
    },
    backButton: {
      padding: 8,
      marginLeft: -8,
    },
    scrollContainer: {
      paddingBottom: 40,
    },
    resultCard: {
      margin: 20,
      padding: 24,
      borderRadius: 20,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    riskLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: "rgba(255, 255, 255, 0.9)",
      marginBottom: 8,
      textTransform: "uppercase",
    },
    riskValue: {
      fontSize: 32,
      fontWeight: "800",
      color: "#FFFFFF",
      marginBottom: 16,
    },
    riskIconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    explanationCard: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#334155" : "#F1F5F9",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
    },
    explanationText: {
      fontSize: 15,
      color: colors.tabIconDefault,
      lineHeight: 22,
    },
    actionButton: {
      backgroundColor: "#E11D48",
      borderRadius: 12,
      height: 52,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 20,
      marginTop: 10,
    },
    actionButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
  });
};
