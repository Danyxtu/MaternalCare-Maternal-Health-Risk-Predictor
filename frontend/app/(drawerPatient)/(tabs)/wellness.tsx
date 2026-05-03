import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Layout, Moon, Droplet, Apple, Zap, Smile, Info } from "lucide-react-native";
import { getPatientDashboardStyles } from "#/src/styles/patientDashboard.styles";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import api from "#/src/api/api";

const WellnessCheckScreen = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getPatientDashboardStyles(colorScheme);
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [tips, setTips] = useState<string[] | null>(null);

  // Form State
  const [sleep, setSleep] = useState("");
  const [water, setWater] = useState("");
  const [diet, setDiet] = useState("Good");
  const [stress, setStress] = useState("Low");
  const [mood, setMood] = useState("Happy");

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("/wellness/check-in", {
        sleep_hours: parseFloat(sleep) || 0,
        water_intake: parseFloat(water) || 0,
        diet_quality: diet,
        stress_level: stress,
        mood: mood,
        supplements_taken: true,
      });
      setTips(response.data.data.tips);
    } catch (error: any) {
      if (error.status !== 401) {
        console.error("Wellness check-in failed:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderOptionGroup = (label: string, options: string[], current: string, setter: (val: string) => void) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 14, fontWeight: "600", color: "#64748B", marginBottom: 10 }}>{label}</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            onPress={() => setter(opt)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 20,
              backgroundColor: current === opt ? "#E11D48" : "#F1F5F9",
            }}
          >
            <Text style={{ color: current === opt ? "#FFFFFF" : "#64748B", fontSize: 13, fontWeight: "600" }}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (tips) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Daily Guidance</Text>
            <Text style={styles.headerSubtitle}>Personalized lifestyle feedback</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={{ padding: 20 }}>
            <View style={[styles.statusCard, { borderColor: "#10B981" }]}>
              <Smile color="#10B981" size={48} />
              <Text style={[styles.statusValue, { color: "#10B981", marginTop: 12 }]}>Great Job!</Text>
              <Text style={styles.statusSubtitle}>Thank you for completing your daily check-in.</Text>
            </View>

            <Text style={[styles.sectionTitle, { marginLeft: 0 }]}>Wellness Recommendations</Text>
            {tips.map((tip, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  backgroundColor: "#FFFFFF",
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: "#F1F5F9",
                }}
              >
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "#FFF1F2", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#E11D48" }}>{index + 1}</Text>
                </View>
                <Text style={{ flex: 1, fontSize: 14, color: "#334155", lineHeight: 20 }}>{tip}</Text>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.statusCard, { backgroundColor: "#E11D48", marginTop: 20 }]}
              onPress={() => setTips(null)}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 16 }}>Done for Today</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
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
          <Text style={styles.headerTitle}>Daily Check-in</Text>
          <Text style={styles.headerSubtitle}>How are you feeling today?</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{ padding: 20 }}>
          <View style={{ backgroundColor: "#F8FAFC", padding: 16, borderRadius: 12, marginBottom: 24, flexDirection: "row", alignItems: "center" }}>
            <Info color="#64748B" size={20} />
            <Text style={{ flex: 1, marginLeft: 12, fontSize: 12, color: "#64748B", fontStyle: "italic" }}>
              This guide provides lifestyle suggestions based on your input. It is not a medical diagnosis.
            </Text>
          </View>

          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <Moon color="#E11D48" size={18} />
              <Text style={{ marginLeft: 8, fontSize: 14, fontWeight: "600", color: "#334155" }}>Sleep Hours</Text>
            </View>
            <TextInput
              style={{ backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 8, padding: 12 }}
              placeholder="e.g., 8"
              keyboardType="numeric"
              value={sleep}
              onChangeText={setSleep}
            />
          </View>

          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <Droplet color="#E11D48" size={18} />
              <Text style={{ marginLeft: 8, fontSize: 14, fontWeight: "600", color: "#334155" }}>Water Intake (Liters)</Text>
            </View>
            <TextInput
              style={{ backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 8, padding: 12 }}
              placeholder="e.g., 2.5"
              keyboardType="numeric"
              value={water}
              onChangeText={setWater}
            />
          </View>

          {renderOptionGroup("Diet Quality", ["Poor", "Fair", "Good"], diet, setDiet)}
          {renderOptionGroup("Stress Level", ["Low", "Moderate", "High"], stress, setStress)}
          {renderOptionGroup("Overall Mood", ["Happy", "Neutral", "Tired"], mood, setMood)}

          <TouchableOpacity
            style={{ backgroundColor: "#E11D48", padding: 18, borderRadius: 12, alignItems: "center", marginTop: 20 }}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>Get Personalized Guide</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WellnessCheckScreen;
