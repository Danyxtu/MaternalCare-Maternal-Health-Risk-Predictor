import { SafeAreaView, Text, View } from "react-native";
import React from "react";

const PatientProfile = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>Profile</Text>
        <Text style={{ marginTop: 8, color: "#475569" }}>
          Manage your profile information here.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default PatientProfile;
