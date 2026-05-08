import React from "react";
import { View, Text, TouchableOpacity, ScrollView, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Bell, Shield, CircleHelp, User } from "lucide-react-native";
import { router } from "expo-router";
import { getSettingsScreenStyles } from "#/src/styles/settings.styles";

const SettingsScreen = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getSettingsScreenStyles(colorScheme);

  const SettingItem = ({ icon, label, onPress }: { icon: React.ReactNode, label: string, onPress: () => void }) => (
    <TouchableOpacity 
      style={{ 
        flexDirection: "row", 
        alignItems: "center", 
        paddingVertical: 16, 
        borderBottomWidth: 1, 
        borderBottomColor: colorScheme === 'dark' ? '#334155' : '#F1F5F9' 
      }}
      onPress={onPress}
    >
      <View style={{ width: 40 }}>{icon}</View>
      <Text style={{ flex: 1, fontSize: 16, fontWeight: "500", color: colorScheme === 'dark' ? '#F1F5F9' : '#1E293B' }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF' }}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={colorScheme === 'dark' ? '#F1F5F9' : '#1E293B'} size={24} />
        </TouchableOpacity>
        <Text style={{ marginLeft: 16, fontSize: 20, fontWeight: "700", color: colorScheme === 'dark' ? '#F1F5F9' : '#1E293B' }}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: "600", color: "#64748B", marginBottom: 16 }}>ACCOUNT</Text>
        <SettingItem 
          icon={<User color="#64748B" size={20} />} 
          label="Profile Information" 
          onPress={() => router.push("/(drawerPatient)/profile" as any)} 
        />
        <SettingItem 
          icon={<Bell color="#64748B" size={20} />} 
          label="Notifications" 
          onPress={() => {}} 
        />
        
        <Text style={{ fontSize: 14, fontWeight: "600", color: "#64748B", marginTop: 32, marginBottom: 16 }}>SECURITY & SUPPORT</Text>
        <SettingItem 
          icon={<Shield color="#64748B" size={20} />} 
          label="Privacy & Security" 
          onPress={() => {}} 
        />
        <SettingItem 
          icon={<CircleHelp color="#64748B" size={20} />} 
          label="Help & Support" 
          onPress={() => {}} 
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
