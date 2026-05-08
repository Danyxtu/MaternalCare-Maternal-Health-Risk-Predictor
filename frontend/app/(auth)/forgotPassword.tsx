import React, { useState } from "react";
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
import { router } from "expo-router";
import { Mail, ArrowLeft, Send, Hash } from "lucide-react-native";
import { getLoginScreenStyles } from "#styles/login.styles.ts";
import AppLogo from "#/src/components/AppLogo";
import { post } from "#api/api.ts";

const ForgotPasswordScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getLoginScreenStyles(colorScheme);

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSendRequest = async (method: "link" | "otp") => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setMessage(null);

      await post("/auth/forgot-password", { email, method });

      if (method === "otp") {
        router.push({
          pathname: "/(auth)/verifyOtp",
          params: { email },
        });
      } else {
        setMessage("A password reset link has been sent to your email.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to process request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity
          style={{ marginBottom: 20 }}
          onPress={() => router.back()}
        >
          <ArrowLeft color={colorScheme === "dark" ? "#FFFFFF" : "#0F172A"} size={24} />
        </TouchableOpacity>

        {/* Header Section */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <AppLogo size={100} borderColor="#E11D48" borderWidth={3} imageScale={1.5} />
          <Text style={[styles.welcomeText, { marginTop: 16 }]}>Forgot Password?</Text>
          <Text style={styles.subtitleText}>
            Select how you would like to reset your password.
          </Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {message && (
          <View style={[styles.errorContainer, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
            <Text style={[styles.errorText, { color: '#166534' }]}>{message}</Text>
          </View>
        )}

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputBox}>
              <Mail color="#94A3B8" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError(null);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={{ gap: 12 }}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => handleSendRequest("link")}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Send color="#FFFFFF" size={20} style={{ marginRight: 8 }} />
                  <Text style={styles.loginButtonText}>Send Reset Link</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: '#F1F5F9' }]}
              onPress={() => handleSendRequest("otp")}
              disabled={isLoading}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Hash color="#E11D48" size={20} style={{ marginRight: 8 }} />
                <Text style={[styles.loginButtonText, { color: '#E11D48' }]}>Send OTP Code</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
