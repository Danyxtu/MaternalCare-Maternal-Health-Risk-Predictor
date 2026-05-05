import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
  useColorScheme,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Layout, Search, Filter, ChevronRight, QrCode } from "lucide-react-native";
import { router, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

import { getPatientRecordsScreenStyles } from "#/src/styles/patientRecords.styles";
import { get } from "#/src/api/api";
import AccessCodeModal from "#/src/components/Doctor/AccessCodeModal";

// --- Types ---
interface PatientRecord {
  id: string;
  name: string;
  age: number;
  bp: string;
  risk: string;
}

const PatientRecordsScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const styles = getPatientRecordsScreenStyles(colorScheme);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAccessCodeModalVisible, setIsAccessCodeModalVisible] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async ({ showLoader = true } = {}) => {
    try {
      if (showLoader) setIsLoading(true);
      const response = await get("/patients");
      setPatients(response.data.data);
    } catch (error: any) {
      if (error.status !== 401) {
        console.error("Failed to fetch patients:", error);
      }
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchPatients({ showLoader: false });
    } finally {
      setRefreshing(false);
    }
  };

  const filteredPatients = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return patients;
    return patients.filter((patient) =>
      patient.name.toLowerCase().includes(query),
    );
  }, [searchQuery, patients]);

  // --- Render Items ---
  const renderItem: ListRenderItem<PatientRecord> = ({ item }) => (
    <TouchableOpacity
      style={styles.tableRowButton}
      onPress={() =>
        router.push({
          pathname: "/(drawerDoctor)/(tabs)/patientRecords/[id]",
          params: { id: item.id },
        })
      }
      activeOpacity={0.8}
    >
      <View style={styles.tableRow}>
        <View style={[styles.cell, styles.colName]}>
          <Text style={styles.patientName}>{item.name}</Text>
        </View>
        <View style={[styles.cell, styles.colAge]}>
          <Text style={styles.cellText}>{item.age}</Text>
        </View>
        <View style={[styles.cell, styles.colBP]}>
          <Text style={styles.cellText}>{item.bp || "N/A"}</Text>
          <Text style={styles.unitText}>mmHg</Text>
        </View>
        <View style={[styles.cell, styles.colSugar]}>
          <Text style={styles.cellText}>{item.risk}</Text>
          <Text style={styles.unitText}>Risk</Text>
        </View>
        <ChevronRight
          size={18}
          color={colorScheme === "dark" ? "#CBD5E1" : "#94A3B8"}
        />
      </View>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <>
      {/* Search & Filter Section */}
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchBar}>
          <Search color="#94A3B8" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => fetchPatients()}
        >
          <Filter color="#94A3B8" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.extraFilterBox} />
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, styles.colName]}>
          Patient{"\n"}Name
        </Text>
        <Text style={[styles.tableHeaderText, styles.colAge]}>Age</Text>
        <Text style={[styles.tableHeaderText, styles.colBP]}>
          Blood{"\n"}Pressure
        </Text>
        <Text style={[styles.tableHeaderText, styles.colSugar]}>
          Health{"\n"}Risk
        </Text>
      </View>
    </>
  );

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right", "bottom"]}
    >
      {/* Header Section - Fixed at top */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Layout
            color={colorScheme === "dark" ? "#ECEDEE" : "#11181C"}
            size={24}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitle}>Patient Records</Text>
          <Text style={styles.headerSubtitle}>
            View and manage all patient assessments
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.headerIcon, { backgroundColor: '#10B98120' }]}
          onPress={() => setIsAccessCodeModalVisible(true)}
        >
          <QrCode color="#10B981" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#10B981"
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={filteredPatients}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListHeaderComponent={ListHeader}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#10B981"]}
              />
            }
          />
        )}

        {/* Fixed Bottom Bar */}
        <View style={styles.bottomBar}>
          <Text style={styles.bottomBarText}>
            Showing{" "}
            <Text style={styles.bottomBarTextBold}>
              {filteredPatients.length}
            </Text>{" "}
            of <Text style={styles.bottomBarTextBold}>{patients.length}</Text>{" "}
            patients
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(drawerDoctor)/(tabs)/assessment")}
            style={styles.newAssessmentButton}
          >
            <Text style={styles.newAssessmentButtonText}>New Assessment</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AccessCodeModal
        visible={isAccessCodeModalVisible}
        onClose={() => setIsAccessCodeModalVisible(false)}
        onSuccess={(patientId) => {
          router.push({
            pathname: "/(drawerDoctor)/(tabs)/patientRecords/[id]",
            params: { id: patientId },
          });
        }}
      />
    </SafeAreaView>
  );
};

export default PatientRecordsScreen;
