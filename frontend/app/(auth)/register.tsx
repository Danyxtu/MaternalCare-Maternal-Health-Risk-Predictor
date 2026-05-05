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
import { Heart, User, Mail, Lock, Eye, EyeOff, Camera, Image as ImageIcon, CheckCircle2 } from "lucide-react-native";
import { getRegisterScreenStyles } from "#styles/register.styles.ts";
import * as ImagePicker from 'expo-image-picker';

import { register } from "#modules/auth/auth.service.ts";
import { upload } from "#api/api.ts";

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
  const [role, setRole] = useState<"DOCTOR" | "PATIENT">("PATIENT");
  const [idImage, setIdImage] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const pickImage = async (useCamera: boolean) => {
    try {
      const permissionResult = useCamera 
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert(`Permission to access ${useCamera ? 'camera' : 'gallery'} is required!`);
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({ 
            allowsEditing: true, 
            quality: 0.5,
            aspect: [4, 3] 
          })
        : await ImagePicker.launchImageLibraryAsync({ 
            allowsEditing: true, 
            quality: 0.5,
            aspect: [4, 3] 
          });

      if (!result.canceled) {
        setIdImage(result.assets[0].uri);
      }
    } catch (err) {
      console.error("Image pick error:", err);
      alert("Failed to access camera or gallery");
    }
  };

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

      let id_card_url = undefined;
      if (role === "DOCTOR") {
        if (!idImage) {
          setError("Please upload a picture of your professional ID.");
          return;
        }

        // Upload ID image
        try {
          const formData = new FormData();
          const filename = idImage.split('/').pop() || 'id_card.jpg';
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image/jpeg`;

          formData.append('file', {
            uri: idImage,
            name: filename,
            type,
          } as any);

          const uploadRes: any = await upload("/upload", formData);
          id_card_url = uploadRes.data.url;
        } catch (uploadErr) {
          console.error("ID Upload failed:", uploadErr);
          setError("Failed to upload ID image. Please try again.");
          return;
        }
      }

      const payload = {
        email,
        password,
        first_name: firstName || undefined,
        last_name: lastName || undefined,
        middle_initial: middleInitial || undefined,
        role: role,
        id_card_url,
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
            {/* Section 1: Role Selection Card */}
            <View
              style={{
                borderWidth: 1,
                borderColor: colorScheme === "dark" ? "#334155" : "#E2E8F0",
                borderRadius: 20,
                padding: 20,
                backgroundColor: colorScheme === "dark" ? "#1E293B" : "#F8FAFC",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 2,
                marginBottom: 40, // Large gap between sections
              }}
            >
              <Text style={[styles.inputLabel, { fontSize: 16, marginBottom: 12 }]}>I am a...</Text>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    padding: 14,
                    borderRadius: 12,
                    backgroundColor:
                      role === "PATIENT"
                        ? "#E11D48"
                        : colorScheme === "dark"
                          ? "#0F172A"
                          : "#FFFFFF",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor:
                      role === "PATIENT"
                        ? "#E11D48"
                        : colorScheme === "dark"
                          ? "#334155"
                          : "#E2E8F0",
                  }}
                  onPress={() => setRole("PATIENT")}
                >
                  <Text
                    style={{
                      color: role === "PATIENT" ? "#FFFFFF" : "#64748B",
                      fontWeight: "700",
                    }}
                  >
                    Patient
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    padding: 14,
                    borderRadius: 12,
                    backgroundColor:
                      role === "DOCTOR"
                        ? "#E11D48"
                        : colorScheme === "dark"
                          ? "#0F172A"
                          : "#FFFFFF",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor:
                      role === "DOCTOR"
                        ? "#E11D48"
                        : colorScheme === "dark"
                          ? "#334155"
                          : "#E2E8F0",
                  }}
                  onPress={() => setRole("DOCTOR")}
                >
                  <Text
                    style={{
                      color: role === "DOCTOR" ? "#FFFFFF" : "#64748B",
                      fontWeight: "700",
                    }}
                  >
                    Doctor
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Section 2: Personal Information */}
            <View>
              <Text style={[styles.inputLabel, { color: "#E11D48", marginBottom: 20, letterSpacing: 1 }]}>PERSONAL INFORMATION</Text>
              
              {/* First Name Input */}
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

              {/* Middle Initial Input */}
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

              {/* Last Name Input */}
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

              {/* ID Verification Section (Doctor Only) */}
              {role === "DOCTOR" && (
                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 30,
                    padding: 20,
                    backgroundColor: colorScheme === "dark" ? "#1E293B" : "#F1F5F9",
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: "#E11D4840",
                  }}
                >
                  <Text style={[styles.inputLabel, { color: "#E11D48", marginBottom: 8 }]}>
                    PROFESSIONAL VERIFICATION
                  </Text>
                  <Text style={{ fontSize: 13, color: "#64748B", marginBottom: 20, lineHeight: 18 }}>
                    Please provide a clear photo of your professional ID card for administrative review.
                  </Text>

                  {idImage ? (
                    <View style={{ alignItems: "center" }}>
                      <View style={{ 
                        width: '100%', 
                        height: 200, 
                        borderRadius: 12, 
                        overflow: 'hidden', 
                        backgroundColor: '#000',
                        marginBottom: 12,
                        position: 'relative'
                      }}>
                        <ImageIcon color="#FFFFFF20" size={40} style={{ position: 'absolute', top: '40%', left: '42%' }} />
                        {/* Note: We use ImageIcon as placeholder because we don't have Expo Image here yet, 
                            but the actual Image component will be used if we had it. 
                            Let's use a standard View for now to show we have the image. */}
                        <View style={{ flex: 1, backgroundColor: '#10B98120', justifyContent: 'center', alignItems: 'center' }}>
                          <CheckCircle2 color="#10B981" size={48} />
                          <Text style={{ color: '#10B981', fontWeight: '700', marginTop: 8 }}>ID Captured Successfully</Text>
                        </View>
                      </View>
                      <TouchableOpacity 
                        onPress={() => setIdImage(null)}
                        style={{ padding: 8 }}
                      >
                        <Text style={{ color: '#E11D48', fontWeight: '600' }}>Remove and Retake</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          height: 100,
                          backgroundColor: colorScheme === "dark" ? "#0F172A" : "#FFFFFF",
                          borderRadius: 16,
                          justifyContent: "center",
                          alignItems: "center",
                          borderWidth: 1,
                          borderStyle: "dashed",
                          borderColor: "#94A3B8",
                        }}
                        onPress={() => pickImage(true)}
                      >
                        <Camera color="#E11D48" size={24} style={{ marginBottom: 8 }} />
                        <Text style={{ fontSize: 12, color: "#64748B", fontWeight: "600" }}>Take Photo</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          flex: 1,
                          height: 100,
                          backgroundColor: colorScheme === "dark" ? "#0F172A" : "#FFFFFF",
                          borderRadius: 16,
                          justifyContent: "center",
                          alignItems: "center",
                          borderWidth: 1,
                          borderStyle: "dashed",
                          borderColor: "#94A3B8",
                        }}
                        onPress={() => pickImage(false)}
                      >
                        <ImageIcon color="#E11D48" size={24} style={{ marginBottom: 8 }} />
                        <Text style={{ fontSize: 12, color: "#64748B", fontWeight: "600" }}>Upload File</Text>
                      </TouchableOpacity>
                    </View>
                  )}
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
                    onChangeText={setEmail}
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
