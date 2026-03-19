import { SafeAreaView, Text, View } from "react-native";
import React from "react";

const PatientSettings = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>Settings</Text>
        <Text style={{ marginTop: 8, color: "#475569" }}>
          Configure your preferences.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default PatientSettings;
