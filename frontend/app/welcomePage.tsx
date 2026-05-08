import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getWelcomeScreenStyles } from "#/src/styles/welcome.styles";
import AppLogo from "#/src/components/AppLogo";

const WelcomeScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getWelcomeScreenStyles(colorScheme);

  const handleGetStarted = async () => {
    await AsyncStorage.setItem("hasOpened", "true");
    router.push("/(auth)/register");
  };

  const handleLogin = async () => {
    console.log("handleLogin triggered");
    await AsyncStorage.setItem("hasOpened", "true");
    router.push("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Section: Graphic / Illustration area */}
        <View style={styles.graphicContainer}>
          {/* We use a styled view as a placeholder for a nice vector illustration. 
              You can replace this with an actual <Image /> component later. */}
          <View style={styles.illustrationPlaceholder}>
            <AppLogo size={180} borderColor="#E11D48" borderWidth={3} imageScale={1.1} />
          </View>
        </View>

        {/* Middle Section: Branding & Copy */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to MaternalCare</Text>
          <Text style={styles.subtitle}>
            Empowering maternal health with real-time monitoring and predictive
            risk assessment for a safer journey.
          </Text>
        </View>

        {/* Bottom Section: Actions */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGetStarted}
          >
            <Text style={styles.primaryButtonText}>Create Account</Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginTextPrompt}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginTextLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
