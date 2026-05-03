import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, User } from "lucide-react-native";
import { router } from "expo-router";
import { useAuth } from "#/src/context/authContext";

const ProfileScreen = () => {
  const { first_name, last_name, email, role } = useAuth() as any;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#11181C" size={24} />
        </TouchableOpacity>
        <Text style={{ marginLeft: 16, fontSize: 20, fontWeight: "700" }}>My Profile</Text>
      </View>

      <View style={{ alignItems: "center", marginTop: 40 }}>
        <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: "#FFF1F2", alignItems: "center", justifyContent: "center" }}>
          <User color="#E11D48" size={60} />
        </View>
        <Text style={{ marginTop: 16, fontSize: 24, fontWeight: "700" }}>{first_name} {last_name}</Text>
        <Text style={{ color: "#64748B", marginTop: 4 }}>{role}</Text>
      </View>

      <View style={{ padding: 20, marginTop: 40 }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: "#94A3B8", fontSize: 12, fontWeight: "600", marginBottom: 4 }}>EMAIL</Text>
          <Text style={{ fontSize: 16, fontWeight: "500" }}>{email}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
