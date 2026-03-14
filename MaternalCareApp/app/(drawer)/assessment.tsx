import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Layout,
  User,
  Calendar,
  Activity,
  Heart,
  Droplet,
  Thermometer
} from 'lucide-react-native';
import { getNewAssessmentScreenStyles } from '@/styles/assessment.styles';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

// --- Types ---
interface InputFieldProps {
  label: string;
  icon?: React.ReactNode;
  placeholder: string;
  helperText?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  isRequired?: boolean;
}

// --- Reusable Components ---
const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  placeholder,
  helperText,
  value,
  onChangeText,
  keyboardType = 'default',
  isRequired = true
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getNewAssessmentScreenStyles(colorScheme);
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

// --- Main Screen Component ---
const NewAssessmentScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getNewAssessmentScreenStyles(colorScheme);
  const navigation = useNavigation();
  // Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [bloodSugar, setBloodSugar] = useState('');
  const [temperature, setTemperature] = useState('');
  const [heartRate, setHeartRate] = useState('');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      {/* Header Section - Fixed at top */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Layout color={colorScheme === 'dark' ? '#ECEDEE' : '#11181C'} size={24} />
        </TouchableOpacity>
        <View style={[styles.headerTextContainer, { marginLeft: 12 }]}>
          <Text style={styles.headerTitle}>Physiological Input Module</Text>
          <Text style={styles.headerSubtitle}>Enter patient vitals for risk assessment</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Form Card */}
          <View style={styles.card}>

            {/* --- Patient Information Section --- */}
            <View style={styles.sectionHeader}>
              <User color="#E11D48" size={20} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Patient Information</Text>
            </View>

            <InputField
              label="Full Name"
              placeholder="Enter patient name"
              value={name}
              onChangeText={setName}
            />

            <InputField
              label="Age (years)"
              icon={<Calendar color="#475569" size={16} />}
              placeholder="Enter age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />

            <View style={styles.divider} />

            {/* --- Vital Signs Section --- */}
            <View style={styles.sectionHeader}>
              <Activity color="#E11D48" size={20} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Vital Signs</Text>
            </View>

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
              helperText="Normal: 70-100 mg/dL (fasting)"
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

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Calculate Risk Assessment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default NewAssessmentScreen;