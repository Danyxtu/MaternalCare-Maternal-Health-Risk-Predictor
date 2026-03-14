import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  Shield,
  Key,
  Moon,
  CircleHelp,
  ChevronRight,
  LogOut,
  Layout,
  Mail
} from 'lucide-react-native';
import { getSettingsScreenStyles } from '@/styles/settings.styles';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

// --- Reusable Setting Row Component ---
interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  type?: 'link' | 'toggle';
  value?: boolean;
  onToggle?: (val: boolean) => void;
  onPress?: () => void;
  isDestructive?: boolean;
  theme: 'light' | 'dark';
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  title,
  subtitle,
  type = 'link',
  value,
  onToggle,
  onPress,
  isDestructive,
  theme
}) => {
  const styles = getSettingsScreenStyles(theme);
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={type === 'toggle'}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, isDestructive && styles.destructiveIconBox]}>
        {icon}
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={[styles.settingTitle, isDestructive && styles.destructiveText]}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {type === 'link' ? (
        <ChevronRight color="#94A3B8" size={20} />
      ) : (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#E2E8F0', true: '#E11D48' }}
          thumbColor="#FFFFFF"
        />
      )}
    </TouchableOpacity>
  );
};

// --- Main Screen ---
const SettingsScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getSettingsScreenStyles(colorScheme);
  const navigation = useNavigation();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
          <Text style={styles.navTitle}>Settings</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account & Security</Text>
          <View style={styles.card}>
            <SettingRow
              theme={colorScheme}
              icon={<Key color="#64748B" size={20} />}
              title="Change Password"
              onPress={() => { }}
            />
            <View style={styles.divider} />
            <SettingRow
              theme={colorScheme}
              icon={<Shield color="#64748B" size={20} />}
              title="Two-Factor Authentication"
              subtitle="Enhance your account security"
              onPress={() => { }}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <SettingRow
              theme={colorScheme}
              icon={<Bell color="#64748B" size={20} />}
              title="Push Notifications"
              type="toggle"
              value={pushNotifications}
              onToggle={setPushNotifications}
            />
            <View style={styles.divider} />
            <SettingRow
              theme={colorScheme}
              icon={<Mail color="#64748B" size={20} />}
              title="Email Alerts"
              subtitle="Daily summaries and urgent risk alerts"
              type="toggle"
              value={emailAlerts}
              onToggle={setEmailAlerts}
            />
            <View style={styles.divider} />
            <SettingRow
              theme={colorScheme}
              icon={<Moon color="#64748B" size={20} />}
              title="Dark Mode"
              type="toggle"
              value={darkMode}
              onToggle={setDarkMode}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & About</Text>
          <View style={styles.card}>
            <SettingRow
              theme={colorScheme}
              icon={<CircleHelp color="#64748B" size={20} />}
              title="Help Center & FAQ"
              onPress={() => { }}
            />
            <View style={styles.divider} />
            <SettingRow
              theme={colorScheme}
              icon={<Shield color="#64748B" size={20} />}
              title="Privacy Policy"
              onPress={() => { }}
            />
          </View>
        </View>

        {/* Logout Button */}
        <View style={[styles.card, { marginTop: 12 }]}>
          <SettingRow
            theme={colorScheme}
            icon={<LogOut color="#E11D48" size={20} />}
            title="Log Out"
            isDestructive={true}
            onPress={() => console.log('Logging out...')}
          />
        </View>

        <Text style={styles.versionText}>MaternalCare App v1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
