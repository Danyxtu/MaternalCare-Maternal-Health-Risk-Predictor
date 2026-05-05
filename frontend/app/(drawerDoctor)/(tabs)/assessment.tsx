import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Layout,
  User,
  Calendar,
  Activity,
  Heart,
  Droplet,
  Thermometer,
  Moon,
  Pill,
  Check,
} from "lucide-react-native";
import { getNewAssessmentScreenStyles } from "#/src/styles/assessment.styles";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import api from "#api/api.ts";
import { useRouter } from "expo-router";

// --- Types ---
interface InputFieldProps {
  label: string;
  icon?: React.ReactNode;
  placeholder: string;
  helperText?: string;
  errorText?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  isRequired?: boolean;
}

interface ExistingPatient {
  id: string;
  name: string;
  age: number;
  bp?: string;
  risk?: string;
}

type FieldErrorKey =
  | "patient"
  | "firstName"
  | "lastName"
  | "age"
  | "systolic"
  | "diastolic"
  | "bloodSugar"
  | "temperature"
  | "heartRate"
  | "hemoglobin"
  | "sleepHours"
  | "dietAdherence"
  | "ironSupplement"
  | "folicSupplement";

type FieldErrors = Partial<Record<FieldErrorKey, string>>;

// --- Reusable Components ---
const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  placeholder,
  helperText,
  errorText,
  value,
  onChangeText,
  keyboardType = "default",
  isRequired = true,
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getNewAssessmentScreenStyles(colorScheme);

  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelRow}>
        {icon && <View style={styles.labelIcon}>{icon}</View>}
        <Text style={styles.label}>
          {label} {isRequired && <Text style={styles.requiredAsterisk}>*</Text>}
        </Text>
      </View>
      {!!errorText && <Text style={styles.errorText}>{errorText}</Text>}
      <TextInput
        style={[styles.textInput, !!errorText && styles.errorInput]}
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

