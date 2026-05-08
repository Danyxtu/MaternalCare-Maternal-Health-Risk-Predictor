import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowLeft } from "lucide-react-native";
import { getLoginScreenStyles } from "#styles/login.styles.ts";
import AppLogo from "#/src/components/AppLogo";
import { post } from "#api/api.ts";

const ResetPasswordScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getLoginScreenStyles(colorScheme);
  const params = useLocalSearchParams<{ email: string; token?: string; otp?: string }>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await post("/auth/reset-password", {
        email: params.email,
        token: params.token,
        otp: params.otp,
        password: password
      });

      setIsSuccess(true);
      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <CheckCircle2 color="#10B981" size={80} />
        <Text style={[styles.welcomeText, { marginTop: 24 }]}>Success!</Text>
        <Text style={styles.subtitleText}>Your password has been reset successfully.</Text>
        <Text style={[styles.subtitleText, { marginTop: 8 }]}>Redirecting to login...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {!params.token && (
          <TouchableOpacity
            style={{ marginBottom: 20 }}
            onPress={() => router.back()}
          >
            <ArrowLeft color={colorScheme === "dark" ? "#FFFFFF" : "#0F172A"} size={24} />
          </TouchableOpacity>
        )}

        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <AppLogo size={100} borderColor="#E11D48" borderWidth={3} imageScale={1.5} />
          <Text style={[styles.welcomeText, { marginTop: 16 }]}>Set New Password</Text>
          <Text style={styles.subtitleText}>
            Please enter your new password below.
          </Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>New Password</Text>
            <View style={styles.inputBox}>
              <Lock color="#94A3B8" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                {showPassword ? <EyeOff color="#94A3B8" size={20} /> : <Eye color="#94A3B8" size={20} />}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.inputBox}>
              <Lock color="#94A3B8" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                {showConfirmPassword ? <EyeOff color="#94A3B8" size={20} /> : <Eye color="#94A3B8" size={20} />}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleReset}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.loginButtonText}>Reset Password</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;
