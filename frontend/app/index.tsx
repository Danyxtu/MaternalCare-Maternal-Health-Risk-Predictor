import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";

import { useAuth } from "#/src/context/authContext";

export default function Index() {
  const { userToken, role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!userToken || !role) {
      router.replace("/welcomePage");
      return;
    }

    router.replace({ pathname: "/(drawerDoctor)/(tabs)/dashboard" });
  }, [isLoading, role, router, userToken]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#10B981" />
    </View>
  );
}