// --- Main Screen Component ---
const NewAssessmentScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getNewAssessmentScreenStyles(colorScheme);
  const navigation = useNavigation();
  const router = useRouter();

  // Stepper State
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const STEPS = [
    { id: 1, title: "Patient Info" },
    { id: 2, title: "Physiological" },
    { id: 3, title: "Lifestyle" },
    { id: 4, title: "Supplements" },
  ];

  const getStepErrors = (step: number): FieldErrors => {
    const errors: FieldErrors = {};
    switch (step) {
      case 1:
        if (patientType === "existing") {
          if (
            selectedPatientName.trim() === "" &&
            existingSearch.trim() === ""
          ) {
            errors.patient = "Required";
          }
        } else {
          if (firstName.trim() === "") errors.firstName = "Required";
          if (lastName.trim() === "") errors.lastName = "Required";
        }

        if (age.trim() === "") errors.age = "Required";
        return errors;
      case 2:
        if (systolic.trim() === "") errors.systolic = "Required";
        if (diastolic.trim() === "") errors.diastolic = "Required";
        if (bloodSugar.trim() === "") errors.bloodSugar = "Required";
        if (temperature.trim() === "") errors.temperature = "Required";
        if (heartRate.trim() === "") errors.heartRate = "Required";
        if (hemoglobin.trim() === "") errors.hemoglobin = "Required";
        return errors;
      case 3:
        if (sleepHours.trim() === "") errors.sleepHours = "Required";
        if (dietAdherence.trim() === "") errors.dietAdherence = "Required";
        return errors;
      case 4:
        if (ironSupplement.trim() === "") errors.ironSupplement = "Required";
        if (folicSupplement.trim() === "") errors.folicSupplement = "Required";
        return errors;
      default:
        return errors;
    }
  };

  const handleNext = () => {
    const errors = getStepErrors(currentStep);
    if (Object.keys(errors).length === 0) {
      setFieldErrors({});
      setCompletedSteps((prev) =>
        prev.includes(currentStep) ? prev : [...prev, currentStep],
      );
      setCurrentStep((prev) => prev + 1);
    } else {
      setFieldErrors(errors);
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId < currentStep || completedSteps.includes(stepId - 1)) {
      setFieldErrors({});
      setCurrentStep(stepId);
    }
  };

  const patientOptions: Array<{ key: "existing" | "new"; label: string }> = [
    { key: "existing", label: "Existing Patient" },
    { key: "new", label: "New Patient" },
  ];

  // Form State
  const [patientType, setPatientType] = useState<"existing" | "new">(
    "existing",
  );
  const [existingSearch, setExistingSearch] = useState("");
  const [selectedPatientName, setSelectedPatientName] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );
  const [existingPatients, setExistingPatients] = useState<ExistingPatient[]>(
    [],
  );
  const [refreshing, setRefreshing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [age, setAge] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [bloodSugar, setBloodSugar] = useState("");
  const [temperature, setTemperature] = useState("");
  const [tempUnit, setTempUnit] = useState<"C" | "F">("F");
  const [heartRate, setHeartRate] = useState("");
  const [hemoglobin, setHemoglobin] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [dietAdherence, setDietAdherence] = useState("Fair");
  const [ironSupplement, setIronSupplement] = useState("0");
  const [folicSupplement, setFolicSupplement] = useState("0");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const resetForm = () => {
    setCurrentStep(1);
    setCompletedSteps([]);
    setPatientType("existing");
    setExistingSearch("");
    setSelectedPatientName("");
    setSelectedPatientId(null);
    setFirstName("");
    setLastName("");
    setMiddleInitial("");
    setAge("");
    setSystolic("");
    setDiastolic("");
    setBloodSugar("");
    setTemperature("");
    setHeartRate("");
    setHemoglobin("");
    setSleepHours("");
    setDietAdherence("Fair");
    setIronSupplement("0");
    setFolicSupplement("0");
    setFieldErrors({});
  };

  const clearFieldError = (key: FieldErrorKey) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const fetchExistingPatients = async () => {
    try {
      const response = await api.get("/patients");
      const patients = (response.data?.data ?? []) as ExistingPatient[];
      setExistingPatients(patients);
    } catch (error: any) {
      if (error.status !== 401) {
        console.error("Failed to fetch patients:", error);
      }
    }
  };

  useEffect(() => {
    fetchExistingPatients();
  }, []);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchExistingPatients();
    } finally {
      setRefreshing(false);
    }
  };

  const filteredPatients = useMemo(() => {
    const query = existingSearch.trim().toLowerCase();
    if (!query) return existingPatients;
    return existingPatients.filter((patient) => {
      const name = patient.name?.trim() ?? "";
      const parts = name.split(/\s+/).filter(Boolean);
      const firstInitial = parts[0]?.[0] ?? "";
      const lastInitial =
        parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
      const initials = `${firstInitial}${lastInitial}`.toLowerCase();

      const nameMatch = name.toLowerCase().includes(query);
      const initialsMatch = initials.startsWith(
        query.replace(/\s+/g, "").slice(0, 2),
      );
      return nameMatch || initialsMatch;
    });
  }, [existingSearch, existingPatients]);

  const formatNewPatientName = () => {
    const mi = middleInitial.trim();
    const miText = mi ? `${mi.charAt(0).toUpperCase()}. ` : "";
    return `${firstName.trim()} ${miText}${lastName.trim()}`.trim();
  };

  const handlePatientTypeChange = (type: "existing" | "new") => {
    setPatientType(type);
    setFieldErrors({});
    if (type === "existing") {
      setFirstName("");
      setLastName("");
      setMiddleInitial("");
    } else {
      setExistingSearch("");
      setSelectedPatientName("");
      setSelectedPatientId(null);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const patientName =
        patientType === "existing"
          ? selectedPatientName || existingSearch.trim()
          : formatNewPatientName();

      let finalTemp = parseFloat(temperature) || 0;
      if (tempUnit === "C") {
        // Convert C to F: (C * 9/5) + 32
        finalTemp = (finalTemp * 9) / 5 + 32;
      }

      const physiologicalData = [
        parseFloat(age) || 0,           // 0: Age
        parseFloat(systolic) || 0,      // 1: SystolicBP
        parseFloat(diastolic) || 0,     // 2: DiastolicBP
        parseFloat(bloodSugar) || 0,    // 3: BS
        finalTemp,                      // 4: BodyTemp
        parseFloat(heartRate) || 0,     // 5: HeartRate
        parseFloat(sleepHours) || 0,    // 6: sleep_hours
        parseFloat(hemoglobin) || 0,    // 7: hemoglobin_g_dL
        parseInt(ironSupplement) || 0,  // 8: iron_supplement
        parseInt(folicSupplement) || 0, // 9: folic_supplement
        dietAdherence,                  // 10: diet_adherence (String)
      ];

      const response = await api.post("/model/explain", {
        physiological_data: physiologicalData,
        patient_name: patientName,
        patient_type: patientType,
      });

      const routeParams: Record<string, string> = {
        result: JSON.stringify(response.data),
        patient_name: patientName,
        patient_type: patientType,
        patient_age: age,
        physiological_data: JSON.stringify(physiologicalData),
      };
      if (patientType === "existing" && selectedPatientId) {
        routeParams.patient_id = String(selectedPatientId);
      }
      router.push({
        pathname: "/assessedRisk",
        params: routeParams,
      });
      
      // Reset form data for next assessment
      resetForm();
      
      console.log("Prediction Response:", response.data);
    } catch (error: any) {
      if (error.status !== 401) {
        console.error("API Error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepperContainer}>
      {STEPS.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = completedSteps.includes(step.id) && !isActive;
        return (
          <View key={step.id} style={styles.stepItem}>
            <TouchableOpacity
              onPress={() => handleStepClick(step.id)}
              disabled={loading}
              activeOpacity={0.7}
              style={[
                styles.stepCircle,
                isActive && styles.stepCircleActive,
                isCompleted && styles.stepCircleCompleted,
              ]}
            >
              {isCompleted ? (
                <Check color="#FFFFFF" size={16} />
              ) : (
                <Text
                  style={[
                    styles.stepText,
                    isActive && styles.stepTextActive,
                    isCompleted && { color: "#FFFFFF" },
                    { marginBottom: 0 },
                  ]}
                >
                  {step.id}
                </Text>
              )}
            </TouchableOpacity>
            <Text
              style={[
                styles.stepText,
                isActive && styles.stepTextActive,
                { marginTop: 4 },
              ]}
            >
              {step.title}
            </Text>
            {index < STEPS.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  completedSteps.includes(step.id) && styles.stepLineCompleted,
                  currentStep === step.id && styles.stepLineActive,
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View>
            <View style={styles.selectorContainer}>
              {patientOptions.map((option) => {
                const selected = patientType === option.key;
                return (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.selectorOption,
                      selected && styles.selectorOptionActive,
                    ]}
                    onPress={() => handlePatientTypeChange(option.key)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.selectorOptionText,
                        selected && styles.selectorOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.sectionHeader}>
              <User color="#E11D48" size={20} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Patient Information</Text>
            </View>

            {patientType === "existing" ? (
              <>
                <InputField
                  label="Patient (Initials or Name)"
                  placeholder="Type initials e.g., AG"
                  value={existingSearch}
                  errorText={fieldErrors.patient}
                  onChangeText={(text) => {
                    setExistingSearch(text);
                    setSelectedPatientName(text);
                    setSelectedPatientId(null);
                    if (text.trim() !== "") clearFieldError("patient");
                  }}
                />
                <View style={styles.suggestionContainer}>
                  {filteredPatients.map((patient) => {
                    const formattedName = patient.name;
                    const parts = (patient.name ?? "")
                      .trim()
                      .split(/\s+/)
                      .filter(Boolean);
                    const firstInitial = parts[0]?.[0] ?? "";
                    const lastInitial =
                      parts.length > 1
                        ? (parts[parts.length - 1]?.[0] ?? "")
                        : "";
                    const initials = `${firstInitial}${lastInitial}`;
                    const isActive = selectedPatientName === formattedName;
                    return (
                      <TouchableOpacity
                        key={patient.id}
                        style={[
                          styles.suggestionChip,
                          isActive && styles.suggestionChipActive,
                        ]}
                        onPress={() => {
                          setSelectedPatientName(formattedName);
                          setExistingSearch(formattedName);
                          setSelectedPatientId(patient.id);
                          clearFieldError("patient");
                        }}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.suggestionChipText,
                            isActive && styles.suggestionChipTextActive,
                          ]}
                        >
                          {formattedName}
                          <Text style={styles.suggestionChipInitials}>
                            {`  (${initials})`}
                          </Text>
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  {filteredPatients.length === 0 && existingSearch.trim() && (
                    <Text style={styles.helperText}>No matches found</Text>
                  )}
                </View>
              </>
            ) : (
              <>
                <InputField
                  label="First Name"
                  placeholder="Enter first name"
                  value={firstName}
                  errorText={fieldErrors.firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    if (text.trim() !== "") clearFieldError("firstName");
                  }}
                />
                <InputField
                  label="Last Name"
                  placeholder="Enter last name"
                  value={lastName}
                  errorText={fieldErrors.lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    if (text.trim() !== "") clearFieldError("lastName");
                  }}
                />
                <InputField
                  label="Middle Initial"
                  placeholder="e.g., A"
                  value={middleInitial}
                  onChangeText={(text) => setMiddleInitial(text.slice(0, 1))}
                  helperText="Single letter only"
                  isRequired={false}
                />
              </>
            )}

            <InputField
              label="Age (years)"
              icon={<Calendar color="#475569" size={16} />}
              placeholder="Enter age"
              value={age}
              errorText={fieldErrors.age}
              onChangeText={(text) => {
                setAge(text);
                if (text.trim() !== "") clearFieldError("age");
              }}
              keyboardType="numeric"
            />
          </View>
        );
      case 2:
        return (
          <View>
            <View style={styles.sectionHeader}>
              <Activity color="#E11D48" size={20} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Physiological Data</Text>
            </View>

            <InputField
              label="Blood Pressure (Systolic)"
              icon={<Heart color="#EF4444" size={16} />}
              placeholder="e.g., 120"
              helperText="Normal: 90-120 mmHg"
              value={systolic}
              errorText={fieldErrors.systolic}
              onChangeText={(text) => {
                setSystolic(text);
                if (text.trim() !== "") clearFieldError("systolic");
              }}
              keyboardType="numeric"
            />

            <InputField
              label="Blood Pressure (Diastolic)"
              icon={<Heart color="#EF4444" size={16} />}
              placeholder="e.g., 80"
              helperText="Normal: 60-80 mmHg"
              value={diastolic}
              errorText={fieldErrors.diastolic}
              onChangeText={(text) => {
                setDiastolic(text);
                if (text.trim() !== "") clearFieldError("diastolic");
              }}
              keyboardType="numeric"
            />

            <InputField
              label="Blood Sugar Level"
              icon={<Droplet color="#3B82F6" size={16} />}
              placeholder="e.g., 5.5"
              helperText="Normal: 3.9-5.6 mmol/L (fasting)"
              value={bloodSugar}
              errorText={fieldErrors.bloodSugar}
              onChangeText={(text) => {
                setBloodSugar(text);
                if (text.trim() !== "") clearFieldError("bloodSugar");
              }}
              keyboardType="numeric"
            />

            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <View style={styles.labelIcon}>
                  <Thermometer color="#F97316" size={16} />
                </View>
                <Text style={styles.label}>
                  Body Temperature <Text style={styles.requiredAsterisk}>*</Text>
                </Text>
              </View>
              <View style={[styles.selectorContainer, { marginBottom: 8 }]}>
                {(["F", "C"] as const).map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={[
                      styles.selectorOption,
                      tempUnit === unit && styles.selectorOptionActive,
                      { paddingVertical: 6 }
                    ]}
                    onPress={() => setTempUnit(unit)}
                  >
                    <Text
                      style={[
                        styles.selectorOptionText,
                        tempUnit === unit && styles.selectorOptionTextActive,
                        { fontSize: 12 }
                      ]}
                    >
                      °{unit} {unit === "F" ? "(System Priority)" : ""}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {!!fieldErrors.temperature && <Text style={styles.errorText}>{fieldErrors.temperature}</Text>}
              <TextInput
                style={[styles.textInput, !!fieldErrors.temperature && styles.errorInput]}
                placeholder={tempUnit === "F" ? "e.g., 98.6" : "e.g., 37.0"}
                placeholderTextColor="#94A3B8"
                value={temperature}
                onChangeText={(text) => {
                  setTemperature(text);
                  if (text.trim() !== "") clearFieldError("temperature");
                }}
                keyboardType="numeric"
              />
              <Text style={styles.helperText}>
                {tempUnit === "F" ? "Normal: 97.7-99.5°F" : "Normal: 36.5-37.5°C"}
              </Text>
            </View>

            <InputField
              label="Heart Rate"
              icon={<Activity color="#8B5CF6" size={16} />}
              placeholder="e.g., 75"
              helperText="Normal: 60-100 bpm"
              value={heartRate}
              errorText={fieldErrors.heartRate}
              onChangeText={(text) => {
                setHeartRate(text);
                if (text.trim() !== "") clearFieldError("heartRate");
              }}
              keyboardType="numeric"
            />

            <InputField
              label="Hemoglobin (g/dL)"
              icon={<Droplet color="#E11D48" size={16} />}
              placeholder="e.g., 12.0"
              value={hemoglobin}
              errorText={fieldErrors.hemoglobin}
              onChangeText={(text) => {
                setHemoglobin(text);
                if (text.trim() !== "") clearFieldError("hemoglobin");
              }}
              keyboardType="numeric"
            />
          </View>
        );
      case 3:
        return (
          <View>
            <View style={styles.sectionHeader}>
              <Activity color="#E11D48" size={20} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>
                Lifestyle & Behavioral Data
              </Text>
            </View>

            <InputField
              label="Sleep Hours"
              icon={<Moon color="#3B82F6" size={16} />}
              placeholder="e.g., 8"
              value={sleepHours}
              errorText={fieldErrors.sleepHours}
              onChangeText={(text) => {
                setSleepHours(text);
                if (text.trim() !== "") clearFieldError("sleepHours");
              }}
              keyboardType="numeric"
            />

            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <View style={styles.labelIcon}>
                  <Activity color="#475569" size={16} />
                </View>
                <Text style={styles.label}>Diet Adherence</Text>
              </View>
              {!!fieldErrors.dietAdherence && (
                <Text style={styles.errorText}>
                  {fieldErrors.dietAdherence}
                </Text>
              )}
              <View style={styles.selectorContainer}>
                {["Poor", "Fair", "Good"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.selectorOption,
                      dietAdherence === option && styles.selectorOptionActive,
                    ]}
                    onPress={() => {
                      setDietAdherence(option);
                      if (option.trim() !== "")
                        clearFieldError("dietAdherence");
                    }}
                  >
                    <Text
                      style={[
                        styles.selectorOptionText,
                        dietAdherence === option &&
                          styles.selectorOptionTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );
      case 4:
        return (
          <View>
            <View style={styles.sectionHeader}>
              <Pill color="#E11D48" size={20} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>
                Supplements & Interventions
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <View style={styles.labelIcon}>
                  <Pill color="#475569" size={16} />
                </View>
                <Text style={styles.label}>Iron Supplement</Text>
              </View>
              <View style={styles.selectorContainer}>
                {[
                  { label: "No", val: "0" },
                  { label: "Yes", val: "1" },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.val}
                    style={[
                      styles.selectorOption,
                      ironSupplement === option.val &&
                        styles.selectorOptionActive,
                    ]}
                    onPress={() => setIronSupplement(option.val)}
                  >
                    <Text
                      style={[
                        styles.selectorOptionText,
                        ironSupplement === option.val &&
                          styles.selectorOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <View style={styles.labelIcon}>
                  <Pill color="#475569" size={16} />
                </View>
                <Text style={styles.label}>Folic Acid Supplement</Text>
              </View>
              <View style={styles.selectorContainer}>
                {[
                  { label: "No", val: "0" },
                  { label: "Yes", val: "1" },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.val}
                    style={[
                      styles.selectorOption,
                      folicSupplement === option.val &&
                        styles.selectorOptionActive,
                    ]}
                    onPress={() => setFolicSupplement(option.val)}
                  >
                    <Text
                      style={[
                        styles.selectorOptionText,
                        folicSupplement === option.val &&
                          styles.selectorOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right", "bottom"]}
    >
      {/* Header Section - Fixed at top */}
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
        <View style={[styles.headerTextContainer, { marginLeft: 12 }]}>
          <Text style={styles.headerTitle}>Physiological Input Module</Text>
          <Text style={styles.headerSubtitle}>
            Complete {STEPS.length} steps for risk assessment
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#10B981"]}
              tintColor={colorScheme === "dark" ? "#ECEDEE" : "#10B981"}
            />
          }
        >
          {renderStepIndicator()}

          {/* Form Card */}
          <View style={styles.card}>{renderStepContent()}</View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {currentStep > 1 ? (
              <TouchableOpacity
                onPress={() => {
                  setFieldErrors({});
                  setCurrentStep((prev) => prev - 1);
                }}
                style={styles.secondaryButton}
                disabled={loading}
              >
                <Text style={styles.secondaryButtonText}>Previous</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  router.push("/(drawerDoctor)/(tabs)/patientRecords")
                }
                style={styles.secondaryButton}
                disabled={loading}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}

            {currentStep < 4 ? (
              <TouchableOpacity
                onPress={handleNext}
                style={styles.primaryButton}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={loading ? undefined : handleSubmit}
                style={[
                  styles.primaryButton,
                  loading && { backgroundColor: "#CBD5E1" },
                ]}
                disabled={loading}
                activeOpacity={loading ? 1 : 0.7}
              >
                <Text
                  style={[
                    styles.primaryButtonText,
                    loading && { color: "#64748B" },
                  ]}
                >
                  {loading ? "Calculating..." : "Calculate Risk Assessment"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default NewAssessmentScreen;
