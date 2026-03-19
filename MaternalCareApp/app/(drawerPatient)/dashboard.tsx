import { SafeAreaView, Text, View } from "react-native";
import React from "react";

const PatientDashboard = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>
          Patient Dashboard
        </Text>
        <Text style={{ marginTop: 8, color: "#475569" }}>
          Welcome! This area is reserved for patient-specific features.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default PatientDashboard;
