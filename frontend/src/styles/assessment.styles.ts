import { StyleSheet } from "react-native";
import { Colors } from "../../constants/theme";

type Theme = "light" | "dark";

export const getNewAssessmentScreenStyles = (theme: Theme) => {
  const colors = Colors[theme];
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    scrollContainer: {
      paddingBottom: 40,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      height: 80, // Fixed height for alignment
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
    card: {
      marginTop: 10,
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
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      marginTop: 8,
    },
    sectionIcon: {
      marginRight: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    divider: {
      height: 1,
      backgroundColor: theme === "dark" ? "#334155" : "#F1F5F9",
      marginVertical: 24,
    },
    inputContainer: {
      marginBottom: 16,
    },
    labelRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    labelIcon: {
      marginRight: 6,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    requiredAsterisk: {
      color: "#E11D48",
    },
    textInput: {
      borderWidth: 1,
      borderColor: theme === "dark" ? "#334155" : "#E2E8F0",
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.background,
    },
    selectorContainer: {
      flexDirection: "row",
      backgroundColor: theme === "dark" ? "#0F172A" : "#F8FAFC",
      borderWidth: 1,
      borderColor: theme === "dark" ? "#334155" : "#E2E8F0",
      borderRadius: 12,
      marginBottom: 16,
      overflow: "hidden",
    },
    selectorOption: {
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
    },
    selectorOptionActive: {
      backgroundColor: "#E11D4820",
      borderBottomWidth: 2,
      borderBottomColor: "#E11D48",
    },
    selectorOptionText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.tabIconDefault,
    },
    selectorOptionTextActive: {
      color: "#E11D48",
    },
    helperText: {
      fontSize: 12,
      color: colors.tabIconDefault,
      marginTop: 6,
    },
    suggestionContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: -4,
      marginBottom: 12,
    },
    suggestionChip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#334155" : "#E2E8F0",
      backgroundColor: colors.background,
    },
    suggestionChipActive: {
      backgroundColor: "#E11D4820",
      borderColor: "#E11D48",
    },
    suggestionChipText: {
      color: colors.text,
      fontSize: 13,
      fontWeight: "500",
    },
    suggestionChipTextActive: {
      color: "#E11D48",
    },
    suggestionChipInitials: {
      color: colors.tabIconDefault,
      fontSize: 12,
      fontWeight: "500",
    },
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
    stepperContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginHorizontal: 20,
      marginBottom: 10,
    },
    stepItem: {
      flex: 1,
      alignItems: "center",
    },
    stepCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme === "dark" ? "#334155" : "#E2E8F0",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
      zIndex: 2,
    },
    stepCircleActiveOuter: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: "#E11D48",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: -4,
      zIndex: 1,
    },
    stepCircleActive: {
      backgroundColor: "#E11D48",
    },
    stepCircleCompleted: {
      backgroundColor: "#10B981",
    },
    errorText: {
      fontSize: 12,
      color: "#E11D48",
      marginTop: 4,
    },
    errorInput: {
      borderColor: "#E11D48",
    },
    stepText: {
      fontSize: 10,
      color: colors.tabIconDefault,
      textAlign: "center",
    },
    stepTextActive: {
      color: "#E11D48",
      fontWeight: "700",
    },
    stepLine: {
      position: "absolute",
      top: 15,
      left: "50%",
      right: "-50%",
      height: 2,
      backgroundColor: theme === "dark" ? "#334155" : "#E2E8F0",
      zIndex: 0,
    },
    stepLineCompleted: {
      backgroundColor: "#10B981",
    },
    stepLineActive: {
      backgroundColor: "#E11D48",
    },
  });
};
