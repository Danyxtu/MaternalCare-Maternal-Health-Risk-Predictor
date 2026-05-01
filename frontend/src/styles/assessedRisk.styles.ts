import { StyleSheet } from "react-native";
import { Colors } from "../../constants/theme";

type Theme = "light" | "dark";

export const getAssessedRiskStyles = (theme: Theme) => {
  const colors = Colors[theme];

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      paddingBottom: 40,
    },

    // ── Header ──────────────────────────────────────
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      height: 80,
      backgroundColor: colors.background,
    },
    headerTextContainer: {
      flex: 1,
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

    // ── Hero Card ────────────────────────────────────
    heroCard: {
      marginTop: 10,
      marginHorizontal: 20,
      marginBottom: 16,
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 24,
      borderWidth: 1.5,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    riskIconCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    riskLabel: {
      fontSize: 26,
      fontWeight: "800",
      marginBottom: 20,
      letterSpacing: 0.3,
    },
    gaugeContainer: {
      alignItems: "center",
      marginBottom: 10,
    },
    gaugeValue: {
      fontSize: 42,
      fontWeight: "800",
      color: colors.text,
      lineHeight: 48,
    },
    gaugeSubtext: {
      fontSize: 13,
      color: colors.tabIconDefault,
      marginTop: 2,
    },
    probabilityBarTrack: {
      width: "100%",
      height: 8,
      borderRadius: 4,
      backgroundColor: theme === "dark" ? "#334155" : "#E2E8F0",
      marginTop: 12,
      marginBottom: 20,
      overflow: "hidden",
    },
    probabilityBarFill: {
      height: "100%",
      borderRadius: 4,
    },
    infoBox: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      borderLeftWidth: 3,
      paddingLeft: 12,
      paddingVertical: 4,
      width: "100%",
    },
    infoBoxText: {
      flex: 1,
      fontSize: 13,
      color: colors.tabIconDefault,
      lineHeight: 20,
    },

    // ── Shared Card ──────────────────────────────────
    card: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 20,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#334155" : "#F1F5F9",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
      marginBottom: 16,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      marginTop: 4,
    },
    sectionIcon: {
      marginRight: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    sectionSubtitle: {
      fontSize: 13,
      color: colors.tabIconDefault,
      lineHeight: 20,
      marginBottom: 4,
    },
    divider: {
      height: 1,
      backgroundColor: theme === "dark" ? "#334155" : "#F1F5F9",
      marginVertical: 16,
    },

    // ── Feature Rows ─────────────────────────────────
    featureRow: {
      marginBottom: 18,
      paddingBottom: 18,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#1E293B" : "#F8FAFC",
    },
    featureHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    featureLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flex: 1,
      marginRight: 12,
    },
    featureCondition: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.text,
      flexShrink: 1,
    },
    impactBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    impactBadgeText: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.3,
    },
    barTrack: {
      height: 6,
      borderRadius: 3,
      width: "100%",
      overflow: "hidden",
      marginBottom: 6,
    },
    barFill: {
      height: "100%",
      borderRadius: 3,
    },
    featureWeight: {
      fontSize: 11,
      color: colors.tabIconDefault,
      fontVariant: ["tabular-nums"],
    },

    // ── Legend ───────────────────────────────────────
    legendItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      marginBottom: 14,
    },
    legendText: {
      flex: 1,
      fontSize: 13,
      color: colors.tabIconDefault,
      lineHeight: 20,
    },

    // ── Disclaimer ───────────────────────────────────
    disclaimerBox: {
      marginHorizontal: 20,
      marginBottom: 16,
      padding: 16,
      borderRadius: 10,
      backgroundColor: theme === "dark" ? "#1E293B" : "#FFF7ED",
      borderWidth: 1,
      borderColor: theme === "dark" ? "#334155" : "#FED7AA",
    },
    disclaimerText: {
      fontSize: 12,
      color: theme === "dark" ? "#94A3B8" : "#92400E",
      lineHeight: 18,
    },

    // ── Buttons ──────────────────────────────────────
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
      marginHorizontal: 20,
    },
    primaryButton: {
      flex: 2,
      backgroundColor: "#E11D48",
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    primaryButtonText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "600",
    },
    secondaryButton: {
      flex: 1,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#334155" : "#E2E8F0",
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    secondaryButtonText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "500",
    },
  });
};
