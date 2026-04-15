import { StyleSheet } from "react-native";
import { Colors } from "../constants/theme";

type Theme = "light" | "dark";

export const getPatientRecordsScreenStyles = (theme: Theme) => {
  const colors = Colors[theme];
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    listContent: {
      paddingBottom: 20,
    },
    tableRowButton: {
      marginHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#334155" : "#F1F5F9",
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      height: 80, // Fixed height for alignment
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
    searchFilterContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      marginTop: 10,
      marginBottom: 24,
      gap: 12,
    },
    searchBar: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#334155" : "#E2E8F0",
      borderRadius: 12,
      paddingHorizontal: 12,
      height: 48,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
    },
    filterButton: {
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
    },
    extraFilterBox: {
      width: 48,
      height: 48,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#334155" : "#E2E8F0",
      borderRadius: 12,
      backgroundColor: colors.background,
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: theme === "dark" ? "#1E293B" : "#F8FAFC",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      marginHorizontal: 20,
    },
    tableHeaderText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.text,
    },
    tableRow: {
      flexDirection: "row",
      paddingVertical: 16,
      paddingHorizontal: 20,
      alignItems: "flex-start",
      gap: 8,
    },
    cell: {
      justifyContent: "center",
    },
    patientName: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.text,
      lineHeight: 20,
    },
    cellText: {
      fontSize: 15,
      color: theme === "dark" ? "#CBD5E1" : "#334155",
    },
    unitText: {
      fontSize: 12,
      color: colors.tabIconDefault,
      marginTop: 2,
    },
    colName: {
      flex: 2,
    },
    colAge: {
      flex: 0.8,
      justifyContent: "flex-start",
      paddingTop: 2,
    },
    colBP: {
      flex: 1.2,
    },
    colSugar: {
      flex: 1,
    },
    bottomBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme === "dark" ? colors.background : "#FAFAFA",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: theme === "dark" ? "#334155" : "#F1F5F9",
    },
    bottomBarText: {
      fontSize: 14,
      color: colors.tabIconDefault,
    },
    bottomBarTextBold: {
      fontWeight: "600",
      color: colors.text,
    },
    newAssessmentButton: {
      backgroundColor: "#E11D48",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    newAssessmentButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600",
    },

    // Detail screen
    detailContainer: {
      flex: 1,
      paddingBottom: 24,
    },
    detailHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    backButton: {
      width: 42,
      height: 42,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#334155" : "#E2E8F0",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },
    patientCard: {
      marginHorizontal: 20,
      marginTop: 12,
      padding: 16,
      borderRadius: 14,
      backgroundColor: theme === "dark" ? "#0F172A" : "#F8FAFC",
      borderWidth: 1,
      borderColor: theme === "dark" ? "#1E293B" : "#E2E8F0",
      gap: 12,
    },
    patientNameRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: "#E0F2FE",
    },
    badgeText: {
      color: "#0369A1",
      fontWeight: "600",
      fontSize: 12,
    },
    patientMetaRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
    },
    metaBlock: {
      minWidth: "45%",
    },
    metaLabel: {
      fontSize: 12,
      color: colors.tabIconDefault,
      marginBottom: 4,
    },
    metaValue: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
    },
    historyHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: 20,
      marginTop: 20,
      marginBottom: 8,
    },
    historyHeaderText: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    historyCount: {
      fontSize: 13,
      color: colors.tabIconDefault,
    },
    historyTableHeader: {
      flexDirection: "row",
      backgroundColor: theme === "dark" ? "#1E293B" : "#F8FAFC",
      paddingVertical: 12,
      paddingHorizontal: 20,
      marginHorizontal: 20,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    historyTableHeaderText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.text,
    },
    historyRow: {
      flexDirection: "row",
      paddingVertical: 14,
      paddingHorizontal: 20,
      marginHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#334155" : "#E2E8F0",
      backgroundColor: colors.background,
      gap: 12,
    },
    historyCell: {
      justifyContent: "center",
      gap: 4,
    },
    colDateHistory: {
      flex: 1.2,
    },
    colVitalsHistory: {
      flex: 2,
    },
    colRiskHistory: {
      flex: 1,
      alignItems: "flex-start",
    },
    riskPill: {
      alignSelf: "flex-start",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
    },
    riskLow: {
      backgroundColor: "#DCFCE7",
      borderColor: "#16A34A",
    },
    riskModerate: {
      backgroundColor: "#FEF3C7",
      borderColor: "#F59E0B",
    },
    riskHigh: {
      backgroundColor: "#FEE2E2",
      borderColor: "#DC2626",
    },
    riskText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.text,
    },
    riskScore: {
      fontSize: 13,
      color: colors.tabIconDefault,
    },
    noteText: {
      fontSize: 12,
      color: colors.tabIconDefault,
    },
    emptyState: {
      marginHorizontal: 20,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#334155" : "#E2E8F0",
      backgroundColor: colors.background,
    },
    emptyTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 6,
    },
    emptySubtitle: {
      fontSize: 13,
      color: colors.tabIconDefault,
    },
  });
};
