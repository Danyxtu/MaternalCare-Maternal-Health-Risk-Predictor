import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

/**
 *  Read This before designing any page:
 *
 *  If you want to design a specific page in drawer, comment out the corresponding Stack.Screen
 *
 *  Designing the welcome page: No need to comment out.
 *
 *  For authentication pages(Auth): comment WelcomePage
 *
 *  For main pages (Dashboard, Assessment, Settings): comment WelcomePage and Auth
 *
 *  After designing the page, uncomment the corresponding Stack.Screen to make it work and push it to github.
 *
 *  Dont forget the general format for git branch name: <name>/task/<task-name>
 *  Ex: danyxtu021/feature/design-welcome-page
 */

const RootLayout = () => {
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
