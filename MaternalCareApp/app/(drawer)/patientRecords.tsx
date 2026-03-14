import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Layout, Search, Filter } from 'lucide-react-native';
import { getPatientRecordsScreenStyles } from '@/styles/patientRecords.styles';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

// --- Types ---
interface PatientRecord {
  id: string;
  name: string;
  age: number;
  bp: string;
  bloodSugar: number;
}

// --- Mock Data ---
const patientsData: PatientRecord[] = [
  { id: '1', name: 'Sarah\nJohnson', age: 28, bp: '115/75', bloodSugar: 92 },
  { id: '2', name: 'Maria\nGarcia', age: 38, bp: '145/95', bloodSugar: 110 },
  { id: '3', name: 'Emily\nChen', age: 25, bp: '122/82', bloodSugar: 88 },
  { id: '4', name: 'Aisha\nPatel', age: 32, bp: '135/88', bloodSugar: 105 },
  { id: '5', name: 'Jessica\nWilliams', age: 22, bp: '110/70', bloodSugar: 85 },
  { id: '6', name: 'Linda\nMartinez', age: 37, bp: '148/92', bloodSugar: 128 },
  { id: '7', name: 'Priya\nKumar', age: 29, bp: '118/76', bloodSugar: 90 },
  { id: '8', name: 'Amanda\nBrown', age: 34, bp: '132/86', bloodSugar: 102 },
];

const PatientRecordsScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getPatientRecordsScreenStyles(colorScheme);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  // --- Render Items ---
  const renderItem: ListRenderItem<PatientRecord> = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={[styles.cell, styles.colName]}>
        <Text style={styles.patientName}>{item.name}</Text>
      </View>
      <View style={[styles.cell, styles.colAge]}>
        <Text style={styles.cellText}>{item.age}</Text>
      </View>
      <View style={[styles.cell, styles.colBP]}>
        <Text style={styles.cellText}>{item.bp}</Text>
        <Text style={styles.unitText}>mmHg</Text>
      </View>
      <View style={[styles.cell, styles.colSugar]}>
        <Text style={styles.cellText}>{item.bloodSugar}</Text>
        <Text style={styles.unitText}>mg/dL</Text>
      </View>
    </View>
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
        <TouchableOpacity style={styles.filterButton}>
          <Filter color="#94A3B8" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.extraFilterBox} />
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, styles.colName]}>Patient{'\n'}Name</Text>
        <Text style={[styles.tableHeaderText, styles.colAge]}>Age</Text>
        <Text style={[styles.tableHeaderText, styles.colBP]}>Blood{'\n'}Pressure</Text>
        <Text style={[styles.tableHeaderText, styles.colSugar]}>Blood{'\n'}Sugar</Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      {/* Header Section - Fixed at top */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Layout color={colorScheme === 'dark' ? '#ECEDEE' : '#11181C'} size={24} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitle}>Patient Records</Text>
          <Text style={styles.headerSubtitle}>View and manage all patient assessments</Text>
        </View>
      </View>

      <View style={styles.container}>

        <FlatList
          data={patientsData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Fixed Bottom Bar */}
        <View style={styles.bottomBar}>
          <Text style={styles.bottomBarText}>
            Showing <Text style={styles.bottomBarTextBold}>{patientsData.length}</Text> of <Text style={styles.bottomBarTextBold}>{patientsData.length}</Text> patients
          </Text>
          <TouchableOpacity style={styles.newAssessmentButton}>
            <Text style={styles.newAssessmentButtonText}>New Assessment</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default PatientRecordsScreen;