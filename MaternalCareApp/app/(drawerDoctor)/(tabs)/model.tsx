import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BrainCircuit,
  Database,
  BarChart3,
  CheckCircle2,
  Info,
  Layout,
} from "lucide-react-native";
import { getProfileScreenStyles } from "#/src/styles/profile.styles";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

const ModelExplanationScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  // Reusing some styles for consistency, but we could create model.styles.ts
  const styles = getProfileScreenStyles(colorScheme);
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right", "bottom"]}
    >
      {/* Fixed Navigation Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Layout
            color={colorScheme === "dark" ? "#ECEDEE" : "#11181C"}
            size={24}
          />
        </TouchableOpacity>
        <View style={styles.navTitleContainer}>
          <Text style={styles.navTitle}>AI Model Insights</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#10B981"]}
          />
        }
      >
        {/* Model Overview Card */}
        <View style={styles.card}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <BrainCircuit
              color="#10B981"
              size={24}
              style={{ marginRight: 10 }}
            />
            <Text style={[styles.cardTitle, { marginBottom: 0 }]}>
              Random Forest Classifier
            </Text>
          </View>
          <Text
            style={{
              color: colorScheme === "dark" ? "#CBD5E1" : "#475569",
              lineHeight: 20,
            }}
          >
            The MaternalCare predictive engine uses an ensemble learning method
            called Random Forest. It operates by constructing a multitude of
            decision trees during training and outputting the class that is the
            mode of the classes of the individual trees.
          </Text>
        </View>

        {/* Dataset Insights */}
        <View style={styles.card}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Database color="#3B82F6" size={24} style={{ marginRight: 10 }} />
            <Text style={[styles.cardTitle, { marginBottom: 0 }]}>
              Training Data
            </Text>
          </View>
          <Text
            style={{
              color: colorScheme === "dark" ? "#CBD5E1" : "#475569",
              lineHeight: 20,
              marginBottom: 10,
            }}
          >
            The model was trained on an augmented dataset of maternal health
            records, focusing on key physiological indicators:
          </Text>
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                color: colorScheme === "dark" ? "#94A3B8" : "#64748B",
                marginBottom: 4,
              }}
            >
              • Age & Gestational Age
            </Text>
            <Text
              style={{
                color: colorScheme === "dark" ? "#94A3B8" : "#64748B",
                marginBottom: 4,
              }}
            >
              • Systolic & Diastolic Blood Pressure
            </Text>
            <Text
              style={{
                color: colorScheme === "dark" ? "#94A3B8" : "#64748B",
                marginBottom: 4,
              }}
            >
              • Blood Sugar (Glucose) Levels
            </Text>
            <Text
              style={{
                color: colorScheme === "dark" ? "#94A3B8" : "#64748B",
                marginBottom: 4,
              }}
            >
              • Body Temperature & Heart Rate
            </Text>
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.card}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <BarChart3 color="#F59E0B" size={24} style={{ marginRight: 10 }} />
            <Text style={[styles.cardTitle, { marginBottom: 0 }]}>
              Model Performance
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                style={{ fontSize: 18, fontWeight: "700", color: "#10B981" }}
              >
                70.44%
              </Text>
              <Text style={{ fontSize: 12, color: "#64748B" }}>Accuracy</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{ fontSize: 18, fontWeight: "700", color: "#3B82F6" }}
              >
                71%
              </Text>
              <Text style={{ fontSize: 12, color: "#64748B" }}>Precision</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{ fontSize: 18, fontWeight: "700", color: "#F59E0B" }}
              >
                71%
              </Text>
              <Text style={{ fontSize: 12, color: "#64748B" }}>Recall</Text>
            </View>
          </View>
        </View>

        {/* Explainability Section */}
        <View style={styles.card}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <CheckCircle2
              color="#8B5CF6"
              size={24}
              style={{ marginRight: 10 }}
            />
            <Text style={[styles.cardTitle, { marginBottom: 0 }]}>
              Explainable AI (LIME)
            </Text>
          </View>
          <Text
            style={{
              color: colorScheme === "dark" ? "#CBD5E1" : "#475569",
              lineHeight: 20,
            }}
          >
            We use LIME (Local Interpretable Model-agnostic Explanations) to
            provide transparency. For every assessment, the model highlights
            which specific vitals (like high BP) contributed most to the risk
            prediction.
          </Text>
        </View>

        {/* Disclaimer */}
        <View
          style={{
            padding: 16,
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <Info
            color="#94A3B8"
            size={16}
            style={{ marginRight: 8, marginTop: 2 }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: 12,
              color: "#94A3B8",
              fontStyle: "italic",
            }}
          >
            Model training is performed offline using secure, anonymized
            clinical data. The weights are updated periodically to maintain high
            diagnostic precision.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ModelExplanationScreen;
