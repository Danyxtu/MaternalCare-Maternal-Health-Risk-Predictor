import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Heart, User, Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import { getRegisterScreenStyles } from "#styles/register.styles.ts";

import { register } from "#modules/auth/auth.service.ts";

const RegistrationScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getRegisterScreenStyles(colorScheme);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"PATIENT" | "DOCTOR">("PATIENT");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError("Email and password are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        middleInitial: middleInitial || undefined,
        role: role, // "PATIENT" or "DOCTOR"
      };

      await register(payload);

      // On success, redirect to login (or auto-login if desired)
      router.replace("/(auth)/login");
    } catch (err: any) {
      setError(err?.message ?? "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.logoBox}>
              <Heart color="#FFFFFF" size={32} fill="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Create an Account</Text>
            <Text style={styles.headerSubtitle}>
              Join MaternalCare to start monitoring.
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Full Name Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>First Name (optional)</Text>
              <View style={styles.inputBox}>
                <User color="#94A3B8" size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter first name"
                  placeholderTextColor="#94A3B8"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Last Name (optional)</Text>
              <View style={styles.inputBox}>
                <User color="#94A3B8" size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter last name"
                  placeholderTextColor="#94A3B8"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Middle Initial (optional)</Text>
              <View style={styles.inputBox}>
                <User color="#94A3B8" size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="M"
                  placeholderTextColor="#94A3B8"
                  maxLength={2}
                  value={middleInitial}
                  onChangeText={setMiddleInitial}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputBox}>
                <Mail color="#94A3B8" size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Role Selector */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Role</Text>
              <View style={styles.roleOptionsRow}>
                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    role === "PATIENT" && styles.roleOptionActive,
                  ]}
                  onPress={() => setRole("PATIENT")}
                >
                  <Text
                    style={[
                      styles.roleOptionText,
                      role === "PATIENT" && styles.roleOptionTextActive,
                    ]}
                  >
                    Patient
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    role === "DOCTOR" && styles.roleOptionActive,
                  ]}
                  onPress={() => setRole("DOCTOR")}
                >
                  <Text
                    style={[
                      styles.roleOptionText,
                      role === "DOCTOR" && styles.roleOptionTextActive,
                    ]}
                  >
                    Doctor
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputBox}>
                <Lock color="#94A3B8" size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Create a password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? (
                    <EyeOff color="#94A3B8" size={20} />
                  ) : (
                    <Eye color="#94A3B8" size={20} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.inputBox}>
                <Lock color="#94A3B8" size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm your password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  {showConfirmPassword ? (
                    <EyeOff color="#94A3B8" size={20} />
                  ) : (
                    <Eye color="#94A3B8" size={20} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, isSubmitting && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={isSubmitting}
            >
              <Text style={styles.registerButtonText}>
                {isSubmitting ? "Creating..." : "Create Account"}
              </Text>
            </TouchableOpacity>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          {/* Footer Section: Log In Link */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.loginText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegistrationScreen;
