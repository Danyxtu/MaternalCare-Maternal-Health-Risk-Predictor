import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Layout,
  Activity,
  Heart,
  Droplet,
  Thermometer,
  Calendar,
} from "lucide-react-native";
import { getPatientAssessmentStyles } from "#/src/styles/patientAssessment.styles";
import { useNavigation, useRouter } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { useAuth } from "#/src/context/authContext";
import api from "#/src/api/api";

// --- Types ---
interface InputFieldProps {
  label: string;
  icon?: React.ReactNode;
  placeholder: string;
  helperText?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  isRequired?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  placeholder,
  helperText,
  value,
  onChangeText,
  keyboardType = "default",
  isRequired = true,
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getPatientAssessmentStyles(colorScheme);

  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelRow}>
        {icon && <View style={styles.labelIcon}>{icon}</View>}
        <Text style={styles.label}>
          {label} {isRequired && <Text style={styles.requiredAsterisk}>*</Text>}
        </Text>
      </View>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
      {helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const SelfAssessmentScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getPatientAssessmentStyles(colorScheme);
  const navigation = useNavigation();
  const router = useRouter();
  const { userToken } = useAuth();

  // Form State
  const [age, setAge] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [bloodSugar, setBloodSugar] = useState("");
  const [temperature, setTemperature] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [loading, setLoading] = useState(false);

  const showToast = (msg: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      console.log(msg);
    }
  };

  const handleSubmit = async () => {
    if (
      !age ||
      !systolic ||
      !diastolic ||
      !bloodSugar ||
      !temperature ||
      !heartRate
    ) {
      showToast("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/model/explain", {
        physiological_data: [
          age,
          systolic,
          diastolic,
          bloodSugar,
          temperature,
          heartRate,
        ],
      });
      router.push({
        pathname: "/(drawerPatient)/healthRisk" as any,
        params: { result: JSON.stringify(response.data) },
      });
    } catch (error: any) {
      console.error("Assessment Error:", error);
      const msg =
        error.response?.data?.error || "Failed to process assessment.";
      showToast(msg);
    } finally {
      setLoading(false);
    }
  };

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
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Self Assessment</Text>
          <Text style={styles.headerSubtitle}>
            Log your daily vitals for monitoring
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Activity color="#E11D48" size={20} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Daily Vitals</Text>
            </View>

            <InputField
              label="Age (years)"
              icon={<Calendar color="#475569" size={16} />}
              placeholder="Enter your age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />

            <InputField
              label="Blood Pressure (Systolic)"
              icon={<Heart color="#EF4444" size={16} />}
              placeholder="e.g., 120"
              helperText="Normal: 90-120 mmHg"
              value={systolic}
              onChangeText={setSystolic}
              keyboardType="numeric"
            />

            <InputField
              label="Blood Pressure (Diastolic)"
              icon={<Heart color="#EF4444" size={16} />}
              placeholder="e.g., 80"
              helperText="Normal: 60-80 mmHg"
              value={diastolic}
              onChangeText={setDiastolic}
              keyboardType="numeric"
            />

            <InputField
              label="Blood Sugar Level"
              icon={<Droplet color="#3B82F6" size={16} />}
              placeholder="e.g., 95"
              helperText="Normal: 70-100 mg/dL"
              value={bloodSugar}
              onChangeText={setBloodSugar}
              keyboardType="numeric"
            />

            <InputField
              label="Body Temperature"
              icon={<Thermometer color="#F97316" size={16} />}
              placeholder="e.g., 37.0"
              helperText="Normal: 36.5-37.5°C"
              value={temperature}
              onChangeText={setTemperature}
              keyboardType="numeric"
            />

            <InputField
              label="Heart Rate"
              icon={<Activity color="#8B5CF6" size={16} />}
              placeholder="e.g., 75"
              helperText="Normal: 60-100 bpm"
              value={heartRate}
              onChangeText={setHeartRate}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={loading ? undefined : handleSubmit}
              style={[
                styles.primaryButton,
                loading && { backgroundColor: "#CBD5E1" },
              ]}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? "Processing..." : "Submit Assessment"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SelfAssessmentScreen;
