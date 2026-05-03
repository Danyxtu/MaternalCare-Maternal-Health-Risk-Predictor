import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useAuth, AuthProvider } from "#/src/context/authContext";
import { ActivityIndicator, View } from "react-native";

const RootLayout = () => {
  const { userToken, role, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    console.log("Navigation segments:", segments);
    console.log("Auth State:", { userToken: !!userToken, role, isLoading });

    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inWelcomePage = segments[0] === "welcomePage";
    const inDoctorGroup = segments[0] === "(drawerDoctor)";
    const inPatientGroup = segments[0] === "(drawerPatient)";

    if (!userToken || !role) {
      if (!inAuthGroup && !inWelcomePage) {
        console.log("Redirecting to welcomePage: Missing token or role.");
        router.replace("/welcomePage");
      }
      return;
    }

    const targetRoute = role === "DOCTOR" 
      ? "/(drawerDoctor)/(tabs)/dashboard" 
      : "/(drawerPatient)/(tabs)/dashboard";

    const isInCorrectGroup = role === "DOCTOR" ? inDoctorGroup : inPatientGroup;

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
