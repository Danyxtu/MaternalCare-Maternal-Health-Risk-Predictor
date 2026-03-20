import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Shield, 
  ChevronLeft 
} from "lucide-react-native";
import { getPatientRiskStyles } from "@/styles/patientRisk.styles";

const HealthRiskScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getPatientRiskStyles(colorScheme);
  const router = useRouter();
  const { result } = useLocalSearchParams();

  // Fallback if no result passed
  const aiResult = result ? JSON.parse(result as string) : null;
  const prediction = aiResult?.predicted_class || aiResult?.prediction || "Low Risk";

  const getRiskDetails = () => {
    const level = prediction.toLowerCase();
    if (level.includes("high")) {
      return {
        color: "#EF4444",
        icon: <ShieldAlert color="#FFFFFF" size={32} />,
        description: "Your recent vitals indicate a high risk level. Please contact your healthcare provider immediately for further guidance.",
      };
    } else if (level.includes("mid") || level.includes("medium")) {
      return {
        color: "#F59E0B",
        icon: <Shield color="#FFFFFF" size={32} />,
        description: "Your vitals show a moderate risk. We recommend scheduling a follow-up consultation with your doctor soon.",
      };
    } else {
      return {
        color: "#10B981",
        icon: <ShieldCheck color="#FFFFFF" size={32} />,
        description: "Your vitals are within the normal range. Keep maintaining your healthy lifestyle and regular checkups.",
      };
    }
  };

  const risk = getRiskDetails();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft color={colorScheme === "dark" ? "#ECEDEE" : "#11181C"} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Standing</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={[styles.resultCard, { backgroundColor: risk.color }]}>
          <Text style={styles.riskLabel}>Current Assessment</Text>
          <Text style={styles.riskValue}>{prediction.toUpperCase()}</Text>
          <View style={styles.riskIconContainer}>
            {risk.icon}
          </View>
        </View>

        <View style={styles.explanationCard}>
          <Text style={styles.sectionTitle}>Medical Guidance</Text>
          <Text style={styles.explanationText}>
            {risk.description}
          </Text>
        </View>

        <View style={styles.explanationCard}>
          <Text style={styles.sectionTitle}>What does this mean?</Text>
          <Text style={styles.explanationText}>
            This assessment is based on your blood pressure, sugar levels, temperature, and heart rate using our advanced AI monitoring system. It helps identify potential concerns early in your pregnancy.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push("/(drawerPatient)/dashboard")}
        >
          <Text style={styles.actionButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HealthRiskScreen;
