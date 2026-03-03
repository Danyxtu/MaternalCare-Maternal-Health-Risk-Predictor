import {
  DrawerContentScrollView,
  DrawerItemList,
  useDrawerProgress,
} from "@react-navigation/drawer";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const CustomDrawerContent = (props: any) => {
  const progress = useDrawerProgress();

  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            progress.value,
            [0, 1],
            [20, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
      opacity: progress.value,
    };
  });

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <Animated.View style={[{ flex: 1, padding: 20 }, animatedContentStyle]}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatar} />
          <Text style={styles.username}>Danny Dev</Text>
        </View>

        {/* Default Nav Items */}
        <View style={{ flex: 1, marginTop: 20 }}>
          <DrawerItemList {...props} />
        </View>

        {/* Logout Section with Reanimated */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => router.replace("/welcomePage")}
        >
          <Text style={{ color: "#ff4444", fontWeight: "bold" }}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 20,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#ddd" },
  username: { marginTop: 10, fontSize: 18, fontWeight: "600" },
  logoutBtn: { padding: 20, borderTopWidth: 1, borderTopColor: "#eee" },
});
