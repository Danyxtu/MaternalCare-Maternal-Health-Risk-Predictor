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
import { router, useLocalSearchParams } from "expo-router";
import { Hash, ArrowLeft } from "lucide-react-native";
import { getLoginScreenStyles } from "#styles/login.styles.ts";
import AppLogo from "#/src/components/AppLogo";

const VerifyOtpScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getLoginScreenStyles(colorScheme);
  const { email } = useLocalSearchParams<{ email: string }>();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    router.push({
      pathname: "/(auth)/resetPassword",
      params: { email, otp },
    });
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

        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <AppLogo size={100} borderColor="#E11D48" borderWidth={3} imageScale={1.5} />
          <Text style={[styles.welcomeText, { marginTop: 16 }]}>Verify OTP</Text>
          <Text style={styles.subtitleText}>
            Enter the 6-digit code sent to {email}
          </Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Verification Code</Text>
            <View style={styles.inputBox}>
              <Hash color="#94A3B8" size={20} style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, { letterSpacing: 8, fontSize: 24, fontWeight: '700' }]}
                placeholder="000000"
                placeholderTextColor="#94A3B8"
                value={otp}
                onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, '').slice(0, 6))}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleVerify}
          >
            <Text style={styles.loginButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerifyOtpScreen;
