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
  Layout,
  Bell,
  AlertTriangle,
  Activity,
  TrendingUp,
  Clock
} from 'lucide-react-native';
import { getAlertsScreenStyles } from '@/styles/alerts.styles';
import { router, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

// --- Types ---
interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  valueColor?: string;
  borderColor?: string;
}

type AlertVariant = 'high' | 'medium';

interface AlertCardProps {
  patientName: string;
  statusText: string;
  age: number;
  bp: string;
  bloodSugar: number;
  heartRate: number;
  timeAgo: string;
  variant: AlertVariant;
}

// --- Theme Configurations for Alert Cards ---
const alertThemes = {
  high: {
    bg: '#FFF1F2',
    borderLeft: '#E11D48',
    textMain: '#881337',
    textLabel: '#E11D48',
    badgeBg: '#FECDD3',
    buttonBg: '#E11D48',
  },
  medium: {
    bg: '#FFFBEB',
    borderLeft: '#F59E0B',
    textMain: '#78350F',
    textLabel: '#D97706',
    badgeBg: '#FDE68A',
    buttonBg: '#D97706',
  }
};

// --- Components ---

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  iconBgColor,
  valueColor = '#0F172A',
  borderColor = '#F1F5F9'
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getAlertsScreenStyles(colorScheme);
  return (
    <View style={[styles.summaryCard, { borderColor }]}>
      <View style={styles.summaryCardHeader}>
        <Text style={styles.summaryCardTitle}>{title}</Text>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          {icon}
        </View>
      </View>
      <Text style={[styles.summaryCardValue, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const AlertCard: React.FC<AlertCardProps> = ({
  patientName,
  statusText,
  age,
  bp,
  bloodSugar,
  heartRate,
  timeAgo,
  variant
}) => {
  const theme = alertThemes[variant];
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getAlertsScreenStyles(colorScheme);

  return (
    <View style={[styles.alertCard, { backgroundColor: theme.bg, borderLeftColor: theme.borderLeft }]}>

      {/* Header: Name, Badge, Button */}
      <View style={styles.alertCardHeader}>
        <View style={styles.alertCardTitleRow}>
          <Text style={[styles.alertCardName, { color: theme.textMain }]}>{patientName}</Text>
          <View style={[styles.badge, { backgroundColor: theme.badgeBg }]}>
            <Text style={[styles.badgeText, { color: theme.textMain }]}>{statusText}</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.viewDetailsButton, { backgroundColor: theme.buttonBg }]} onPress={() => router.push('/(drawer)/alertDetails')}>
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
      </View>

      {/* Vitals Grid */}
      <View style={styles.vitalsGrid}>
        <View style={styles.vitalItem}>
          <Text style={[styles.vitalLabel, { color: theme.textLabel }]}>Age</Text>
          <Text style={[styles.vitalValue, { color: theme.textMain }]}>{age} years</Text>
        </View>
        <View style={styles.vitalItem}>
          <Text style={[styles.vitalLabel, { color: theme.textLabel }]}>Blood Pressure</Text>
          <Text style={[styles.vitalValue, { color: theme.textMain }]}>{bp}</Text>
        </View>
        <View style={styles.vitalItem}>
          <Text style={[styles.vitalLabel, { color: theme.textLabel }]}>Blood Sugar</Text>
          <Text style={[styles.vitalValue, { color: theme.textMain }]}>{bloodSugar} mg/dL</Text>
        </View>
        <View style={styles.vitalItem}>
          <Text style={[styles.vitalLabel, { color: theme.textLabel }]}>Heart Rate</Text>
          <Text style={[styles.vitalValue, { color: theme.textMain }]}>{heartRate} bpm</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.alertCardFooter}>
        <Clock color={theme.textLabel} size={14} style={{ marginRight: 6 }} />
        <Text style={[styles.footerText, { color: theme.textLabel }]}>Assessed {timeAgo}</Text>
      </View>
    </View>
  );
};

// --- Main Screen ---
const AlertSystemScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getAlertsScreenStyles(colorScheme);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      {/* Screen Header - Fixed at top */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Layout color={colorScheme === 'dark' ? '#ECEDEE' : '#11181C'} size={24} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitle}>Real-time Alert System</Text>
          <Text style={styles.headerSubtitle}>Monitor and respond to patient risk alerts</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Top Summary Cards (Horizontal Scroll) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.summaryScrollContent}
          style={styles.summaryScrollView}
        >
          <SummaryCard
            title="Active Alerts"
            value="4"
            icon={<Bell color="#3B82F6" size={20} />}
            iconBgColor="#DBEAFE"
          />
          <SummaryCard
            title="High Priority"
            value="2"
            valueColor="#E11D48"
            borderColor="#FECDD3"
            icon={<AlertTriangle color="#E11D48" size={20} />}
            iconBgColor="#FFE4E6"
          />
          <SummaryCard
            title="Medium Priority"
            value="2"
            valueColor="#F59E0B"
            icon={<Activity color="#F59E0B" size={20} />}
            iconBgColor="#FEF3C7"
          />
          <SummaryCard
            title="Low Priority"
            value="0"
            valueColor="#10B981"
            icon={<TrendingUp color="#10B981" size={20} />}
            iconBgColor="#D1FAE5"
          />
        </ScrollView>

        {/* High Priority Alerts Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <AlertTriangle color="#E11D48" size={20} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>High Priority Alerts</Text>
          </View>

          <AlertCard
            patientName="Linda Martinez"
            statusText="CRITICAL"
            age={37}
            bp="148/92"
            bloodSugar={128}
            heartRate={105}
            timeAgo="12 hours ago"
            variant="high"
          />
          <AlertCard
            patientName="Maria Garcia"
            statusText="CRITICAL"
            age={38}
            bp="145/95"
            bloodSugar={110}
            heartRate={92}
            timeAgo="10 hours ago"
            variant="high"
          />
        </View>

        {/* Medium Priority Alerts Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <TrendingUp color="#D97706" size={20} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Medium Priority Alerts</Text>
          </View>

          <AlertCard
            patientName="Aisha Patel"
            statusText="MONITOR"
            age={32}
            bp="135/88"
            bloodSugar={105}
            heartRate={95}
            timeAgo="11 hours ago"
            variant="medium"
          />
          <AlertCard
            patientName="Amanda Brown"
            statusText="MONITOR"
            age={34}
            bp="132/86"
            bloodSugar={102}
            heartRate={88}
            timeAgo="7 hours ago"
            variant="medium"
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default AlertSystemScreen;