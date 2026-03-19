import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Edit2,
  Layout
} from 'lucide-react-native';
import { getProfileScreenStyles } from '@/styles/profile.styles';
import { useNavigation, router } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

const MyProfileScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getProfileScreenStyles(colorScheme);
  const navigation = useNavigation();

  // Mock User Data
  const user = {
    name: "Dr. Sarah Jenkins",
    role: "Lead Obstetrician",
    email: "sarah.jenkins@maternalcare.com",
    phone: "+1 (555) 123-4567",
    clinic: "City Hospital, Maternity Wing",
    location: "San Francisco, CA"
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      {/* Fixed Navigation Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Layout color={colorScheme === 'dark' ? '#ECEDEE' : '#11181C'} size={24} />
        </TouchableOpacity>
        <View style={styles.navTitleContainer}>
          <Text style={styles.navTitle}>My Profile</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Edit2 color="#E11D48" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>SJ</Text>
            </View>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userRole}>{user.role}</Text>
        </View>

        {/* Contact Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Mail color="#64748B" size={18} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Phone color="#64748B" size={18} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{user.phone}</Text>
            </View>
          </View>
        </View>

        {/* Professional Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Professional Details</Text>

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Briefcase color="#64748B" size={18} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Primary Clinic</Text>
              <Text style={styles.infoValue}>{user.clinic}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <MapPin color="#64748B" size={18} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{user.location}</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default MyProfileScreen;
