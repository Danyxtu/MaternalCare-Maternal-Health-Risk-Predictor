import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useAuth, AuthProvider } from "@/context/authContext";
import { ActivityIndicator, View } from "react-native";
const RootLayout = () => {
  const { userToken, role, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inDoctorGroup = segments[0] === "(drawerDoctor)";
    const inPatientGroup = segments[0] === "(drawerPatient)";

    if (!userToken) {
      if (!inAuthGroup) router.replace("/welcomePage");
      return;
    }

    if (!role) {
      router.replace("/welcomePage");
      return;
    }

    const targetRoute =
      role === "DOCTOR"
        ? "/(drawerDoctor)/dashboard"
        : "/(drawerPatient)/dashboard";

    const isInCorrectGroup =
      (role === "DOCTOR" && inDoctorGroup) ||
      (role === "PATIENT" && inPatientGroup);

    if (inAuthGroup || !isInCorrectGroup) {
      router.replace(targetRoute);
    }
  }, [userToken, role, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="welcomePage" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(drawerDoctor)" options={{ headerShown: false }} />
      <Stack.Screen name="(drawerPatient)" options={{ headerShown: false }} />
    </Stack>
  );
};

// Wrap with Provider at the top level
export default function Layout() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}
