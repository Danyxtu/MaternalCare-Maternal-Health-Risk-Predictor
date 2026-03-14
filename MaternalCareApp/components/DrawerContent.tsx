import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, usePathname } from 'expo-router';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import {
  LayoutDashboard,
  FileText,
  Activity,
  AlertTriangle,
  Heart,
  Layout,
  Settings,
  User,
  LogOut
} from 'lucide-react-native';
import { getDrawerContentStyles } from '@/styles/drawer.styles';

// --- Types ---
interface DrawerItemProps {
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onPress: () => void;
  isDestructive?: boolean;
}

// --- Reusable Component ---
const DrawerItem: React.FC<DrawerItemProps> = ({
  label,
  icon,
  isActive,
  onPress,
  isDestructive
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getDrawerContentStyles(colorScheme);
  const textColor = isActive ? '#E11D48' : isDestructive ? '#E11D48' : (colorScheme === 'dark' ? '#CBD5E1' : '#334155');
  const bgColor = isActive ? '#FFF1F2' : 'transparent';

  return (
    <TouchableOpacity
      style={[styles.drawerItem, { backgroundColor: bgColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconWrapper}>
        {icon}
      </View>
      <Text style={[styles.drawerItemText, { color: textColor, fontWeight: isActive ? '600' : '500' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// --- Main Sidebar Component ---
const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getDrawerContentStyles(colorScheme);
  const pathname = usePathname();

  const getActiveRoute = () => {
    if (pathname.includes('/dashboard')) return 'Dashboard';
    if (pathname.includes('/patientRecords')) return 'Patient Records';
    if (pathname.includes('/assessment')) return 'New Assessment';
    if (pathname.includes('/alerts')) return 'Alerts';
    if (pathname.includes('/settings')) return 'Settings';
    if (pathname.includes('/profile')) return 'My Profile';
    return '';
  };

  const activeRoute = getActiveRoute();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoIconContainer}>
              <Heart color="#FFFFFF" size={24} fill="#FFFFFF" />
            </View>
            <View style={styles.logoTextContainer}>
              <Text style={styles.brandName}>MaternalCare</Text>
              <Text style={styles.brandSubtitle}>Risk Predictor</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.collapseButton} onPress={() => props.navigation.closeDrawer()}>
            <Layout color={colorScheme === 'dark' ? '#ECEDEE' : '#11181C'} size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Navigation Links */}
        <ScrollView contentContainerStyle={styles.navContainer} showsVerticalScrollIndicator={false}>

          {/* Primary Nav */}
          <View style={styles.navGroup}>
            <DrawerItem
              label="Dashboard"
              icon={<LayoutDashboard color={activeRoute === 'Dashboard' ? '#E11D48' : '#475569'} size={20} />}
              isActive={activeRoute === 'Dashboard'}
              onPress={() => router.push('/(drawer)/dashboard')}
            />
            <DrawerItem
              label="Patient Records"
              icon={<FileText color={activeRoute === 'Patient Records' ? '#E11D48' : '#475569'} size={20} />}
              isActive={activeRoute === 'Patient Records'}
              onPress={() => router.push('/(drawer)/patientRecords')}
            />
            <DrawerItem
              label="New Assessment"
              icon={<Activity color={activeRoute === 'New Assessment' ? '#E11D48' : '#475569'} size={20} />}
              isActive={activeRoute === 'New Assessment'}
              onPress={() => router.push('/(drawer)/assessment')}
            />
            <DrawerItem
              label="Alerts"
              icon={<AlertTriangle color={activeRoute === 'Alerts' ? '#E11D48' : '#475569'} size={20} />}
              isActive={activeRoute === 'Alerts'}
              onPress={() => router.push('/(drawer)/alerts')}
            />
          </View>

          {/* Secondary Nav (Suggested Additions) */}
          <View style={styles.navGroup}>
            <View style={styles.subDivider} />
            <DrawerItem
              label="My Profile"
              icon={<User color={activeRoute === 'My Profile' ? '#E11D48' : '#475569'} size={20} />}
              isActive={activeRoute === 'My Profile'}
              onPress={() => router.push('/(drawer)/profile')}
            />
            <DrawerItem
              label="Settings"
              icon={<Settings color={activeRoute === 'Settings' ? '#E11D48' : '#475569'} size={20} />}
              isActive={activeRoute === 'Settings'}
              onPress={() => router.push('/(drawer)/settings')}
            />
          </View>

        </ScrollView>

        {/* Bottom Section: Help Card & Logout */}
        <View style={styles.bottomSection}>

          {/* Need Help Card */}
          <View style={styles.helpCard}>
            <Text style={styles.helpCardTitle}>Need Help?</Text>
            <TouchableOpacity>
              <Text style={styles.helpCardLink}>Contact medical support</Text>
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/(auth)/login')}>
            <LogOut color="#E11D48" size={20} style={{ marginRight: 12 }} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  );
};

export default CustomDrawerContent;
