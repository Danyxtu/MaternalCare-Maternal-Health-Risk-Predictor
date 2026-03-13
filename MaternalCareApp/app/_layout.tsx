import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Stack, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RootLayout = () => {
  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasOpened = await AsyncStorage.getItem('hasOpened');
      if (hasOpened) {
        router.replace('/(auth)/login');
      }
    };
    checkFirstLaunch();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="welcomePage" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
