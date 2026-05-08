import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react-native";
import { getLoginScreenStyles } from "#styles/login.styles.ts";
import { useAuth } from "#context/authContext.tsx";
import AppLogo from "#/src/components/AppLogo";

const LoginScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getLoginScreenStyles(colorScheme);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login
  const { login } = useAuth();
  // Login Payload
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      setError(null);
      await login({ email, password });
      // On successful login, the user will be redirected by the RootLayout logic
    } catch (err: any) {
      // Handle "Pending Approval" status (403 Forbidden)
      if (err.response && err.response.status === 403) {
        router.push("/(auth)/pendingApproval");
      } else {
        const message = err.response?.data?.message || "Invalid email or password. Please try again.";
        setError(message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Top Section: Logo & Welcome Text */}
        <View style={styles.headerContainer}>
          <View style={{ backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <AppLogo size={200} borderColor="#E11D48" backgroundColor="transparent" borderWidth={4} imageScale={1.5} />
          </View>
          <Text style={styles.brandName}>MaternalCare</Text>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.subtitleText}>
            Please enter your details to sign in.
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          {/* Inline Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <AlertCircle color="#DC2626" size={20} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

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
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError(null);
                }}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputBox}>
              <Lock color="#94A3B8" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (error) setError(null);
                }}
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

          {/* Forgot Password Link */}
          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={() => router.push("/(auth)/forgotPassword")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Section */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.signUpText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center", marginTop: 12 }}>
          <Text style={styles.footerText}>
            Maternal Health Monitoring System
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
