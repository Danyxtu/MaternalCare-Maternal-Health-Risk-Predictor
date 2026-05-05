import React from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Construction } from "lucide-react-native";
import { router } from "expo-router";

const HealthStandingScreen = () => {
  const colorScheme = useColorScheme() ?? "light";
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={isDark ? '#F1F5F9' : '#1E293B'} size={24} />
        </TouchableOpacity>
        <Text style={{ marginLeft: 16, fontSize: 20, fontWeight: "700", color: isDark ? '#F1F5F9' : '#1E293B' }}>Health Standing</Text>
      </View>

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 40 }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF1F2', alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <Construction color="#E11D48" size={40} />
        </View>
        <Text style={{ fontSize: 24, fontWeight: "700", textAlign: "center", color: isDark ? '#F1F5F9' : '#1E293B' }}>Under Construction</Text>
        <Text style={{ marginTop: 12, fontSize: 16, color: "#64748B", textAlign: "center", lineHeight: 24 }}>
          We are currently building this feature to give you detailed insights into your health status. Check back soon!
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default HealthStandingScreen;
